import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaSchool, 
  FaImages, 
  FaUsers, 
  FaUserFriends,
  FaDonate,
  FaSignOutAlt,
  FaGlobe,
  FaComments,
  FaQuoteRight,
  FaHandshake,
  FaBullhorn,
  FaShareAlt,
  FaBell,
  FaBug
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      navigate('/login');
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>YEDIRE</h2>
        <p>FIREWOCH</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={isActive('/admin') ? 'active' : ''}>
            <Link to="/admin">
              <FaTachometerAlt />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={isActive('/admin/test') ? 'active' : ''}>
            <Link to="/admin/test">
              <FaBug />
              <span>Database Test</span>
            </Link>
          </li>
          <li className={isActive('/admin/schools') ? 'active' : ''}>
            <Link to="/admin/schools">
              <FaSchool />
              <span>Schools</span>
            </Link>
          </li>
          <li className={isActive('/admin/gallery') ? 'active' : ''}>
            <Link to="/admin/gallery">
              <FaImages />
              <span>Gallery</span>
            </Link>
          </li>
          <li className={isActive('/admin/banks') ? 'active' : ''}>
            <Link to="/admin/banks">
              <FaDonate />
              <span>Bank Accounts</span>
            </Link>
          </li>
          <li className={isActive('/admin/testimonials') ? 'active' : ''}>
            <Link to="/admin/testimonials">
              <FaQuoteRight />
              <span>Testimonials</span>
            </Link>
          </li>
          <li className={isActive('/admin/sponsors') ? 'active' : ''}>
            <Link to="/admin/sponsors">
              <FaHandshake />
              <span>Sponsors</span>
            </Link>
          </li>
          <li className={isActive('/admin/communities') ? 'active' : ''}>
            <Link to="/admin/communities">
              <FaUsers />
              <span>Communities</span>
            </Link>
          </li>
          <li className={isActive('/admin/volunteers') ? 'active' : ''}>
            <Link to="/admin/volunteers">
              <FaUserFriends />
              <span>Volunteers</span>
            </Link>
          </li>
          <li className={isActive('/admin/social-media') ? 'active' : ''}>
            <Link to="/admin/social-media">
              <FaShareAlt />
              <span>Social Media</span>
            </Link>
          </li>
          <li className={isActive('/admin/urgent-messages') ? 'active' : ''}>
            <Link to="/admin/urgent-messages">
              <FaBullhorn />
              <span>Urgent Messages</span>
            </Link>
          </li>
          <li className={isActive('/admin/alerts') ? 'active' : ''}>
            <Link to="/admin/alerts">
              <FaBell />
              <span>Alert Messages</span>
            </Link>
          </li>
          <li>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <FaGlobe />
              <span>View Website</span>
            </a>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;