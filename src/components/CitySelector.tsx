'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, X, Plus, Check, Loader2, Navigation } from 'lucide-react';
import { useWidgets } from '@/context/WidgetContext';
import { CITIES, getCitiesByRegion, searchCities, REGION_ORDER, CityData } from '@/data/cities';

export function CitySelector() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const {
    location,
    setManualLocation,
    setAutoLocation,
    worldClocks,
    addWorldClock,
    removeWorldClock,
    citySubTab,
    setCitySubTab,
  } = useWidgets();

  const activeTab = citySubTab;

  // Get current home city
  const homeCity = location.mode === 'manual' && location.manualLocation
    ? location.manualLocation.cityName
    : location.resolvedCityName || 'Not set';

  // Get filtered cities
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return getCitiesByRegion();
    }

    const results = searchCities(searchQuery);
    // Group search results by region
    return results.reduce((acc, city) => {
      if (!acc[city.region]) {
        acc[city.region] = [];
      }
      acc[city.region].push(city);
      return acc;
    }, {} as Record<string, CityData[]>);
  }, [searchQuery]);

  // Check if a city is already in world clocks
  const isInWorldClocks = (cityName: string, timezone: string) => {
    return worldClocks.some(
      (clock) => clock.cityName === cityName && clock.timezone === timezone
    );
  };

  // Handle city selection for home
  const handleSelectHomeCity = (city: CityData) => {
    setManualLocation(city.name, city.timezone);
  };

  // Handle adding to world clocks
  const handleAddToWorldClocks = (city: CityData) => {
    if (!isInWorldClocks(city.name, city.timezone)) {
      addWorldClock({
        cityCode: city.code,
        cityName: city.name,
        country: city.countryCode,
        timezone: city.timezone,
      });
    }
  };

  // Handle requesting current location
  const handleRequestLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsRequestingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Fetch location data from weather API to get city name
          const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
          const data = await response.json();

          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const cityName = data.location?.name || 'Unknown';

          setAutoLocation(
            { latitude, longitude },
            cityName,
            timezone
          );

          setIsRequestingLocation(false);
        } catch (error) {
          console.error('Failed to fetch location data:', error);
          setIsRequestingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to retrieve your location. Please select a city manually.');
        setIsRequestingLocation(false);
      }
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab switcher */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === 'home' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCitySubTab('home')}
          className="flex-1 cursor-pointer data-[state=active]:cursor-default"
        >
          Home City
        </Button>
        <Button
          variant={activeTab === 'world' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCitySubTab('world')}
          className="flex-1 cursor-pointer data-[state=active]:cursor-default"
        >
          World Clocks
        </Button>
      </div>

      {activeTab === 'home' && (
        <>
          {/* Current home city */}
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Current Home City</div>
                  <div className="text-sm text-muted-foreground">{homeCity}</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRequestLocation}
                disabled={isRequestingLocation}
                className="cursor-pointer"
              >
                {isRequestingLocation ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    Use My Location
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* City list */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {REGION_ORDER.filter((region) => filteredCities[region]).map((region) => (
              <div key={region}>
                <div className="text-xs font-semibold text-muted-foreground mb-2 sticky top-0 bg-gray-200 py-1 px-2 rounded-2xl">
                  {region}
                </div>
                <div className="space-y-1">
                  {filteredCities[region].map((city) => (
                    <button
                      key={`${city.name}-${city.timezone}`}
                      onClick={() => handleSelectHomeCity(city)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-medium">{city.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {city.country} • {city.code}
                        </div>
                      </div>
                      {location.mode === 'manual' &&
                       location.manualLocation?.cityName === city.name &&
                       location.manualLocation?.timezone === city.timezone && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'world' && (
        <>
          {/* Current world clocks */}
          {worldClocks.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Your World Clocks</div>
              <div className="space-y-2">
                {worldClocks.map((clock) => (
                  <div
                    key={clock.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <div>
                      <div className="text-sm font-medium">{clock.cityName}</div>
                      <div className="text-xs text-muted-foreground">
                        {clock.country} • {clock.cityCode}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removeWorldClock(clock.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cities to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* City list */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {REGION_ORDER.filter((region) => filteredCities[region]).map((region) => (
              <div key={region}>
                <div className="text-xs font-semibold text-muted-foreground mb-2 sticky top-0 bg-gray-200 py-1 px-2 rounded-2xl">
                  {region}
                </div>
                <div className="space-y-1">
                  {filteredCities[region].map((city) => {
                    const alreadyAdded = isInWorldClocks(city.name, city.timezone);
                    return (
                      <button
                        key={`${city.name}-${city.timezone}`}
                        onClick={() => handleAddToWorldClocks(city)}
                        disabled={alreadyAdded}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div>
                          <div className="text-sm font-medium">{city.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {city.country} • {city.code}
                          </div>
                        </div>
                        {alreadyAdded ? (
                          <Check className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
