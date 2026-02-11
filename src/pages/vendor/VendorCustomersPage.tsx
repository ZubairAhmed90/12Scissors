import { useState } from 'react';
import {
  Search, Phone, Clock, DollarSign, Bell, Users, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockShops, mockBookings } from '@/data/mockData';
import { format } from 'date-fns';
import VendorLayout from '@/components/vendor/VendorLayout';

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: Date | null;
  isRepeat: boolean;
}

const VendorCustomersPage = () => {
  const shop = mockShops[0];
  const shopBookings = mockBookings.filter(b => b.shopId === shop.id);
  const [searchQuery, setSearchQuery] = useState('');

  // Aggregate customer data from bookings
  const customers: CustomerData[] = [];
  const customerMap = new Map<string, CustomerData>();

  shopBookings.forEach(booking => {
    const existing = customerMap.get(booking.customerId);
    if (existing) {
      existing.totalBookings++;
      existing.totalSpent += booking.totalPrice;
      if (!existing.lastVisit || new Date(booking.date) > existing.lastVisit) {
        existing.lastVisit = new Date(booking.date);
      }
      existing.isRepeat = existing.totalBookings > 1;
    } else {
      customerMap.set(booking.customerId, {
        id: booking.customerId,
        name: booking.customerName,
        phone: booking.customerPhone,
        totalBookings: 1,
        totalSpent: booking.totalPrice,
        lastVisit: new Date(booking.date),
        isRepeat: false,
      });
    }
  });

  customerMap.forEach(customer => customers.push(customer));

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const headerActions = (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5 text-muted-foreground" />
    </Button>
  );

  return (
    <VendorLayout 
      title="Customers" 
      subtitle={`${customers.length} total customer${customers.length !== 1 ? 's' : ''}`}
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="font-display text-2xl font-bold text-foreground">{customers.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Repeat Customers</p>
              <p className="font-display text-2xl font-bold text-primary">
                {customers.filter(c => c.isRepeat).length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="font-display text-2xl font-bold text-foreground">
                ${customers.reduce((sum, c) => sum + c.totalSpent, 0)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Avg. per Customer</p>
              <p className="font-display text-2xl font-bold text-foreground">
                ${customers.length > 0 
                  ? Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length)
                  : 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-card border-border"
          />
        </div>

        {/* Customer List */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Customer Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length > 0 ? (
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-display text-lg font-bold text-primary">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{customer.name}</p>
                          {customer.isRepeat && (
                            <Badge className="gradient-gold text-primary-foreground text-xs">
                              Repeat Customer
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </span>
                          {customer.lastVisit && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last: {format(customer.lastVisit, 'MMM dd, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
                        <Calendar className="h-4 w-4" />
                        {customer.totalBookings} booking{customer.totalBookings !== 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-primary">
                        <DollarSign className="h-4 w-4" />
                        {customer.totalSpent} total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  No Customers Found
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'No customers match your search' 
                    : 'Your customer list will appear here'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default VendorCustomersPage;
