import { useState } from "react";
import { GlobeIcon } from "lucide-react";
import { GlobeView } from "@/components/GlobeView";
import { CountryData } from "@/pages/Index";

interface WorldMapProps {
  countries: Record<string, CountryData>;
  onCountryClick: (countryId: string, countryName: string) => void;
  mapLevel: "country" | "state" | "city";
}

export const WorldMap = ({
  countries,
  onCountryClick,
  mapLevel,
}: WorldMapProps) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [showGlobe, setShowGlobe] = useState(false);

  // Sample country data - in a real app, this would come from a proper world map dataset
  const sampleCountries = [
    {
      id: "usa",
      name: "United States",
      path: "M 158 206 L 157 227 L 183 234 L 234 211 L 241 168 L 213 145 L 158 150 Z",
    },
    {
      id: "canada",
      name: "Canada",
      path: "M 158 80 L 157 140 L 213 135 L 280 95 L 245 60 L 180 65 Z",
    },
    {
      id: "brazil",
      name: "Brazil",
      path: "M 280 350 L 340 380 L 380 420 L 350 450 L 290 440 L 270 400 Z",
    },
    {
      id: "russia",
      name: "Russia",
      path: "M 450 80 L 650 85 L 680 140 L 620 180 L 480 175 L 445 120 Z",
    },
    {
      id: "china",
      name: "China",
      path: "M 550 200 L 620 195 L 640 240 L 600 280 L 540 275 L 530 230 Z",
    },
    {
      id: "australia",
      name: "Australia",
      path: "M 620 420 L 680 425 L 700 460 L 680 480 L 630 475 L 615 450 Z",
    },
    {
      id: "india",
      name: "India",
      path: "M 500 280 L 540 275 L 555 320 L 530 350 L 490 340 L 485 300 Z",
    },
    {
      id: "germany",
      name: "Germany",
      path: "M 420 180 L 435 175 L 440 195 L 430 205 L 415 200 Z",
    },
    {
      id: "france",
      name: "France",
      path: "M 400 190 L 420 185 L 425 205 L 410 215 L 395 210 Z",
    },
    {
      id: "uk",
      name: "United Kingdom",
      path: "M 385 165 L 400 160 L 405 175 L 395 180 L 380 175 Z",
    },
  ];

  // Use the same color logic as in Index.tsx for consistency
  const getCountryFill = (countryId: string) => {
    const countryData = countries[countryId];
    if (!countryData) return "#FFFFFF";
    if (countryData.visitCount >= 5) return "#000000";
    const baseColor = countryData.baseColor;
    const opacity = Math.min(0.2 + countryData.visitCount * 0.15, 1);
    const hex = baseColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getCountryStroke = () => "#000000";

  return (
    <div className="w-full h-full bg-white relative">
      {/* Globe Toggle Button - bottom left */}
      <button
        className="absolute bottom-6 left-6 z-30 bg-white rounded-full shadow-lg p-3 hover:bg-blue-50 transition-colors border border-gray-200 flex items-center justify-center"
        title="Toggle Globe View"
        onClick={() => setShowGlobe(true)}
        style={{ pointerEvents: "auto" }}
      >
        <GlobeIcon className="h-7 w-7 text-blue-600" />
      </button>
      <GlobeView visible={showGlobe} onClose={() => setShowGlobe(false)} />
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Ocean/Background */}
        <rect width="800" height="500" fill="#FFFFFF" />

        {/* Sample countries */}
        {sampleCountries.map((country) => {
          const countryData = countries[country.id];
          const isHovered = hoveredCountry === country.id;

          return (
            <g key={country.id}>
              <path
                d={country.path}
                fill={getCountryFill(country.id)}
                stroke={getCountryStroke()}
                strokeWidth={isHovered ? 2 : 1}
                className="cursor-pointer transition-all duration-200 hover:stroke-2"
                onClick={() => onCountryClick(country.id, country.name)}
                onMouseEnter={() => setHoveredCountry(country.id)}
                onMouseLeave={() => setHoveredCountry(null)}
              />

              {/* Country tooltip on hover */}
              {isHovered && (
                <g>
                  <rect
                    x="10"
                    y="10"
                    width="200"
                    height="40"
                    fill="rgba(0, 0, 0, 0.8)"
                    rx="4"
                    className="pointer-events-none"
                  />
                  <text
                    x="20"
                    y="25"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {country.name}
                  </text>
                  {countryData && (
                    <text
                      x="20"
                      y="40"
                      fill="white"
                      fontSize="10"
                      className="pointer-events-none"
                    >
                      {countryData.visitCount} visit
                      {countryData.visitCount !== 1 ? "s" : ""}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Minimalist legend in bottom right */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded shadow-lg">
        <div className="text-xs text-gray-600 mb-2">Visits</div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((visits) => (
            <div key={visits} className="text-center">
              <div
                className="w-4 h-4 border border-black mb-1"
                style={{
                  backgroundColor:
                    visits >= 5
                      ? "#000000"
                      : `rgba(59, 130, 246, ${0.2 + visits * 0.15})`,
                }}
              />
              <div className="text-xs">{visits >= 5 ? "5+" : visits}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
