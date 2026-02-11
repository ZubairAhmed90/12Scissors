import { Link } from 'react-router-dom';
import { Scissors, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Scissors className="h-8 w-8 text-primary" />
              <span className="font-display text-2xl font-bold text-foreground">12Scissors</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Pakistan's premier grooming destination. Find and book top-rated barbershops, spas, and salons across the country.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Find Barbers
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">For Business</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/vendor/register" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  List Your Shop
                </Link>
              </li>
              <li>
                <Link to="/vendor/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Vendor Login
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/manager/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Manager Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                F-7 Markaz, Islamabad, Pakistan
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4 text-primary" />
                +92 51 1234567
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4 text-primary" />
                support@12scissors.pk
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2025 12Scissors Pakistan. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/refund" className="text-muted-foreground hover:text-foreground transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
