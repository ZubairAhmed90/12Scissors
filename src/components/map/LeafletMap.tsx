import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BarberShop } from '@/types';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LeafletMapProps {
  shops: BarberShop[];
  userLocation?: { lat: number; lng: number } | null;
  onShopClick?: (shop: BarberShop) => void;
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const LeafletMap = ({ 
  shops, 
  userLocation, 
  onShopClick, 
  className = '',
  center,
  zoom = 12
}: LeafletMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Default center (Pakistan - Islamabad)
    const defaultCenter = center || userLocation || { lat: 33.6844, lng: 73.0479 };

    const map = L.map(mapRef.current).setView([defaultCenter.lat, defaultCenter.lng], zoom);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                 <div class="w-2 h-2 bg-white rounded-full"></div>
               </div>`,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Your Location</b>');
    }

    // Add shop markers
    shops.forEach((shop) => {
      if (shop.location.coordinates) {
        const shopIcon = L.divIcon({
          html: `<div class="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                     <circle cx="6" cy="6" r="3"/>
                     <path d="M8.12 8.12 12 12"/>
                     <path d="M20 4 8.12 15.88"/>
                     <circle cx="6" cy="18" r="3"/>
                     <path d="M14.8 14.8 20 20"/>
                   </svg>
                 </div>`,
          className: 'custom-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([shop.location.coordinates.lat, shop.location.coordinates.lng], { icon: shopIcon })
          .addTo(map);

        const popupContent = `
          <div class="min-w-48">
            <h3 class="font-bold text-sm mb-1">${shop.name}</h3>
            <p class="text-xs text-gray-600 mb-2">${shop.location.address}</p>
            <div class="flex items-center gap-1 text-xs">
              <span class="text-amber-500">★</span>
              <span>${shop.rating}</span>
              <span class="text-gray-400">(${shop.reviewCount} reviews)</span>
            </div>
            ${shop.isOpen ? '<span class="text-xs text-green-500">Open Now</span>' : '<span class="text-xs text-red-500">Closed</span>'}
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onShopClick) onShopClick(shop);
        });
      }
    });

    // Fit bounds to show all markers
    const bounds: L.LatLngTuple[] = [];
    if (userLocation) bounds.push([userLocation.lat, userLocation.lng]);
    shops.forEach(shop => {
      if (shop.location.coordinates) {
        bounds.push([shop.location.coordinates.lat, shop.location.coordinates.lng]);
      }
    });
    
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], zoom);
    }
  }, [shops, userLocation, onShopClick, zoom]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full rounded-xl ${className}`}
      style={{ minHeight: '300px' }}
    />
  );
};

export default LeafletMap;
