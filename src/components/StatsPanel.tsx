
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon, GlobeIcon } from "lucide-react";

interface StatsPanelProps {
  totalVisits: number;
  uniqueCountries: number;
}

export const StatsPanel = ({ totalVisits, uniqueCountries }: StatsPanelProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <GlobeIcon className="h-5 w-5" />
          Travel Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{uniqueCountries}</div>
            <div className="text-xs text-blue-800">Countries Visited</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{totalVisits}</div>
            <div className="text-xs text-orange-800">Total Visits</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Countries left:</span>
            <span className="font-medium">{195 - uniqueCountries}</span>
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
        </div>
      </CardContent>
    </Card>
  );
};
