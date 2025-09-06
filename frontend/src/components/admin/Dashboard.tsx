import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaSchool, FaHandsHelping, FaUsers, FaChartLine } from 'react-icons/fa';
import CountUp from 'react-countup';
import { apiService } from '../../utils/apiClient';
import { School, ApiResponse } from '../../types/database';
import '../../styles/admin/Dashboard.css';

interface DashboardStats {
  schools: number;
  students: number;
  volunteers: number;
  communities: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    schools: 0,
    students: 0,
    volunteers: 0,
    communities: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all data in parallel
      const [schoolsResponse, communitiesResponse] = await Promise.all([
        apiService.schools.getAll(),
        apiService.communities.getAll()
      ]);

      // Process schools data
      const schools: School[] = schoolsResponse.data || [];
      const totalStudents = schools.reduce((sum, school) => 
        sum + (school.children_served || 0), 0);

      // Note: Volunteers endpoint might need to be added to your API
      // For now, we'll use a placeholder or fetch from a different endpoint
      let volunteersCount = 0;
      try {
        // Assuming you have a volunteers endpoint
        const volunteersResponse = await fetch('/api/volunteers');
        if (volunteersResponse.ok) {
          const volunteersData = await volunteersResponse.json();
          volunteersCount = volunteersData.length || 0;
        }
      } catch (err) {
        console.warn('Volunteers endpoint not available:', err);
      }

      setStats({
        schools: schools.length,
        students: totalStudents,
        volunteers: volunteersCount,
        communities: communitiesResponse.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchStats} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="impact-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaGraduationCap />
          </div>
          <div className="stat-number">
            {loading ? (
              <span className="loading-placeholder">...</span>
            ) : (
              <CountUp 
                end={stats.students} 
                duration={2.5} 
                separator="," 
                suffix="+"
                enableScrollSpy
                scrollSpyOnce
              />
            )}
          </div>
          <div className="stat-label">Students Helped</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaSchool />
          </div>
          <div className="stat-number">
            {loading ? (
              <span className="loading-placeholder">...</span>
            ) : (
              <CountUp 
                end={stats.schools} 
                duration={2} 
                suffix="+"
                enableScrollSpy
                scrollSpyOnce
              />
            )}
          </div>
          <div className="stat-label">Schools Supported</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaHandsHelping />
          </div>
          <div className="stat-number">
            {loading ? (
              <span className="loading-placeholder">...</span>
            ) : (
              <CountUp 
                end={stats.volunteers} 
                duration={1.5} 
                suffix="+"
                enableScrollSpy
                scrollSpyOnce
              />
            )}
          </div>
          <div className="stat-label">Volunteers</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-number">
            {loading ? (
              <span className="loading-placeholder">...</span>
            ) : (
              <CountUp 
                end={stats.communities} 
                duration={1} 
                suffix="+"
                enableScrollSpy
                scrollSpyOnce
              />
            )}
          </div>
          <div className="stat-label">Communities Reached</div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="quick-insights">
          <h2>Quick Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-header">
                <FaChartLine />
                <h3>Average Students per School</h3>
              </div>
              <p className="insight-value">
                {loading ? '...' : (
                  <CountUp 
                    end={stats.schools ? Math.round(stats.students / stats.schools) : 0}
                    duration={1.5}
                    separator=","
                  />
                )}
              </p>
            </div>
            <div className="insight-card">
              <div className="insight-header">
                <FaUsers />
                <h3>Volunteer to Student Ratio</h3>
              </div>
              <p className="insight-value">
                {loading ? '...' : (
                  `1:${Math.round(stats.students / (stats.volunteers || 1))}`
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {stats.schools > 0 && (
              <div className="activity-item">
                <div className="activity-icon school">
                  <FaSchool />
                </div>
                <div className="activity-content">
                  <h4>Schools Active</h4>
                  <p>{stats.schools} schools currently in the program</p>
                </div>
              </div>
            )}
            {stats.students > 0 && (
              <div className="activity-item">
                <div className="activity-icon students">
                  <FaGraduationCap />
                </div>
                <div className="activity-content">
                  <h4>Student Impact</h4>
                  <p>Serving {stats.students} students across communities</p>
                </div>
              </div>
            )}
            {stats.communities > 0 && (
              <div className="activity-item">
                <div className="activity-icon communities">
                  <FaUsers />
                </div>
                <div className="activity-content">
                  <h4>Community Engagement</h4>
                  <p>Active in {stats.communities} different communities</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
