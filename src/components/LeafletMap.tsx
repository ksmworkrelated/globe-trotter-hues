import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CountryData } from "@/pages/Index";
import { getCountryIdFromFeature } from "@/lib/utils";

interface LeafletMapProps {
  countries: Record<string, CountryData>;
  onCountryClick: (countryId: string, countryName: string) => void;
  mapLevel: "country" | "state" | "city";
  getCountryColor: (feature: GeoJSON.Feature) => string;
  getCountryOpacity: (feature: GeoJSON.Feature) => number;
  theme?: "light" | "dark";
  style?: React.CSSProperties; // <-- add style prop
}

export const LeafletMap = ({
  countries,
  onCountryClick,
  mapLevel,
  getCountryColor,
  getCountryOpacity,
  theme = "light",
  style = {}, // <-- default style
}: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [geoLayers, setGeoLayers] = useState<L.GeoJSON[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

  // Only initialize the map when visible (expand or not compress)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // Prevent double init

    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      maxBounds: [
        [-85, -170],
        [85, 190],
      ],
      maxBoundsViscosity: 1.0,
      worldCopyJump: false,
    });

    L.tileLayer(
      theme === "dark"
        ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAIAAADY1U0VAAAAAAnRSTlMAAHaTzTgAAABGSURBVHja7cEBAQAAAIIg/69uFBLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwG4AAAX4AAVkAAAAASUVORK5CYII="
        : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAIAAADY1U0VAAAAAAnRSTlMAAHaTzTgAAABGSURBVHja7cEBAQAAAIIg/69uFBLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwG4AAAX4AAVkAAAAASUVORK5CYII=",
      {
        maxZoom: 18,
        noWrap: true,
        attribution: "",
      }
    ).addTo(mapRef.current);

    mapRef.current.fitBounds([
      [15, -170],
      [75, 190],
    ]);

    setIsMapReady(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setIsMapReady(false);
    };
  }, [theme]);

  // Fetch and add geo data only if map is ready
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    // Move dataUrls inside the effect to avoid dependency warning
    const dataUrls = {
      country:
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
      state:
        "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json",
      city: "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", // Fallback to countries for now
    };

    // Clear existing layers
    geoLayers.forEach((layer) => {
      mapRef.current?.removeLayer(layer);
    });

    // Fetch and add new geospatial data
    const fetchGeoData = async () => {
      try {
        const response = await fetch(dataUrls[mapLevel]);
        const geoData = await response.json();

        // Only use the original features (no duplication)
        const wrappedGeoData = geoData;

        const geoLayer = L.geoJSON(wrappedGeoData, {
          style: (feature: GeoJSON.Feature) => ({
            fillColor: getCountryColor(feature),
            fillOpacity: getCountryOpacity(feature),
            weight: 1,
            opacity: 1,
            color: "#333",
          }),
          onEachFeature: (feature, layer) => {
            const countryName =
              feature.properties.name || feature.properties.NAME || "Unknown";
            const countryId = getCountryIdFromFeature(feature);

            layer.on({
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  weight: 2,
                  color: "#666",
                  fillOpacity: 0.9,
                });
                layer.bringToFront();

                // Show tooltip
                const countryData = countries[countryId];
                const popup = L.popup()
                  .setLatLng(e.latlng)
                  .setContent(
                    `
                    <div class="font-medium">${countryName}</div>
                    ${
                      countryData
                        ? `<div class="text-sm text-gray-600">${
                            countryData.visitCount
                          } visit${
                            countryData.visitCount !== 1 ? "s" : ""
                          }</div>`
                        : ""
                    }
                  `
                  )
                  .openOn(mapRef.current!);
              },
              mouseout: (e) => {
                geoLayer.resetStyle(e.target);
                mapRef.current?.closePopup();
              },
              click: (e) => {
                onCountryClick(countryId, countryName);
                mapRef.current?.closePopup();
              },
            });
          },
        });

        geoLayer.addTo(mapRef.current!);
        setGeoLayers([geoLayer]);
      } catch (error) {
        console.error("Error loading geospatial data:", error);
      }
    };

    fetchGeoData();
  }, [
    mapLevel,
    getCountryColor,
    getCountryOpacity,
    countries,
    onCountryClick,
    isMapReady,
  ]); // Remove geoLayers from dependencies to prevent infinite loop

  // Update styles when countries data changes
  useEffect(() => {
    if (!isMapReady) return;
    geoLayers.forEach((layer) => {
      layer.setStyle((feature: GeoJSON.Feature) => ({
        fillColor: getCountryColor(feature),
        fillOpacity: getCountryOpacity(feature),
        weight: 1,
        opacity: 1,
        color: "#333",
      }));
      // Force Leaflet to re-evaluate the style for all features
      layer.eachLayer((featureLayer: L.Path) => {
        if (layer.resetStyle) {
          layer.resetStyle(featureLayer);
        }
      });
    });
    // Force a redraw of the map to ensure instant update
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [geoLayers, getCountryColor, getCountryOpacity, isMapReady]);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen z-0 ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
      style={style}
    >
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

/* Add this to your global CSS (e.g., index.css) for best results:
html, body, .leaflet-container { background: #fff !important; }
*/
