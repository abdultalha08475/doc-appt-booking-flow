
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone } from 'lucide-react';
import InputField from './InputField';

interface EmergencyBookingProps {
  onEmergencyBook: (data: { name: string; phone: string; emergency: string }) => void;
}

const EmergencyBooking: React.FC<EmergencyBookingProps> = ({ onEmergencyBook }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    emergency: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEmergencyBook(formData);
  };

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
          Emergency Booking
        </h3>
      </div>

      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
        For urgent medical situations. You will be prioritized in the queue.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Full Name"
          value={formData.name}
          onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
          placeholder="Enter your name"
          required
        />

        <InputField
          label="Phone Number"
          value={formData.phone}
          onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
          placeholder="Enter phone number"
          required
        />

        <InputField
          label="Emergency Description"
          value={formData.emergency}
          onChange={(value) => setFormData(prev => ({ ...prev, emergency: value }))}
          placeholder="Briefly describe the emergency"
          required
        />

        <div className="flex space-x-3">
          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Book Emergency Slot
          </Button>
          <Button type="button" variant="outline" className="border-red-300 text-red-600">
            <Phone className="w-4 h-4 mr-2" />
            Call Emergency: 108
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmergencyBooking;
