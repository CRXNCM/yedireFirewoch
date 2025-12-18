import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaSchool, 
  FaHandsHelping, 
  FaUsers, 
  FaChartLine,
  FaDonate,
  FaQuoteRight,
  FaHandshake,
  FaBullhorn,
  FaBell,
  FaImages,
  FaShareAlt
} from 'react-icons/fa';
import { apiService } from '../../utils/apiClient.js';
import '../../styles/admin/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    schools: 0,
    students: 0,
    volunteers: 0,
    communities: 0,
    testimonials: 0,
    sponsors: 0,
    banks: 0,
    alerts: 0,
    urgentMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      console.log('🔍 Checking backend health...');
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        console.log('✅ Backend is healthy, fetching dashboard data...');
        fetchDashboardData();
      } else {
        console.error('❌ Backend health check failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Backend health check error:', error);
      // Still try to fetch dashboard data in case health endpoint is down
      fetchDashboardData();
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('📊 Starting to fetch dashboard data...');
      
      // Test each endpoint individually to identify which ones work
      const endpointTests = [
        { name: 'schools', call: () => apiService.schools.getAll() },
        { name: 'communities', call: () => apiService.communities.getAll() },
        { name: 'testimonials', call: () => apiService.testimonials.getAll() },
        { name: 'sponsors', call: () => apiService.sponsors.getAll() },
        { name: 'banks', call: () => apiService.banks.getAll() },
        { name: 'alerts', call: () => apiService.alerts.getAll() }
      ];

      const results = {};
      
      // Test each endpoint individually
      for (const test of endpointTests) {
        try {
          console.log(`🔄 Testing ${test.name} endpoint...`);
          const response = await test.call();
          results[test.name] = response;
          console.log(`✅ ${test.name} endpoint working:`, response);
        } catch (error) {
          console.error(`❌ ${test.name} endpoint failed:`, error.message);
          results[test.name] = { [test.name]: [] };
        }
      }

      // Extract data with fallbacks
      const schools = results.schools?.schools || [];
      const communities = results.communities?.communities || [];
      const testimonials = results.testimonials?.testimonials || [];
      const sponsors = results.sponsors?.sponsors || [];
      const banks = results.banks?.banks || [];
      const alerts = results.alerts?.alerts || [];

      console.log('📈 Final data summary:', {
        schools: schools.length,
        communities: communities.length,
        testimonials: testimonials.length,
        sponsors: sponsors.length,
        banks: banks.length,
        alerts: alerts.length
      });

      // Calculate total students across all schools
      const totalStudents = schools.reduce((sum, school) => 
        sum + (school.children_served || 0), 0);

      setStats({
        schools: schools.length,
        students: totalStudents,
        volunteers: communities.length, // Communities = Volunteers
        communities: communities.length,
        testimonials: testimonials.length,
        sponsors: sponsors.length,
        banks: banks.length,
        alerts: alerts.length,
        urgentMessages: 0 // Will be added when endpoint is ready
      });

      // Set recent activity
      setRecentActivity([
        {
          type: 'schools',
          icon: FaSchool,
          title: 'Schools Active',
          description: `${schools.length} schools currently in the program`,
          count: schools.length,
          color: 'school'
        },
        {
          type: 'students',
          icon: FaGraduationCap,
          title: 'Student Impact',
          description: `Serving ${totalStudents} students across communities`,
          count: totalStudents,
          color: 'students'
        },
        {
          type: 'volunteers',
          icon: FaUsers,
          title: 'Volunteers',
          description: `${communities.length} volunteers supporting the program`,
          count: communities.length,
          color: 'volunteers'
        },
        {
          type: 'testimonials',
          icon: FaQuoteRight,
          title: 'Testimonials',
          description: `${testimonials.length} testimonials collected`,
          count: testimonials.length,
          color: 'testimonials'
        }
      ]);

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      // Set default values on error
      setStats({
        schools: 0,
        students: 0,
        volunteers: 0,
        communities: 0,
        testimonials: 0,
        sponsors: 0,
        banks: 0,
        alerts: 0,
        urgentMessages: 0
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, number, label, color = 'default', link = null }) => {
    const content = (
      <div className={`stat-card ${color}`}>
        <div className="stat-icon">
          <Icon />
        </div>
        <div className="stat-number">
          {loading ? (
            <span className="loading-placeholder">...</span>
          ) : (
            <span>{number.toLocaleString()}</span>
          )}
        </div>
        <div className="stat-label">{label}</div>
      </div>
    );

    if (link) {
      return <Link to={link}>{content}</Link>;
    }
    return content;
  };

  const QuickActionCard = ({ icon: Icon, title, description, link, color = 'default' }) => (
    <Link to={link} className={`quick-action-card ${color}`}>
      <div className="action-icon">
        <Icon />
      </div>
      <div className="action-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to YeDire Firewoch Charity Organization Admin Panel</p>
      </div>

      {/* Main Stats Grid */}
      <div className="impact-stats-grid">
        <StatCard 
          icon={FaGraduationCap} 
          number={stats.students} 
          label="Students Helped" 
          color="students"
          link="/admin/schools"
        />
        <StatCard 
          icon={FaSchool} 
          number={stats.schools} 
          label="Schools Supported" 
          color="schools"
          link="/admin/schools"
        />
        <StatCard 
          icon={FaUsers} 
          number={stats.volunteers} 
          label="Volunteers" 
          color="volunteers"
          link="/admin/communities"
        />
        <StatCard 
          icon={FaQuoteRight} 
          number={stats.testimonials} 
          label="Testimonials" 
          color="testimonials"
          link="/admin/testimonials"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <QuickActionCard
            icon={FaSchool}
            title="Manage Schools"
            description="Add, edit, or remove schools from the program"
            link="/admin/schools"
            color="schools"
          />
          <QuickActionCard
            icon={FaQuoteRight}
            title="Manage Testimonials"
            description="Add or edit testimonials from donors and beneficiaries"
            link="/admin/testimonials"
            color="testimonials"
          />
          <QuickActionCard
            icon={FaDonate}
            title="Bank Accounts"
            description="Manage donation bank account information"
            link="/admin/banks"
            color="banks"
          />
          <QuickActionCard
            icon={FaHandshake}
            title="Manage Sponsors"
            description="Add or edit sponsor information"
            link="/admin/sponsors"
            color="sponsors"
          />
          <QuickActionCard
            icon={FaImages}
            title="Gallery Management"
            description="Upload and manage images for the website"
            link="/admin/gallery"
            color="gallery"
          />
          <QuickActionCard
            icon={FaBullhorn}
            title="Urgent Messages"
            description="Send urgent messages to website visitors"
            link="/admin/urgent-messages"
            color="urgent"
          />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="additional-stats">
        <h2>Additional Statistics</h2>
        <div className="stats-row">
          <div className="stat-item">
            <FaHandshake />
            <span className="stat-number">{stats.sponsors}</span>
            <span className="stat-label">Sponsors</span>
          </div>
          <div className="stat-item">
            <FaDonate />
            <span className="stat-number">{stats.banks}</span>
            <span className="stat-label">Bank Accounts</span>
          </div>
          <div className="stat-item">
            <FaBell />
            <span className="stat-number">{stats.alerts}</span>
            <span className="stat-label">Alert Messages</span>
          </div>
          <div className="stat-item">
            <FaBullhorn />
            <span className="stat-number">{stats.urgentMessages}</span>
            <span className="stat-label">Urgent Messages</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map((activity, index) => (
            <div key={index} className={`activity-item ${activity.color}`}>
              <div className="activity-icon">
                <activity.icon />
              </div>
              <div className="activity-content">
                <h4>{activity.title}</h4>
                <p>{activity.description}</p>
              </div>
              <div className="activity-count">
                {activity.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;