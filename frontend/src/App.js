import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contacts from './pages/Contacts';
import Donate from './pages/Donate';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Add these imports to your existing imports
import Sponsors from './components/admin/Sponsors';
import AddSponsor from './components/admin/AddSponsor';
import EditSponsor from './components/admin/EditSponsor';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Public routes */}
          <Route path="*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/donate" element={<Donate />} />
                
                // Then add these routes to your existing routes
                <Route path="/admin/sponsors" element={<Sponsors />} />
                <Route path="/admin/sponsors/add" element={<AddSponsor />} />
                <Route path="/admin/sponsors/edit/:id" element={<EditSponsor />} />
              </Routes>
            </>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;