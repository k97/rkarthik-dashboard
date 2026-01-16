'use client';

import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface City {
  name: string;
  country: string;
  timezone: string;
}

const POPULAR_CITIES: City[] = [
  { name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne' },
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { name: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { name: 'New York', country: 'United States', timezone: 'America/New_York' },
  { name: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles' },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { name: 'Chennai', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris' },
];

interface LocationPickerProps {
  onSelectCity: (cityName: string, timezone: string) => void;
  onRetryGeolocation?: () => void;
  showRetryOption?: boolean;
}

export function LocationPicker({
  onSelectCity,
  onRetryGeolocation,
  showRetryOption = false,
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCities = POPULAR_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCity = (city: City) => {
    onSelectCity(city.name, city.timezone);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MapPin className="w-4 h-4" />
          Select Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {showRetryOption && onRetryGeolocation && (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                onRetryGeolocation();
                setIsOpen(false);
              }}
            >
              <MapPin className="w-4 h-4" />
              Use my current location
            </Button>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {filteredCities.map((city) => (
              <Button
                key={`${city.name}-${city.country}`}
                variant="ghost"
                className="justify-start h-auto py-2 px-3"
                onClick={() => handleSelectCity(city)}
              >
                <div className="text-left">
                  <div className="font-medium">{city.name}</div>
                  <div className="text-xs text-muted-foreground">{city.country}</div>
                </div>
              </Button>
            ))}
          </div>

          {filteredCities.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No cities found. Try a different search.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
