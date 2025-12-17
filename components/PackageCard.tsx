import React from 'react';
import { TourPackage } from '../types';
import { Clock, MapPin, CheckCircle } from 'lucide-react';

interface PackageCardProps {
  pkg: TourPackage;
  onBook: (pkg: TourPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onBook }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      <div className="relative h-56 overflow-hidden group">
        <img 
          src={pkg.image} 
          alt={pkg.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-blue-800 font-bold text-sm shadow-sm">
          ${pkg.price.toLocaleString()}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-blue-600 text-sm font-medium mb-2">
          <MapPin size={16} className="mr-1" />
          {pkg.destination}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Clock size={16} className="mr-1" />
          {pkg.duration}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {pkg.description}
        </p>

        <div className="mt-auto">
          <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-2">Highlights</h4>
          <ul className="space-y-1 mb-6">
            {pkg.highlights.slice(0, 3).map((highlight, idx) => (
              <li key={idx} className="flex items-start text-xs text-gray-600">
                <CheckCircle size={14} className="text-green-500 mr-2 mt-0.5 shrink-0" />
                {highlight}
              </li>
            ))}
          </ul>
          
          <button 
            onClick={() => onBook(pkg)}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
