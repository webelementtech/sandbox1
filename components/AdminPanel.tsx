import React, { useState } from 'react';
import { TourPackage, Booking } from '../types';
import { generateTourDetails } from '../services/geminiService';
import { Plus, Trash2, Check, X, Sparkles, Loader2, LayoutDashboard, Package, Users } from 'lucide-react';

interface AdminPanelProps {
  packages: TourPackage[];
  bookings: Booking[];
  setPackages: React.Dispatch<React.SetStateAction<TourPackage[]>>;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ packages, bookings, setPackages, setBookings }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'bookings'>('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // New Package Form State
  const [newPkg, setNewPkg] = useState<Partial<TourPackage>>({
    title: '',
    destination: '',
    price: 0,
    description: '',
    duration: '',
    image: 'https://picsum.photos/800/600',
    highlights: []
  });

  const handleGenerateAI = async () => {
    if (!newPkg.destination || !newPkg.title) {
      alert("Please enter a Destination and Title first.");
      return;
    }
    setIsGenerating(true);
    try {
      const details = await generateTourDetails(newPkg.destination, newPkg.title);
      setNewPkg(prev => ({
        ...prev,
        description: details.description,
        highlights: details.highlights,
        price: details.estimatedPrice,
        duration: details.suggestedDuration
      }));
    } catch (e) {
      alert("AI Generation failed. Check API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddPackage = () => {
    if (!newPkg.title || !newPkg.destination) return;
    const pkg: TourPackage = {
      id: Date.now().toString(),
      title: newPkg.title!,
      destination: newPkg.destination!,
      description: newPkg.description || '',
      price: newPkg.price || 0,
      duration: newPkg.duration || 'TBD',
      image: newPkg.image || 'https://picsum.photos/800/600',
      highlights: newPkg.highlights || []
    };
    setPackages([...packages, pkg]);
    setNewPkg({
        title: '',
        destination: '',
        price: 0,
        description: '',
        duration: '',
        image: 'https://picsum.photos/800/600',
        highlights: []
    });
    alert("Package added successfully!");
  };

  const handleDeletePackage = (id: string) => {
    if (confirm("Are you sure?")) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  };

  const stats = {
    totalRevenue: bookings.filter(b => b.status === 'CONFIRMED').reduce((acc, curr) => {
       const pkg = packages.find(p => p.id === curr.packageId);
       return acc + (pkg ? pkg.price : 0);
    }, 0),
    pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
    totalPackages: packages.length
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex flex-col items-center">
          <img src="https://i.ibb.co/3W6qW5j/logo.png" alt="Pavan Hans" className="h-24 w-auto mb-2 object-contain" />
          <p className="text-xs text-gray-500 uppercase tracking-wider">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('packages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'packages' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Package size={18} /> Packages
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users size={18} /> Bookings
            {stats.pendingBookings > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.pendingBookings}</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Active Packages</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPackages}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
                <p className="text-3xl font-bold text-orange-500">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Manage Packages</h1>
            </div>

            {/* Add Package Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus size={18} /> Add New Package
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder="Tour Title (e.g. Magical Maldives)" 
                  className="p-2 border rounded-lg"
                  value={newPkg.title}
                  onChange={e => setNewPkg({...newPkg, title: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Destination" 
                  className="p-2 border rounded-lg"
                  value={newPkg.destination}
                  onChange={e => setNewPkg({...newPkg, destination: e.target.value})}
                />
              </div>
              
              <div className="flex gap-4 mb-4">
                 <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !newPkg.title}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                  {isGenerating ? 'AI Generating...' : 'Auto-Fill with Gemini AI'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input 
                  type="number" 
                  placeholder="Price ($)" 
                  className="p-2 border rounded-lg"
                  value={newPkg.price || ''}
                  onChange={e => setNewPkg({...newPkg, price: Number(e.target.value)})}
                />
                <input 
                  type="text" 
                  placeholder="Duration (e.g. 5 Days)" 
                  className="p-2 border rounded-lg"
                  value={newPkg.duration}
                  onChange={e => setNewPkg({...newPkg, duration: e.target.value})}
                />
                 <input 
                  type="text" 
                  placeholder="Image URL" 
                  className="p-2 border rounded-lg"
                  value={newPkg.image}
                  onChange={e => setNewPkg({...newPkg, image: e.target.value})}
                />
              </div>
              
              <textarea 
                placeholder="Description" 
                className="w-full p-2 border rounded-lg mb-4 h-24"
                value={newPkg.description}
                onChange={e => setNewPkg({...newPkg, description: e.target.value})}
              />

              <button 
                onClick={handleAddPackage}
                className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
              >
                Create Package
              </button>
            </div>

            {/* Package List Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Image</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Title</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {packages.map(pkg => (
                    <tr key={pkg.id}>
                      <td className="p-4"><img src={pkg.image} alt="" className="w-12 h-12 rounded object-cover" /></td>
                      <td className="p-4 font-medium text-gray-900">{pkg.title}</td>
                      <td className="p-4 text-gray-600">${pkg.price}</td>
                      <td className="p-4">
                        <button onClick={() => handleDeletePackage(pkg.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Package</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{booking.customerName}</div>
                        <div className="text-xs text-gray-500">{booking.email}</div>
                      </td>
                      <td className="p-4 text-gray-700">{booking.packageTitle}</td>
                      <td className="p-4 text-gray-700">{booking.travelDate}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        {booking.status === 'PENDING' && (
                          <>
                            <button onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')} className="p-1 text-green-600 hover:bg-green-50 rounded">
                              <Check size={18} />
                            </button>
                            <button onClick={() => updateBookingStatus(booking.id, 'CANCELLED')} className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">No bookings yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};