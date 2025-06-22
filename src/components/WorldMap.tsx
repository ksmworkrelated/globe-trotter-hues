
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

  return (
    <div className="w-full h-full bg-white">
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Ocean/Background */}
        <rect width="800" height="500" fill="#FFFFFF" />
        
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
                      {countryData.visitCount} visit{countryData.visitCount !== 1 ? 's' : ''}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
