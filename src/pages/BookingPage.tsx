import { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, CreditCard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { mockShops, generateTimeSlots } from '@/data/mockData';
import { format, addDays, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import DiscountCodeInput from '@/components/booking/DiscountCodeInput';
import { DiscountCode } from '@/types';

const BookingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const shop = mockShops.find(s => s.slug === slug);
  const serviceIds = searchParams.get('services')?.split(',') || [];
  const selectedServices = shop?.services.filter(s => serviceIds.includes(s.id)) || [];

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
    discountCode: DiscountCode;
  } | null>(null);

  const subtotalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const discountAmount = appliedDiscount?.amount || 0;
  const totalPrice = subtotalPrice - discountAmount;
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
    if (date) {
      setTimeSlots(generateTimeSlots(date));
    }
  };

  const handleConfirmBooking = () => {
    // In a real app, this would save to the database
    const booking = {
      id: `booking_${Date.now()}`,
      shopId: shop?.id,
      shopName: shop?.name,
      services: selectedServices,
      date: selectedDate,
      timeSlot: selectedTime,
      subtotalPrice,
      discountCode: appliedDiscount?.code || null,
      discountAmount,
      totalPrice,
      status: 'booked',
      createdAt: new Date(),
    };

    // Save to localStorage for demo
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(existingBookings));

    toast({
      title: "Booking Confirmed! 🎉",
      description: `Your appointment at ${shop?.name} is confirmed for ${format(selectedDate!, 'MMM dd')} at ${selectedTime}`,
    });

    setStep(4);
  };

  if (!shop) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Shop Not Found</h1>
          <Link to="/marketplace">
            <Button className="gradient-gold text-primary-foreground">Browse All Shops</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-dark border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to={`/shop/${slug}`} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to {shop.name}</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[
            { num: 1, label: 'Date', icon: Calendar },
            { num: 2, label: 'Time', icon: Clock },
            { num: 3, label: 'Confirm', icon: CreditCard },
            { num: 4, label: 'Done', icon: Check },
          ].map((s, index) => (
            <div key={s.num} className="flex items-center">
              <div className={cn(
                "flex flex-col items-center",
                step >= s.num ? "text-primary" : "text-muted-foreground"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all",
                  step >= s.num ? "gradient-gold shadow-gold" : "bg-secondary"
                )}>
                  <s.icon className={cn(
                    "h-5 w-5",
                    step >= s.num ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                </div>
                <span className="text-sm font-medium hidden md:block">{s.label}</span>
              </div>
              {index < 3 && (
                <div className={cn(
                  "w-12 md:w-24 h-0.5 mx-2",
                  step > s.num ? "bg-primary" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Select Date */}
            {step === 1 && (
              <Card className="border-border">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">
                    Select a Date
                  </h2>
                  <div className="flex justify-center">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                      className="rounded-lg border border-border p-3 pointer-events-auto"
                    />
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!selectedDate}
                      className="gradient-gold text-primary-foreground"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Select Time */}
            {step === 2 && (
              <Card className="border-border">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-2">
                    Select a Time
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {selectedDate && format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={cn(
                          selectedTime === slot.time 
                            ? "gradient-gold text-primary-foreground border-0" 
                            : "border-border",
                          !slot.available && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)} className="border-border">
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!selectedTime}
                      className="gradient-gold text-primary-foreground"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirm Booking */}
            {step === 3 && (
              <Card className="border-border">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">
                    Confirm Your Booking
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Booking Summary */}
                    <div className="glass rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={shop.logo}
                          alt={shop.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-foreground">{shop.name}</h3>
                          <p className="text-sm text-muted-foreground">{shop.location.address}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date</span>
                          <p className="font-semibold text-foreground">
                            {selectedDate && format(selectedDate, 'MMMM dd, yyyy')}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time</span>
                          <p className="font-semibold text-foreground">{selectedTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Services</h4>
                      <div className="space-y-2">
                        {selectedServices.map(service => (
                          <div key={service.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {service.name} ({service.duration} min)
                            </span>
                            <span className="text-foreground">Rs. {service.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Discount Code Input */}
                    <div className="pt-4 border-t border-border">
                      <DiscountCodeInput
                        shopId={shop.id}
                        totalPrice={subtotalPrice}
                        onApply={setAppliedDiscount}
                        appliedDiscount={appliedDiscount}
                      />
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t border-border space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">Rs. {subtotalPrice}</span>
                      </div>
                      {appliedDiscount && (
                        <div className="flex justify-between text-sm">
                          <span className="text-primary">Discount ({appliedDiscount.code})</span>
                          <span className="text-primary">- Rs. {discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2">
                        <div>
                          <span className="font-semibold text-foreground">Total</span>
                          <p className="text-sm text-muted-foreground">{totalDuration} minutes</p>
                        </div>
                        <span className="font-display text-2xl font-bold text-primary">Rs. {totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)} className="border-border">
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirmBooking}
                      className="gradient-gold text-primary-foreground shadow-gold"
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <Card className="border-border">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6">
                    <Check className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    Booking Confirmed!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Your appointment has been booked successfully. We've sent a confirmation to your phone.
                  </p>
                  
                  <div className="glass rounded-lg p-4 mb-6 text-left">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Shop</span>
                        <p className="font-semibold text-foreground">{shop.name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date & Time</span>
                        <p className="font-semibold text-foreground">
                          {selectedDate && format(selectedDate, 'MMM dd')} at {selectedTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/bookings">
                      <Button variant="outline" className="border-primary text-primary">
                        View My Bookings
                      </Button>
                    </Link>
                    <Link to="/marketplace">
                      <Button className="gradient-gold text-primary-foreground">
                        Browse More Shops
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 sticky top-24">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                Booking Summary
              </h3>

              {/* Shop Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
                <img
                  src={shop.logo}
                  alt={shop.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{shop.name}</h4>
                  <p className="text-xs text-muted-foreground">{shop.location.city}</p>
                </div>
              </div>

              {/* Selected Services */}
              <div className="space-y-2 mb-4">
                {selectedServices.map(service => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{service.name}</span>
                    <span className="text-foreground">Rs. {service.price}</span>
                  </div>
                ))}
              </div>

              {/* Date & Time */}
              {selectedDate && (
                <div className="glass rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{format(selectedDate, 'MMM dd, yyyy')}</span>
                    {selectedTime && (
                      <>
                        <Clock className="h-4 w-4 text-primary ml-2" />
                        <span className="text-foreground">{selectedTime}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Applied Discount */}
              {appliedDiscount && (
                <div className="glass rounded-lg p-3 mb-4 border border-primary/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-primary">- Rs. {discountAmount}</span>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between pt-4 border-t border-border">
                <div>
                  <span className="text-muted-foreground">Total</span>
                  <div className="text-xs text-muted-foreground">{totalDuration} min</div>
                </div>
                <span className="font-display text-2xl font-bold text-primary">Rs. {totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
