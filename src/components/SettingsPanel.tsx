import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcwIcon, XIcon, MinusIcon } from "lucide-react";
import { CountryData, MapSettings } from "@/pages/Index";

interface SettingsPanelProps {
  settings: MapSettings;
  onSettingsChange: (settings: MapSettings) => void;
  onReset: () => void;
  onClose: () => void;
  totalVisits: number;
  uniqueCountries: number;
  countries: Record<string, CountryData>;
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
  onCountryDecrease,
}: SettingsPanelProps) => {
  const handleColorModeChange = (value: string) => {
    onSettingsChange({
      ...settings,
      colorMode: value as "random" | "uniform",
    });
  };

  const handleMapLevelChange = (value: string) => {
    onSettingsChange({
      ...settings,
      mapLevel: value as "country" | "state" | "city",
    });
  };

  const handleUniformColorChange = (color: string) => {
    onSettingsChange({
      ...settings,
      uniformColor: color,
    });
  };

  const countryList = Object.values(countries).sort(
    (a, b) => b.visitCount - a.visitCount
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
        onClick={onClose}
      />

      {/* Settings Panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-40 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Travel Settings
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
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
                  <Label htmlFor="random" className="text-sm">
                    Random Colors
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="uniform" id="uniform" />
                  <Label htmlFor="uniform" className="text-sm">
                    Uniform Color
                  </Label>
                </div>
              </RadioGroup>

              {settings.colorMode === "uniform" && (
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
                  <Label htmlFor="country" className="text-sm">
                    Country Level
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="state" id="state" />
                  <Label htmlFor="state" className="text-sm">
                    State Level
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="city" id="city" />
                  <Label htmlFor="city" className="text-sm">
                    City Level
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Map Theme */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Theme</Label>
              <RadioGroup
                value={settings.theme}
                onValueChange={(value) =>
                  onSettingsChange({
                    ...settings,
                    theme: value as "light" | "dark",
                  })
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="text-sm">
                    Light
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="text-sm">
                    Dark
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Visited Countries */}
            {countryList.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Visited Countries</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {countryList.map((country) => (
                    <div
                      key={country.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: country.color }}
                        />
                        <span className="text-sm font-medium">
                          {country.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {country.visitCount}
                        </span>
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
