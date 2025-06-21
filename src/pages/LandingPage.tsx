
import React from 'react';
import { Link } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, Shield, Clock, Star, Users, Phone } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <HeaderNav>
        <Link to="/login">
          <Button variant="outline" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
            Login
          </Button>
        </Link>
      </HeaderNav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Book Your Doctor Visit
              <span className="block text-blue-600 dark:text-blue-400">Instantly</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              No more busy signals—secure your appointment instantly. Skip the wait, 
              get the care you need when you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  Book Now
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-lg font-semibold text-lg border-red-300 text-red-600 hover:bg-red-50">
                <Phone className="w-5 h-5 mr-2" />
                Emergency: 108
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Doctors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">24/7</div>
              <div className="text-gray-600 dark:text-gray-300">Emergency Care</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">10k+</div>
              <div className="text-gray-600 dark:text-gray-300">Happy Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">4.8</div>
              <div className="text-gray-600 dark:text-gray-300">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Simple steps to book your appointment</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Sign In</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quick phone verification with OTP. No lengthy forms or complicated sign-ups.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Choose & Book</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select your preferred doctor, date and time slot. Get your queue number instantly.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Arrive</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Show up at your scheduled time. Skip the waiting room chaos with your confirmed slot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why Choose DocBook?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Save Time</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">No more waiting in long queues</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Guaranteed</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your slot is confirmed instantly</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">SMS Updates</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get confirmation on your phone</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Expert Care</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Qualified doctors across specialties</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Enhanced Booking Experience</h2>
          <p className="text-xl text-blue-100 mb-8">Now with more features for better healthcare management</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div>
              <Calendar className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Appointment Management</h3>
              <p className="text-blue-100">View, reschedule, and track all your appointments</p>
            </div>
            <div>
              <Clock className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Real-time Availability</h3>
              <p className="text-blue-100">See live slot availability and book instantly</p>
            </div>
            <div>
              <Star className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Rating & Reviews</h3>
              <p className="text-blue-100">Rate doctors and read patient reviews</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
