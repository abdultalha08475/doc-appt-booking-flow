
import { supabase } from '@/integrations/supabase/client';

export const createAdminUser = async () => {
  try {
    // First, sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@docbook.com',
      password: 'admin123',
      options: {
        data: {
          name: 'admin'
        }
      }
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return { success: false, error: error.message };
    }

    console.log('Admin user created successfully:', data);

    // Update the profile to ensure admin privileges
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          name: 'admin',
          phone: null
        });

      if (profileError) {
        console.error('Error updating admin profile:', profileError);
        return { success: false, error: profileError.message };
      }
    }

    return { success: true, message: 'Admin user created successfully' };
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return { success: false, error: error.message };
  }
};
