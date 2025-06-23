import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ClinicStats, Appointment } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<ClinicStats>({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    revenue: 0,
    averageWaitTime: 0
  });

  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscription for appointments
    const channel = supabase
      .channel('admin-dashboard-appointments')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Real-time appointment change:', payload);
          
          // Show toast notification for new bookings
          if (payload.eventType === 'INSERT') {
            const newAppointment = payload.new as any;
            toast({
              title: "New Appointment Booked!",
              description: `${newAppointment.patient_name} has booked an appointment for ${newAppointment.appointment_date}`,
            });
          }
          
          // Refresh dashboard data when any appointment changes
          fetchDashboardData();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data...');
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      console.log('Today date:', today);
      
      // Fetch all appointments
      const { data: allAppointments, error: allError } = await supabase
        .from('appointments')
        .select('*');

      if (allError) {
        console.error('Error fetching all appointments:', allError);
        throw allError;
      }

      console.log('All appointments:', allAppointments);

      // Fetch today's appointments
      const { data: todayAppointments, error: todayError } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', today)
        .order('queue_number', { ascending: true });

      if (todayError) {
        console.error('Error fetching today appointments:', todayError);
        throw todayError;
      }

      console.log('Today appointments:', todayAppointments);

      // Calculate statistics
      const totalPatients = new Set(allAppointments?.map(apt => apt.patient_name) || []).size;
      const todayCount = todayAppointments?.length || 0;
      const pendingCount = allAppointments?.filter(apt => apt.status === 'pending' || apt.status === 'confirmed').length || 0;
      const completedCount = allAppointments?.filter(apt => apt.status === 'completed').length || 0;
      
      // Mock revenue calculation (you can implement actual pricing logic)
      const revenue = completedCount * 500; // Assuming ₹500 per appointment
      
      const calculatedStats = {
        totalPatients,
        todayAppointments: todayCount,
        pendingAppointments: pendingCount,
        completedAppointments: completedCount,
        revenue,
        averageWaitTime: 15 // Mock average wait time
      };

      console.log('Calculated stats:', calculatedStats);
      setStats(calculatedStats);

      // Set recent appointments (today's appointments)
      const formattedAppointments: Appointment[] = (todayAppointments || []).map(apt => ({
        id: apt.id,
        doctorId: apt.doctor_id,
        doctorName: apt.doctor_name,
        patientName: apt.patient_name,
        patientPhone: apt.patient_phone,
        date: apt.appointment_date,
        time: apt.time_slot,
        reason: apt.reason,
        status: apt.status as 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'in-progress',
        queueNumber: apt.queue_number,
        createdAt: apt.created_at
      }));

      console.log('Formatted appointments:', formattedAppointments);
      setRecentAppointments(formattedAppointments);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Today\'s Appointments',  
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Pending',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-orange-600 bg-orange-50';
      case 'completed':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome to your clinic management dashboard
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Appointments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Today's Appointments
          </h2>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <TrendingUp className="w-4 h-4 mr-1" />
            Live Queue
          </div>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-300">No appointments scheduled for today</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                    Queue #
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                    Patient
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                    Doctor
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                    Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                      #{appointment.queueNumber}
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-gray-100">
                      {appointment.patientName}
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                      {appointment.doctorName}
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                      {appointment.time}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600 mr-4" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Emergency Queue
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Manage urgent appointments
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Schedule Management
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Manage doctor schedules
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Patient Records
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Access patient database
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
