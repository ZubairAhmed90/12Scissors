import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Tag, BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BarberShop } from '@/types';
import { mockShopCategories } from '@/data/mockData';

interface ShopCardProps {
  shop: BarberShop;
  distance?: number;
}

const ShopCard = ({ shop, distance }: ShopCardProps) => {
  const startingPrice = Math.min(...shop.services.map(s => s.price));
  const category = mockShopCategories.find(c => c.id === shop.categoryId);

  return (
    <Link to={`/shop/${shop.slug}`}>
      <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-gold">
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={shop.coverImage}
            alt={shop.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            {shop.isPremium && (
              <Badge className="gradient-gold text-primary-foreground border-0">
                Premium
              </Badge>
            )}
            <Badge variant={shop.isOpen ? "default" : "secondary"} className={shop.isOpen ? "bg-success" : ""}>
              {shop.isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>

          {/* Category & Offers */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            {category && (
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {category.name}
              </Badge>
            )}
            {shop.offers.filter(o => o.isActive !== false).length > 0 && (
              <Badge variant="destructive" className="gap-1">
                <Tag className="h-3 w-3" />
                {shop.offers.filter(o => o.isActive !== false).length} Offer{shop.offers.filter(o => o.isActive !== false).length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {/* Distance Badge */}
          {distance !== undefined && (
            <div className="absolute bottom-4 right-4">
              <Badge className="bg-background/80 backdrop-blur-sm text-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
              </Badge>
            </div>
          )}

          {/* Logo */}
          <div className="absolute -bottom-6 left-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-card shadow-lg">
              <img
                src={shop.logo}
                alt={`${shop.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <CardContent className="pt-8 pb-4">
          {/* Shop Info */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {shop.name}
                </h3>
                {shop.isVerified && (
                  <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{shop.location.address}, {shop.location.city}</span>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1 bg-secondary rounded-lg px-2 py-1">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="font-semibold text-foreground">{shop.rating}</span>
              <span className="text-muted-foreground text-sm">({shop.reviewCount})</span>
            </div>
          </div>

          {/* Services Preview */}
          <div className="flex flex-wrap gap-1 mb-3">
            {shop.services.slice(0, 3).map((service) => (
              <Badge key={service.id} variant="secondary" className="text-xs">
                {service.name}
              </Badge>
            ))}
            {shop.services.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{shop.services.length - 3} more
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="text-muted-foreground text-sm flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>From 30 min</span>
            </div>
            <div className="text-foreground font-semibold">
              From <span className="text-primary">Rs. {startingPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ShopCard;
