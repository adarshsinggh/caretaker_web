import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User, Phone, MapPin, FileText, Calendar } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { addParent } from '../api';

const AddParentPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [medicalInfo, setMedicalInfo] = useState('');
  const [age, setAge] = useState<number>(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await addParent({
        name,
        contact,
        address,
        medicalInfo,
        age
      });

      setSuccess(response.data.message);
      
      // Redirect to home page after successful parent addition
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while adding parent details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full gradient-bg p-4 shadow-lg">
            <Heart size={32} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Add Parent Details
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Add information about your parent to help us provide better service
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-luxury sm:rounded-xl sm:px-10">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="name"
              label="Parent's Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter parent's full name"
              required
              icon={<User size={18} />}
            />
            
            <Input
              id="contact"
              label="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter parent's contact number"
              required
              icon={<Phone size={18} />}
            />
            
            <Input
              id="address"
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter parent's address"
              required
              icon={<MapPin size={18} />}
            />
            
            <Input
              id="age"
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              placeholder="Enter parent's age"
              required
              icon={<Calendar size={18} />}
            />
            
            <div className="mb-4">
              <label htmlFor="medicalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                Medical Information
              </label>
              <div className="relative rounded-xl overflow-hidden shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                  <FileText size={18} className="text-gray-500" />
                </div>
                <textarea
                  id="medicalInfo"
                  value={medicalInfo}
                  onChange={(e) => setMedicalInfo(e.target.value)}
                  placeholder="Enter any relevant medical information"
                  rows={3}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <Button 
                type="submit" 
                fullWidth 
                disabled={isLoading}
                variant="gradient"
              >
                {isLoading ? 'Saving...' : 'Save Parent Details'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                fullWidth 
                onClick={handleSkip}
              >
                Skip for Now
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddParentPage;