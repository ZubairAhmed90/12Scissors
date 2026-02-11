import { useState } from 'react';
import { 
  Tag, Plus, Trash2, Edit2, Calendar, Percent, DollarSign,
  CheckCircle, XCircle, Copy, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { toast } from 'sonner';
import { format, isAfter, isBefore } from 'date-fns';
import VendorLayout from '@/components/vendor/VendorLayout';
import { mockShops, mockDiscountCodes } from '@/data/mockData';
import { DiscountCode } from '@/types';

const VendorDiscountCodesPage = () => {
  const shop = mockShops[0]; // Demo shop
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(
    mockDiscountCodes.filter(dc => dc.shopId === shop.id)
  );
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
        isActive: code.isActive,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.code || !formData.title || !formData.validFrom || !formData.validUntil) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.discountType === 'percentage' && (formData.discountValue < 1 || formData.discountValue > 100)) {
      toast.error('Percentage must be between 1 and 100');
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
      shopId: shop.id,
      shopName: shop.name,
      isActive: formData.isActive,
      createdAt: editingCode?.createdAt || new Date(),
      createdBy: editingCode?.createdBy || 'vendor',
      approvalStatus: editingCode?.approvalStatus || 'approved',
      approvedAt: editingCode?.approvedAt || new Date(),
    };

    if (editingCode) {
      setDiscountCodes(prev => prev.map(dc => dc.id === editingCode.id ? codeData : dc));
      toast.success('Discount code updated successfully');
    } else {
      setDiscountCodes(prev => [...prev, codeData]);
      toast.success('Discount code created successfully');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setDiscountCodes(prev => prev.filter(dc => dc.id !== id));
    toast.success('Discount code deleted');
  };

  const toggleStatus = (id: string) => {
    setDiscountCodes(prev => prev.map(dc => 
      dc.id === id ? { ...dc, isActive: !dc.isActive } : dc
    ));
    toast.success('Status updated');
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const approveCode = (id: string) => {
    setDiscountCodes(prev => prev.map(dc => 
      dc.id === id ? { ...dc, approvalStatus: 'approved' as const, isActive: true, approvedAt: new Date() } : dc
    ));
    toast.success('Discount code approved and activated!');
  };

  const rejectCode = (id: string) => {
    setDiscountCodes(prev => prev.map(dc => 
      dc.id === id ? { ...dc, approvalStatus: 'rejected' as const, isActive: false, rejectedReason: 'Vendor rejected' } : dc
    ));
    toast.success('Discount code rejected');
  };

  const getCodeStatus = (code: DiscountCode) => {
    const now = new Date();
    if (code.approvalStatus === 'pending') return { label: 'Pending Approval', variant: 'outline' as const };
    if (code.approvalStatus === 'rejected') return { label: 'Rejected', variant: 'destructive' as const };
    if (!code.isActive) return { label: 'Inactive', variant: 'secondary' as const };
    if (isBefore(now, new Date(code.validFrom))) return { label: 'Scheduled', variant: 'outline' as const };
    if (isAfter(now, new Date(code.validUntil))) return { label: 'Expired', variant: 'destructive' as const };
    if (code.usageLimit && code.usedCount >= code.usageLimit) return { label: 'Exhausted', variant: 'destructive' as const };
    return { label: 'Active', variant: 'default' as const };
  };

  const activeCodesCount = discountCodes.filter(dc => {
    const status = getCodeStatus(dc);
    return status.label === 'Active';
  }).length;

  const pendingCodesCount = discountCodes.filter(dc => dc.approvalStatus === 'pending').length;
  const pendingCodes = discountCodes.filter(dc => dc.approvalStatus === 'pending' && dc.createdBy === 'admin');
  const totalRedemptions = discountCodes.reduce((sum, dc) => sum + dc.usedCount, 0);

  return (
    <VendorLayout title="Discount Codes" subtitle="Create and manage promotional discount codes">
      {/* Pending Approval Banner */}
      {pendingCodes.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/10 mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {pendingCodes.length} Admin-Created Code{pendingCodes.length > 1 ? 's' : ''} Pending Your Approval
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The platform admin has created discount codes for your shop. Review and approve them to activate.
                </p>
                <div className="space-y-2">
                  {pendingCodes.map(code => (
                    <div key={code.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-primary">{code.code}</span>
                        <Badge className="gradient-gold text-primary-foreground text-xs">
                          {code.discountType === 'percentage' 
                            ? `${code.discountValue}% OFF`
                            : `Rs. ${code.discountValue} OFF`
                          }
                        </Badge>
                        <span className="text-sm text-muted-foreground">{code.title}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => rejectCode(code.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-500 hover:bg-emerald-600 text-white"
                          onClick={() => approveCode(code.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                <p className="text-sm text-muted-foreground">Total Uses</p>
                <p className="text-2xl font-bold text-foreground">{totalRedemptions}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full h-full gradient-gold text-primary-foreground"
                  onClick={() => handleOpenDialog()}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Code
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    {editingCode ? 'Edit Discount Code' : 'Create New Discount Code'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
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
                      <p className="text-sm text-muted-foreground">Enable this code for customers to use</p>
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
                      {editingCode ? 'Update Code' : 'Create Code'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Discount Codes Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            All Discount Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {discountCodes.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Code</TableHead>
                    <TableHead className="text-muted-foreground">Discount</TableHead>
                    <TableHead className="text-muted-foreground">Validity</TableHead>
                    <TableHead className="text-muted-foreground">Usage</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discountCodes.map((code) => {
                    const status = getCodeStatus(code);
                    return (
                      <TableRow key={code.id} className="border-border">
                        <TableCell>
                          <div>
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
                            <p className="text-foreground">{format(new Date(code.validFrom), 'dd MMM')} - {format(new Date(code.validUntil), 'dd MMM yyyy')}</p>
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
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleStatus(code.id)}
                              className="h-8 w-8"
                            >
                              {code.isActive ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
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
                              className="h-8 w-8 text-destructive hover:text-destructive"
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
              <h3 className="font-semibold text-foreground mb-2">No discount codes yet</h3>
              <p className="text-muted-foreground mb-4">Create your first discount code to attract customers</p>
              <Button className="gradient-gold text-primary-foreground" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Discount Code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </VendorLayout>
  );
};

export default VendorDiscountCodesPage;
