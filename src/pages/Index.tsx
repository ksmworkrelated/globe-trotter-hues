import { useState, useEffect, useCallback } from "react";
import { LeafletMap } from "@/components/LeafletMap";
import { TopControls } from "@/components/TopControls";
import { TravelStats } from "@/components/TravelStats";
import type { Feature } from "geojson";
import { getCountryIdFromFeature } from "@/lib/utils";
import { GlobeIcon, MapIcon } from "lucide-react";
import { GlobeView } from "@/components/GlobeView";
import { MapTransition } from "@/components/MapTransition";
import { GlobeTransition } from "@/components/GlobeTransition";

export interface CountryData {
  id: string;
  name: string;
  visitCount: number;
  color: string;
  baseColor: string;
}

export interface MapSettings {
  colorMode: "random" | "uniform";
  mapLevel: "country" | "state" | "city";
  uniformColor: string;
  theme: "light" | "dark";
}

// Type for GeoJSON country feature
interface CountryFeature extends Feature {
  properties: {
    name?: string;
    NAME?: string;
    id?: string;
    [key: string]: unknown;
  };
}

const Index = () => {
  const [countries, setCountries] = useState<Record<string, CountryData>>({});
  const [settings, setSettings] = useState<MapSettings>({
    colorMode: "random",
    mapLevel: "country",
    uniformColor: "#3B82F6",
    theme: "light",
  });
  const [viewMode, setViewMode] = useState<"globe" | "map">("map");
  const [worldGeoJSON, setWorldGeoJSON] = useState(null);
  const [compressGlobe, setCompressGlobe] = useState(false);
  const [expandMap, setExpandMap] = useState(false);
  const [compressMap, setCompressMap] = useState(false);
  const [pendingExpand, setPendingExpand] = useState(false);
  const [showMap, setShowMap] = useState(viewMode === "map");
  const [showGlobe, setShowGlobe] = useState(viewMode === "globe");

  useEffect(() => {
    fetch("/world.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("GeoJSON fetch failed");
        return res.json();
      })
      .then(setWorldGeoJSON)
      .catch((err) => {
        console.error("Failed to load GeoJSON:", err);
        setWorldGeoJSON("error");
      });
  }, []);

  const getRandomColor = () => {
    const colors = [
      "#EF4444",
      "#F97316",
      "#F59E0B",
      "#EAB308",
      "#84CC16",
      "#22C55E",
      "#10B981",
      "#14B8A6",
      "#06B6D4",
      "#0EA5E9",
      "#3B82F6",
      "#6366F1",
      "#8B5CF6",
      "#A855F7",
      "#D946EF",
      "#EC4899",
      "#F43F5E",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getColorForVisitCount = (count: number, baseColor: string) => {
    if (count >= 5) return "#000000";

    const opacity = Math.min(0.2 + count * 0.15, 1);
    const hex = baseColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleCountryClick = (countryId: string, countryName: string) => {
    setCountries((prev) => {
      const existing = prev[countryId];
      if (existing) {
        const newCount = existing.visitCount + 1;
        return {
          ...prev,
          [countryId]: {
            ...existing,
            visitCount: newCount,
            color: getColorForVisitCount(newCount, existing.baseColor),
          },
        };
      } else {
        const baseColor =
          settings.colorMode === "random"
            ? getRandomColor()
            : settings.uniformColor;
        return {
          ...prev,
          [countryId]: {
            id: countryId,
            name: countryName,
            visitCount: 1,
            color: getColorForVisitCount(1, baseColor),
            baseColor: baseColor,
          },
        };
      }
    });
  };

  const handleCountryDecrease = (countryId: string) => {
    setCountries((prev) => {
      const existing = prev[countryId];
      if (existing && existing.visitCount > 0) {
        const newCount = existing.visitCount - 1;
        if (newCount === 0) {
          const { [countryId]: _, ...rest } = prev;
          return rest;
        } else {
          return {
            ...prev,
            [countryId]: {
              ...existing,
              visitCount: newCount,
              color: getColorForVisitCount(newCount, existing.baseColor),
            },
          };
        }
      }
      return prev;
    });
  };

  const handleSearch = (countryName: string) => {
    const countryId = countryName.toLowerCase().replace(/\s+/g, "-");
    handleCountryClick(countryId, countryName);
  };

  const resetMap = () => {
    setCountries({});
  };

  const totalVisits = Object.values(countries).reduce(
    (sum, country) => sum + country.visitCount,
    0
  );
  const uniqueCountries = Object.keys(countries).length;

  // Memoize getCountryColor and getCountryOpacity for LeafletMap
  const getCountryColor = useCallback(
    (feature: CountryFeature) => {
      const countryId = getCountryIdFromFeature(feature);
      const countryData = countries[countryId];
      return countryData ? countryData.color : "#f0f0f0";
    },
    [countries]
  );

  const getCountryOpacity = useCallback(
    (feature: CountryFeature) => {
      const countryId = getCountryIdFromFeature(feature);
      const countryData = countries[countryId];
      return countryData ? 0.8 : 0.3;
    },
    [countries]
  );

  // Robust transition state: only one view is visible at a time, with a null state for cross-fade
  const [activeView, setActiveView] = useState<"map" | "globe" | null>(
    viewMode
  );

  const MAP_FADE_DURATION = 1200; // was 1600, now faster
  const GLOBE_FADE_DURATION = 600;

  const handleViewToggle = () => {
    if (activeView === "globe") {
      setActiveView(null); // start fade out globe
      setTimeout(() => setActiveView("map"), GLOBE_FADE_DURATION); // after globe fade, show map
    } else if (activeView === "map") {
      setActiveView(null); // start fade out map
      setTimeout(() => setActiveView("globe"), MAP_FADE_DURATION); // after map fade, show globe
    }
  };

  // Sync viewMode for button state
  useEffect(() => {
    if (activeView === "map" || activeView === "globe") {
      setViewMode(activeView);
    }
  }, [activeView]);

  // Coordinate transitions: only show map after globe compresses out, only show globe after map fades out
  useEffect(() => {
    if (viewMode === "globe") {
      // Wait for map fade duration before showing globe
      const timeout = setTimeout(() => setShowGlobe(true), 1600);
      return () => clearTimeout(timeout);
    } else {
      setShowGlobe(false);
    }
  }, [viewMode]);

  if (worldGeoJSON === null) return <div>Loading map...</div>;
  if (worldGeoJSON === "error") return <div>Failed to load map data.</div>;

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Top Controls */}
      <TopControls
        settings={settings}
        onSettingsChange={setSettings}
        onReset={resetMap}
        onSearch={handleSearch}
        totalVisits={totalVisits}
        uniqueCountries={uniqueCountries}
        countries={countries}
        onCountryDecrease={handleCountryDecrease}
      />

      {/* Travel Stats */}
      <TravelStats
        totalVisits={totalVisits}
        uniqueCountries={uniqueCountries}
      />

      {/* View Toggle Button - top left */}
      <button
        className="absolute top-6 left-6 z-30 bg-white rounded-full shadow-lg p-3 hover:bg-blue-50 transition-colors border border-gray-200 flex items-center justify-center"
        title={
          viewMode === "globe" ? "Switch to 2D Map" : "Switch to Globe View"
        }
        onClick={handleViewToggle}
        style={{ pointerEvents: "auto" }}
      >
        {viewMode === "globe" ? (
          <MapIcon className="h-7 w-7 text-blue-600" />
        ) : (
          <GlobeIcon className="h-7 w-7 text-blue-600" />
        )}
      </button>

      {/* Main View: Use MapTransition to fade/unmount LeafletMap */}
      <GlobeTransition
        show={activeView === "globe"}
        duration={GLOBE_FADE_DURATION}
      >
        <GlobeView
          geoJson={worldGeoJSON}
          getCountryColor={getCountryColor}
          getCountryOpacity={getCountryOpacity}
          countryBorderColor="#fff"
          countryBorderWidth={0.5}
          theme={settings.theme}
          onCountryClick={handleCountryClick}
        />
      </GlobeTransition>
      <MapTransition show={activeView === "map"} duration={MAP_FADE_DURATION}>
        <LeafletMap
          countries={countries}
          onCountryClick={handleCountryClick}
          mapLevel={settings.mapLevel}
          getCountryColor={getCountryColor}
          getCountryOpacity={getCountryOpacity}
          theme={settings.theme}
        />
      </MapTransition>
    </div>
  );
};

export default Index;
