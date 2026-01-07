
import { createClient } from '@supabase/supabase-js'; //Creates a single supabase client for interacting with the database
import 'react-native-url-polyfill/auto'; //helps react native handle urls

const supabaseUrl = 'https://itxwdsijadksuafrmjad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eHdkc2lqYWRrc3VhZnJtamFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTUwMTAsImV4cCI6MjA4MTYzMTAxMH0.RmSDgzJiDxRMRwxJjkbe9YapiYoxvo_fxJjevVpNJSo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); //make the supabase client available for use throughout the app / all files