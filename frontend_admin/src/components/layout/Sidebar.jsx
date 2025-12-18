import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  UserGroupIcon,
  TrophyIcon,
  HeartIcon,
  BellIcon,
  Squares2X2Icon,
  BuildingOfficeIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: <HomeIcon className="h-5 w-5" />, path: '/' },
    { 
      title: 'Content',
      items: [
        { name: 'Banks', icon: <CurrencyDollarIcon className="h-5 w-5" />, path: '/banks' },
        { name: 'Gallery', icon: <PhotoIcon className="h-5 w-5" />, path: '/gallery' },
        { name: 'Schools', icon: <BuildingOfficeIcon className="h-5 w-5" />, path: '/schools' },
        { name: 'Sponsors', icon: <TrophyIcon className="h-5 w-5" />, path: '/sponsors' },
      ]
    },
    {
      title: 'Community',
      items: [
        { name: 'Testimonials', icon: <UserGroupIcon className="h-5 w-5" />, path: '/testimonials' },
        { name: 'Volunteers', icon: <HeartIcon className="h-5 w-5" />, path: '/volunteers' },
        { name: 'Socials', icon: <Squares2X2Icon className="h-5 w-5" />, path: '/socials' },
        { name: 'Alerts', icon: <BellIcon className="h-5 w-5" />, path: '/alerts' },
        { name: 'Communities', icon: <UserGroupIcon className="h-5 w-5" />, path: '/communities' },
      ]
    },
    {
      title: 'Account',
      items: [
        { name: 'Profile', icon: <UserCircleIcon className="h-5 w-5" />, path: '/profile' },
        { name: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5" />, path: '/settings' },
        { name: 'Logout', icon: <ArrowLeftOnRectangleIcon className="h-5 w-5" />, path: '/logout' },
      ]
    }
  ];

  const isActive = (path) => location.pathname === path;
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close dropdown when clicking outside
  const profileRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white border-r border-gray-700">
      {/* Logo/Brand */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">YF</span>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
            YedireFirewoch
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.title && (
              <h3 className="px-4 text-xs font-semibold text-white uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {(section.items || [section]).map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive(item.path)
                        ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:pl-5'
                    }`}
                  >
                    <span className={`mr-3 ${isActive(item.path) ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-white">{item.name}</span>
                    {isActive(item.path) && (
                      <span className="ml-auto h-2 w-2 bg-blue-500 rounded-full"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700 relative" ref={profileRef}>
        <button 
          className="w-full flex items-center space-x-3 focus:outline-none"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          aria-expanded={isProfileOpen}
          aria-haspopup="true"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">AD</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-gray-400 truncate">admin@yedirefirewoch.com</p>
          </div>
          <div className={`transition-transform duration-200 ${isProfileOpen ? 'transform rotate-180' : ''}`}>
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsProfileOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-5 w-5" />
                <span>Your Profile</span>
              </div>
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsProfileOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Settings</span>
              </div>
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              onClick={() => {
                // Handle logout logic here
                console.log('Logging out...');
                setIsProfileOpen(false);
              }}
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
