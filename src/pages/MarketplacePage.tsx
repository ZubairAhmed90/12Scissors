import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Scissors, Search, SlidersHorizontal, X, Star, MapPin, Map, Grid3X3, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import ShopCard from '@/components/marketplace/ShopCard';
import { mockShops, cities, serviceCategories, mockShopCategories } from '@/data/mockData';
import LeafletMap from '@/components/map/LeafletMap';
import LocationPermissionDialog from '@/components/map/LocationPermissionDialog';
import { calculateDistance, formatDistance } from '@/hooks/useGeolocation';
import { BarberShop } from '@/types';

const MarketplacePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedShopCategory, setSelectedShopCategory] = useState<string | null>(null);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showOffersOnly, setShowOffersOnly] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Parse URL parameters for category filtering
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    const cityParam = searchParams.get('city');
    
    if (categorySlug) {
      const category = mockShopCategories.find(c => c.slug === categorySlug);
      if (category) {
        setSelectedShopCategory(category.id);
      }
    }
    
    if (cityParam) {
      setSelectedCity(cityParam);
    }
  }, [searchParams]);

  // Load cached location
  useEffect(() => {
    const cached = localStorage.getItem('userLocation');
    if (cached) {
      try {
        setUserLocation(JSON.parse(cached));
      } catch {
        // Invalid cached data
      }
    }
  }, []);

  const handleLocationAllow = (location: { lat: number; lng: number }) => {
    setUserLocation(location);
  };

  const handleLocationDeny = () => {
    // User denied, continue without location
  };

  const shopsWithDistance = useMemo(() => {
    return mockShops.map(shop => {
      let distance = Infinity;
      if (userLocation && shop.location.coordinates) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          shop.location.coordinates.lat,
          shop.location.coordinates.lng
        );
      }
      return { ...shop, distance };
    });
  }, [userLocation]);

  const filteredShops = useMemo(() => {
    let result = [...shopsWithDistance];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        shop =>
          shop.name.toLowerCase().includes(query) ||
          shop.description.toLowerCase().includes(query) ||
          shop.services.some(s => s.name.toLowerCase().includes(query))
      );
    }

    // City filter
    if (selectedCity && selectedCity !== 'all') {
      result = result.filter(shop => shop.location.city === selectedCity);
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter(shop => shop.rating >= minRating);
    }

    // Price filter (maxPrice slider is 0-100, representing Rs. 0 to Rs. 50,000)
    const maxPriceValue = maxPrice * 500;
    if (maxPrice < 100) {
      result = result.filter(shop =>
        shop.services.some(s => s.price <= maxPriceValue)
      );
    }

    // Service category filter
    if (selectedCategories.length > 0) {
      result = result.filter(shop =>
        shop.services.some(s => selectedCategories.includes(s.category))
      );
    }

    // Shop category filter (from URL params like /marketplace?category=spa-wellness)
    if (selectedShopCategory) {
      result = result.filter(shop =>
        shop.categoryId === selectedShopCategory || shop.categories.includes(selectedShopCategory)
      );
    }

    // Open only filter
    if (showOpenOnly) {
      result = result.filter(shop => shop.isOpen);
    }

    // Offers only filter
    if (showOffersOnly) {
      result = result.filter(shop => shop.offers.length > 0);
    }

    // Sort
    switch (sortBy) {
      case 'distance':
        result.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'price-low':
        result.sort((a, b) => {
          const aMin = Math.min(...a.services.map(s => s.price));
          const bMin = Math.min(...b.services.map(s => s.price));
          return aMin - bMin;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const aMin = Math.min(...a.services.map(s => s.price));
          const bMin = Math.min(...b.services.map(s => s.price));
          return bMin - aMin;
        });
        break;
    }

    return result;
  }, [searchQuery, selectedCity, minRating, maxPrice, selectedCategories, selectedShopCategory, showOpenOnly, showOffersOnly, sortBy, shopsWithDistance]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setMinRating(0);
    setMaxPrice(100);
    setSelectedCategories([]);
    setSelectedShopCategory(null);
    setShowOpenOnly(false);
    setShowOffersOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedCity !== 'all' || minRating > 0 || maxPrice < 100 || selectedCategories.length > 0 || selectedShopCategory || showOpenOnly || showOffersOnly;

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleShopClick = (shop: BarberShop) => {
    navigate(`/shop/${shop.slug}`);
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Location Permission Dialog */}
      <LocationPermissionDialog
        onAllow={handleLocationAllow}
        onDeny={handleLocationDeny}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-dark border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Scissors className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground">12Scissors</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/bookings">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                My Bookings
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Find Your <span className="gradient-gold-text">Barber</span>
            </h1>
            <p className="text-muted-foreground">
              Discover {filteredShops.length} barbershop{filteredShops.length !== 1 ? 's' : ''} 
              {userLocation && ' near you'}
            </p>
          </div>

          {/* View Toggle & Location Status */}
          <div className="flex items-center gap-3">
            {userLocation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation className="h-4 w-4 text-primary" />
                <span>Location enabled</span>
              </div>
            )}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'gradient-gold text-primary-foreground' : ''}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'gradient-gold text-primary-foreground' : ''}
              >
                <Map className="h-4 w-4 mr-2" />
                Map
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search barbershops, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card border-border"
            />
          </div>

          {/* City Select */}
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full lg:w-48 h-12 bg-card border-border">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48 h-12 bg-card border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="distance">Nearest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Filters Sheet (Mobile) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden h-12 border-border">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-2 gradient-gold text-primary-foreground">Active</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-card border-border">
              <SheetHeader>
                <SheetTitle className="text-foreground">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <FilterContent
                  minRating={minRating}
                  setMinRating={setMinRating}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  showOpenOnly={showOpenOnly}
                  setShowOpenOnly={setShowOpenOnly}
                  showOffersOnly={showOffersOnly}
                  setShowOffersOnly={setShowOffersOnly}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="glass rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">Filters</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <FilterContent
                minRating={minRating}
                setMinRating={setMinRating}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                showOpenOnly={showOpenOnly}
                setShowOpenOnly={setShowOpenOnly}
                showOffersOnly={showOffersOnly}
                setShowOffersOnly={setShowOffersOnly}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {viewMode === 'map' ? (
              <div className="glass rounded-xl overflow-hidden" style={{ height: '600px' }}>
                <LeafletMap
                  shops={filteredShops}
                  userLocation={userLocation}
                  onShopClick={handleShopClick}
                  zoom={12}
                />
              </div>
            ) : filteredShops.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredShops.map((shop) => (
                  <div key={shop.id} className="relative">
                    <ShopCard shop={shop} />
                    {userLocation && shop.distance !== Infinity && (
                      <Badge className="absolute top-4 left-4 bg-background/90 text-foreground border border-border">
                        <Navigation className="h-3 w-3 mr-1" />
                        {formatDistance(shop.distance)}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-xl p-12 text-center">
                <Scissors className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  No barbershops found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters} variant="outline" className="border-primary text-primary">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface FilterContentProps {
  minRating: number;
  setMinRating: (value: number) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  showOpenOnly: boolean;
  setShowOpenOnly: (value: boolean) => void;
  showOffersOnly: boolean;
  setShowOffersOnly: (value: boolean) => void;
}

const FilterContent = ({
  minRating,
  setMinRating,
  maxPrice,
  setMaxPrice,
  selectedCategories,
  toggleCategory,
  showOpenOnly,
  setShowOpenOnly,
  showOffersOnly,
  setShowOffersOnly,
}: FilterContentProps) => {
  return (
    <div className="space-y-6">
      {/* Rating */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          Minimum Rating
        </label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              variant={minRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setMinRating(rating)}
              className={minRating === rating ? "gradient-gold text-primary-foreground border-0" : "border-border"}
            >
              {rating === 0 ? 'All' : (
                <span className="flex items-center gap-1">
                  {rating}
                  <Star className="h-3 w-3 fill-current" />
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          Max Price: <span className="text-primary">{maxPrice === 100 ? 'Any' : `Rs. ${(maxPrice * 500).toLocaleString()}`}</span>
        </label>
        <Slider
          value={[maxPrice]}
          onValueChange={([value]) => setMaxPrice(value)}
          max={100}
          step={5}
          className="py-2"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          Service Categories
        </label>
        <div className="space-y-2">
          {serviceCategories.map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor={category}
                className="ml-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <div className="flex items-center">
          <Checkbox
            id="openOnly"
            checked={showOpenOnly}
            onCheckedChange={(checked) => setShowOpenOnly(checked as boolean)}
            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label htmlFor="openOnly" className="ml-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
            Open Now
          </label>
        </div>
        <div className="flex items-center">
          <Checkbox
            id="offersOnly"
            checked={showOffersOnly}
            onCheckedChange={(checked) => setShowOffersOnly(checked as boolean)}
            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label htmlFor="offersOnly" className="ml-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
            Has Offers
          </label>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
