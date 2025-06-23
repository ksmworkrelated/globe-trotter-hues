import { useState } from "react";
import { SearchIcon, SettingsIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SettingsPanel } from "@/components/SettingsPanel";
import { COUNTRY_NAMES } from "@/lib/countryNames";
import { CountryData, MapSettings } from "@/pages/Index";

interface TopControlsProps {
  settings: MapSettings;
  onSettingsChange: (settings: MapSettings) => void;
  onReset: () => void;
  onSearch: (countryName: string) => void;
  totalVisits: number;
  uniqueCountries: number;
  countries: Record<string, CountryData>;
  onCountryDecrease: (countryId: string) => void;
}

export const TopControls = ({
  settings,
  onSettingsChange,
  onReset,
  onSearch,
  totalVisits,
  uniqueCountries,
  countries,
  onCountryDecrease,
}: TopControlsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCountries =
    searchTerm.length > 0
      ? COUNTRY_NAMES.filter((name) =>
          name.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 8)
      : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    onSearch(name);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <>
      {/* Top Controls Bar - Moved to Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex items-center relative">
          <div className="relative w-64">
            <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-4 py-2 w-64 bg-white/90 backdrop-blur-sm"
              autoComplete="off"
            />
            {showSuggestions && filteredCountries.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow z-30 max-h-48 overflow-auto">
                {filteredCountries.map((name) => (
                  <li
                    key={name}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onMouseDown={() => handleSuggestionClick(name)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>

        {/* Settings Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="bg-white/90 backdrop-blur-sm hover:bg-white"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={onSettingsChange}
          onReset={onReset}
          onClose={() => setShowSettings(false)}
          totalVisits={totalVisits}
          uniqueCountries={uniqueCountries}
          countries={countries}
          onCountryDecrease={onCountryDecrease}
        />
      )}
    </>
  );
};
