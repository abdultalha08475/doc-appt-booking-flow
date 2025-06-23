
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, User, Calendar } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  doctor_name?: string;
  appointment_date?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

const PatientReviews: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchReviews();
      fetchDoctors();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          doctors(name),
          appointments(appointment_date)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data?.map(review => ({
        ...review,
        doctor_name: review.doctors?.name,
        appointment_date: review.appointments?.appointment_date
      })) || []);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error loading reviews",
        description: "Failed to load your reviews. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialty')
        .eq('is_active', true);

      if (error) throw error;
      setDoctors(data || []);
    } catch (error: any) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!selectedDoctor || rating === 0) {
      toast({
        title: "Missing information",
        description: "Please select a doctor and provide a rating.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user?.id,
          doctor_id: selectedDoctor,
          rating,
          comment: comment.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!"
      });

      // Reset form
      setSelectedDoctor('');
      setRating(0);
      setComment('');
      
      // Refresh reviews
      fetchReviews();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error submitting review",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          index < currentRating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300 hover:text-yellow-400'
        }`}
        onClick={interactive ? () => setRating(index + 1) : undefined}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Your Reviews
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Star className="w-4 h-4 mr-2" />
              Write Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Doctor
                </label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {renderStars(rating, true)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comment (Optional)
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={submitReview} 
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-300">No reviews yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Share your experience with our doctors
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {review.doctor_name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
              
              {review.comment && (
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                  "{review.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default PatientReviews;
