import React from 'react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight,
  Leaf,
  Apple,
  Milk,
  UtensilsCrossed,
  ShoppingBag
} from 'lucide-react';

import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0B1221] text-gray-400 py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center text-white text-3xl font-bold">
              <span>Naji</span>
              <span className="text-[#00B56A]">kai</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Your neighborhood marketplace. Fresh produce, dairy, meat and more — delivered from local vendors near you.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-[#1E2635] rounded-lg flex items-center justify-center hover:bg-[#00B56A] hover:text-white transition-all duration-300">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#1E2635] rounded-lg flex items-center justify-center hover:bg-[#00B56A] hover:text-white transition-all duration-300">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#1E2635] rounded-lg flex items-center justify-center hover:bg-[#00B56A] hover:text-white transition-all duration-300">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#1E2635] rounded-lg flex items-center justify-center hover:bg-[#00B56A] hover:text-white transition-all duration-300">
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Browse Products', 'Nearby Vendors', 'Track My Order', 'Become a Vendor', 'My Account'].map((item) => (
                <li key={item} className="flex items-center gap-2 group cursor-pointer">
                  <ChevronRight size={14} className="text-[#00B56A] group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:text-white transition-colors text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Categories</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 group cursor-pointer">
                <Leaf size={18} className="text-[#00B56A]" />
                <span className="group-hover:text-white transition-colors text-sm">Fresh Vegetables</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <Apple size={18} className="text-[#00B56A]" />
                <span className="group-hover:text-white transition-colors text-sm">Seasonal Fruits</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <Milk size={18} className="text-[#00B56A]" />
                <span className="group-hover:text-white transition-colors text-sm">Dairy & Eggs</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <UtensilsCrossed size={18} className="text-[#00B56A]" />
                <span className="group-hover:text-white transition-colors text-sm">Meat & Poultry</span>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#00B56A] shrink-0" />
                <span className="text-sm">Jhumka Bazar, Sunsari, Koshi Province, Nepal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-[#00B56A] shrink-0" />
                <span className="text-sm">+977 9800000000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-[#00B56A] shrink-0" />
                <span className="text-sm">support@najikai.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={20} className="text-[#00B56A] shrink-0" />
                <span className="text-sm">Mon-Fri: 6:00 AM - 9:00 PM</span>
              </li>
            </ul>
            
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Najikai. All rights reserved. Made with love in Nepal.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;