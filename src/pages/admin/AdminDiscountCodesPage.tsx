import { useState } from 'react';
import { 
  Tag, Search, Store, Calendar, Percent, Plus,
  CheckCircle, XCircle, Eye, Filter, Edit2, Trash2, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format, isAfter, isBefore } from 'date-fns';
import AdminLayout from '@/components/admin/AdminLayout';
import { mockDiscountCodes, mockShops, mockShopCategories } from '@/data/mockData';
import { DiscountCode } from '@/types';

const AdminDiscountCodesPage = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(mockDiscountCodes);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [shopFilter, setShopFilter] = useState<string>('all');
  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minOrderValue: 0,
    maxDiscountAmount: 0,
    validFrom: '',
    validUntil: '',
    usageLimit: 0,
    perUserLimit: 1,
    shopId: '',
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 0,
      maxDiscountAmount: 0,
      validFrom: '',
      validUntil: '',
      usageLimit: 0,
      perUserLimit: 1,
      shopId: '',
      isActive: true,
    });
    setEditingCode(null);
  };

  const handleOpenDialog = (code?: DiscountCode) => {
    if (code) {
      setEditingCode(code);
      setFormData({
        code: code.code,
        title: code.title,
        description: code.description,
        discountType: code.discountType,
        discountValue: code.discountValue,
        minOrderValue: code.minOrderValue || 0,
        maxDiscountAmount: code.maxDiscountAmount || 0,
        validFrom: format(new Date(code.validFrom), 'yyyy-MM-dd'),
        validUntil: format(new Date(code.validUntil), 'yyyy-MM-dd'),
        usageLimit: code.usageLimit || 0,
        perUserLimit: code.perUserLimit || 1,
        shopId: code.shopId,
        isActive: code.isActive,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.code || !formData.title || !formData.validFrom || !formData.validUntil || !formData.shopId) {
      toast.error('Please fill in all required fields including shop selection');
      return;
    }

    if (formData.discountType === 'percentage' && (formData.discountValue < 1 || formData.discountValue > 100)) {
      toast.error('Percentage must be between 1 and 100');
      return;
    }

    const shop = mockShops.find(s => s.id === formData.shopId);
    if (!shop) {
      toast.error('Please select a valid shop');
      return;
    }

    const codeData: DiscountCode = {
      id: editingCode?.id || `dc-${Date.now()}`,
      code: formData.code.toUpperCase(),
      title: formData.title,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      minOrderValue: formData.minOrderValue || undefined,
      maxDiscountAmount: formData.maxDiscountAmount || undefined,
      validFrom: new Date(formData.validFrom),
      validUntil: new Date(formData.validUntil),
      usageLimit: formData.usageLimit || undefined,
      usedCount: editingCode?.usedCount || 0,
      perUserLimit: formData.perUserLimit || undefined,
      shopId: formData.shopId,
      shopName: shop.name,
      isActive: formData.isActive,
      createdAt: editingCode?.createdAt || new Date(),
      createdBy: 'admin',
      approvalStatus: editingCode ? editingCode.approvalStatus : 'pending', // Admin-created codes need vendor approval
      approvedAt: editingCode?.approvedAt,
    };

    if (editingCode) {
      setDiscountCodes(prev => prev.map(dc => dc.id === editingCode.id ? codeData : dc));
      toast.success('Discount code updated successfully');
    } else {
      setDiscountCodes(prev => [...prev, codeData]);
      toast.success('Discount code created - pending vendor approval');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setDiscountCodes(prev => prev.filter(dc => dc.id !== id));
    toast.success('Discount code deleted');
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const getCodeStatus = (code: DiscountCode) => {
    const now = new Date();
    if (code.approvalStatus === 'pending') return { label: 'Pending Approval', variant: 'outline' as const, color: 'text-amber-400' };
    if (code.approvalStatus === 'rejected') return { label: 'Rejected', variant: 'destructive' as const, color: 'text-destructive' };
    if (!code.isActive) return { label: 'Inactive', variant: 'secondary' as const, color: 'text-muted-foreground' };
    if (isBefore(now, new Date(code.validFrom))) return { label: 'Scheduled', variant: 'outline' as const, color: 'text-blue-400' };
    if (isAfter(now, new Date(code.validUntil))) return { label: 'Expired', variant: 'destructive' as const, color: 'text-destructive' };
    if (code.usageLimit && code.usedCount >= code.usageLimit) return { label: 'Exhausted', variant: 'destructive' as const, color: 'text-orange-400' };
    return { label: 'Active', variant: 'default' as const, color: 'text-emerald-400' };
  };

  const filteredCodes = discountCodes.filter(code => {
    const matchesSearch = 
      code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const status = getCodeStatus(code);
    const matchesStatus = statusFilter === 'all' || status.label.toLowerCase().includes(statusFilter);
    const matchesShop = shopFilter === 'all' || code.shopId === shopFilter;

    return matchesSearch && matchesStatus && matchesShop;
  });

  const activeCodesCount = discountCodes.filter(dc => getCodeStatus(dc).label === 'Active').length;
  const pendingCodesCount = discountCodes.filter(dc => dc.approvalStatus === 'pending').length;
  const totalRedemptions = discountCodes.reduce((sum, dc) => sum + dc.usedCount, 0);
  const totalShopsWithCodes = new Set(discountCodes.map(dc => dc.shopId)).size;

  return (
    <AdminLayout title="Discount Codes" subtitle="Create and manage discount codes for all vendors">
      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Codes</p>
                <p className="text-2xl font-bold text-foreground">{discountCodes.length}</p>
              </div>
              <Tag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-emerald-400">{activeCodesCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-amber-400">{pendingCodesCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Redemptions</p>
                <p className="text-2xl font-bold text-foreground">{totalRedemptions}</p>
              </div>
              <Percent className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendors</p>
                <p className="text-2xl font-bold text-foreground">{totalShopsWithCodes}</p>
              </div>
              <Store className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card className="border-border mb-6">
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
              <SelectTrigger className="w-full md:w-44 bg-secondary border-border">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending Approval</SelectItem>
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-gold text-primary-foreground" onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Code
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    {editingCode ? 'Edit Discount Code' : 'Create Discount Code for Vendor'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {/* Shop Selection - Required for Admin */}
                  <div className="space-y-2">
                    <Label>Select Shop *</Label>
                    <Select
                      value={formData.shopId}
                      onValueChange={(v) => setFormData(prev => ({ ...prev, shopId: v }))}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select a shop..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockShops.map(shop => (
                          <SelectItem key={shop.id} value={shop.id}>
                            <div className="flex items-center gap-2">
                              <img src={shop.logo} alt={shop.name} className="w-6 h-6 rounded-full object-cover" />
                              {shop.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      ⚠️ Admin-created codes require vendor approval before activation
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Code *</Label>
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="e.g., SAVE20"
                        className="bg-secondary border-border uppercase font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., New Customer Discount"
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the offer..."
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Discount Type</Label>
                      <Select
                        value={formData.discountType}
                        onValueChange={(v) => setFormData(prev => ({ ...prev, discountType: v as 'percentage' | 'fixed' }))}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount (Rs.)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Value *</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          min="1"
                          max={formData.discountType === 'percentage' ? 100 : 100000}
                          value={formData.discountValue}
                          onChange={(e) => setFormData(prev => ({ ...prev, discountValue: parseInt(e.target.value) || 0 }))}
                          className="bg-secondary border-border pl-10"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {formData.discountType === 'percentage' ? <Percent className="h-4 w-4" /> : <span>Rs.</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valid From *</Label>
                      <Input
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Valid Until *</Label>
                      <Input
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Minimum Order Value (Rs.)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.minOrderValue}
                        onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: parseInt(e.target.value) || 0 }))}
                        placeholder="0 = No minimum"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Discount Amount (Rs.)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: parseInt(e.target.value) || 0 }))}
                        placeholder="0 = No cap"
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Total Usage Limit</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: parseInt(e.target.value) || 0 }))}
                        placeholder="0 = Unlimited"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Per Customer Limit</Label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.perUserLimit}
                        onChange={(e) => setFormData(prev => ({ ...prev, perUserLimit: parseInt(e.target.value) || 1 }))}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                    <div>
                      <Label>Active Status</Label>
                      <p className="text-sm text-muted-foreground">
                        {editingCode ? 'Enable this code' : 'Will activate after vendor approval'}
                      </p>
                    </div>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                      Cancel
                    </Button>
                    <Button className="gradient-gold text-primary-foreground" onClick={handleSave}>
                      {editingCode ? 'Update Code' : 'Create Code (Pending Approval)'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Discount Codes Table */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
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
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-primary">{code.code}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyCode(code.code)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{code.title}</p>
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
                          {code.minOrderValue && code.minOrderValue > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Min. Rs. {code.minOrderValue}
                            </p>
                          )}
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
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedCode(code)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(code)}
                              className="h-8 w-8"
                            >
                              <Edit2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(code.id)}
                              className="h-8 w-8 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
    </AdminLayout>
  );
};

export default AdminDiscountCodesPage;