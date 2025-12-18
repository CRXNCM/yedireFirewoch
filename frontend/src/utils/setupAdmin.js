import { apiService } from './apiClient';

const setupAdmin = async () => {
  try {
    console.log('Setting up admin user...');
    
    // Use a valid email format
    const adminEmail = 'mosisaboneya4@gmail.com';
    const adminPassword = 'Admin123!';
    
    try {
      // Create admin user using your API
      const response = await apiService.auth.register({
        email: adminEmail,
        password: adminPassword,
        full_name: 'Admin User',
        role: 'admin'
      });

      console.log('Admin user created successfully!');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
      
      // Log in the admin user to get the auth token
      const loginResponse = await apiService.auth.login({
        email: adminEmail,
        password: adminPassword
      });
      
      console.log('Admin user logged in successfully!');
      console.log('Auth Token:', loginResponse.token);
      
    } catch (error) {
      console.error('Error setting up admin user:', error.response?.data || error.message);
      return;
    }
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
};

// Run the setup function
setupAdmin();