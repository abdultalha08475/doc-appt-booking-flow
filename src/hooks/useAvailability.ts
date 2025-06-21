
import { useState, useEffect } from 'react';
import { TimeSlot } from '../types';

export const useAvailability = (doctorId: string, date: string) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId || !date) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockSlots: TimeSlot[] = [
        { id: '1', time: '09:00', isAvailable: true },
        { id: '2', time: '09:30', isAvailable: false },
        { id: '3', time: '10:00', isAvailable: true },
        { id: '4', time: '10:30', isAvailable: true },
        { id: '5', time: '11:00', isAvailable: false },
        { id: '6', time: '11:30', isAvailable: true },
        { id: '7', time: '14:00', isAvailable: true },
        { id: '8', time: '14:30', isAvailable: true },
        { id: '9', time: '15:00', isAvailable: false },
        { id: '10', time: '15:30', isAvailable: true },
      ];
      setSlots(mockSlots);
      setLoading(false);
    }, 1000);
  }, [doctorId, date]);

  return { slots, loading };
};
