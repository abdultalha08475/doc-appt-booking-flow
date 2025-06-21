
import React from 'react';
import { TimeSlot } from '../types';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
  loading?: boolean;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading available slots...</span>
      </div>
    );
  }

  const morningSlots = slots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour < 12;
  });

  const afternoonSlots = slots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 12;
  });

  const SlotButton = ({ slot }: { slot: TimeSlot }) => (
    <Button
      key={slot.id}
      variant={selectedSlot === slot.id ? "default" : "outline"}
      size="sm"
      disabled={!slot.isAvailable}
      onClick={() => onSelectSlot(slot.id)}
      className={`relative ${!slot.isAvailable ? 'opacity-50 cursor-not-allowed' : ''} ${
        slot.isEmergency ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' : ''
      }`}
    >
      <Clock className="w-4 h-4 mr-1" />
      {slot.time}
      {slot.isEmergency && <AlertTriangle className="w-3 h-3 ml-1" />}
    </Button>
  );

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Morning Slots
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {morningSlots.map(slot => <SlotButton key={slot.id} slot={slot} />)}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Afternoon Slots
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {afternoonSlots.map(slot => <SlotButton key={slot.id} slot={slot} />)}
        </div>
      </div>

      {slots.filter(s => s.isAvailable).length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-300">No slots available for this date</p>
          <p className="text-sm text-gray-500">Please try another date</p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
