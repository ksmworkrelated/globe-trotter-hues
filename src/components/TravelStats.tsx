
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlobeIcon, XIcon, EyeIcon, EyeOffIcon } from "lucide-react";

interface TravelStatsProps {
  totalVisits: number;
  uniqueCountries: number;
}

export const TravelStats = ({ totalVisits, uniqueCountries }: TravelStatsProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <div className="absolute bottom-4 right-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-white/90 backdrop-blur-sm hover:bg-white"
        >
          <EyeIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 z-20">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-sm">
            <GlobeIcon className="h-4 w-4" />
            Travel Stats
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            <EyeOffIcon className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{uniqueCountries}</div>
              <div className="text-xs text-blue-800">Countries</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{totalVisits}</div>
              <div className="text-xs text-orange-800">Total Visits</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Progress:</span>
              <span className="font-medium">{Math.round((uniqueCountries / 195) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-orange-500 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((uniqueCountries / 195) * 100, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
