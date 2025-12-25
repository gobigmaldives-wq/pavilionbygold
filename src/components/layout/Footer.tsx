import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <img src={logo} alt="Pavilion by Gold" className="h-16 w-auto mb-4" />
            <p className="text-cream/70 text-sm leading-relaxed">
              An exquisite venue for life's most memorable celebrations. 
              Where elegance meets extraordinary.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-gold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-cream/70 hover:text-gold transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/spaces" className="text-cream/70 hover:text-gold transition-colors text-sm">
                  Our Spaces
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-cream/70 hover:text-gold transition-colors text-sm">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg text-gold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-cream/70">
                <MapPin size={18} className="text-gold flex-shrink-0 mt-0.5" />
                <span>West Beach Pavilion, Rasfannu, Boduthakurufaanu Magu, Male</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-cream/70">
                <Phone size={18} className="text-gold flex-shrink-0" />
                <span>+(960) 7979766</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-lg text-gold mb-4">Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-cream/70">
                <Clock size={18} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p>Saturday - Thursday: 12:00 PM - 23:00 PM</p>
                  <p>Friday: 14:00 PM - 23:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-12 pt-8 text-center">
          <p className="text-cream/50 text-sm">
            © {new Date().getFullYear()} Pavilion by Gold. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
