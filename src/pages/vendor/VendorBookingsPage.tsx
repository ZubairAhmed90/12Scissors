import { useState } from 'react';
import {
  Calendar, Check, X, Clock, Bell,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockShops, mockBookings } from '@/data/mockData';
import { format, isToday, isTomorrow, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Booking } from '@/types';
import VendorLayout from '@/components/vendor/VendorLayout';

const VendorBookingsPage = () => {
  const { toast } = useToast();
  const shop = mockShops[0];
  const [bookings, setBookings] = useState<Booking[]>(
    mockBookings.filter(b => b.shopId === shop.id).map(b => ({
      ...b,
      date: new Date(b.date),
      createdAt: new Date(b.createdAt),
    }))
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const filteredBookings = bookings.filter(b => isSameDay(new Date(b.date), selectedDate));

  const handleMarkComplete = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: 'completed' as const } : b)
    );
    toast({
      title: "Booking Completed",
      description: "The booking has been marked as completed",
    });
  };

  const handleMarkNoShow = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: 'no-show' as const } : b)
    );
    toast({
      title: "Marked as No-Show",
      description: "The booking has been marked as no-show",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return <Badge className="bg-primary text-primary-foreground">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'no-show':
        return <Badge variant="secondary">No Show</Badge>;
      default:
        return null;
    }
  };

  const headerActions = (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5 text-muted-foreground" />
    </Button>
  );

  return (
    <VendorLayout title="Bookings" subtitle="Manage your appointments" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Week Navigation */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(addDays(selectedDate, -7))}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="font-semibold text-foreground">
                {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const dayBookings = bookings.filter(b => isSameDay(new Date(b.date), day));
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentDay = isToday(day);
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      isSelected
                        ? 'gradient-gold text-primary-foreground shadow-gold'
                        : isCurrentDay
                        ? 'bg-secondary border-2 border-primary'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <p className={`text-xs ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                      {format(day, 'EEE')}
                    </p>
                    <p className={`text-lg font-bold ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {format(day, 'd')}
                    </p>
                    {dayBookings.length > 0 && (
                      <Badge variant={isSelected ? "secondary" : "default"} className={`mt-1 text-xs ${isSelected ? '' : 'gradient-gold border-0'}`}>
                        {dayBookings.length}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {isToday(selectedDate) ? 'Today' : isTomorrow(selectedDate) ? 'Tomorrow' : format(selectedDate, 'EEEE, MMM dd')}
              <Badge variant="secondary" className="ml-2">
                {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings
                  .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-secondary flex flex-col items-center justify-center">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">{booking.timeSlot}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{booking.customerName}</p>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {booking.services.map(s => s.name).join(', ')}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{booking.customerPhone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="font-display text-xl font-bold text-primary">
                          ${booking.totalPrice}
                        </span>
                        
                        {booking.status === 'booked' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleMarkComplete(booking.id)}
                              className="bg-success hover:bg-success/90"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkNoShow(booking.id)}
                              className="border-muted-foreground text-muted-foreground hover:bg-secondary"
                            >
                              <X className="h-4 w-4 mr-1" />
                              No Show
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  No Bookings
                </h3>
                <p className="text-muted-foreground">
                  No appointments scheduled for {format(selectedDate, 'MMMM dd')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default VendorBookingsPage;
