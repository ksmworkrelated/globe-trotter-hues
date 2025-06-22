
import { useState } from "react";
import { WorldMap } from "@/components/WorldMap";
import { TopControls } from "@/components/TopControls";

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
        const newCount = existing.visitCount + 1;
        newCountries.set(countryId, {
          ...existing,
          visitCount: newCount,
          color: newCount >= 5 ? '#000000' : getColorForVisitCount(newCount, existing.color)
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

  const handleCountryDecrease = (countryId: string) => {
    setCountries(prev => {
      const newCountries = new Map(prev);
      const existing = newCountries.get(countryId);
      
      if (existing && existing.visitCount > 0) {
        const newCount = existing.visitCount - 1;
        if (newCount === 0) {
          newCountries.delete(countryId);
        } else {
          newCountries.set(countryId, {
            ...existing,
            visitCount: newCount,
            color: newCount >= 5 ? '#000000' : getColorForVisitCount(newCount, existing.color)
          });
        }
      }
      
      return newCountries;
    });
  };

  const handleSearch = (countryName: string) => {
    const countryId = countryName.toLowerCase().replace(/\s+/g, '-');
    handleCountryClick(countryId, countryName);
  };

  const resetMap = () => {
    setCountries(new Map());
  };

  const totalVisits = Array.from(countries.values()).reduce((sum, country) => sum + country.visitCount, 0);
  const uniqueCountries = countries.size;

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

      {/* Fullscreen Map */}
      <WorldMap 
        countries={countries}
        onCountryClick={handleCountryClick}
        mapLevel={settings.mapLevel}
      />
    </div>
  );
};

export default Index;
