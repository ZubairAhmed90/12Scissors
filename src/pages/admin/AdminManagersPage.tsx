import { useState } from 'react';
import { Shield, Plus, Trash2, Copy, Eye, EyeOff, Mail, Phone, Calendar, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  status: 'active' | 'inactive';
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
}

const initialManagers: Manager[] = [
  {
    id: 'mgr1',
    name: 'Bilal Ahmed',
    email: 'manager@12scissors.pk',
    phone: '+92 311 6789012',
    password: 'manager123',
    status: 'active',
    permissions: ['view_bookings', 'manage_billing', 'view_reports'],
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2025-01-30'),
  },
];

const availablePermissions = [
  { id: 'view_bookings', label: 'View All Bookings', description: 'Can see all reservations' },
  { id: 'manage_billing', label: 'Manage Billing', description: 'Create invoices for dealers' },
  { id: 'view_reports', label: 'View Reports', description: 'Access analytics & reports' },
  { id: 'manage_vendors', label: 'Manage Vendors', description: 'Edit vendor information' },
  { id: 'manage_customers', label: 'Manage Customers', description: 'Edit customer information' },
];

const AdminManagersPage = () => {
  const { toast } = useToast();
  const [managers, setManagers] = useState<Manager[]>(initialManagers);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const [newManager, setNewManager] = useState({
    name: '',
    email: '',
    phone: '',
    permissions: [] as string[],
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCreateManager = async () => {
    if (!newManager.name || !newManager.email || !newManager.phone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const password = generatePassword();
    const manager: Manager = {
      id: `mgr_${Date.now()}`,
      name: newManager.name,
      email: newManager.email,
      phone: newManager.phone,
      password,
      status: 'active',
      permissions: newManager.permissions,
      createdAt: new Date(),
    };

    setManagers(prev => [...prev, manager]);
    setIsLoading(false);
    setShowCreateDialog(false);
    setNewManager({ name: '', email: '', phone: '', permissions: [] });

    toast({
      title: 'Manager Created! 🎉',
      description: `${manager.name} can now login with password: ${password}`,
    });
  };

  const togglePermission = (permId: string) => {
    setNewManager(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId],
    }));
  };

  const deleteManager = () => {
    if (selectedManager) {
      setManagers(prev => prev.filter(m => m.id !== selectedManager.id));
      toast({
        title: 'Manager Removed',
        description: `${selectedManager.name} has been removed`,
        variant: 'destructive',
      });
      setShowDeleteConfirm(false);
      setSelectedManager(null);
    }
  };

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
    toast({
      title: 'Copied!',
      description: 'Credentials copied to clipboard',
    });
  };

  const toggleStatus = (managerId: string) => {
    setManagers(prev => prev.map(m => {
      if (m.id === managerId) {
        const newStatus = m.status === 'active' ? 'inactive' : 'active';
        toast({
          title: newStatus === 'active' ? 'Manager Activated' : 'Manager Deactivated',
          description: `${m.name} is now ${newStatus}`,
        });
        return { ...m, status: newStatus };
      }
      return m;
    }));
  };

  return (
    <AdminLayout title="Manager Management" subtitle="Create and manage platform managers">
      {/* Info Card */}
      <Card className="bg-primary/10 border-primary/20 mb-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">About Managers</h4>
              <p className="text-sm text-muted-foreground">
                Managers can view all reservations, generate bills for dealers, and access reports based on their permissions.
                They cannot modify platform settings or manage other managers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Manager Button */}
      <div className="flex justify-end mb-6">
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-gold text-primary-foreground shadow-gold">
              <Plus className="h-4 w-4 mr-2" />
              Create Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Manager</DialogTitle>
              <DialogDescription>
                A password will be auto-generated for the manager
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Horizontal form layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Manager name"
                    value={newManager.name}
                    onChange={(e) => setNewManager(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="manager@12scissors.pk"
                    value={newManager.email}
                    onChange={(e) => setNewManager(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="+92 3XX XXXXXXX"
                    value={newManager.phone}
                    onChange={(e) => setNewManager(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availablePermissions.map((perm) => (
                    <div
                      key={perm.id}
                      onClick={() => togglePermission(perm.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        newManager.permissions.includes(perm.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground text-sm">{perm.label}</p>
                          <p className="text-xs text-muted-foreground">{perm.description}</p>
                        </div>
                        {newManager.permissions.includes(perm.id) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button
                onClick={handleCreateManager}
                disabled={isLoading}
                className="gradient-gold text-primary-foreground"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Manager'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Managers List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Active Managers ({managers.length})</CardTitle>
          <CardDescription>All platform managers and their credentials</CardDescription>
        </CardHeader>
        <CardContent>
          {managers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No managers created yet</p>
              <p className="text-sm">Click "Create Manager" to add one</p>
            </div>
          ) : (
            <div className="space-y-4">
              {managers.map((manager) => (
                <div key={manager.id} className="p-4 rounded-lg bg-secondary border border-border">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                        <Shield className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{manager.name}</h3>
                          <Badge className={manager.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {manager.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {manager.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {manager.phone}
                          </span>
                        </div>
                        
                        {/* Credentials */}
                        <div className="mt-3 p-3 rounded bg-card border border-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground">Login Credentials</p>
                              <p className="text-sm text-foreground">Password: {showPassword[manager.id] ? manager.password : '••••••••••'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPassword(prev => ({ ...prev, [manager.id]: !prev[manager.id] }))}
                              >
                                {showPassword[manager.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyCredentials(manager.email, manager.password)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Permissions */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {manager.permissions.map((p) => (
                            <Badge key={p} variant="secondary" className="text-xs">
                              {availablePermissions.find(ap => ap.id === p)?.label || p}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Created: {manager.createdAt.toLocaleDateString()}
                          {manager.lastLogin && (
                            <span className="ml-2">• Last login: {manager.lastLogin.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(manager.id)}
                        className={manager.status === 'active' ? 'text-red-400 border-red-400/50' : 'text-green-400 border-green-400/50'}
                      >
                        {manager.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => {
                          setSelectedManager(manager);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Remove Manager</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedManager?.name}? They will lose access to the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteManager}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminManagersPage;
