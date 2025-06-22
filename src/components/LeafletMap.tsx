
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CountryData } from '@/pages/Index';

interface LeafletMapProps {
  countries: Map<string, CountryData>;
  onCountryClick: (countryId: string, countryName: string) => void;
  mapLevel: 'country' | 'state' | 'city';
}

export const LeafletMap = ({ countries, onCountryClick, mapLevel }: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [geoLayers, setGeoLayers] = useState<L.GeoJSON[]>([]);

  // Natural Earth data URLs (hosted on GitHub)
  const dataUrls = {
    country: 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
    state: 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json',
    city: 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson' // Fallback to countries for now
  };

  const getCountryColor = (feature: any) => {
    const countryId = feature.properties.name?.toLowerCase().replace(/\s+/g, '-') || 
                     feature.properties.NAME?.toLowerCase().replace(/\s+/g, '-') ||
                     feature.properties.id;
    const countryData = countries.get(countryId);
    return countryData ? countryData.color : '#f0f0f0';
  };

  const getCountryOpacity = (feature: any) => {
    const countryId = feature.properties.name?.toLowerCase().replace(/\s+/g, '-') || 
                     feature.properties.NAME?.toLowerCase().replace(/\s+/g, '-') ||
                     feature.properties.id;
    const countryData = countries.get(countryId);
    return countryData ? 0.8 : 0.3;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the map
    mapRef.current = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      attributionControl: false
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing layers
    geoLayers.forEach(layer => {
      mapRef.current?.removeLayer(layer);
    });

    // Fetch and add new geospatial data
    const fetchGeoData = async () => {
      try {
        const response = await fetch(dataUrls[mapLevel]);
        const geoData = await response.json();

        const geoLayer = L.geoJSON(geoData, {
          style: (feature) => ({
            fillColor: getCountryColor(feature),
            weight: 1,
            opacity: 1,
            color: '#333',
            fillOpacity: getCountryOpacity(feature),
          }),
          onEachFeature: (feature, layer) => {
            const countryName = feature.properties.name || feature.properties.NAME || 'Unknown';
            const countryId = countryName.toLowerCase().replace(/\s+/g, '-');

            layer.on({
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  weight: 2,
                  color: '#666',
                  fillOpacity: 0.9
                });
                layer.bringToFront();

                // Show tooltip
                const countryData = countries.get(countryId);
                const popup = L.popup()
                  .setLatLng(e.latlng)
                  .setContent(`
                    <div class="font-medium">${countryName}</div>
                    ${countryData ? `<div class="text-sm text-gray-600">${countryData.visitCount} visit${countryData.visitCount !== 1 ? 's' : ''}</div>` : ''}
                  `)
                  .openOn(mapRef.current!);
              },
              mouseout: (e) => {
                geoLayer.resetStyle(e.target);
                mapRef.current?.closePopup();
              },
              click: (e) => {
                onCountryClick(countryId, countryName);
                mapRef.current?.closePopup();
              }
            });
          }
        });

        geoLayer.addTo(mapRef.current!);
        setGeoLayers([geoLayer]);
      } catch (error) {
        console.error('Error loading geospatial data:', error);
      }
    };

    fetchGeoData();
  }, [mapLevel, countries, onCountryClick]);

  // Update styles when countries data changes
  useEffect(() => {
    geoLayers.forEach(layer => {
      layer.eachLayer((featureLayer: any) => {
        if (featureLayer.feature) {
          const style = {
            fillColor: getCountryColor(featureLayer.feature),
            fillOpacity: getCountryOpacity(featureLayer.feature),
            weight: 1,
            opacity: 1,
            color: '#333'
          };
          featureLayer.setStyle(style);
        }
      });
    });
  }, [countries]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
