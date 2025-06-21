
import React from 'react';
import { Doctor } from '../types';
import { Button } from '@/components/ui/button';
import { Star, Clock, DollarSign } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: (doctor: Doctor) => void;
  selected?: boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, selected }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer transition-all ${
        selected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:shadow-lg'
      }`}
      onClick={() => onSelect(doctor)}
    >
      <div className="flex items-start space-x-4">
        <img
          src={doctor.avatar}
          alt={doctor.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{doctor.name}</h3>
          <p className="text-blue-600 dark:text-blue-400 font-medium">{doctor.specialty}</p>
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{doctor.experience}+ years</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{doctor.rating}/5</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>₹{doctor.fee}</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant={selected ? "default" : "outline"}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(doctor);
          }}
        >
          {selected ? 'Selected' : 'Select'}
        </Button>
      </div>
    </div>
  );
};

export default DoctorCard;
