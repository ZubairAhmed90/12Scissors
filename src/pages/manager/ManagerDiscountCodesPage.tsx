import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Scissors, Tag, Search, Store, Calendar, Percent,
  CheckCircle, XCircle, Eye, Filter, LogOut, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format, isAfter, isBefore } from 'date-fns';
import { mockDiscountCodes, mockShops, mockShopCategories } from '@/data/mockData';
import { DiscountCode } from '@/types';
import { useToast } from '@/hooks/use-toast';

const ManagerDiscountCodesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [manager, setManager] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [discountCodes] = useState<DiscountCode[]>(mockDiscountCodes);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [shopFilter, setShopFilter] = useState<string>('all');
  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null);

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

  const getCodeStatus = (code: DiscountCode) => {
    const now = new Date();
    if (code.approvalStatus === 'pending') return { label: 'Pending', variant: 'outline' as const };
    if (code.approvalStatus === 'rejected') return { label: 'Rejected', variant: 'destructive' as const };
    if (!code.isActive) return { label: 'Inactive', variant: 'secondary' as const };
    if (isBefore(now, new Date(code.validFrom))) return { label: 'Scheduled', variant: 'outline' as const };
    if (isAfter(now, new Date(code.validUntil))) return { label: 'Expired', variant: 'destructive' as const };
    if (code.usageLimit && code.usedCount >= code.usageLimit) return { label: 'Exhausted', variant: 'destructive' as const };
    return { label: 'Active', variant: 'default' as const };
  };

  const filteredCodes = discountCodes.filter(code => {
    const matchesSearch = 
      code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const status = getCodeStatus(code);
    const matchesStatus = statusFilter === 'all' || status.label.toLowerCase() === statusFilter;
    const matchesShop = shopFilter === 'all' || code.shopId === shopFilter;

    return matchesSearch && matchesStatus && matchesShop;
  });

  const activeCodesCount = discountCodes.filter(dc => getCodeStatus(dc).label === 'Active').length;
  const pendingCodesCount = discountCodes.filter(dc => dc.approvalStatus === 'pending').length;
  const totalRedemptions = discountCodes.reduce((sum, dc) => sum + dc.usedCount, 0);

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
            <Link to="/manager">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                <Calendar className="h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-3 text-foreground bg-purple-500/10">
              <Tag className="h-5 w-5" />
              Discount Codes
            </Button>
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
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Discount Codes</h1>
            <p className="text-muted-foreground">View all discount codes across all vendors</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{discountCodes.length}</p>
                    <p className="text-xs text-muted-foreground">Total Codes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">{activeCodesCount}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-400">{pendingCodesCount}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Percent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalRedemptions}</p>
                    <p className="text-xs text-muted-foreground">Redemptions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by code, title, or shop..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40 bg-secondary border-border">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={shopFilter} onValueChange={setShopFilter}>
                  <SelectTrigger className="w-full md:w-48 bg-secondary border-border">
                    <Store className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Shop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Shops</SelectItem>
                    {mockShops.map(shop => (
                      <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Discount Codes Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                All Discount Codes ({filteredCodes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCodes.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">Code</TableHead>
                        <TableHead className="text-muted-foreground">Shop</TableHead>
                        <TableHead className="text-muted-foreground">Discount</TableHead>
                        <TableHead className="text-muted-foreground">Validity</TableHead>
                        <TableHead className="text-muted-foreground">Usage</TableHead>
                        <TableHead className="text-muted-foreground">Created By</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCodes.map((code) => {
                        const status = getCodeStatus(code);
                        const shop = mockShops.find(s => s.id === code.shopId);
                        const category = mockShopCategories.find(c => c.id === shop?.categoryId);
                        
                        return (
                          <TableRow key={code.id} className="border-border">
                            <TableCell>
                              <div>
                                <span className="font-mono font-bold text-primary">{code.code}</span>
                                <p className="text-sm text-muted-foreground">{code.title}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {shop && (
                                  <img 
                                    src={shop.logo} 
                                    alt={shop.name} 
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-foreground">{code.shopName}</p>
                                  <p className="text-xs text-muted-foreground">{category?.name}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="gradient-gold text-primary-foreground">
                                {code.discountType === 'percentage' 
                                  ? `${code.discountValue}% OFF`
                                  : `Rs. ${code.discountValue} OFF`
                                }
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="text-foreground">
                                  {format(new Date(code.validFrom), 'dd MMM')} - {format(new Date(code.validUntil), 'dd MMM yyyy')}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="text-foreground font-medium">{code.usedCount} used</p>
                                {code.usageLimit && (
                                  <p className="text-muted-foreground">of {code.usageLimit}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={code.createdBy === 'admin' ? 'default' : 'secondary'}>
                                {code.createdBy === 'admin' ? 'Admin' : 'Vendor'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={status.variant}>{status.label}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedCode(code)}
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No discount codes found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters</p>
                </div>
              )}
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedCode} onOpenChange={() => setSelectedCode(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Discount Code Details</DialogTitle>
          </DialogHeader>
          {selectedCode && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div>
                  <span className="font-mono text-2xl font-bold text-primary">{selectedCode.code}</span>
                  <p className="text-muted-foreground">{selectedCode.title}</p>
                </div>
                <Badge className="gradient-gold text-primary-foreground text-lg px-4 py-2">
                  {selectedCode.discountType === 'percentage' 
                    ? `${selectedCode.discountValue}% OFF`
                    : `Rs. ${selectedCode.discountValue} OFF`
                  }
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">Shop</p>
                  <p className="font-medium text-foreground">{selectedCode.shopName}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getCodeStatus(selectedCode).variant}>
                    {getCodeStatus(selectedCode).label}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <Badge variant={selectedCode.createdBy === 'admin' ? 'default' : 'secondary'}>
                    {selectedCode.createdBy === 'admin' ? 'Admin' : 'Vendor'}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">Approval</p>
                  <Badge variant={
                    selectedCode.approvalStatus === 'approved' ? 'default' :
                    selectedCode.approvalStatus === 'pending' ? 'outline' : 'destructive'
                  }>
                    {selectedCode.approvalStatus}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">Valid From</p>
                  <p className="font-medium text-foreground">
                    {format(new Date(selectedCode.validFrom), 'PPP')}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">Valid Until</p>
                  <p className="font-medium text-foreground">
                    {format(new Date(selectedCode.validUntil), 'PPP')}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">Usage</p>
                  <p className="font-medium text-foreground">
                    {selectedCode.usedCount} / {selectedCode.usageLimit || '∞'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground">Min. Order</p>
                  <p className="font-medium text-foreground">
                    {selectedCode.minOrderValue ? `Rs. ${selectedCode.minOrderValue}` : 'No minimum'}
                  </p>
                </div>
              </div>

              {selectedCode.description && (
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-foreground">{selectedCode.description}</p>
                </div>
              )}

              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="text-foreground">{format(new Date(selectedCode.createdAt), 'PPP')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerDiscountCodesPage;