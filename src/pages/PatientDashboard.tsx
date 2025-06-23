
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Clock,
  User,
  FileText,
  Bell,
  Star,
  Phone,
  MapPin,
  CreditCard,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Appointment {
  id: string;
  doctor_name: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  reason: string;
  queue_number: number;
}

interface MedicalRecord {
  id: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  created_at: string;
  doctor_name?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const PatientDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch recent appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .order('appointment_date', { ascending: false })
        .limit(5);

      if (appointmentsError) throw appointmentsError;
      setAppointments(appointmentsData || []);

      // Fetch medical records
      const { data: recordsData, error: recordsError } = await supabase
        .from('patient_medical_records')
        .select(`
          *,
          doctors(name)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recordsError) throw recordsError;
      setMedicalRecords(recordsData?.map(record => ({
        ...record,
        doctor_name: record.doctors?.name
      })) || []);

      // Fetch notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (notificationsError) throw notificationsError;
      setNotifications(notificationsData || []);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error loading dashboard",
        description: "Failed to load your dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {userProfile?.name || user?.email}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Here's your health overview and recent activity
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {appointments.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Medical Records
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {medicalRecords.length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Notifications
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {notifications.filter(n => !n.is_read).length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Health Score
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  85%
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Appointments */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Recent Appointments
                </h2>
                <Link to="/appointments">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-300">No appointments yet</p>
                  <Link to="/book">
                    <Button className="mt-4">Book Appointment</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {appointment.doctor_name}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {appointment.appointment_date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {appointment.time_slot}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{appointment.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          #{appointment.queue_number}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Medical Records */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Medical Records
                </h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>

              {medicalRecords.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-300">No medical records yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {record.diagnosis || 'General Consultation'}
                        </p>
                        <span className="text-sm text-gray-500">
                          {new Date(record.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {record.doctor_name && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          Dr. {record.doctor_name}
                        </p>
                      )}
                      {record.prescription && (
                        <p className="text-sm text-gray-700 dark:text-gray-400">
                          <strong>Prescription:</strong> {record.prescription}
                        </p>
                      )}
                      {record.notes && (
                        <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                          <strong>Notes:</strong> {record.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link to="/book" className="block">
                  <Button className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book New Appointment
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  View Medical History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Rate & Review
                </Button>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Notifications
                </h2>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-4">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">No notifications</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        notification.is_read 
                          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800' 
                          : 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                      }`}
                      onClick={() => !notification.is_read && markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Bell className={`w-4 h-4 mt-0.5 ${getNotificationIcon(notification.type)}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            notification.is_read 
                              ? 'text-gray-600 dark:text-gray-300' 
                              : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Contact Info */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Need Help?
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Emergency</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">+91-123-456-7890</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Visit Us</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">123 Health Street</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
