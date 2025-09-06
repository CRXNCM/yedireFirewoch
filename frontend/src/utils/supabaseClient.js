import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ryufuhcepxhndkfnhxlu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dWZ1aGNlcHhobmRrZm5oeGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzEzOTksImV4cCI6MjA1OTgwNzM5OX0.i5nr7obUOL6eWWcCeCJc0Sg3uyS9cm-21f_0B7PGJtk';
const apiKey = 'sb_secret_TGmeItTU28_eFmgWa2CPDA_NgK34yEz';
export const supabase = createClient(supabaseUrl, supabaseAnonKey, apiKey);
