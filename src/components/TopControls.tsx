
import { useState } from "react";
import { SearchIcon, SettingsIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SettingsPanel } from "@/components/SettingsPanel";
import { CountryData, MapSettings } from "@/pages/Index";

interface TopControlsProps {
  settings: MapSettings;
  onSettingsChange: (settings: MapSettings) => void;
  onReset: () => void;
  onSearch: (countryName: string) => void;
  totalVisits: number;
  uniqueCountries: number;
  countries: Map<string, CountryData>;
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
  onCountryDecrease
}: TopControlsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm("");
    }
  };

  return (
    <>
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        {/* Settings Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="bg-white/90 backdrop-blur-sm hover:bg-white"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white/90 backdrop-blur-sm"
            />
          </div>
          <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
            Add
          </Button>
        </form>
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
