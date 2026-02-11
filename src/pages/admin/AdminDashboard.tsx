import { Link } from 'react-router-dom';
import { 
  Store, FolderOpen, Calendar, DollarSign, TrendingUp, Users, ChevronRight,
  Percent, Tag, Gift, Sparkles, Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockShops, mockBookings, mockCategories, mockShopCategories } from '@/data/mockData';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminDashboard = () => {
  const totalShops = mockShops.length;
  const totalBookings = mockBookings.length;
  const totalCategories = mockCategories.length;
  const totalRevenue = mockShops.reduce((acc, shop) => acc + (shop.billing?.totalRevenue || 0), 0);
  const totalCommission = mockShops
    .filter(s => s.billing?.planType === 'commission')
    .reduce((acc, s) => acc + (s.billing?.commissionEarned || 0), 0);
  const subscriptionRevenue = mockShops
    .filter(s => s.billing?.planType === 'subscription')
    .reduce((acc, s) => acc + (s.billing?.subscriptionPrice || 0), 0);

  const verifiedShops = mockShops.filter(s => s.isVerified).length;
  const premiumShops = mockShops.filter(s => s.isPremium).length;
  const activeOffers = mockShops.reduce((acc, shop) => acc + shop.offers.filter(o => o.isActive).length, 0);

  // Category-wise shop breakdown
  const categoryStats = mockShopCategories.map(cat => {
    const shopsInCategory = mockShops.filter(shop => shop.categoryId === cat.id);
    const revenue = shopsInCategory.reduce((acc, shop) => acc + (shop.billing?.totalRevenue || 0), 0);
    return {
      ...cat,
      shopCount: shopsInCategory.length,
      revenue,
      bookings: shopsInCategory.reduce((acc, shop) => acc + (shop.billing?.totalBookings || 0), 0),
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Subscription breakdown
  const subscriptionStats = {
    basic: mockShops.filter(s => s.billing?.subscriptionTier === 'basic').length,
    premium: mockShops.filter(s => s.billing?.subscriptionTier === 'premium').length,
    enterprise: mockShops.filter(s => s.billing?.subscriptionTier === 'enterprise').length,
    commission: mockShops.filter(s => s.billing?.planType === 'commission').length,
  };

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Overview of platform performance">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Shops</CardTitle>
            <Store className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalShops}</div>
            <p className="text-xs text-muted-foreground">{verifiedShops} verified, {premiumShops} premium</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Rs. {(subscriptionRevenue + totalCommission).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Subscriptions + Commissions</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Offers</CardTitle>
            <Gift className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeOffers}</div>
            <p className="text-xs text-muted-foreground">Across all vendors</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">GMV</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Rs. {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Gross merchandise value</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription & Category Stats */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Subscription Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Vendor Plans
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Enterprise</p>
                <p className="text-2xl font-bold text-foreground">{subscriptionStats.enterprise}</p>
                <p className="text-xs text-primary">Rs. 10,000/mo</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Premium</p>
                <p className="text-2xl font-bold text-foreground">{subscriptionStats.premium}</p>
                <p className="text-xs text-primary">Rs. 5,000/mo</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Basic</p>
                <p className="text-2xl font-bold text-foreground">{subscriptionStats.basic}</p>
                <p className="text-xs text-primary">Rs. 3,000/mo</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Commission</p>
                <p className="text-2xl font-bold text-foreground">{subscriptionStats.commission}</p>
                <p className="text-xs text-primary">10% per booking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category-wise Revenue */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryStats.slice(0, 5).map((cat, index) => (
              <div key={cat.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{cat.name}</span>
                  <span className="text-muted-foreground">{cat.shopCount} shops • Rs. {cat.revenue.toLocaleString()}</span>
                </div>
                <Progress 
                  value={(cat.revenue / (categoryStats[0]?.revenue || 1)) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/categories">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                <FolderOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">Manage Categories</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or remove service categories</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/shops">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                <Store className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">Manage Shops</h3>
                <p className="text-sm text-muted-foreground">Verify, manage, or remove vendor shops</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/users">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">User Management</h3>
                <p className="text-sm text-muted-foreground">Manage customers and vendors</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Category-wise Vendors Table */}
      <Card className="bg-card border-border mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Vendors by Category</CardTitle>
          <Link to="/admin/shops">
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {mockShopCategories.map(category => {
              const shopsInCat = mockShops.filter(s => s.categoryId === category.id);
              if (shopsInCat.length === 0) return null;
              
              return (
                <div key={category.id} className="p-4 rounded-lg bg-secondary">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">{category.name}</h4>
                      <Badge variant="secondary">{shopsInCat.length} vendors</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {shopsInCat.slice(0, 4).map(shop => (
                      <Badge key={shop.id} variant="outline" className="border-border">
                        {shop.name}
                        {shop.isPremium && <Crown className="h-3 w-3 ml-1 text-primary" />}
                      </Badge>
                    ))}
                    {shopsInCat.length > 4 && (
                      <Badge variant="outline" className="border-primary text-primary">
                        +{shopsInCat.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Offers by Category */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Active Offers Across Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockShops
              .filter(shop => shop.offers.some(o => o.isActive))
              .slice(0, 5)
              .map(shop => (
                <div key={shop.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                  <div className="flex items-center gap-3">
                    <img src={shop.logo} alt={shop.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{shop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {mockShopCategories.find(c => c.id === shop.categoryId)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {shop.offers.filter(o => o.isActive).map(offer => (
                      <Badge key={offer.id} className="gradient-gold text-primary-foreground">
                        <Percent className="h-3 w-3 mr-1" />
                        {offer.discountPercent}% OFF
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
