
import { useState, useEffect } from 'react';
import { TimeSlot } from '../types';

export const useAvailability = (doctorId: string = 'dr-sarah-johnson', date: string) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;

    setLoading(true);
    // Simulate API call with realistic doctor schedule
    setTimeout(() => {
      const selectedDate = new Date(date);
      const dayOfWeek = selectedDate.getDay();
      
      // Skip Sundays (day 0)
      if (dayOfWeek === 0) {
        setSlots([]);
        setLoading(false);
        return;
      }

      const mockSlots: TimeSlot[] = [
        // Morning slots
        { id: '1', time: '09:00', isAvailable: true },
        { id: '2', time: '09:30', isAvailable: Math.random() > 0.3 },
        { id: '3', time: '10:00', isAvailable: true },
        { id: '4', time: '10:30', isAvailable: Math.random() > 0.4 },
        { id: '5', time: '11:00', isAvailable: true },
        { id: '6', time: '11:30', isAvailable: Math.random() > 0.2 },
        
        // Afternoon slots
        { id: '7', time: '14:00', isAvailable: true },
        { id: '8', time: '14:30', isAvailable: Math.random() > 0.3 },
        { id: '9', time: '15:00', isAvailable: true },
        { id: '10', time: '15:30', isAvailable: Math.random() > 0.4 },
        { id: '11', time: '16:00', isAvailable: true },
        { id: '12', time: '16:30', isAvailable: Math.random() > 0.2 },
        { id: '13', time: '17:00', isAvailable: true },
        { id: '14', time: '17:30', isAvailable: Math.random() > 0.3 },
      ];

      // Add emergency slots for urgent cases
      if (dayOfWeek !== 6) { // No emergency slots on Saturday
        mockSlots.push(
          { id: 'emergency-1', time: '12:00', isAvailable: true, isEmergency: true },
          { id: 'emergency-2', time: '18:00', isAvailable: true, isEmergency: true }
        );
      }

      setSlots(mockSlots);
      setLoading(false);
    }, 1000);
  }, [doctorId, date]);

  return { slots, loading };
};
