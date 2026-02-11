import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Mail, Lock, User, Phone, MapPin, Store, ArrowRight, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cities } from '@/data/mockData';

const plans = [
  {
    id: 'subscription',
    name: 'SaaS Subscription',
    price: 'Rs. 5,000/month',
    features: [
      'Unlimited bookings',
      'No commission fees',
      'Priority support',
      'Analytics dashboard',
      'Featured listing',
    ],
  },
  {
    id: 'commission',
    name: 'Commission Based',
    price: '10% per booking',
    features: [
      'No monthly fees',
      'Pay as you earn',
      'Basic support',
      'Standard listing',
      'Great for starters',
    ],
  },
];

const VendorRegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    city: '',
    address: '',
    plan: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.ownerName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.shopName || !formData.city || !formData.address) {
      toast({
        title: "Missing information",
        description: "Please fill in all shop details",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSelectPlan = (planId: string) => {
    handleInputChange('plan', planId);
  };

  const handleRegister = async () => {
    if (!formData.plan) {
      toast({
        title: "Select a plan",
        description: "Please choose a pricing plan to continue",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const vendor = {
      id: `vendor_${Date.now()}`,
      name: formData.ownerName,
      email: formData.email,
      phone: formData.phone,
      shopName: formData.shopName,
      city: formData.city,
      address: formData.address,
      plan: formData.plan,
      role: 'vendor',
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem('vendor', JSON.stringify(vendor));
    
    setIsLoading(false);
    toast({
      title: "Registration Successful! 🎉",
      description: "Welcome to 12Scissors. Your shop is now being reviewed.",
    });
    navigate('/vendor/dashboard');
  };

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      </div>

      <Card className="relative z-10 w-full max-w-lg border-border glass">
        <CardHeader className="text-center pb-2">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <Scissors className="h-10 w-10 text-primary" />
            <span className="font-display text-3xl font-bold text-foreground">12Scissors</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">Register Your Shop</h1>
          <p className="text-muted-foreground">Join Pakistan's premier grooming marketplace</p>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-1 mx-1 ${step > s ? 'bg-primary' : 'bg-secondary'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2 px-4">
            <span>Owner Info</span>
            <span>Shop Details</span>
            <span>Select Plan</span>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Step 1: Owner Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Owner Full Name"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  className="pl-12 h-12 bg-secondary border-border text-foreground"
                />
              </div>
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-12 h-12 bg-secondary border-border text-foreground"
                />
              </div>
              
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Phone Number (+92 3XX XXXXXXX)"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-12 h-12 bg-secondary border-border text-foreground"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-12 h-12 bg-secondary border-border text-foreground"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-12 h-12 bg-secondary border-border text-foreground"
                />
              </div>

              <Button
                onClick={handleNextStep}
                className="w-full h-12 gradient-gold text-primary-foreground shadow-gold"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Shop Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Shop Name"
                  value={formData.shopName}
                  onChange={(e) => handleInputChange('shopName', e.target.value)}
                  className="pl-12 h-12 bg-secondary border-border text-foreground"
                />
              </div>
              
              <div>
                <Label className="text-muted-foreground mb-2 block">City</Label>
                <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                  <SelectTrigger className="h-12 bg-secondary border-border text-foreground">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Full Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="pl-12 h-12 bg-secondary border-border text-foreground"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 border-border"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="flex-1 h-12 gradient-gold text-primary-foreground shadow-gold"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Select Plan */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.plan === plan.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{plan.name}</h3>
                      <span className="text-primary font-bold">{plan.price}</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 h-12 border-border"
                >
                  Back
                </Button>
                <Button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="flex-1 h-12 gradient-gold text-primary-foreground shadow-gold"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <Link to="/vendor/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              ← Back to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorRegisterPage;
