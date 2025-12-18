import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaSchool, 
  FaUsers, 
  FaQuoteRight, 
  FaHandshake,
  FaDonate,
  FaBell,
  FaBullhorn,
  FaImages,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaBolt,
  FaUserPlus,
  FaChartBar
} from 'react-icons/fa';
import { apiService } from '../utils/apiClient';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    schools: 0,
    students: 0,
    volunteers: 0,
    communities: 0,
    testimonials: 0,
    sponsors: 0,
    banks: 0,
    alerts: 0,
    urgentMessages: 0,
    pendingRequests: 0,
    activeEvents: 0,
    totalDonations: 0,
    monthlyActiveUsers: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [
          schoolsRes, 
          communitiesRes, 
          testimonialsRes, 
          sponsorsRes, 
          banksRes, 
          alertsRes,
          urgentMessagesRes
        ] = await Promise.allSettled([
          apiService.schools.getAll(),
          apiService.communities.getAll(),
          apiService.testimonials.getAll(),
          apiService.sponsors.getAll(),
          apiService.banks.getAll(),
          apiService.alerts.getAll(),
          apiService.urgentMessages.getAll()
        ]);

        // Extract data from responses
        const schools = schoolsRes.status === 'fulfilled' ? schoolsRes.value.schools || [] : [];
        const communities = communitiesRes.status === 'fulfilled' ? communitiesRes.value.communities || [] : [];
        const testimonials = testimonialsRes.status === 'fulfilled' ? testimonialsRes.value.testimonials || [] : [];
        const sponsors = sponsorsRes.status === 'fulfilled' ? sponsorsRes.value.sponsors || [] : [];
        const banks = banksRes.status === 'fulfilled' ? banksRes.value.banks || [] : [];
        const alerts = alertsRes.status === 'fulfilled' ? alertsRes.value.alerts || [] : [];
        const urgentMessages = urgentMessagesRes.status === 'fulfilled' ? urgentMessagesRes.value.urgentMessages || [] : [];

        // Calculate total students across all schools
        const totalStudents = schools.reduce((sum, school) => sum + (school.children_served || 0), 0);

        // Update stats
        setStats({
          schools: schools.length,
          students: totalStudents,
          volunteers: communities.length,
          communities: communities.length,
          testimonials: testimonials.length,
          sponsors: sponsors.length,
          banks: banks.length,
          alerts: alerts.length,
          urgentMessages: urgentMessages.length
        });

        // Update recent activity
        setRecentActivity([
          {
            type: 'schools',
            icon: FaSchool,
            title: 'Schools Active',
            description: `${schools.length} schools currently in the program`,
            count: schools.length,
            color: 'schools',
            onClick: () => navigate('/admin/schools')
          },
          {
            type: 'students',
            icon: FaGraduationCap,
            title: 'Student Impact',
            description: `Serving ${totalStudents.toLocaleString()} students across communities`,
            count: totalStudents,
            color: 'students',
            onClick: () => navigate('/admin/schools')
          },
          {
            type: 'volunteers',
            icon: FaUsers,
            title: 'Volunteers',
            description: `${communities.length} volunteers supporting the program`,
            count: communities.length,
            color: 'volunteers',
            onClick: () => navigate('/admin/communities')
          },
          {
            type: 'testimonials',
            icon: FaQuoteRight,
            title: 'Testimonials',
            description: `${testimonials.length} testimonials collected`,
            count: testimonials.length,
            color: 'testimonials',
            onClick: () => navigate('/admin/testimonials')
          }
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        await apiService.auth.verifyToken();
        fetchDashboardData();
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const getColor = (type) => {
    const colors = {
      students: '#4caf50',
      schools: '#2196f3',
      volunteers: '#ff9800',
      testimonials: '#9c27b0',
      sponsors: '#f44336',
      banks: '#00bcd4',
      gallery: '#ff5722',
      urgent: '#e91e63',
      default: '#6c757d'
    };
    return colors[type] || colors.default;
  };

  const StatCard = ({ icon: Icon, title, value, color = 'primary', trend, trendLabel, link }) => {
    const card = (
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        height: '100%',
        borderLeft: `4px solid ${getColor(color)}`,
        ':hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
        }
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ 
              color: '#666',
              fontSize: '14px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: `${getColor(color)}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: getColor(color)
              }}>
                <Icon size={16} />
              </div>
              {title}
            </div>
            <div style={{ 
              fontSize: '24px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '4px'
            }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
          </div>
          {trend && (
            <div style={{
              backgroundColor: trend > 0 ? '#48bb7820' : '#f5656520',
              color: trend > 0 ? '#48bb78' : '#f56565',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        {trendLabel && (
          <div style={{
            color: '#718096',
            fontSize: '12px',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {trendLabel}
          </div>
        )}
      </div>
    );

    return link ? <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>{card}</Link> : card;
  };

  const ActivityItem = ({ icon: Icon, title, time, description, color = 'primary' }) => (
    <div style={{
      display: 'flex',
      padding: '12px 0',
      borderBottom: '1px solid #edf2f7',
      '&:last-child': {
        borderBottom: 'none'
      }
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: `${getColor(color)}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: getColor(color),
        flexShrink: 0,
        marginRight: '12px'
      }}>
        <Icon size={14} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h4 style={{ margin: '0 0 4px 0', color: '#2d3748', fontSize: '14px' }}>{title}</h4>
          <span style={{ color: '#a0aec0', fontSize: '12px' }}>{time}</span>
        </div>
        <p style={{ margin: 0, color: '#718096', fontSize: '13px', lineHeight: '1.4' }}>{description}</p>
      </div>
    </div>
  );

  // Simulate fetching data
  useEffect(() => {
    // Mock data for demonstration
    const mockActivities = [
      {
        id: 1,
        title: 'New school registration',
        description: 'Green Valley School has registered in the program',
        time: '2 hours ago',
        icon: FaSchool
      },
      {
        id: 2,
        title: 'Volunteer application',
        description: 'John Doe applied to become a volunteer',
        time: '5 hours ago',
        icon: FaUsers
      },
      {
        id: 3,
        title: 'Donation received',
        description: 'Received a donation of $500 from Jane Smith',
        time: '1 day ago',
        icon: FaDonate
      },
      {
        id: 4,
        title: 'New testimonial',
        description: 'Sarah Johnson shared her experience with the program',
        time: '2 days ago',
        icon: FaQuoteRight
      }
    ];

    const mockEvents = [
      {
        id: 1,
        title: 'Volunteer Training',
        date: 'Nov 15, 2023',
        time: '10:00 AM - 2:00 PM',
        location: 'Community Center',
        icon: FaUsers
      },
      {
        id: 2,
        title: 'School Visit',
        date: 'Nov 18, 2023',
        time: '9:00 AM - 12:00 PM',
        location: 'Sunshine Elementary',
        icon: FaSchool
      },
      {
        id: 3,
        title: 'Fundraising Meeting',
        date: 'Nov 20, 2023',
        time: '3:00 PM - 5:00 PM',
        location: 'Online',
        icon: FaHandshake
      }
    ];

    setRecentActivities(mockActivities);
    setUpcomingEvents(mockEvents);
  }, []);

  return (
    <div style={{
      flexGrow: 1,
      padding: '24px',
      overflow: 'auto',
      height: '100vh',
      backgroundColor: '#f5f7fa',
      width: 'calc(100vw - 250px)',
      margin: 0,
      maxWidth: 'none',
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          margin: '0 0 8px 0', 
          color: '#2d3748', 
          fontSize: '24px', 
          fontWeight: '700' 
        }}>
          Dashboard Overview
        </h1>
        <p style={{ 
          margin: 0, 
          color: '#718096', 
          fontSize: '14px'
        }}>
          Welcome back! Here's what's happening with your organization today.
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <StatCard 
          icon={FaSchool}
          title="Total Schools"
          value={stats.schools}
          color="blue"
          trend={12.5}
          trendLabel="+3 from last month"
          link="/admin/schools"
        />
        <StatCard 
          icon={FaGraduationCap}
          title="Students Impacted"
          value={stats.students}
          color="green"
          trend={8.3}
          trendLabel="+124 from last month"
          link="/admin/students"
        />
        <StatCard 
          icon={FaUsers}
          title="Active Volunteers"
          value={stats.volunteers}
          color="purple"
          trend={5.2}
          trendLabel="+12 from last month"
          link="/admin/volunteers"
        />
        <StatCard 
          icon={FaDonate}
          title="Total Donations"
          value={`$${(stats.totalDonations || 0).toLocaleString()}`}
          color="orange"
          trend={18.7}
          trendLabel="+$2,450 from last month"
          link="/admin/donations"
        />
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        width: '100%',
        boxSizing: 'border-box',
        margin: '0 auto',
        backgroundColor: '#f5f7fa'
      }}>
        {/* Left Column */}
        <div>
          {/* Upcoming Events */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            height: 'fit-content',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #edf2f7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '16px',
                fontWeight: '600',
                color: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaCalendarAlt size={16} color="#4a5568" />
                Upcoming Events
              </h3>
              <Link to="/admin/events" style={{
                color: '#4299e1',
                fontSize: '13px',
                textDecoration: 'none',
                fontWeight: '500',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}>
                View All
              </Link>
            </div>
            <div style={{ padding: '12px 0' }}>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <div key={event.id} style={{
                    padding: '12px 20px',
                    borderBottom: '1px solid #edf2f7',
                    '&:last-child': {
                      borderBottom: 'none'
                    },
                    '&:hover': {
                      backgroundColor: '#f8fafc'
                    }
                  }}>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: '#ebf8ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#3182ce',
                        flexShrink: 0
                      }}>
                        <event.icon size={16} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '4px'
                        }}>
                          <h4 style={{ 
                            margin: 0, 
                            fontSize: '14px',
                            color: '#2d3748',
                            fontWeight: '600'
                          }}>
                            {event.title}
                          </h4>
                          <span style={{ 
                            fontSize: '12px',
                            color: '#718096',
                            backgroundColor: '#f7fafc',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {event.date}
                          </span>
                        </div>
                        <div style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12px',
                          color: '#718096',
                          marginTop: '4px'
                        }}>
                          <span>{event.time}</span>
                          <span>•</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  padding: '24px', 
                  textAlign: 'center',
                  color: '#718096',
                  fontSize: '14px'
                }}>
                  No upcoming events scheduled
                </div>
              )}
            </div>
            
            {/* Quick Actions */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              marginTop: '24px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #edf2f7',
                backgroundColor: '#f8fafc'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2d3748',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaBolt size={14} color="#4a5568" />
                  Quick Actions
                </h3>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                padding: '16px'
              }}>
                <Link to="/admin/schools/new" style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    '> div': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }
                }}>
                  <div style={{
                    backgroundColor: '#ebf8ff',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    border: '1px solid #bee3f8',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#90cdf4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                      color: 'white'
                    }}>
                      <FaPlus size={14} />
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#2b6cb0'
                    }}>Add School</span>
                  </div>
                </Link>
                
                <Link to="/admin/volunteers/new" style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    '> div': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }
                }}>
                  <div style={{
                    backgroundColor: '#faf5ff',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    border: '1px solid #e9d8fd',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#9f7aea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                      color: 'white'
                    }}>
                      <FaUserPlus size={14} />
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#553c9a'
                    }}>Add Volunteer</span>
                  </div>
                </Link>
                
                <Link to="/admin/donations/new" style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    '> div': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }
                }}>
                  <div style={{
                    backgroundColor: '#f0fff4',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    border: '1px solid #c6f6d5',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#48bb78',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                      color: 'white'
                    }}>
                      <FaDonate size={14} />
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#2f855a'
                    }}>Record Donation</span>
                  </div>
                </Link>
                
                <Link to="/admin/alerts/new" style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    '> div': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }
                }}>
                  <div style={{
                    backgroundColor: '#fff5f5',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    border: '1px solid #fed7d7',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#f56565',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                      color: 'white'
                    }}>
                      <FaBullhorn size={14} />
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#c53030'
                    }}>Send Alert</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            height: '100%',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #edf2f7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '16px',
                fontWeight: '600',
                color: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaBell size={16} color="#4a5568" />
                Recent Activity
              </h3>
              <Link to="/admin/activity" style={{
                color: '#4299e1',
                fontSize: '13px',
                textDecoration: 'none',
                fontWeight: '500',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}>
                View All
              </Link>
            </div>
            <div style={{ padding: '12px 0' }}>
              {recentActivities.length > 0 ? (
                recentActivities.map(activity => (
                  <ActivityItem
                    key={activity.id}
                    icon={activity.icon}
                    title={activity.title}
                    description={activity.description}
                    time={activity.time}
                  />
                ))
              ) : (
                <div style={{ 
                  padding: '24px', 
                  textAlign: 'center',
                  color: '#718096',
                  fontSize: '14px'
                }}>
                  No recent activities to show
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Additional Stats */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            height: '100%',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #edf2f7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '16px',
                fontWeight: '600',
                color: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaChartBar size={16} color="#4a5568" />
                Additional Statistics
              </h3>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
              padding: '16px'
            }}>
              <StatCard 
                icon={FaHandshake} 
                number={stats.sponsors} 
                label="Sponsors" 
                color="sponsors"
                link="/admin/sponsors"
              />
              <StatCard 
                icon={FaDonate} 
                number={stats.banks} 
                label="Bank Accounts" 
                color="banks"
                link="/admin/banks"
              />
              <StatCard 
                icon={FaBell} 
                number={stats.alerts} 
                label="Alert Messages" 
                color="urgent"
                link="/admin/alerts"
              />
              <StatCard 
                icon={FaBullhorn} 
                number={stats.urgentMessages} 
                label="Urgent Messages" 
                color="urgent"
                link="/admin/urgent-messages"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Recent Activity */}
        <div>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '20px',
            height: '100%',
            boxSizing: 'border-box'
          }}>
            <h2 style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              color: '#333',
              fontWeight: '600'
            }}>
              Recent Activity
            </h2>
            <div>
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon || FaBell;
                return (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0',
                    ':last-child': {
                      borderBottom: 'none'
                    }
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      color: '#fff',
                      backgroundColor: getColor(activity.color),
                      flexShrink: 0
                    }}>
                      <Icon size={14} />
                    </div>
                    <div>
                      <h4 style={{
                        margin: '0 0 4px 0',
                        fontSize: '14px',
                        color: '#333'
                      }}>
                        {activity.title}
                      </h4>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#666',
                        lineHeight: '1.4'
                      }}>
                        {activity.description}
                      </p>
                    </div>
                    <div style={{
                      marginLeft: 'auto',
                      fontSize: '12px',
                      color: '#999',
                      whiteSpace: 'nowrap',
                      paddingLeft: '8px'
                    }}>
                      {activity.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;