import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, FileText, CreditCard, Tag, ArrowLeft, Check } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { getAddresses, createBooking } from '../api';
import { Address } from '../types';

const BookServicePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceType } = location.state as { serviceType: string } || { serviceType: '' };
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [serviceDate, setServiceDate] = useState<string>('');
  const [serviceTime, setServiceTime] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');
  const [discountCode, setDiscountCode] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddressLoading, setIsAddressLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsAddressLoading(true);
    try {
      const response = await getAddresses();
      if (response.data && response.data.locations) {
        setAddresses(response.data.locations);
        if (response.data.locations.length > 0) {
          setSelectedAddressId(response.data.locations[0]._id);
        }
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to fetch addresses. Please try again later.");
    } finally {
      setIsAddressLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Combine date and time
    const dateTime = new Date(`${serviceDate}T${serviceTime}`);

    try {
      const response = await createBooking({
        parentId: selectedParentId,
        serviceType,
        serviceDate: dateTime.toISOString(),
        recurring: isRecurring,
        specialInstructions,
        paymentMethod,
        discountCode: discountCode || undefined
      });

      setSuccess(response.data.message);
      
      // Redirect to home page after successful booking
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while creating the booking');
    } finally {
      setIsLoading(false);
    }
  };

  if (!serviceType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 md:pt-16">
        <div className="bg-white p-6 rounded-xl shadow-luxury">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Service Not Selected</h2>
          <p className="text-gray-700 mb-4">Please select a service from the home page.</p>
          <Button onClick={() => navigate('/')} icon={<ArrowLeft size={18} />}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-luxury p-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/')} 
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Book {serviceType}</h1>
              <p className="text-gray-600">Fill in the details to book this service</p>
            </div>
          </div>
          
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Parent Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Parent
              </label>
              <div className="relative rounded-xl overflow-hidden shadow-sm">
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                  required
                >
                  <option value="">Select a parent</option>
                  {/* This would be populated from an API call in a real app */}
                  <option value="67c307564377d7f66da33663">Parent 1</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Address Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Select Address
              </label>
              {isAddressLoading ? (
                <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-gray-600">Loading addresses...</span>
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-2">
                  {addresses.map((address) => (
                    <div 
                      key={address._id}
                      className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        selectedAddressId === address._id 
                          ? 'border-primary-500 bg-primary-50 shadow-md' 
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedAddressId(address._id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                          selectedAddressId === address._id ? 'bg-primary-500' : 'border border-gray-300'
                        }`}>
                          {selectedAddressId === address._id && <Check size={12} className="text-white" />}
                        </div>
                        <div>
                          <div className="font-medium">{address.label}</div>
                          <div className="text-gray-600 text-sm">{address.address}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-xl text-center">
                  <p className="text-gray-500">No addresses found. Please add an address first.</p>
                </div>
              )}
            </div>
            
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Service Date
                </label>
                <div className="relative rounded-xl overflow-hidden shadow-sm">
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Service Time
                </label>
                <div className="relative rounded-xl overflow-hidden shadow-sm">
                  <input
                    type="time"
                    value={serviceTime}
                    onChange={(e) => setServiceTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Recurring Option */}
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <input
                id="recurring"
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="recurring" className="ml-3 block text-sm text-gray-700">
                Make this a recurring service
              </label>
            </div>
            
            {/* Special Instructions */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="inline mr-1" />
                Special Instructions
              </label>
              <div className="relative rounded-xl overflow-hidden shadow-sm">
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special requirements or instructions..."
                />
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard size={16} className="inline mr-1" />
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border rounded-xl p-4 cursor-pointer flex items-center ${
                    paymentMethod === 'Cash' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => setPaymentMethod('Cash')}
                >
                  <input
                    id="cash"
                    type="radio"
                    value="Cash"
                    checked={paymentMethod === 'Cash'}
                    onChange={() => setPaymentMethod('Cash')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="cash" className="ml-3 block text-sm text-gray-700">
                    Cash
                  </label>
                </div>
                <div 
                  className={`border rounded-xl p-4 cursor-pointer flex items-center ${
                    paymentMethod === 'Online' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => setPaymentMethod('Online')}
                >
                  <input
                    id="online"
                    type="radio"
                    value="Online"
                    checked={paymentMethod === 'Online'}
                    onChange={() => setPaymentMethod('Online')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="online" className="ml-3 block text-sm text-gray-700">
                    Online
                  </label>
                </div>
              </div>
            </div>
            
            {/* Discount Code */}
            <Input
              id="discountCode"
              label="Discount Code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Enter discount code if you have one"
              icon={<Tag size={18} />}
            />
            
            <Button 
              type="submit" 
              fullWidth 
              disabled={isLoading}
              variant="gradient"
            >
              {isLoading ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookServicePage