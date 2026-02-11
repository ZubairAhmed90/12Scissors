import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: '/marketplace', label: 'Find Barbers' },
    { to: '/vendor/login', label: 'For Business' },
    { to: '/login', label: 'Customer Login' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-foreground">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] bg-card border-border p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">12Scissors</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col p-4 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-border my-4" />
          <Link to="/login" onClick={() => setIsOpen(false)}>
            <Button className="w-full gradient-gold text-primary-foreground">
              Book Now
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
