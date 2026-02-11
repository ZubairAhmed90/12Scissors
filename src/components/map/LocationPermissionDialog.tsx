import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, X } from 'lucide-react';

interface LocationPermissionDialogProps {
  onAllow: (location: { lat: number; lng: number }) => void;
  onDeny: () => void;
}

const LocationPermissionDialog = ({ onAllow, onDeny }: LocationPermissionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we've already asked for permission
    const hasAsked = localStorage.getItem('locationPermissionAsked');
    const savedLocation = localStorage.getItem('userLocation');
    
    if (savedLocation) {
      onAllow(JSON.parse(savedLocation));
      return;
    }

    if (!hasAsked) {
      setOpen(true);
    }
  }, [onAllow]);

  const handleAllow = () => {
    setIsLoading(true);
    localStorage.setItem('locationPermissionAsked', 'true');

    if (!navigator.geolocation) {
      setOpen(false);
      onDeny();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        localStorage.setItem('userLocation', JSON.stringify(location));
        setOpen(false);
        setIsLoading(false);
        onAllow(location);
      },
      () => {
        setOpen(false);
        setIsLoading(false);
        onDeny();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleDeny = () => {
    localStorage.setItem('locationPermissionAsked', 'true');
    setOpen(false);
    onDeny();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Navigation className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl text-foreground">Enable Location Services</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Allow 12Scissors to access your location to show nearby barbershops, salons, and spas in your area.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Find Nearby Shops</p>
              <p className="text-xs text-muted-foreground">Discover salons closest to you</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
            <Navigation className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Get Directions</p>
              <p className="text-xs text-muted-foreground">Navigate to your appointments easily</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button 
            onClick={handleAllow} 
            className="w-full gradient-gold text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? 'Getting Location...' : 'Allow Location Access'}
          </Button>
          <Button 
            onClick={handleDeny} 
            variant="ghost" 
            className="w-full text-muted-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Not Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPermissionDialog;
