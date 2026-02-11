import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Mail, Lock, ArrowRight, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Demo credentials
const MANAGER_CREDENTIALS = {
  email: 'manager@12scissors.pk',
  password: 'manager123',
};

const ManagerLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (email === MANAGER_CREDENTIALS.email && password === MANAGER_CREDENTIALS.password) {
      const manager = {
        id: 'manager1',
        name: 'Bilal Ahmed',
        email: email,
        role: 'manager',
        permissions: ['view_bookings', 'manage_billing', 'view_reports'],
      };
      localStorage.setItem('manager', JSON.stringify(manager));
      
      setIsLoading(false);
      toast({
        title: "Welcome Manager! 🎉",
        description: "You've successfully logged in",
      });
      navigate('/manager');
    } else {
      setIsLoading(false);
      toast({
        title: "Invalid credentials",
        description: "Please check your email and password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-500/10" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-border glass">
        <CardHeader className="text-center pb-2">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <Scissors className="h-10 w-10 text-primary" />
            <span className="font-display text-3xl font-bold text-foreground">12Scissors</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-purple-400" />
            <h1 className="font-display text-2xl font-bold text-foreground">Manager Portal</h1>
          </div>
          <p className="text-muted-foreground">Login to manage reservations & billing</p>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Manager email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-14 bg-secondary border-border text-foreground"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="pl-12 h-14 bg-secondary border-border text-foreground"
              />
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Login to Manager Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-xs text-muted-foreground text-center mb-2">Demo Credentials:</p>
            <p className="text-sm text-foreground text-center">
              Email: <span className="text-purple-400">manager@12scissors.pk</span>
            </p>
            <p className="text-sm text-foreground text-center">
              Password: <span className="text-purple-400">manager123</span>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              ← Back to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerLoginPage;
