
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ClinicStats, Appointment } from '../types';
import {
  Users,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

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

  useEffect(() => {
    // Simulate fetching dashboard data
    const mockStats: ClinicStats = {
      totalPatients: 1250,
      todayAppointments: 32,
      pendingAppointments: 8,
      completedAppointments: 18,
      revenue: 45600,
      averageWaitTime: 15
    };

    const mockAppointments: Appointment[] = [
      {
        id: '1',
        doctorId: 'dr1',
        doctorName: 'Dr. Smith',
        patientName: 'John Doe',
        patientPhone: '+919876543210',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        reason: 'General Checkup',
        status: 'confirmed',
        queueNumber: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        doctorId: 'dr2',
        doctorName: 'Dr. Johnson',
        patientName: 'Jane Smith',
        patientPhone: '+919876543211',
        date: new Date().toISOString().split('T')[0],
        time: '10:30',
        reason: 'Follow-up',
        status: 'in-progress',
        queueNumber: 2,
        createdAt: new Date().toISOString()
      }
    ];

    setStats(mockStats);
    setRecentAppointments(mockAppointments);
  }, []);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome to your clinic management dashboard
        </p>
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
