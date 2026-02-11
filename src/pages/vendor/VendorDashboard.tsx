import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scissors, Calendar, Users, Settings,
  TrendingUp, Clock, DollarSign, Star, ChevronRight, Bell,
  Gift, Plus, Tag, Percent, Trash2, ToggleRight, ToggleLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockShops, mockBookings, mockShopCategories, mockCategories } from '@/data/mockData';
import { isToday, isTomorrow, startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';
import { toast } from 'sonner';
import VendorLayout from '@/components/vendor/VendorLayout';
import { Offer } from '@/types';

const VendorDashboard = () => {
  const shop = mockShops[0]; // Demo shop
  const shopBookings = mockBookings.filter(b => b.shopId === shop.id);
  const [offers, setOffers] = useState<Offer[]>(shop.offers);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discountPercent: 10,
    code: '',
    validUntil: '',
  });

  const todayBookings = shopBookings.filter(b => isToday(new Date(b.date)));
  const tomorrowBookings = shopBookings.filter(b => isTomorrow(new Date(b.date)));
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekBookings = shopBookings.filter(b =>
    isWithinInterval(new Date(b.date), { start: weekStart, end: weekEnd })
  );

  const totalRevenue = shopBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // Service category breakdown
  const serviceCategoryStats = mockCategories.slice(0, 6).map(cat => {
    const servicesInCat = shop.services.filter(s => s.category === cat.name);
    const revenue = servicesInCat.reduce((sum, s) => sum * 1.2, 5000); // Mock calculation
    return {
      name: cat.name,
      serviceCount: servicesInCat.length,
      revenue: Math.round(revenue),
    };
  }).filter(c => c.serviceCount > 0);

  const stats = [
    { title: 'Today\'s Bookings', value: todayBookings.length, icon: Calendar, color: 'text-primary' },
    { title: 'This Week', value: weekBookings.length, icon: TrendingUp, color: 'text-emerald-400' },
    { title: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-amber-400' },
    { title: 'Rating', value: shop.rating.toString(), icon: Star, color: 'text-primary' },
  ];

  const handleCreateOffer = () => {
    if (!newOffer.title || !newOffer.code || !newOffer.validUntil) {
      toast.error('Please fill in all required fields');
      return;
    }

    const offer: Offer = {
      id: `offer-${Date.now()}`,
      title: newOffer.title,
      description: newOffer.description,
      discountPercent: newOffer.discountPercent,
      code: newOffer.code.toUpperCase(),
      validUntil: new Date(newOffer.validUntil),
      isActive: true,
    };

    setOffers(prev => [...prev, offer]);
    setNewOffer({ title: '', description: '', discountPercent: 10, code: '', validUntil: '' });
    setIsOfferDialogOpen(false);
    toast.success('Offer created successfully!');
  };

  const toggleOfferStatus = (offerId: string) => {
    setOffers(prev => prev.map(o => 
      o.id === offerId ? { ...o, isActive: !o.isActive } : o
    ));
    toast.success('Offer status updated');
  };

  const deleteOffer = (offerId: string) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
    toast.success('Offer deleted');
  };

  const headerActions = (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
      </Button>
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
        <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
      </div>
    </div>
  );

  return (
    <VendorLayout title="Dashboard" subtitle={`Welcome back, ${shop.name}`} headerActions={headerActions}>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Overview
          </TabsTrigger>
          <TabsTrigger value="offers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Gift className="h-4 w-4 mr-2" />
            Offers & Deals
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="font-display text-3xl font-bold text-foreground mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Today's Schedule</CardTitle>
                <Link to="/vendor/bookings">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayBookings.length > 0 ? (
                  todayBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {booking.customerName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.services.map(s => s.name).join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="border-primary text-primary">
                          <Clock className="h-3 w-3 mr-1" />
                          {booking.timeSlot}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">Rs. {booking.totalPrice}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No bookings scheduled for today</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Link to="/vendor/bookings">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2 border-border hover:border-primary hover:bg-primary/5">
                    <Calendar className="h-6 w-6 text-primary" />
                    <span>Manage Bookings</span>
                  </Button>
                </Link>
                <Link to="/vendor/customers">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2 border-border hover:border-primary hover:bg-primary/5">
                    <Users className="h-6 w-6 text-primary" />
                    <span>View Customers</span>
                  </Button>
                </Link>
                <Link to="/vendor/settings">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2 border-border hover:border-primary hover:bg-primary/5">
                    <Settings className="h-6 w-6 text-primary" />
                    <span>Shop Settings</span>
                  </Button>
                </Link>
                <Link to={`/shop/${shop.slug}`}>
                  <Button variant="outline" className="w-full h-24 flex-col gap-2 border-border hover:border-primary hover:bg-primary/5">
                    <Scissors className="h-6 w-6 text-primary" />
                    <span>View Public Page</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Tomorrow */}
          {tomorrowBookings.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Tomorrow's Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tomorrowBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">{booking.timeSlot}</p>
                      </div>
                      <span className="font-semibold text-primary">Rs. {booking.totalPrice}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Offers Tab */}
        <TabsContent value="offers" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Manage Offers</h2>
              <p className="text-sm text-muted-foreground">Create and manage promotional offers for your shop</p>
            </div>
            <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-gold text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Create New Offer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Offer Title *</Label>
                      <Input
                        id="title"
                        value={newOffer.title}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Weekend Special"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Promo Code *</Label>
                      <Input
                        id="code"
                        value={newOffer.code}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="e.g., WEEKEND20"
                        className="bg-secondary border-border uppercase"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount %</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="1"
                        max="100"
                        value={newOffer.discountPercent}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, discountPercent: parseInt(e.target.value) || 0 }))}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validUntil">Valid Until *</Label>
                      <Input
                        id="validUntil"
                        type="date"
                        value={newOffer.validUntil}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, validUntil: e.target.value }))}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newOffer.description}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your offer..."
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setIsOfferDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="gradient-gold text-primary-foreground" onClick={handleCreateOffer}>
                      Create Offer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Active Offers */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Your Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {offers.length > 0 ? (
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        offer.isActive ? 'border-primary/30 bg-primary/5' : 'border-border bg-secondary opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg gradient-gold flex items-center justify-center">
                          <Percent className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{offer.title}</p>
                            <Badge className={offer.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'}>
                              {offer.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{offer.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>Code: <span className="font-mono text-primary">{offer.code}</span></span>
                            <span>Expires: {format(new Date(offer.validUntil), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="gradient-gold text-primary-foreground text-lg px-4 py-1">
                          {offer.discountPercent}% OFF
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleOfferStatus(offer.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {offer.isActive ? (
                            <ToggleRight className="h-5 w-5 text-primary" />
                          ) : (
                            <ToggleLeft className="h-5 w-5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteOffer(offer.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">No Offers Yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first promotional offer to attract more customers</p>
                  <Button className="gradient-gold text-primary-foreground" onClick={() => setIsOfferDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Offer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="font-display text-3xl font-bold text-foreground mt-1">
                  {shop.billing?.totalBookings || 0}
                </p>
                <p className="text-xs text-primary mt-2">
                  {shop.billing?.completedBookings || 0} completed
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="font-display text-3xl font-bold text-foreground mt-1">
                  {shop.billing?.totalBookings 
                    ? Math.round((shop.billing.completedBookings / shop.billing.totalBookings) * 100) 
                    : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {shop.billing?.cancelledBookings || 0} cancelled
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                <p className="font-display text-3xl font-bold text-foreground mt-1">
                  Rs. {shop.billing?.totalBookings 
                    ? Math.round((shop.billing.totalRevenue || 0) / shop.billing.totalBookings).toLocaleString() 
                    : 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Service Category Performance */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Service Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceCategoryStats.map((cat, index) => (
                  <div key={index} className="p-4 rounded-lg bg-card border border-border">
                    <p className="font-semibold text-foreground">{cat.name}</p>
                    <p className="text-2xl font-bold text-primary mt-2">{cat.serviceCount} services</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </VendorLayout>
  );
};

export default VendorDashboard;
