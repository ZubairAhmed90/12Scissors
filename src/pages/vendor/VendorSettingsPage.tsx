import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, User, Store, Bell, Lock, 
  Mail, Phone, MapPin, Camera, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import LocationPicker from '@/components/map/LocationPicker';
import VendorLayout from '@/components/vendor/VendorLayout';

const VendorSettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState({
    // Profile
    ownerName: 'Ali Raza',
    email: 'vendor@12scissors.pk',
    phone: '+92 345 4567890',
    
    // Shop
    shopName: 'The Gentleman\'s Cut',
    shopDescription: 'A premium barbershop experience combining traditional techniques with modern style.',
    address: 'F-7 Markaz, Jinnah Super',
    city: 'Islamabad',
    
    // Location
    coordinates: { lat: 33.7294, lng: 73.0931 } as { lat: number; lng: number } | undefined,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    bookingAlerts: true,
    marketingEmails: false,
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('vendor');
    if (!stored) {
      navigate('/vendor/login');
      return;
    }
    setVendor(JSON.parse(stored));
  }, [navigate]);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully',
    });
  };

  const handlePasswordChange = async () => {
    if (!settings.currentPassword || !settings.newPassword || !settings.confirmPassword) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all password fields',
        variant: 'destructive',
      });
      return;
    }
    if (settings.newPassword !== settings.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSettings(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    toast({
      title: 'Password Updated',
      description: 'Your password has been changed successfully',
    });
  };

  if (!vendor) return null;

  const headerActions = (
    <Button onClick={handleSave} disabled={isLoading} className="gradient-gold text-primary-foreground">
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Save className="h-4 w-4 mr-2" />
      )}
      Save Changes
    </Button>
  );

  return (
    <VendorLayout title="Settings" subtitle="Manage your profile and shop settings" headerActions={headerActions}>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="shop" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Store className="h-4 w-4 mr-2" />
            Shop
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <Button variant="outline" className="border-border">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Full Name</Label>
                  <Input
                    id="ownerName"
                    value={settings.ownerName}
                    onChange={(e) => setSettings(prev => ({ ...prev, ownerName: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shop Settings */}
        <TabsContent value="shop">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Shop Information</CardTitle>
              <CardDescription>Update your shop details and location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    value={settings.shopName}
                    onChange={(e) => setSettings(prev => ({ ...prev, shopName: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={settings.address}
                      onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={settings.city}
                      onChange={(e) => setSettings(prev => ({ ...prev, city: e.target.value }))}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopDescription">Description</Label>
                <Textarea
                  id="shopDescription"
                  value={settings.shopDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, shopDescription: e.target.value }))}
                  className="bg-secondary border-border min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="bg-card border-border mt-6">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Shop Location
              </CardTitle>
              <CardDescription>
                Set your shop's exact location on the map so customers can find you easily
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocationPicker
                value={settings.coordinates ? { ...settings.coordinates, address: settings.address } : undefined}
                onChange={(location) => {
                  setSettings(prev => ({
                    ...prev,
                    coordinates: { lat: location.lat, lng: location.lng },
                    address: location.address,
                  }));
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive booking updates via email</p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Get SMS alerts for new bookings</p>
                  </div>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Booking Alerts</p>
                    <p className="text-sm text-muted-foreground">Push notifications for bookings</p>
                  </div>
                </div>
                <Switch
                  checked={settings.bookingAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, bookingAlerts: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Receive tips and promotions</p>
                  </div>
                </div>
                <Switch
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, marketingEmails: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={settings.currentPassword}
                    onChange={(e) => setSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={settings.newPassword}
                    onChange={(e) => setSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(e) => setSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
              <Button onClick={handlePasswordChange} disabled={isLoading} variant="outline">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </VendorLayout>
  );
};

export default VendorSettingsPage;
