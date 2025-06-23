
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Appointment {
  id: string;
  queue_number: number;
  patient_name: string;
  patient_phone: string;
  appointment_date: string;
  time_slot: string;
  reason: string;
  status: string;
  doctor_name: string;
  created_at: string;
}

const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', selectedDate)
        .order('queue_number', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error fetching appointments",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );

      toast({
        title: "Status updated",
        description: `Appointment status changed to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error updating appointment",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const totalAppointments = appointments.length;
  const completedCount = appointments.filter(apt => apt.status === 'completed').length;
  const inProgressCount = appointments.filter(apt => apt.status === 'in-progress').length;
  const pendingCount = appointments.filter(apt => apt.status === 'confirmed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Appointments Queue
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage today's appointments and queue
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={fetchAppointments} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Queue
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {totalAppointments}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Pending
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {pendingCount}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                In Progress
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {inProgressCount}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Completed
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {completedCount}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Queue Management - {selectedDate}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading appointments...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No appointments for {selectedDate}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              All appointments for this date will appear here
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Queue #</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="text-center">
                    <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold">
                      {appointment.queue_number}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {appointment.patient_name}
                  </TableCell>
                  <TableCell>{appointment.patient_phone}</TableCell>
                  <TableCell>{appointment.time_slot}</TableCell>
                  <TableCell>{appointment.doctor_name}</TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(appointment.status)} flex items-center gap-1`}>
                      {getStatusIcon(appointment.status)}
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment.id, 'in-progress')}
                        >
                          Start
                        </Button>
                      )}
                      {appointment.status === 'in-progress' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AdminAppointmentsPage;
