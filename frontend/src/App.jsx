import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Public Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/HomePage';
import About from './pages/AboutPage';
import Gallery from './pages/GalleryPage';
import Contacts from './pages/ContactPage';
import Donate from './pages/DonatePage';
import Achievements from './pages/AchievementsPage';
import Login from './pages/Login';

// Admin Pages
import Admin from './pages/Admin';
import GalleryManagement from './components/admin/gallery/GalleryManagement';
import SchoolsManagement from './components/admin/schools/SchoolsManagement';
import CommunitiesManagement from './components/admin/communities/CommunitiesManagement';
import VolunteersManagement from './components/admin/volunteers/VolunteersManagement';
import BankManagement from './components/admin/banks/BankManagement';
import SocialMediaManagement from './components/admin/social/SocialMediaManagement';
import TestimonialManagement from './components/admin/testimonials/TestimonialManagement';
import SponsorList from './components/admin/sponsors/SponsorList';
import AddSponsor from './components/admin/sponsors/AddSponsor';
import EditSponsor from './components/admin/sponsors/EditSponsor';
import UrgentMessageList from './components/admin/urgent-messages/UrgentMessageList';
import AddUrgentMessage from './components/admin/urgent-messages/AddUrgentMessage';
import AlertsManagement from './components/admin/alerts/AlertsManagement';
import AdminTestPage from './components/admin/AdminTestPage';

// Layout for public pages (with navbar and footer)
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="main-content">
      {children}
    </main>
    <Footer />
  </>
);

// Layout for admin pages (protected routes)
const AdminLayout = ({ children }) => (
  <ProtectedRoute>
    {children}
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          {/* Home Page - Always accessible */}
          <Route path="/" element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          } />

          {/* About Pages */}
          <Route path="/about" element={
            <PublicLayout>
              <About />
            </PublicLayout>
          } />
          
          <Route path="/about/history" element={
            <PublicLayout>
              <About showHistory />
            </PublicLayout>
          } />

          {/* Other Public Pages */}
          <Route path="/gallery" element={
            <PublicLayout>
              <Gallery />
            </PublicLayout>
          } />

          <Route path="/contacts" element={
            <PublicLayout>
              <Contacts />
            </PublicLayout>
          } />

          <Route path="/donate" element={
            <PublicLayout>
              <Donate />
            </PublicLayout>
          } />

          <Route path="/achievements" element={
            <PublicLayout>
              <Achievements />
            </PublicLayout>
          } />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />

          {/* ===== PROTECTED ADMIN ROUTES ===== */}
          <Route path="/admin" element={
            <AdminLayout>
              <Admin />
            </AdminLayout>
          } />

          {/* Admin Management Routes */}
          <Route path="/admin/gallery" element={
            <AdminLayout>
              <GalleryManagement />
            </AdminLayout>
          } />

          <Route path="/admin/banks" element={
            <AdminLayout>
              <BankManagement />
            </AdminLayout>
          } />

          <Route path="/admin/schools" element={
            <AdminLayout>
              <SchoolsManagement />
            </AdminLayout>
          } />

          <Route path="/admin/communities" element={
            <AdminLayout>
              <CommunitiesManagement />
            </AdminLayout>
          } />

          <Route path="/admin/volunteers" element={
            <AdminLayout>
              <VolunteersManagement />
            </AdminLayout>
          } />

          <Route path="/admin/social-media" element={
            <AdminLayout>
              <SocialMediaManagement />
            </AdminLayout>
          } />

          <Route path="/admin/testimonials" element={
            <AdminLayout>
              <TestimonialManagement />
            </AdminLayout>
          } />

          <Route path="/admin/sponsors" element={
            <AdminLayout>
              <SponsorList />
            </AdminLayout>
          } />

          <Route path="/admin/sponsors/add" element={
            <AdminLayout>
              <AddSponsor />
            </AdminLayout>
          } />

          <Route path="/admin/sponsors/edit/:id" element={
            <AdminLayout>
              <EditSponsor />
            </AdminLayout>
          } />

          <Route path="/admin/urgent-messages" element={
            <AdminLayout>
              <UrgentMessageList />
            </AdminLayout>
          } />

          <Route path="/admin/urgent-messages/add" element={
            <AdminLayout>
              <AddUrgentMessage />
            </AdminLayout>
          } />

          <Route path="/admin/alerts" element={
            <AdminLayout>
              <AlertsManagement />
            </AdminLayout>
          } />

          <Route path="/admin/test" element={
            <AdminLayout>
              <AdminTestPage />
            </AdminLayout>
          } />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;