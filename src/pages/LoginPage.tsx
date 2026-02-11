import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('otp');
    toast({
      title: "OTP Sent! 📱",
      description: "We've sent a verification code to your phone",
    });
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Save user session to localStorage for demo
    const user = {
      id: 'user_demo',
      name: 'Demo User',
      phone: phone,
      city: 'New York',
      role: 'customer',
    };
    localStorage.setItem('user', JSON.stringify(user));
    
    setIsLoading(false);
    toast({
      title: "Welcome back! 🎉",
      description: "You've successfully logged in",
    });
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-border glass">
        <CardHeader className="text-center pb-2">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <Scissors className="h-10 w-10 text-primary" />
            <span className="font-display text-3xl font-bold text-foreground">12Scissors</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {step === 'phone' ? 'Welcome Back' : 'Verify Your Phone'}
          </h1>
          <p className="text-muted-foreground">
            {step === 'phone' 
              ? 'Enter your phone number to continue' 
              : `Enter the code sent to ${phone}`}
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          {step === 'phone' ? (
            <div className="space-y-6">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-12 h-14 bg-secondary border-border text-foreground text-lg"
                />
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={isLoading || phone.length < 10}
                className="w-full h-14 gradient-gold text-primary-foreground shadow-gold text-lg"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="border-border bg-secondary" />
                    <InputOTPSlot index={1} className="border-border bg-secondary" />
                    <InputOTPSlot index={2} className="border-border bg-secondary" />
                    <InputOTPSlot index={3} className="border-border bg-secondary" />
                    <InputOTPSlot index={4} className="border-border bg-secondary" />
                    <InputOTPSlot index={5} className="border-border bg-secondary" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length < 6}
                className="w-full h-14 gradient-gold text-primary-foreground shadow-gold text-lg"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Verify & Login
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <button
                onClick={() => setStep('phone')}
                className="w-full text-center text-muted-foreground hover:text-foreground transition-colors"
              >
                Change phone number
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/vendor/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Are you a barber shop owner?{' '}
              <span className="text-primary">Login as Vendor →</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
