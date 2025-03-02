import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Activity, Utensils, Car, Home as HomeIcon, Users, FileText, Search } from 'lucide-react';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Map from '../components/Map';
import { getNearbyHelpers } from '../api';
import { Helper } from '../types';

const services = [
  { id: 'healthcare', name: 'Healthcare', icon: <Activity size={24} className="text-white" />, color: 'bg-red-500' },
  { id: 'food', name: 'Food & Nutrition', icon: <Utensils size={24} className="text-white" />, color: 'bg-green-500' },
  { id: 'travel', name: 'Travel Assistance', icon: <Car size={24} className="text-white" />, color: 'bg-blue-500' },
  { id: 'home', name: 'Home Assistance', icon: <HomeIcon size={24} className="text-white" />, color: 'bg-purple-500' },
  { id: 'social', name: 'Emotional & Social Support', icon: <Users size={24} className="text-white" />, color: 'bg-yellow-500' },
  { id: 'banking', name: 'Banking & Documentation Help', icon: <FileText size={24} className="text-white" />, color: 'bg-indigo-500' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number]>([12.9716, 77.5946]); // Default to Bangalore
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          fetchNearbyHelpers(longitude, latitude);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Couldn't access your location. Using default location.");
          fetchNearbyHelpers(77.5946, 12.9716); // Default Bangalore coordinates
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Using default location.");
      fetchNearbyHelpers(77.5946, 12.9716); // Default Bangalore coordinates
    }
  }, []);

  const fetchNearbyHelpers = async (longitude: number, latitude: number) => {
    setIsLoading(true);
    try {
      const response = await getNearbyHelpers(longitude, latitude);
      if (response.data && response.data.helpers) {
        setHelpers(response.data.helpers);
      }
    } catch (err) {
      console.error("Error fetching nearby helpers:", err);
      setError("Failed to fetch nearby helpers. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (serviceType: string) => {
    navigate('/book-service', { state: { serviceType } });
  };

  const filteredServices = searchQuery 
    ? services.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : services;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="bg-white rounded-xl shadow-luxury p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Parent Helper</h1>
              <p className="text-gray-600 mb-4">Book services to help your parents living abroad</p>
              
              {error && <Alert type="error" message={error} onClose={() => setError('')} />}
              
              <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-lg">
                <MapPin size={20} className="text-primary-500 mr-2" />
                <p className="text-gray-700">
                  {isLoading ? 'Detecting your location...' : 'Your current location'}
                </p>
              </div>
              
              {helpers.length > 0 && (
                <div className="bg-primary-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center">
                    <Heart size={20} className="text-primary-600 mr-2" />
                    <p className="text-primary-800">
                      <span className="font-bold">{helpers.length}</span> helpers available in your area
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Map with nearby helpers */}
            {helpers.length > 0 && (
              <div className="w-full md:w-1/2">
                <Map helpers={helpers} userLocation={userLocation} />
              </div>
            )}
          </div>
        </div>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        {/* Services grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Book a Service</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-xl shadow-card overflow-hidden cursor-pointer hover:shadow-luxury transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => handleServiceSelect(service.name)}
            >
              <div className={`${service.color} p-6 flex justify-center`}>
                <div className="bg-white/20 p-3 rounded-full">
                  {service.icon}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 text-center">{service.name}</h3>
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick actions */}
        <div className="mt-8 bg-white rounded-xl shadow-luxury p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="glass" 
              onClick={() => navigate('/add-parent')}
              className="py-4"
            >
              Add New Parent
            </Button>
            <Button 
              variant="glass" 
              onClick={() => navigate('/bookings')}
              className="py-4"
            >
              View Bookings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;