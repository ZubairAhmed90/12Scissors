import { useState } from 'react';
import { Users, Search, UserCheck, UserX, Shield, Crown, Trash2, Eye, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

// Extended mock users with more details
const initialUsers = [
  { id: 'user1', name: 'Ahmed Khan', email: 'ahmed@email.com', phone: '+92 300 1234567', city: 'Islamabad', role: 'customer' as const, status: 'active' as const, createdAt: new Date('2023-02-01'), bookingsCount: 12 },
  { id: 'user2', name: 'Sara Ali', email: 'sara@email.com', phone: '+92 321 2345678', city: 'Lahore', role: 'customer' as const, status: 'active' as const, createdAt: new Date('2023-03-15'), bookingsCount: 8 },
  { id: 'user3', name: 'Usman Malik', email: 'usman@email.com', phone: '+92 333 3456789', city: 'Karachi', role: 'customer' as const, status: 'blocked' as const, createdAt: new Date('2023-04-20'), bookingsCount: 3 },
  { id: 'vendor1', name: 'Ali Raza', email: 'vendor@12scissors.pk', phone: '+92 345 4567890', city: 'Islamabad', role: 'vendor' as const, status: 'active' as const, createdAt: new Date('2023-01-15'), bookingsCount: 156 },
  { id: 'vendor2', name: 'Hassan Shah', email: 'hassan@shop.pk', phone: '+92 300 5678901', city: 'Lahore', role: 'vendor' as const, status: 'active' as const, createdAt: new Date('2023-02-20'), bookingsCount: 89 },
  { id: 'manager1', name: 'Bilal Ahmed', email: 'manager@12scissors.pk', phone: '+92 311 6789012', city: 'Islamabad', role: 'manager' as const, status: 'active' as const, createdAt: new Date('2024-01-01'), bookingsCount: 0 },
];

type UserRole = 'customer' | 'vendor' | 'manager' | 'admin';
type UserStatus = 'active' | 'blocked';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  bookingsCount: number;
}

const AdminUsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'blocked' : 'active';
        toast({
          title: newStatus === 'active' ? 'User Activated' : 'User Blocked',
          description: `${user.name} has been ${newStatus === 'active' ? 'activated' : 'blocked'}`,
        });
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const deleteUser = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      toast({
        title: 'User Deleted',
        description: `${selectedUser.name} has been removed from the platform`,
        variant: 'destructive',
      });
      setShowDeleteConfirm(false);
      setSelectedUser(null);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const variants: Record<UserRole, { color: string; icon: React.ReactNode }> = {
      customer: { color: 'bg-blue-500/20 text-blue-400', icon: <Users className="h-3 w-3" /> },
      vendor: { color: 'bg-green-500/20 text-green-400', icon: <Crown className="h-3 w-3" /> },
      manager: { color: 'bg-purple-500/20 text-purple-400', icon: <Shield className="h-3 w-3" /> },
      admin: { color: 'bg-primary/20 text-primary', icon: <Shield className="h-3 w-3" /> },
    };
    return (
      <Badge className={`${variants[role].color} gap-1`}>
        {variants[role].icon}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: UserStatus) => {
    return status === 'active' 
      ? <Badge className="bg-green-500/20 text-green-400">Active</Badge>
      : <Badge className="bg-red-500/20 text-red-400">Blocked</Badge>;
  };

  return (
    <AdminLayout title="User Management" subtitle="Manage customers, vendors, and managers">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.filter(u => u.role === 'customer').length}</p>
                <p className="text-xs text-muted-foreground">Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Crown className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.filter(u => u.role === 'vendor').length}</p>
                <p className="text-xs text-muted-foreground">Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.filter(u => u.role === 'manager').length}</p>
                <p className="text-xs text-muted-foreground">Managers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <UserX className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.filter(u => u.status === 'blocked').length}</p>
                <p className="text-xs text-muted-foreground">Blocked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'customer', 'vendor', 'manager'] as const).map((role) => (
                <Button
                  key={role}
                  variant={filterRole === role ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole(role)}
                  className={filterRole === role ? 'gradient-gold text-primary-foreground' : 'border-border'}
                >
                  {role === 'all' ? 'All Users' : role.charAt(0).toUpperCase() + role.slice(1) + 's'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-secondary gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {user.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDetails(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleUserStatus(user.id)}
                    className={user.status === 'active' ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}
                  >
                    {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{selectedUser.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="text-foreground">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="text-foreground">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">City</p>
                  <p className="text-foreground">{selectedUser.city}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bookings</p>
                  <p className="text-foreground">{selectedUser.bookingsCount}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Member Since</p>
                  <p className="text-foreground">{selectedUser.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsersPage;
