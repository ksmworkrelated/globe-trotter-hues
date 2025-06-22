
import { MapSettings } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { RotateCcwIcon, SettingsIcon } from "lucide-react";

interface ControlPanelProps {
  settings: MapSettings;
  onSettingsChange: (settings: MapSettings) => void;
  onReset: () => void;
}

export const ControlPanel = ({ settings, onSettingsChange, onReset }: ControlPanelProps) => {
  const handleColorModeChange = (value: string) => {
    onSettingsChange({
      ...settings,
      colorMode: value as 'random' | 'uniform'
    });
  };

  const handleMapLevelChange = (value: string) => {
    onSettingsChange({
      ...settings,
      mapLevel: value as 'country' | 'state'
    });
  };

  const handleUniformColorChange = (color: string) => {
    onSettingsChange({
      ...settings,
      uniformColor: color
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <SettingsIcon className="h-5 w-5" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          </RadioGroup>
        </div>

        {/* Reset Button */}
        <Button 
          onClick={onReset} 
          variant="outline" 
          size="sm" 
          className="w-full mt-4"
        >
          <RotateCcwIcon className="h-4 w-4 mr-2" />
          Reset Map
        </Button>
      </CardContent>
    </Card>
  );
};
