import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import AddParentPage from './pages/AddParentPage';
import HomePage from './pages/HomePage';
import BookServicePage from './pages/BookServicePage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        
        <Route path="/add-parent" element={
          <ProtectedRoute>
            <AddParentPage />
          </ProtectedRoute>
        } />
        
        <Route path="/book-service" element={
          <ProtectedRoute>
            <BookServicePage />
          </ProtectedRoute>
        } />
        
        {/* Redirect to home if authenticated, otherwise to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;