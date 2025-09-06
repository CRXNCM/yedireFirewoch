import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/HomePage';
import About from './pages/AboutPage';
import Gallery from './pages/GalleryPage';
import Contacts from './pages/ContactPage';
import Donate from './pages/DonatePage';
import Achievements from './pages/AchievementsPage';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Import the GalleryManagement component
import GalleryManagement from './components/admin/gallery/GalleryManagement';
import SchoolsManagement from './components/admin/schools/SchoolsManagement';
import CommunitiesManagement from './components/admin/communities/CommunitiesManagement';
import VolunteersManagement from './components/admin/volunteers/VolunteersManagement';
import BankManagement from './components/admin/banks/BankManagement';
// Import the SocialMediaManagement component
import SocialMediaManagement from './components/admin/social/SocialMediaManagement';
// Add this import at the top with your other imports
import TestimonialManagement from './components/admin/testimonials/TestimonialManagement';
// Import the Sponsor management components
import SponsorList from './components/admin/sponsors/SponsorList';
import AddSponsor from './components/admin/sponsors/AddSponsor';
import EditSponsor from './components/admin/sponsors/EditSponsor';
// Import the Urgent Message management components
import UrgentMessageList from './components/admin/urgent-messages/UrgentMessageList';
import AddUrgentMessage from './components/admin/urgent-messages/AddUrgentMessage';
// Remove this import until the component is created
// import EditUrgentMessage from './components/admin/urgent-messages/EditUrgentMessage';
// Add this import with your other imports
import AlertsManagement from './components/admin/alerts/AlertsManagement';
// Import the AdminTestPage component
import AdminTestPage from './components/admin/AdminTestPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route - no navbar or footer */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin routes - all protected */}
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/gallery" element={<ProtectedRoute><GalleryManagement /></ProtectedRoute>} />
        <Route path="/admin/banks" element={<ProtectedRoute><BankManagement /></ProtectedRoute>} />
        <Route path="/admin/schools" element={<ProtectedRoute><SchoolsManagement /></ProtectedRoute>} />
        <Route path="/admin/communities" element={<ProtectedRoute><CommunitiesManagement /></ProtectedRoute>} />
        <Route path="/admin/volunteers" element={<ProtectedRoute><VolunteersManagement /></ProtectedRoute>} />
        <Route path="/admin/social-media" element={<ProtectedRoute><SocialMediaManagement /></ProtectedRoute>} />
        <Route path="/admin/testimonials" element={<ProtectedRoute><TestimonialManagement /></ProtectedRoute>} />
        <Route path="/admin/sponsors" element={<ProtectedRoute><SponsorList /></ProtectedRoute>} />
        <Route path="/admin/sponsors/add" element={<ProtectedRoute><AddSponsor /></ProtectedRoute>} />
        <Route path="/admin/sponsors/edit/:id" element={<ProtectedRoute><EditSponsor /></ProtectedRoute>} />
        <Route path="/admin/urgent-messages" element={<ProtectedRoute><UrgentMessageList /></ProtectedRoute>} />
        <Route path="/admin/urgent-messages/add" element={<ProtectedRoute><AddUrgentMessage /></ProtectedRoute>} />
        <Route path="/admin/alerts" element={<ProtectedRoute><AlertsManagement /></ProtectedRoute>} />
        <Route path="/admin/test" element={<ProtectedRoute><AdminTestPage /></ProtectedRoute>} />
        
        {/* Public routes - with navbar and footer */}
        <Route path="/" element={
          <>
            <Navbar />
            <main className="main-content">
              <Home />
            </main>
            <Footer />
          </>
        } />
        <Route path="/about" element={
          <>
            <Navbar />
            <main className="main-content">
              <About />
            </main>
            <Footer />
          </>
        } />
        <Route path="/about/history" element={
          <>
            <Navbar />
            <main className="main-content">
              <About />
            </main>
            <Footer />
          </>
        } />
        <Route path="/achievements" element={
          <>
            <Navbar />
            <main className="main-content">
              <Achievements />
            </main>
            <Footer />
          </>
        } />
        <Route path="/gallery" element={
          <>
            <Navbar />
            <main className="main-content">
              <Gallery />
            </main>
            <Footer />
          </>
        } />
        <Route path="/contacts" element={
          <>
            <Navbar />
            <main className="main-content">
              <Contacts />
            </main>
            <Footer />
          </>
        } />
        <Route path="/donate" element={
          <>
            <Navbar />
            <main className="main-content">
              <Donate />
            </main>
            <Footer />
          </>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;