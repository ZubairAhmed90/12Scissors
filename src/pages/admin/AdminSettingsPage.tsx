import { useState } from 'react';
import { Save, Bell, DollarSign, Shield, Globe, Palette, Mail, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminSettingsPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    // General
    platformName: '12Scissors',
    supportEmail: 'support@12scissors.pk',
    supportPhone: '+92 51 1234567',
    
    // Pricing
    subscriptionPrice: 5000,
    commissionRate: 10,
    minimumPayout: 1000,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    bookingAlerts: true,
    paymentAlerts: true,
    
    // Security
    requireEmailVerification: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: 'Settings Saved',
      description: 'Your platform settings have been updated successfully',
    });
  };

  return (
    <AdminLayout title="Platform Settings" subtitle="Configure platform-wide settings">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">General Settings</CardTitle>
              <CardDescription>Configure basic platform information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) => setSettings(prev => ({ ...prev, platformName: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Settings */}
        <TabsContent value="pricing">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Pricing & Commission</CardTitle>
              <CardDescription>Configure subscription and commission rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subscriptionPrice">Monthly Subscription (Rs.)</Label>
                  <Input
                    id="subscriptionPrice"
                    type="number"
                    value={settings.subscriptionPrice}
                    onChange={(e) => setSettings(prev => ({ ...prev, subscriptionPrice: parseInt(e.target.value) }))}
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">SaaS plan monthly fee</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => setSettings(prev => ({ ...prev, commissionRate: parseInt(e.target.value) }))}
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">Per-booking commission for commission-based plan</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumPayout">Minimum Payout (Rs.)</Label>
                  <Input
                    id="minimumPayout"
                    type="number"
                    value={settings.minimumPayout}
                    onChange={(e) => setSettings(prev => ({ ...prev, minimumPayout: parseInt(e.target.value) }))}
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">Minimum amount for vendor payouts</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <h4 className="font-semibold text-foreground mb-2">Current Plans</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded bg-card border border-border">
                    <p className="font-medium text-foreground">SaaS Subscription</p>
                    <p className="text-primary font-bold">Rs. {settings.subscriptionPrice.toLocaleString()}/month</p>
                    <p className="text-muted-foreground">Unlimited bookings, no commission</p>
                  </div>
                  <div className="p-3 rounded bg-card border border-border">
                    <p className="font-medium text-foreground">Commission Based</p>
                    <p className="text-primary font-bold">{settings.commissionRate}% per booking</p>
                    <p className="text-muted-foreground">No monthly fees, pay as you earn</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Notification Settings</CardTitle>
              <CardDescription>Configure platform notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Send SMS alerts for bookings</p>
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
                      <p className="text-sm text-muted-foreground">Alert vendors on new bookings</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.bookingAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, bookingAlerts: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Payment Alerts</p>
                      <p className="text-sm text-muted-foreground">Notify on payment events</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.paymentAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, paymentAlerts: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Security Settings</CardTitle>
              <CardDescription>Configure platform security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Email Verification</p>
                      <p className="text-sm text-muted-foreground">Require email verification for new users</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                  />
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Session Timeout</p>
                      <p className="text-sm text-muted-foreground">Auto-logout after inactivity (minutes)</p>
                    </div>
                  </div>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    className="bg-card border-border w-32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="gradient-gold text-primary-foreground shadow-gold"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Settings
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
