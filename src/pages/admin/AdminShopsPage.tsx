import { useState } from 'react';
import { 
  Store, Search, MoreVertical, CheckCircle, XCircle, Eye, 
  Trash2, ToggleLeft, ToggleRight, Star, MapPin, Phone,
  TrendingUp, DollarSign, Calendar, Users, CreditCard, Percent,
  Receipt, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockShops } from '@/data/mockData';
import { BarberShop } from '@/types';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminShopsPage = () => {
  const [shops, setShops] = useState<BarberShop[]>(mockShops);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShop, setSelectedShop] = useState<BarberShop | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterPlan, setFilterPlan] = useState<'all' | 'subscription' | 'commission'>('all');

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || shop.billing?.planType === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const handleToggleVerification = (shopId: string) => {
    setShops(prev => prev.map(shop =>
      shop.id === shopId ? { ...shop, isVerified: !shop.isVerified } : shop
    ));
    toast.success('Shop verification status updated');
  };

  const handleTogglePremium = (shopId: string) => {
    setShops(prev => prev.map(shop =>
      shop.id === shopId ? { ...shop, isPremium: !shop.isPremium } : shop
    ));
    toast.success('Shop premium status updated');
  };

  const handleDeleteShop = (shopId: string) => {
    setShops(prev => prev.filter(shop => shop.id !== shopId));
    toast.success('Shop deleted successfully');
  };

  const handleViewDetails = (shop: BarberShop) => {
    setSelectedShop(shop);
    setIsDetailOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'premium': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'basic': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AdminLayout title="Vendor Management" subtitle="Manage all registered vendors and their billing">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{shops.length}</p>
                <p className="text-xs text-muted-foreground">Total Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CreditCard className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {shops.filter(s => s.billing?.planType === 'subscription').length}
                </p>
                <p className="text-xs text-muted-foreground">Subscribed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Percent className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {shops.filter(s => s.billing?.planType === 'commission').length}
                </p>
                <p className="text-xs text-muted-foreground">Commission</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <TrendingUp className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(shops.reduce((sum, s) => sum + (s.billing?.totalRevenue || 0), 0))}
                </p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Horizontal Layout */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Plan:</span>
          <div className="flex gap-1">
            {['all', 'subscription', 'commission'].map((plan) => (
              <Button
                key={plan}
                variant={filterPlan === plan ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterPlan(plan as typeof filterPlan)}
                className={filterPlan === plan ? 'gradient-gold text-primary-foreground' : ''}
              >
                {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-green-500 text-green-500">
            {shops.filter(s => s.isVerified).length} Verified
          </Badge>
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            {shops.filter(s => s.isPremium).length} Premium
          </Badge>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredShops.map((shop) => (
          <Card 
            key={shop.id} 
            className="bg-card border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => handleViewDetails(shop)}
          >
            <div className="relative h-32">
              <img
                src={shop.coverImage}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                {shop.isVerified && (
                  <Badge className="bg-green-500/90 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {shop.isPremium && (
                  <Badge className="bg-amber-500/90 text-white">Premium</Badge>
                )}
              </div>
              <div className="absolute top-2 left-2">
                {shop.billing && (
                  <Badge className={shop.billing.planType === 'subscription' 
                    ? 'bg-green-500/90 text-white' 
                    : 'bg-blue-500/90 text-white'
                  }>
                    {shop.billing.planType === 'subscription' 
                      ? shop.billing.subscriptionTier?.toUpperCase() 
                      : `${shop.billing.commissionRate}% Commission`
                    }
                  </Badge>
                )}
              </div>
              <div className="absolute bottom-2 left-2">
                <img
                  src={shop.logo}
                  alt={shop.name}
                  className="w-12 h-12 rounded-full border-2 border-background object-cover"
                />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground truncate">{shop.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{shop.location.city}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-primary fill-primary" />
                      <span className="text-sm text-foreground">{shop.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({shop.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetails(shop); }}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleToggleVerification(shop.id); }}>
                      {shop.isVerified ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Remove Verification
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify Shop
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleTogglePremium(shop.id); }}>
                      {shop.isPremium ? (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-2" />
                          Remove Premium
                        </>
                      ) : (
                        <>
                          <ToggleRight className="h-4 w-4 mr-2" />
                          Make Premium
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => { e.stopPropagation(); handleDeleteShop(shop.id); }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Shop
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Revenue Info */}
              {shop.billing && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-semibold text-foreground">{formatCurrency(shop.billing.totalRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bookings</p>
                      <p className="font-semibold text-foreground">{shop.billing.totalBookings}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredShops.length === 0 && (
        <div className="text-center py-12">
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No vendors found matching your search</p>
        </div>
      )}

      {/* Vendor Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedShop && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedShop.logo}
                    alt={selectedShop.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <DialogTitle className="text-foreground">{selectedShop.name}</DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedShop.isVerified && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">Verified</Badge>
                      )}
                      {selectedShop.isPremium && (
                        <Badge className="bg-amber-500/20 text-amber-400 text-xs">Premium</Badge>
                      )}
                      {selectedShop.billing && (
                        <Badge className={getTierColor(selectedShop.billing.subscriptionTier)}>
                          {selectedShop.billing.planType === 'subscription' 
                            ? `${selectedShop.billing.subscriptionTier?.toUpperCase()} Plan`
                            : `${selectedShop.billing.commissionRate}% Commission`
                          }
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-3 bg-secondary">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="billing">Billing & Revenue</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img
                      src={selectedShop.coverImage}
                      alt={selectedShop.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Horizontal info layout */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-secondary">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-xs">Location</span>
                      </div>
                      <p className="text-sm text-foreground">{selectedShop.location.city}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-xs">Phone</span>
                      </div>
                      <p className="text-sm text-foreground">{selectedShop.phone}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Star className="h-4 w-4" />
                        <span className="text-xs">Rating</span>
                      </div>
                      <p className="text-sm text-foreground">{selectedShop.rating} ({selectedShop.reviewCount} reviews)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs">Joined</span>
                      </div>
                      <p className="text-sm text-foreground">{selectedShop.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-foreground">{selectedShop.description}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Services ({selectedShop.services.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedShop.services.map(service => (
                        <Badge key={service.id} variant="outline" className="text-xs">
                          {service.name} - {formatCurrency(service.price)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="billing" className="mt-4 space-y-4">
                  {selectedShop.billing ? (
                    <>
                      {/* Plan Type Card */}
                      <Card className="bg-secondary border-border">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Current Plan
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Plan Type</p>
                              <Badge className={selectedShop.billing.planType === 'subscription' 
                                ? 'bg-green-500/20 text-green-400 mt-1' 
                                : 'bg-blue-500/20 text-blue-400 mt-1'
                              }>
                                {selectedShop.billing.planType === 'subscription' ? 'SaaS Subscription' : 'Commission Based'}
                              </Badge>
                            </div>
                            {selectedShop.billing.planType === 'subscription' ? (
                              <>
                                <div>
                                  <p className="text-xs text-muted-foreground">Tier</p>
                                  <Badge className={`${getTierColor(selectedShop.billing.subscriptionTier)} mt-1`}>
                                    {selectedShop.billing.subscriptionTier?.toUpperCase()}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Monthly Price</p>
                                  <p className="text-lg font-bold text-foreground">{formatCurrency(selectedShop.billing.subscriptionPrice || 0)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Status</p>
                                  <Badge className={selectedShop.billing.subscriptionStatus === 'active' 
                                    ? 'bg-green-500/20 text-green-400 mt-1' 
                                    : 'bg-red-500/20 text-red-400 mt-1'
                                  }>
                                    {selectedShop.billing.subscriptionStatus?.toUpperCase()}
                                  </Badge>
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <p className="text-xs text-muted-foreground">Commission Rate</p>
                                  <p className="text-lg font-bold text-foreground">{selectedShop.billing.commissionRate}%</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Commission Earned</p>
                                  <p className="text-lg font-bold text-green-400">{formatCurrency(selectedShop.billing.commissionEarned || 0)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Outstanding</p>
                                  <p className="text-lg font-bold text-amber-400">{formatCurrency(selectedShop.billing.outstandingAmount)}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Revenue Stats - Horizontal */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-card border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-green-500/20">
                                <DollarSign className="h-5 w-5 text-green-400" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Total Revenue</p>
                                <p className="text-xl font-bold text-foreground">{formatCurrency(selectedShop.billing.totalRevenue)}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-card border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-500/20">
                                <Receipt className="h-5 w-5 text-blue-400" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Total Bookings</p>
                                <p className="text-xl font-bold text-foreground">{selectedShop.billing.totalBookings}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-card border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-purple-500/20">
                                <CheckCircle className="h-5 w-5 text-purple-400" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Completed</p>
                                <p className="text-xl font-bold text-foreground">{selectedShop.billing.completedBookings}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-card border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-red-500/20">
                                <XCircle className="h-5 w-5 text-red-400" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Cancelled</p>
                                <p className="text-xl font-bold text-foreground">{selectedShop.billing.cancelledBookings}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Payment Info */}
                      {selectedShop.billing.planType === 'subscription' && (
                        <Card className="bg-secondary border-border">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Last Payment</p>
                                <p className="text-foreground">{selectedShop.billing.lastPaymentDate?.toLocaleDateString() || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Next Billing</p>
                                <p className="text-foreground">{selectedShop.billing.nextBillingDate?.toLocaleDateString() || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Outstanding</p>
                                <p className={selectedShop.billing.outstandingAmount > 0 ? 'text-red-400 font-semibold' : 'text-green-400'}>
                                  {formatCurrency(selectedShop.billing.outstandingAmount)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No billing information available</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="performance" className="mt-4 space-y-4">
                  {selectedShop.billing && (
                    <>
                      {/* Performance Stats - Horizontal */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-card border-border">
                          <CardContent className="p-4 text-center">
                            <p className="text-3xl font-bold text-foreground">
                              {((selectedShop.billing.completedBookings / selectedShop.billing.totalBookings) * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">Completion Rate</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-card border-border">
                          <CardContent className="p-4 text-center">
                            <p className="text-3xl font-bold text-foreground">
                              {formatCurrency(Math.round(selectedShop.billing.totalRevenue / selectedShop.billing.completedBookings))}
                            </p>
                            <p className="text-xs text-muted-foreground">Avg. Order Value</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-card border-border">
                          <CardContent className="p-4 text-center">
                            <p className="text-3xl font-bold text-foreground">{selectedShop.rating}</p>
                            <p className="text-xs text-muted-foreground">Avg. Rating</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-card border-border">
                          <CardContent className="p-4 text-center">
                            <p className="text-3xl font-bold text-foreground">{selectedShop.services.length}</p>
                            <p className="text-xs text-muted-foreground">Services Offered</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Monthly Trend Placeholder */}
                      <Card className="bg-secondary border-border">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Monthly Trend
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-32 flex items-center justify-center text-muted-foreground">
                            <p className="text-sm">Revenue chart coming soon...</p>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>
              </Tabs>

              {/* Actions - Horizontal */}
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border">
                <Button
                  onClick={() => handleToggleVerification(selectedShop.id)}
                  variant={selectedShop.isVerified ? "destructive" : "default"}
                  className={!selectedShop.isVerified ? "gradient-gold text-primary-foreground" : ""}
                >
                  {selectedShop.isVerified ? 'Remove Verification' : 'Verify Vendor'}
                </Button>
                <Button
                  onClick={() => handleTogglePremium(selectedShop.id)}
                  variant="outline"
                >
                  {selectedShop.isPremium ? 'Remove Premium' : 'Make Premium'}
                </Button>
                <Button variant="outline">
                  <Receipt className="h-4 w-4 mr-2" />
                  Generate Invoice
                </Button>
                <Button variant="outline" className="text-red-400 border-red-400/50 hover:bg-red-400/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Vendor
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminShopsPage;
