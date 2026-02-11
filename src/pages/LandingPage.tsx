import { Link } from 'react-router-dom';
import { 
  Scissors, Star, MapPin, Clock, ArrowRight, Quote, CheckCircle,
  Sparkles, Heart, Users, Crown, Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockShops, mockShopCategories, mockTestimonials, cities } from '@/data/mockData';
import ShopCard from '@/components/marketplace/ShopCard';
import { useState } from 'react';
import HeroVideoCarousel from '@/components/landing/HeroVideoCarousel';
import MobileNav from '@/components/landing/MobileNav';
import Footer from '@/components/Footer';

const categoryIcons: Record<string, React.ReactNode> = {
  scissors: <Scissors className="h-8 w-8" />,
  sparkles: <Sparkles className="h-8 w-8" />,
  heart: <Heart className="h-8 w-8" />,
  users: <Users className="h-8 w-8" />,
  crown: <Crown className="h-8 w-8" />,
  palette: <Palette className="h-8 w-8" />,
};

const LandingPage = () => {
  const [searchCity, setSearchCity] = useState('');
  const featuredShops = mockShops.filter(shop => shop.isPremium).slice(0, 6);
  const popularServices = [
    { name: 'Haircut', icon: Scissors, bookings: '15K+' },
    { name: 'Beard Trim', icon: Scissors, bookings: '8K+' },
    { name: 'Facial', icon: Sparkles, bookings: '5K+' },
    { name: 'Full Body Massage', icon: Heart, bookings: '4K+' },
    { name: 'Bridal Makeup', icon: Crown, bookings: '2K+' },
    { name: 'Nail Art', icon: Palette, bookings: '3K+' },
  ];

  return (
    <div className="min-h-screen bg-background dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Scissors className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground">12Scissors</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
              Find Barbers
            </Link>
            <Link to="/vendor/login" className="text-muted-foreground hover:text-foreground transition-colors">
              For Business
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Login
              </Button>
            </Link>
          </div>
          <MobileNav />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <HeroVideoCarousel />

        <div className="relative z-20 container mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">
            Pakistan's Premier
            <span className="block gradient-gold-text">Grooming Destination</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up">
            Discover top-rated barbershops, spas & salons across Pakistan. Book appointments instantly and enjoy premium grooming services.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto animate-fade-in-up">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Enter your city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="pl-12 h-14 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Link to={`/marketplace${searchCity ? `?city=${encodeURIComponent(searchCity)}` : ''}`}>
              <Button className="h-14 px-8 gradient-gold text-primary-foreground font-semibold shadow-gold">
                Find Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Quick city links */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up">
            {cities.slice(0, 4).map((city) => (
              <Link key={city} to={`/marketplace?city=${encodeURIComponent(city)}`}>
                <Button variant="secondary" size="sm" className="bg-secondary/50 hover:bg-secondary">
                  {city}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse by <span className="gradient-gold-text">Category</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find exactly what you're looking for from our wide range of grooming services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockShopCategories.map((category) => (
              <Link key={category.id} to={`/marketplace?category=${category.slug}`}>
                <Card className="group bg-secondary border-border hover:border-primary/50 transition-all duration-300 overflow-hidden h-full">
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">{category.shopCount} shops</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Partner Shops' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '4.8', label: 'Average Rating', icon: Star },
              { value: '24/7', label: 'Online Booking' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-display text-4xl md:text-5xl font-bold gradient-gold-text">
                    {stat.value}
                  </span>
                  {stat.icon && <stat.icon className="h-6 w-6 text-primary fill-primary" />}
                </div>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular <span className="gradient-gold-text">Services</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Most booked services by our customers this month
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularServices.map((service, index) => (
              <Link key={index} to={`/marketplace?service=${encodeURIComponent(service.name)}`}>
                <Card className="bg-secondary border-border hover:border-primary/50 transition-all duration-300 text-center p-6 h-full">
                  <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center mx-auto mb-4">
                    <service.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{service.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {service.bookings} bookings
                  </Badge>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Featured <span className="gradient-gold-text">Shops</span>
              </h2>
              <p className="text-muted-foreground mt-2">Handpicked premium shops for the best experience</p>
            </div>
            <Link to="/marketplace">
              <Button variant="outline" className="hidden md:flex border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>

          <div className="md:hidden mt-8 text-center">
            <Link to="/marketplace">
              <Button className="gradient-gold text-primary-foreground">
                View All Shops
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
            How It <span className="gradient-gold-text">Works</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Find Your Service',
                description: 'Browse through our curated list of premium barbershops, spas, and salons in your area.',
                icon: MapPin,
              },
              {
                step: '02',
                title: 'Book Instantly',
                description: 'Choose your services, pick a time slot, and confirm your appointment with one click.',
                icon: Clock,
              },
              {
                step: '03',
                title: 'Enjoy & Review',
                description: 'Get the perfect service and share your experience to help others discover great shops.',
                icon: Star,
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="glass p-8 rounded-2xl h-full transition-all duration-300 hover:shadow-gold hover:border-primary/50">
                  <span className="font-display text-6xl font-bold text-primary/20 absolute top-4 right-6">
                    {item.step}
                  </span>
                  <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center mb-6">
                    <item.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our <span className="gradient-gold-text">Customers Say</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real reviews from real customers who love our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-card border-border h-full">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.customerImage} 
                      alt={testimonial.customerName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{testimonial.customerName}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose <span className="gradient-gold-text">12Scissors</span>?
              </h2>
              <p className="text-muted-foreground mb-8">
                We're not just a booking platform - we're your partner in looking and feeling your best.
              </p>
              <div className="space-y-4">
                {[
                  'Verified and rated professionals only',
                  'Instant booking with real-time availability',
                  'Secure payments and easy cancellations',
                  'Exclusive deals and loyalty rewards',
                  'Location-based search for nearby shops',
                  '24/7 customer support',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop" 
                alt="Barbershop"
                className="rounded-2xl object-cover w-full h-48"
              />
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop" 
                alt="Spa"
                className="rounded-2xl object-cover w-full h-48 mt-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop" 
                alt="Salon"
                className="rounded-2xl object-cover w-full h-48"
              />
              <img 
                src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop" 
                alt="Nails"
                className="rounded-2xl object-cover w-full h-48 mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-gold opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Look Your Best?
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of satisfied customers who trust 12Scissors for their grooming needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="gradient-gold text-primary-foreground shadow-gold">
                Book Now
              </Button>
            </Link>
            <Link to="/vendor/register">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                List Your Shop
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
