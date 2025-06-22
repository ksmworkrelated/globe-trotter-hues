
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  onSearch: (countryName: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm("");
    }
  };

  const popularCountries = [
    "United States", "Canada", "United Kingdom", "France", "Germany", 
    "Japan", "Australia", "Brazil", "India", "China"
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <SearchIcon className="h-5 w-5" />
          Quick Add
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter country name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm">
            Add
          </Button>
        </form>
        
        <div className="space-y-2">
          <p className="text-xs text-gray-600 font-medium">Quick add popular destinations:</p>
          <div className="flex flex-wrap gap-1">
            {popularCountries.slice(0, 4).map((country) => (
              <Button
                key={country}
                variant="outline"
                size="sm"
                onClick={() => onSearch(country)}
                className="text-xs h-7"
              >
                {country}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
