
import { useState } from "react";
import { CountryData } from "@/pages/Index";

interface WorldMapProps {
  countries: Map<string, CountryData>;
  onCountryClick: (countryId: string, countryName: string) => void;
  mapLevel: 'country' | 'state';
}

export const WorldMap = ({ countries, onCountryClick, mapLevel }: WorldMapProps) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Sample country data - in a real app, this would come from a proper world map dataset
  const sampleCountries = [
    { id: 'usa', name: 'United States', path: 'M 158 206 L 157 227 L 183 234 L 234 211 L 241 168 L 213 145 L 158 150 Z' },
    { id: 'canada', name: 'Canada', path: 'M 158 80 L 157 140 L 213 135 L 280 95 L 245 60 L 180 65 Z' },
    { id: 'brazil', name: 'Brazil', path: 'M 280 350 L 340 380 L 380 420 L 350 450 L 290 440 L 270 400 Z' },
    { id: 'russia', name: 'Russia', path: 'M 450 80 L 650 85 L 680 140 L 620 180 L 480 175 L 445 120 Z' },
    { id: 'china', name: 'China', path: 'M 550 200 L 620 195 L 640 240 L 600 280 L 540 275 L 530 230 Z' },
    { id: 'australia', name: 'Australia', path: 'M 620 420 L 680 425 L 700 460 L 680 480 L 630 475 L 615 450 Z' },
    { id: 'india', name: 'India', path: 'M 500 280 L 540 275 L 555 320 L 530 350 L 490 340 L 485 300 Z' },
    { id: 'germany', name: 'Germany', path: 'M 420 180 L 435 175 L 440 195 L 430 205 L 415 200 Z' },
    { id: 'france', name: 'France', path: 'M 400 190 L 420 185 L 425 205 L 410 215 L 395 210 Z' },
    { id: 'uk', name: 'United Kingdom', path: 'M 385 165 L 400 160 L 405 175 L 395 180 L 380 175 Z' },
  ];

  const getCountryFill = (countryId: string) => {
    const countryData = countries.get(countryId);
    return countryData ? countryData.color : '#FFFFFF';
  };

  const getCountryStroke = () => '#000000';

  const getCountryOpacity = (countryId: string) => {
    const countryData = countries.get(countryId);
    if (!countryData) return 1;
    return 0.3 + (countryData.visitCount * 0.15);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          World Travel Heatmap {mapLevel === 'state' ? '(State Level)' : '(Country Level)'}
        </h2>
        <p className="text-sm text-gray-600">
          Click on countries to mark your visits. Each visit deepens the color (max 5 visits).
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-auto"
          style={{ minHeight: '400px' }}
        >
          {/* Ocean background */}
          <rect width="800" height="500" fill="#F8FAFC" />
          
          {/* Sample countries */}
          {sampleCountries.map((country) => {
            const countryData = countries.get(country.id);
            const isHovered = hoveredCountry === country.id;
            
            return (
              <g key={country.id}>
                <path
                  d={country.path}
                  fill={getCountryFill(country.id)}
                  stroke={getCountryStroke()}
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={getCountryOpacity(country.id)}
                  className="cursor-pointer transition-all duration-200 hover:brightness-110"
                  onClick={() => onCountryClick(country.id, country.name)}
                  onMouseEnter={() => setHoveredCountry(country.id)}
                  onMouseLeave={() => setHoveredCountry(null)}
                />
                
                {/* Country label on hover */}
                {isHovered && (
                  <text
                    x="50"
                    y="30"
                    fill="#1F2937"
                    fontSize="14"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {country.name}
                    {countryData && ` (${countryData.visitCount} visit${countryData.visitCount !== 1 ? 's' : ''})`}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Legend */}
          <g transform="translate(20, 420)">
            <text x="0" y="0" fill="#374151" fontSize="12" fontWeight="bold">Visits:</text>
            {[1, 2, 3, 4, 5].map((visits, index) => {
              const x = index * 40;
              return (
                <g key={visits} transform={`translate(${x}, 10)`}>
                  <rect
                    width="20"
                    height="15"
                    fill="#3B82F6"
                    opacity={0.3 + (visits * 0.15)}
                    stroke="#000"
                    strokeWidth="1"
                  />
                  <text x="25" y="12" fill="#374151" fontSize="10">{visits}</text>
                </g>
              );
            })}
            <g transform="translate(200, 10)">
              <rect width="20" height="15" fill="#000000" stroke="#000" strokeWidth="1" />
              <text x="25" y="12" fill="#374151" fontSize="10">5+</text>
            </g>
          </g>
        </svg>
      </div>

      {/* Note */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is a simplified demo map. In a full implementation, 
          this would use a comprehensive world map dataset with accurate country/state boundaries.
        </p>
      </div>
    </div>
  );
};
