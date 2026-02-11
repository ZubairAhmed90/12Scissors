import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Scissors, MapPin, Phone, Mail, Clock, Star, 
  BadgeCheck, Tag, ChevronLeft, Calendar, Share2,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { mockShops, mockReviews } from '@/data/mockData';
import { format } from 'date-fns';

const ShopDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const shop = mockShops.find(s => s.slug === slug);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  if (!shop) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <div className="text-center">
          <Scissors className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Shop Not Found</h1>
          <p className="text-muted-foreground mb-6">The barbershop you're looking for doesn't exist.</p>
          <Link to="/marketplace">
            <Button className="gradient-gold text-primary-foreground">
              Browse All Shops
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const shopReviews = mockReviews.filter(r => r.shopId === shop.id);
  const totalPrice = shop.services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);
  const totalDuration = shop.services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.duration, 0);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-dark border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/marketplace" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Marketplace</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Cover Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={shop.coverImage}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Shop Logo & Name */}
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-6">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-4 border-card shadow-lg">
              <img
                src={shop.logo}
                alt={`${shop.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground">
                  {shop.name}
                </h1>
                {shop.isVerified && (
                  <BadgeCheck className="h-6 w-6 text-primary" />
                )}
                {shop.isPremium && (
                  <Badge className="gradient-gold text-primary-foreground border-0">
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                  <span className="font-semibold text-foreground">{shop.rating}</span>
                  <span>({shop.reviewCount} reviews)</span>
                </div>
                <Badge variant={shop.isOpen ? "default" : "secondary"} className={shop.isOpen ? "bg-success" : ""}>
                  {shop.isOpen ? 'Open Now' : 'Closed'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="w-full justify-start bg-card border border-border rounded-lg p-1 mb-6">
                <TabsTrigger value="services" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Services
                </TabsTrigger>
                <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  About
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Gallery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="space-y-4">
                {shop.services.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all ${
                      selectedServices.includes(service.id)
                        ? 'border-primary shadow-gold'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {service.duration} min
                          </span>
                          <Badge variant="secondary">{service.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-xl font-bold text-primary">
                          ${service.price}
                        </span>
                        {selectedServices.includes(service.id) && (
                          <Badge className="ml-2 gradient-gold text-primary-foreground border-0">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="about">
                <Card className="border-border">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground mb-3">About</h3>
                      <p className="text-muted-foreground">{shop.description}</p>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground mb-3">Working Hours</h3>
                      <div className="grid gap-2">
                        {shop.workingHours.map((hours) => (
                          <div key={hours.day} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{hours.day}</span>
                            <span className={hours.isOpen ? 'text-foreground' : 'text-muted-foreground'}>
                              {hours.isOpen ? `${hours.openTime} - ${hours.closeTime}` : 'Closed'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {shop.offers.length > 0 && (
                      <div>
                        <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                          <Tag className="h-5 w-5 text-primary" />
                          Current Offers
                        </h3>
                        <div className="space-y-3">
                          {shop.offers.map((offer) => (
                            <div key={offer.id} className="glass rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-foreground">{offer.title}</span>
                                <Badge className="gradient-gold text-primary-foreground border-0">
                                  {offer.discountPercent}% OFF
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{offer.description}</p>
                              <div className="flex items-center justify-between mt-3">
                                <code className="text-sm bg-secondary px-2 py-1 rounded text-primary">
                                  {offer.code}
                                </code>
                                <span className="text-xs text-muted-foreground">
                                  Valid until {format(offer.validUntil, 'MMM dd, yyyy')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {shopReviews.length > 0 ? (
                  shopReviews.map((review) => (
                    <Card key={review.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="font-semibold text-primary">
                                {review.customerName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">{review.customerName}</span>
                              <p className="text-xs text-muted-foreground">
                                {format(review.createdAt, 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-primary fill-primary' : 'text-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-border">
                    <CardContent className="p-8 text-center">
                      <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="gallery">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {shop.gallery.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${shop.name} gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 sticky top-24">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                Book Appointment
              </h3>

              {/* Contact Info */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{shop.location.address}, {shop.location.city}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{shop.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{shop.email}</span>
                </div>
              </div>

              {/* Selected Services Summary */}
              {selectedServices.length > 0 ? (
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-foreground">Selected Services</h4>
                  <div className="space-y-2">
                    {shop.services
                      .filter(s => selectedServices.includes(s.id))
                      .map(service => (
                        <div key={service.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{service.name}</span>
                          <span className="text-foreground">${service.price}</span>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-muted-foreground">Total</span>
                      <div className="text-xs text-muted-foreground">{totalDuration} minutes</div>
                    </div>
                    <span className="font-display text-2xl font-bold text-primary">${totalPrice}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 mb-6 border border-dashed border-border rounded-lg">
                  <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Select services to continue</p>
                </div>
              )}

              <Link
                to={selectedServices.length > 0 ? `/booking/${shop.slug}?services=${selectedServices.join(',')}` : '#'}
                onClick={(e) => {
                  if (selectedServices.length === 0) e.preventDefault();
                }}
              >
                <Button
                  className="w-full h-12 gradient-gold text-primary-foreground shadow-gold"
                  disabled={selectedServices.length === 0}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;
