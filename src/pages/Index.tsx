
import { useState } from "react";
import { WorldMap } from "@/components/WorldMap";
import { ControlPanel } from "@/components/ControlPanel";
import { SearchBar } from "@/components/SearchBar";
import { StatsPanel } from "@/components/StatsPanel";
import { MapGlobeIcon } from "lucide-react";

export interface CountryData {
  id: string;
  name: string;
  visitCount: number;
  color: string;
}

export interface MapSettings {
  colorMode: 'random' | 'uniform';
  mapLevel: 'country' | 'state';
  uniformColor: string;
}

const Index = () => {
  const [countries, setCountries] = useState<Map<string, CountryData>>(new Map());
  const [settings, setSettings] = useState<MapSettings>({
    colorMode: 'random',
    mapLevel: 'country',
    uniformColor: '#3B82F6'
  });

  const getRandomColor = () => {
    const colors = [
      '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
      '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
      '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
      '#EC4899', '#F43F5E'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getColorForVisitCount = (count: number, baseColor: string) => {
    if (count >= 5) return '#000000';
    
    const opacity = Math.min(0.2 + (count * 0.2), 1);
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleCountryClick = (countryId: string, countryName: string) => {
    setCountries(prev => {
      const newCountries = new Map(prev);
      const existing = newCountries.get(countryId);
      
      if (existing) {
        const newCount = Math.min(existing.visitCount + 1, 5);
        newCountries.set(countryId, {
          ...existing,
          visitCount: newCount,
          color: getColorForVisitCount(newCount, existing.color)
        });
      } else {
        const baseColor = settings.colorMode === 'random' ? getRandomColor() : settings.uniformColor;
        newCountries.set(countryId, {
          id: countryId,
          name: countryName,
          visitCount: 1,
          color: getColorForVisitCount(1, baseColor)
        });
      }
      
      return newCountries;
    });
  };

  const handleSearch = (countryName: string) => {
    // In a real implementation, this would find the country by name
    // For now, we'll simulate it
    const countryId = countryName.toLowerCase().replace(/\s+/g, '-');
    handleCountryClick(countryId, countryName);
  };

  const resetMap = () => {
    setCountries(new Map());
  };

  const totalVisits = Array.from(countries.values()).reduce((sum, country) => sum + country.visitCount, 0);
  const uniqueCountries = countries.size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <MapGlobeIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Travel Heatmap</h1>
              <p className="text-sm text-gray-600">Track your adventures around the world</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <SearchBar onSearch={handleSearch} />
          <ControlPanel settings={settings} onSettingsChange={setSettings} onReset={resetMap} />
          <StatsPanel totalVisits={totalVisits} uniqueCountries={uniqueCountries} />
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <WorldMap 
            countries={countries}
            onCountryClick={handleCountryClick}
            mapLevel={settings.mapLevel}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
