import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Scissors, Calendar, DollarSign, FileText, TrendingUp, 
  Users, Store, LogOut, Menu, X, Eye, Download, Filter, Tag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockBookings, mockShops } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [manager, setManager] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterShop, setFilterShop] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const stored = localStorage.getItem('manager');
    if (!stored) {
      navigate('/manager/login');
      return;
    }
    setManager(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('manager');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
    navigate('/manager/login');
  };

  // Calculate stats
  const totalBookings = mockBookings.length;
  const completedBookings = mockBookings.filter(b => b.status === 'completed').length;
  const totalRevenue = mockBookings.reduce((acc, b) => acc + b.totalPrice, 0);
  const commissionEarned = Math.round(totalRevenue * 0.10); // 10% commission

  // Filter bookings
  const filteredBookings = mockBookings.filter(b => {
    const matchesShop = filterShop === 'all' || b.shopId === filterShop;
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchesShop && matchesStatus;
  });

  // Generate invoice
  const generateInvoice = (shopId: string) => {
    const shop = mockShops.find(s => s.id === shopId);
    const shopBookings = mockBookings.filter(b => b.shopId === shopId && b.status === 'completed');
    const shopRevenue = shopBookings.reduce((acc, b) => acc + b.totalPrice, 0);
    const commission = Math.round(shopRevenue * 0.10);

    toast({
      title: 'Invoice Generated',
      description: `Invoice for ${shop?.name}: Rs. ${commission.toLocaleString()} commission on Rs. ${shopRevenue.toLocaleString()} revenue`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'booked': return 'bg-blue-500/20 text-blue-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      case 'no-show': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (!manager) return null;

  return (
    <div className="min-h-screen bg-background dark">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 glass-dark border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">Manager Portal</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <Scissors className="h-8 w-8 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">12Scissors</span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-xs text-muted-foreground">Logged in as</p>
            <p className="font-semibold text-foreground">{manager.name}</p>
            <Badge className="mt-1 bg-purple-500/20 text-purple-400">Manager</Badge>
          </div>

          <div className="pt-4 space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-3 text-foreground bg-purple-500/10">
              <Calendar className="h-5 w-5" />
              Dashboard
            </Button>
            <Link to="/manager/bookings">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                <FileText className="h-5 w-5" />
                All Bookings
              </Button>
            </Link>
            <Link to="/manager/discount-codes">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                <Tag className="h-5 w-5" />
                Discount Codes
              </Button>
            </Link>
            <Link to="/manager/billing">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                <DollarSign className="h-5 w-5" />
                Billing & Invoices
              </Button>
            </Link>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Manager Dashboard</h1>
            <p className="text-muted-foreground">View all reservations and manage billing</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalBookings}</p>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{completedBookings}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">Rs. {totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">Rs. {commissionEarned.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Commission (10%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dealer Billing */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-foreground">Dealer Billing</CardTitle>
              <CardDescription>Generate invoices for commission-based vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockShops.map((shop) => {
                  const shopBookings = mockBookings.filter(b => b.shopId === shop.id && b.status === 'completed');
                  const shopRevenue = shopBookings.reduce((acc, b) => acc + b.totalPrice, 0);
                  const commission = Math.round(shopRevenue * 0.10);

                  return (
                    <div key={shop.id} className="p-4 rounded-lg bg-secondary border border-border">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{shop.name}</h4>
                          <p className="text-sm text-muted-foreground">{shop.location.city}</p>
                        </div>
                        <Badge className={shop.isPremium ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}>
                          {shop.isPremium ? 'Subscription' : 'Commission'}
                        </Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Bookings</p>
                          <p className="font-semibold text-foreground">{shopBookings.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-semibold text-foreground">Rs. {shopRevenue.toLocaleString()}</p>
                        </div>
                      </div>
                      {!shop.isPremium && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground">Commission Due</p>
                              <p className="font-bold text-primary">Rs. {commission.toLocaleString()}</p>
                            </div>
                            <Button size="sm" onClick={() => generateInvoice(shop.id)}>
                              <FileText className="h-4 w-4 mr-1" />
                              Invoice
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* All Reservations */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground">All Reservations</CardTitle>
                  <CardDescription>View and filter all platform bookings</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={filterShop} onValueChange={setFilterShop}>
                    <SelectTrigger className="w-40 bg-secondary border-border">
                      <SelectValue placeholder="All Shops" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Shops</SelectItem>
                      {mockShops.map((shop) => (
                        <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32 bg-secondary border-border">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no-show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-secondary gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="font-semibold text-primary">{booking.customerName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">{booking.shopName}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="text-foreground">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time</p>
                        <p className="text-foreground">{booking.timeSlot}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-semibold text-primary">Rs. {booking.totalPrice}</p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
