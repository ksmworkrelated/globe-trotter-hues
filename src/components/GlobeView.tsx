import Globe, { GlobeMethods } from "react-globe.gl";
import { useEffect, useRef, useState } from "react";
import type { FeatureCollection, Feature } from "geojson";

interface GlobeViewProps {
  geoJson?: FeatureCollection;
  getCountryColor?: (feature: Feature) => string;
  getCountryOpacity?: (feature: Feature) => number;
  countryBorderColor?: string;
  countryBorderWidth?: number;
  theme?: "light" | "dark";
  onCountryClick?: (countryId: string, countryName: string) => void;
  compress?: boolean;
  expand?: boolean; // <-- add expand
  style?: React.CSSProperties; // <-- add style
}

export const GlobeView = ({
  geoJson,
  getCountryColor,
  getCountryOpacity,
  countryBorderColor = "#fff",
  countryBorderWidth = 0.5,
  theme = "light",
  onCountryClick,
  compress = false,
  expand = false, // <-- default
  style = {}, // <-- default
}: GlobeViewProps) => {
  const globeEl = useRef<GlobeMethods | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (globeEl.current && globeEl.current.controls) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  useEffect(() => {
    if (compress) {
      setIsCompressing(true);
      setTimeout(() => setIsCompressing(false), 600); // duration matches transition
    }
  }, [compress]);

  // Use RGBA for opacity
  const colorWithOpacity = (color: string, opacity: number) => {
    if (color.startsWith("rgba")) return color; // already rgba
    const hexVal = color.replace("#", "");
    const bigint = parseInt(hexVal, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${opacity})`;
  };

  // Handle country click
  const handlePolygonClick = (feature: Feature) => {
    if (!onCountryClick) return;
    const countryName =
      feature.properties?.name || feature.properties?.NAME || "Unknown";
    const countryId =
      feature.properties?.id || countryName.toLowerCase().replace(/\s+/g, "-");
    onCountryClick(countryId, countryName);
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-white transition-all duration-700 ${
        compress ? "scale-0 opacity-0" : "scale-100 opacity-100"
      }`}
      style={style}
    >
      <Globe
        ref={globeEl}
        width={window.innerWidth}
        height={window.innerHeight}
        backgroundColor="#ffffff"
        polygonsData={geoJson?.features || []}
        polygonCapColor={(feature: Feature) => {
          if (getCountryColor && getCountryOpacity) {
            return colorWithOpacity(
              getCountryColor(feature),
              getCountryOpacity(feature)
            );
          }
          return colorWithOpacity("#222", 0.8);
        }}
        polygonSideColor={(feature: Feature) => {
          if (getCountryColor && getCountryOpacity) {
            return colorWithOpacity(
              getCountryColor(feature),
              getCountryOpacity(feature)
            );
          }
          return colorWithOpacity("#222", 0.8);
        }}
        polygonStrokeColor={() => countryBorderColor}
        polygonAltitude={0.01}
        polygonLabel={(d: Feature) =>
          d.properties?.name || d.properties?.NAME || ""
        }
        onPolygonClick={handlePolygonClick}
      />
    </div>
  );
};
