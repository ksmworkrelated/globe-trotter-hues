
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcwIcon, XIcon, MinusIcon, GlobeIcon } from "lucide-react";
import { CountryData, MapSettings } from "@/pages/Index";

interface SettingsPanelProps {
  settings: MapSettings;
  onSettingsChange: (settings: MapSettings) => void;
  onReset: () => void;
  onClose: () => void;
  totalVisits: number;
  uniqueCountries: number;
  countries: Map<string, CountryData>;
  onCountryDecrease: (countryId: string) => void;
}

export const SettingsPanel = ({ 
  settings, 
  onSettingsChange, 
  onReset, 
  onClose,
  totalVisits,
  uniqueCountries,
  countries,
  onCountryDecrease
}: SettingsPanelProps) => {
  const handleColorModeChange = (value: string) => {
    onSettingsChange({
      ...settings,
      colorMode: value as 'random' | 'uniform'
    });
  };

  const handleMapLevelChange = (value: string) => {
    onSettingsChange({
      ...settings,
      mapLevel: value as 'country' | 'state' | 'city'
    });
  };

  const handleUniformColorChange = (color: string) => {
    onSettingsChange({
      ...settings,
      uniformColor: color
    });
  };

  const countryList = Array.from(countries.values()).sort((a, b) => b.visitCount - a.visitCount);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
        onClick={onClose}
      />
      
      {/* Settings Panel - Right Side */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-40 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <GlobeIcon className="h-5 w-5" />
            Travel Settings
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Travel Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{uniqueCountries}</div>
                    <div className="text-xs text-blue-800">Countries</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{totalVisits}</div>
                    <div className="text-xs text-orange-800">Total Visits</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((uniqueCountries / 195) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {Math.round((uniqueCountries / 195) * 100)}% of world explored
                </div>
              </CardContent>
            </Card>

            {/* Visit Legend */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Visit Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-xs text-gray-600 mb-2">Visits</div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((visits) => (
                      <div key={visits} className="text-center">
                        <div
                          className="w-4 h-4 border border-black mb-1"
                          style={{ 
                            backgroundColor: visits >= 5 ? '#000000' : `rgba(59, 130, 246, ${0.2 + (visits * 0.15)})` 
                          }}
                        />
                        <div className="text-xs">{visits >= 5 ? '5+' : visits}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Mode */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Color Mode</Label>
              <RadioGroup
                value={settings.colorMode}
                onValueChange={handleColorModeChange}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="random" id="random" />
                  <Label htmlFor="random" className="text-sm">Random Colors</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="uniform" id="uniform" />
                  <Label htmlFor="uniform" className="text-sm">Uniform Color</Label>
                </div>
              </RadioGroup>
              
              {settings.colorMode === 'uniform' && (
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="color"
                    value={settings.uniformColor}
                    onChange={(e) => handleUniformColorChange(e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <Label className="text-xs text-gray-600">Pick color</Label>
                </div>
              )}
            </div>

            {/* Map Level */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Map Detail</Label>
              <RadioGroup
                value={settings.mapLevel}
                onValueChange={handleMapLevelChange}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="country" id="country" />
                  <Label htmlFor="country" className="text-sm">Country Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="state" id="state" />
                  <Label htmlFor="state" className="text-sm">State Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="city" id="city" />
                  <Label htmlFor="city" className="text-sm">City Level</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Visited Countries */}
            {countryList.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Visited Countries</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {countryList.map((country) => (
                    <div key={country.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: country.color }}
                        />
                        <span className="text-sm font-medium">{country.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{country.visitCount}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCountryDecrease(country.id)}
                          className="h-6 w-6 p-0"
                        >
                          <MinusIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reset Button */}
            <Button 
              onClick={onReset} 
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              <RotateCcwIcon className="h-4 w-4 mr-2" />
              Reset Map
            </Button>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
