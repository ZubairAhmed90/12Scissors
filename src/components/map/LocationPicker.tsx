import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Loader2, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationPickerProps {
  value?: { lat: number; lng: number; address?: string };
  onChange: (location: { lat: number; lng: number; address: string }) => void;
  className?: string;
}

const LocationPicker = ({ value, onChange, className = '' }: LocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(value?.address || '');

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const defaultCenter = value || { lat: 33.6844, lng: 73.0479 };
    
    const map = L.map(mapRef.current).setView([defaultCenter.lat, defaultCenter.lng], 15);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add initial marker if value exists
    if (value) {
      addOrUpdateMarker(value.lat, value.lng);
    }

    // Click to add marker
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      addOrUpdateMarker(lat, lng);
      const address = await reverseGeocode(lat, lng);
      setSelectedAddress(address);
      onChange({ lat, lng, address });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const addOrUpdateMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;
    
    const shopIcon = L.divIcon({
      html: `<div class="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white animate-bounce">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                 <circle cx="12" cy="10" r="3"/>
               </svg>
             </div>`,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { icon: shopIcon, draggable: true })
        .addTo(mapInstanceRef.current);
      
      markerRef.current.on('dragend', async () => {
        const position = markerRef.current?.getLatLng();
        if (position) {
          const address = await reverseGeocode(position.lat, position.lng);
          setSelectedAddress(address);
          onChange({ lat: position.lat, lng: position.lng, address });
        }
      });
    }

    mapInstanceRef.current.setView([lat, lng], 16);
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || 'Unknown location';
    } catch {
      return 'Unknown location';
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=pk&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lon);
        addOrUpdateMarker(latNum, lngNum);
        setSelectedAddress(display_name);
        onChange({ lat: latNum, lng: lngNum, address: display_name });
      } else {
        toast({
          title: 'Location not found',
          description: 'Try a different search term',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Search failed',
        description: 'Could not search for location',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation',
        variant: 'destructive',
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        addOrUpdateMarker(lat, lng);
        const address = await reverseGeocode(lat, lng);
        setSelectedAddress(address);
        onChange({ lat, lng, address });
        setIsLocating(false);
      },
      () => {
        toast({
          title: 'Location access denied',
          description: 'Please allow location access to use this feature',
          variant: 'destructive',
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search location in Pakistan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
          variant="outline"
          className="border-border"
        >
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
        <Button
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
        </Button>
      </div>

      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-xl border border-border"
      />

      {selectedAddress && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary">
          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <Label className="text-xs text-muted-foreground">Selected Location</Label>
            <p className="text-sm text-foreground">{selectedAddress}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Click on the map or drag the marker to set your shop's exact location
      </p>
    </div>
  );
};

export default LocationPicker;
