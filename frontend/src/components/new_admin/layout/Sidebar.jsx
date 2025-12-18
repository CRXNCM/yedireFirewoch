import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaSchool, FaImages, FaUsers, 
  FaUserFriends, FaDonate, FaQuoteRight, FaHandshake,
  FaBullhorn, FaBell, FaCog
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: <FaTachometerAlt className="w-5 h-5" />, label: 'Dashboard', path: '/admin' },
    { icon: <FaSchool className="w-5 h-5" />, label: 'Schools', path: '/admin/schools' },
    { icon: <FaImages className="w-5 h-5" />, label: 'Gallery', path: '/admin/gallery' },
    { icon: <FaUsers className="w-5 h-5" />, label: 'Users', path: '/admin/users' },
    { icon: <FaUserFriends className="w-5 h-5" />, label: 'Team', path: '/admin/team' },
    { icon: <FaDonate className="w-5 h-5" />, label: 'Donations', path: '/admin/donations' },
    { icon: <FaQuoteRight className="w-5 h-5" />, label: 'Testimonials', path: '/admin/testimonials' },
    { icon: <FaHandshake className="w-5 h-5" />, label: 'Partners', path: '/admin/partners' },
    { icon: <FaBullhorn className="w-5 h-5" />, label: 'Announcements', path: '/admin/announcements' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-primary">Yedire Firewoch</h1>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="mb-1">
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary border-r-4 border-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t">
        <Link
          to="/admin/settings"
          className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
            location.pathname === '/admin/settings'
              ? 'bg-primary-50 text-primary'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FaCog className="w-5 h-5 mr-3" />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
