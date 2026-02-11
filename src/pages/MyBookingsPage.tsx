import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Calendar, Clock, MapPin, ChevronLeft, X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format, isAfter, addHours, differenceInHours } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Booking } from '@/types';

const MyBookingsPage = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Load bookings from localStorage
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings.map((b: any) => ({
      ...b,
      date: new Date(b.date),
      createdAt: new Date(b.createdAt),
    })));
  }, []);

  const upcomingBookings = bookings.filter(
    b => b.status === 'booked' && isAfter(new Date(b.date), new Date())
  );
  const pastBookings = bookings.filter(
    b => b.status !== 'booked' || !isAfter(new Date(b.date), new Date())
  );

  const canCancel = (booking: Booking) => {
    const bookingDateTime = new Date(booking.date);
    const now = new Date();
    const hoursUntilBooking = differenceInHours(bookingDateTime, now);
    const hoursSinceCreation = differenceInHours(now, new Date(booking.createdAt));

    // If booking is more than 24 hours away, can cancel
    if (hoursUntilBooking > 24) return true;
    // If same day booking, can cancel within 1 hour of booking
    if (hoursSinceCreation <= 1) return true;
    return false;
  };

  const handleCancel = (bookingId: string) => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const, cancelledAt: new Date() } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return <Badge className="bg-primary text-primary-foreground">Upcoming</Badge>;
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

  const BookingCard = ({ booking, showCancel = false }: { booking: any; showCancel?: boolean }) => (
    <Card className="border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">{booking.shopName}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(booking.date), 'MMM dd, yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {booking.timeSlot}
              </span>
            </div>
          </div>
          {getStatusBadge(booking.status)}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {booking.services.map((service: any, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {service.name}
            </Badge>
          ))}
        </div>

        {/* Discount Code Applied */}
        {booking.discountCode && (
          <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Tag className="h-4 w-4 text-primary" />
            <span className="text-sm font-mono font-semibold text-primary">{booking.discountCode}</span>
            <Badge className="gradient-gold text-primary-foreground text-xs">
              - Rs. {booking.discountAmount}
            </Badge>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            {booking.discountCode && booking.subtotalPrice && (
              <span className="text-sm text-muted-foreground line-through mr-2">
                Rs. {booking.subtotalPrice}
              </span>
            )}
            <span className="font-display text-lg font-bold text-primary">
              Rs. {booking.totalPrice}
            </span>
          </div>
          
          <div className="flex gap-2">
            {showCancel && booking.status === 'booked' && canCancel(booking) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Cancel Booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel your booking at {booking.shopName}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-border">Keep Booking</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCancel(booking.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {showCancel && booking.status === 'booked' && !canCancel(booking) && (
              <span className="text-xs text-muted-foreground">
                Cannot cancel (less than 24h before appointment)
              </span>
            )}
            {booking.status === 'completed' && (
              <Link to={`/shop/${booking.shopId}#reviews`}>
                <Button variant="outline" size="sm" className="border-primary text-primary">
                  Write Review
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-dark border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/marketplace" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Marketplace</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">BarberHub</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          My <span className="gradient-gold-text">Bookings</span>
        </h1>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="w-full max-w-md bg-card border border-border rounded-lg p-1 mb-8">
            <TabsTrigger 
              value="upcoming" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingBookings.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} showCancel />
                ))}
              </div>
            ) : (
              <Card className="border-border">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    No Upcoming Bookings
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You don't have any upcoming appointments. Book your next haircut!
                  </p>
                  <Link to="/marketplace">
                    <Button className="gradient-gold text-primary-foreground">
                      Find a Barber
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastBookings.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {pastBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <Card className="border-border">
                <CardContent className="p-12 text-center">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    No Past Bookings
                  </h3>
                  <p className="text-muted-foreground">
                    Your booking history will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyBookingsPage;
