import React, { useState } from 'react';
import { ViewState, TourPackage, Booking } from './types';
import { PackageCard } from './components/PackageCard';
import { ChatWidget } from './components/ChatWidget';
import { AdminPanel } from './components/AdminPanel';
import { LoginModal } from './components/LoginModal';
import { Plane, Phone, Mail, Instagram, Facebook, Twitter, Search, Menu, X, ArrowRight, Star, MapPin } from 'lucide-react';

// Logo URL
const LOGO_URL = "https://i.ibb.co/3W6qW5j/logo.png";

// Initial Mock Data
const INITIAL_PACKAGES: TourPackage[] = [
  {
    id: '1',
    title: 'Parisian Romance',
    destination: 'Paris, France',
    duration: '5 Days / 4 Nights',
    price: 1800,
    description: 'Experience the city of love with a private Seine cruise, Eiffel Tower dinner, and guided museum tours.',
    image: 'https://picsum.photos/id/1015/800/600',
    highlights: ['Eiffel Tower Dinner', 'Louvre Museum Tour', 'Seine River Cruise', 'Montmartre Walk']
  },
  {
    id: '2',
    title: 'Bali Island Escape',
    destination: 'Bali, Indonesia',
    duration: '7 Days / 6 Nights',
    price: 1200,
    description: 'Relax on pristine beaches, explore ancient temples, and enjoy vibrant local culture in Ubud.',
    image: 'https://picsum.photos/id/1039/800/600',
    highlights: ['Ubud Monkey Forest', 'Tanah Lot Sunset', 'Snorkeling in Nusa Dua', 'Balinese Massage']
  },
  {
    id: '3',
    title: 'Swiss Alpine Adventure',
    destination: 'Interlaken, Switzerland',
    duration: '6 Days / 5 Nights',
    price: 2500,
    description: 'Breathtaking mountain views, scenic train rides through the Alps, and luxury chalet stays.',
    image: 'https://picsum.photos/id/1036/800/600',
    highlights: ['Jungfraujoch Trip', 'Lake Brienz Cruise', 'Glacier Express', 'Swiss Chocolate Tasting']
  }
];

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [packages, setPackages] = useState<TourPackage[]>(INITIAL_PACKAGES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Booking Modal State
  const [selectedPkg, setSelectedPkg] = useState<TourPackage | null>(null);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', date: '', phone: '' });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;

    const newBooking: Booking = {
      id: Date.now().toString(),
      packageId: selectedPkg.id,
      packageTitle: selectedPkg.title,
      customerName: bookingForm.name,
      email: bookingForm.email,
      phone: bookingForm.phone,
      travelDate: bookingForm.date,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    setBookings([newBooking, ...bookings]);
    setSelectedPkg(null);
    setBookingForm({ name: '', email: '', date: '', phone: '' });
    alert("Booking Request Sent! We will contact you shortly.");
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setView(ViewState.ADMIN);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginOpen(false);
    setView(ViewState.ADMIN);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView(ViewState.HOME);
  };

  // Render Admin View
  if (view === ViewState.ADMIN) {
    if (!isAuthenticated) {
      // Fallback if somehow state gets desynced, though handleAdminClick prevents this
      setView(ViewState.HOME);
      return null; 
    }
    return (
      <>
        <div className="fixed top-4 right-4 z-50">
           <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow text-sm hover:bg-gray-700 transition-colors border border-gray-700">
             Logout
           </button>
        </div>
        <AdminPanel 
          packages={packages} 
          bookings={bookings} 
          setPackages={setPackages}
          setBookings={setBookings}
        />
      </>
    );
  }

  // Render Public Site
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(ViewState.HOME)}>
              <img 
                src={LOGO_URL} 
                alt="Pavan Hans Tours & Travel" 
                className="h-20 w-auto object-contain"
              />
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">Destinations</a>
              <a href="#" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">Packages</a>
              <a href="#" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">Contact</a>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleAdminClick}
                className="hidden lg:block text-xs font-semibold text-gray-400 hover:text-blue-900"
              >
                Admin Login
              </button>
              <button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-900/20">
                Plan My Trip
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-gray-50" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold mb-6 border border-white/30">
            Explore the World with Pavan Hans
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif drop-shadow-lg">
            Discover Your Next <br/> <span className="text-yellow-400">Great Adventure</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Curated experiences, luxury accommodations, and memories that last a lifetime. Let us handle the details while you enjoy the journey.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white p-2 rounded-full shadow-2xl max-w-2xl mx-auto flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 md:border-r border-gray-200 py-2">
              <Search className="text-gray-400 mr-2" size={20} />
              <input type="text" placeholder="Where do you want to go?" className="w-full outline-none text-gray-700 bg-transparent" />
            </div>
            <div className="flex-1 flex items-center px-4 py-2">
              <span className="text-gray-400 mr-2 text-sm">Date</span>
              <input type="date" className="w-full outline-none text-gray-700 bg-transparent" />
            </div>
            <button className="bg-blue-900 text-white rounded-full px-8 py-3 font-semibold hover:bg-blue-800 transition-colors">
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-900">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Service</h3>
              <p className="text-gray-600">We prioritize your comfort with hand-picked hotels and exclusive transport services.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-900">
                <Menu size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Itineraries</h3>
              <p className="text-gray-600">Every traveler is unique. We tailor your trip to match your specific interests and pace.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-900">
                <Phone size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-gray-600">Our dedicated team is always just a phone call away, anywhere in the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">Featured Destinations</h2>
            <div className="w-24 h-1 bg-blue-900 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600">Hand-picked packages for the discerning traveler.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map(pkg => (
              <PackageCard 
                key={pkg.id} 
                pkg={pkg} 
                onBook={(p) => setSelectedPkg(p)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-serif font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">Contact us today to build your custom itinerary or book one of our exclusive packages.</p>
          <button className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform hover:scale-105 inline-flex items-center gap-2">
            Get in Touch <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-serif font-bold mb-4">Pavan Hans Tours</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Making dreams come true, one destination at a time. Your trusted partner in global exploration.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Packages</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone size={16}/> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><Mail size={16}/> info@pavanhans.com</li>
              <li className="flex items-center gap-2"><MapPin size={16}/> 123 Travel Lane, City, Country</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20}/></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20}/></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20}/></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Pavan Hans Tours and Travel. All rights reserved.
        </div>
      </footer>

      {/* Booking Modal */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-blue-900 p-6 text-white relative">
              <h3 className="text-xl font-bold font-serif">Book Your Trip</h3>
              <p className="text-blue-200 text-sm mt-1">{selectedPkg.title}</p>
              <button 
                onClick={() => setSelectedPkg(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={bookingForm.name}
                  onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={bookingForm.email}
                  onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={bookingForm.phone}
                  onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Travel Date</label>
                <input 
                  required
                  type="date" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={bookingForm.date}
                  onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
                />
              </div>
              
              <div className="pt-2">
                <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors">
                  Confirm Booking Request
                </button>
                <p className="text-xs text-center text-gray-400 mt-3">
                  No payment required now. An agent will contact you to finalize details.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLoginSuccess}
      />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}