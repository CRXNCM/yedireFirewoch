import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaSchool, 
  FaImages, 
  FaUsers, 
  FaUserFriends,
  FaDonate,
  FaSignOutAlt,
  FaQuoteRight,
  FaBell,
  FaBullhorn,
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaHome,
  FaUserCircle
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { 
    title: 'Dashboard', 
    icon: <FaTachometerAlt className="w-5 h-5" />, 
    path: '/admin',
    exact: true
  },
  { 
    title: 'Schools', 
    icon: <FaSchool className="w-5 h-5" />, 
    path: '/admin/schools',
    children: [
      { title: 'All Schools', path: '/admin/schools' },
      { title: 'Add New', path: '/admin/schools/new' }
    ]
  },
  { 
    title: 'Gallery', 
    icon: <FaImages className="w-5 h-5" />, 
    path: '/admin/gallery' 
  },
  { 
    title: 'Communities', 
    icon: <FaUsers className="w-5 h-5" />, 
    path: '/admin/communities' 
  },
  { 
    title: 'Volunteers', 
    icon: <FaUserFriends className="w-5 h-5" />, 
    path: '/admin/volunteers' 
  },
  { 
    title: 'Donations', 
    icon: <FaDonate className="w-5 h-5" />, 
    path: '/admin/donations' 
  },
  { 
    title: 'Testimonials', 
    icon: <FaQuoteRight className="w-5 h-5" />, 
    path: '/admin/testimonials' 
  },
  { 
    title: 'Alerts', 
    icon: <FaBell className="w-5 h-5" />, 
    path: '/admin/alerts' 
  },
  { 
    title: 'Urgent Messages', 
    icon: <FaBullhorn className="w-5 h-5" />, 
    path: '/admin/urgent-messages' 
  },
  { 
    title: 'Settings', 
    icon: <FaCog className="w-5 h-5" />, 
    path: '/admin/settings' 
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, currentUser } = useAuth();

  // Toggle sidebar on mobile
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Toggle submenu
  const toggleSubmenu = (title) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && 
          !event.target.closest('.sidebar-toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if a route is active
  const isActive = (path, exact = false) => {
    return exact 
      ? location.pathname === path
      : location.pathname.startsWith(path);
  };

  // Render menu items
  const renderMenuItems = (items) => {
    return items.map((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      const isItemActive = isActive(item.path, item.exact);
      const isExpanded = expandedItems[item.title];

      return (
        <li key={`${item.title}-${index}`} className="mb-1">
          <div
            onClick={() => {
              if (hasChildren) {
                toggleSubmenu(item.title);
              } else {
                navigate(item.path);
                if (window.innerWidth < 1024) setIsOpen(false);
              }
            }}
            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer ${
              isItemActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <span className="mr-3">{item.icon}</span>
              <span className="text-sm font-medium">{item.title}</span>
            </div>
            {hasChildren && (
              <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                <FaChevronDown className="w-4 h-4" />
              </span>
            )}
          </div>
          
          {hasChildren && (
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <ul className="pl-6 py-1">
                {item.children.map((child, childIndex) => (
                  <li key={childIndex} className="my-1">
                    <Link
                      to={child.path}
                      onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                      className={`block px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                        isActive(child.path, true)
                          ? 'text-blue-400 font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      );
    });
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed z-50 p-2 text-gray-500 rounded-md lg:hidden sidebar-toggle top-4 left-4 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <FaTimes className="w-6 h-6" />
        ) : (
          <FaBars className="w-6 h-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 flex flex-col h-screen w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Link
            to="/admin"
            className="flex items-center space-x-2 text-xl font-bold text-white hover:text-blue-400 transition-colors duration-200"
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          >
            <FaHome className="w-6 h-6 text-blue-400" />
            <span>Admin Panel</span>
          </Link>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4">
            <ul className="space-y-1">
              {renderMenuItems(menuItems)}
            </ul>
          </nav>
        </div>

        {/* User info and logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600">
                <FaUserCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {currentUser?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
              className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
              title="Logout"
            >
              <FaSignOutAlt className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Add padding to the main content when sidebar is open on desktop */}
      <div className={`transition-all duration-300 ${isOpen ? 'lg:pl-64' : ''}`} />
    </>
  );
};

export default Sidebar;
