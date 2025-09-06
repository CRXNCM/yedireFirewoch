import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = 'https://ryufuhcepxhndkfnhxlu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dWZ1aGNlcHhobmRrZm5oeGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzEzOTksImV4cCI6MjA1OTgwNzM5OX0.i5nr7obUOL6eWWcCeCJc0Sg3uyS9cm-21f_0B7PGJtk';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const setupAdmin = async () => {
  try {
    console.log('Setting up admin user...');
    
    // Create admin user
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'admin123',
      options: {
        data: {
          role: 'admin',
          name: 'Admin User'
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('Admin user already exists');
      } else {
        throw error;
      }
    } else {
      console.log('Admin user created successfully:', data.user?.email);
      
      // Create a profile entry if you have a profiles table
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user?.id,
              email: data.user?.email,
              role: 'admin',
              name: 'Admin User'
            }
          ]);
          
        if (profileError) throw profileError;
        console.log('Admin profile created successfully');
      } catch (profileErr) {
        console.error('Error creating admin profile:', profileErr);
      }
    }
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
};

// Run the setup function
setupAdmin();