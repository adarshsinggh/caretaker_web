import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Tag, Heart, ArrowRight } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { signUp } from '../api';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setStep(2);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await signUp({
        name,
        email,
        password,
        appliedReferralCode: referralCode || undefined
      });

      setSuccess(response.data.message);
      
      // If signup includes token, log the user in
      if (response.data.token) {
        login({
          name,
          email,
          token: response.data.token
        });
        
        // Redirect to add parent page
        setTimeout(() => {
          navigate('/add-parent');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
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
          {step === 1 ? 'Create your account' : 'Complete your profile'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 ? 'Let\'s get started with your journey' : 'Just a few more details to get you set up'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-luxury sm:rounded-xl sm:px-10">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
          
          {step === 1 ? (
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <Input
                id="name"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                icon={<User size={18} />}
              />
              
              <Button 
                type="submit" 
                fullWidth 
                variant="gradient"
                icon={<ArrowRight size={18} />}
              >
                Continue
              </Button>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              <Input
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                icon={<Mail size={18} />}
              />
              
              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                icon={<Lock size={18} />}
              />
              
              <Input
                id="referralCode"
                label="Referral Code (Optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter referral code if you have one"
                icon={<Tag size={18} />}
              />
              
              <Button 
                type="submit" 
                fullWidth 
                disabled={isLoading}
                variant="gradient"
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                fullWidth 
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;