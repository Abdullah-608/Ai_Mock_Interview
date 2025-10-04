'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Target, 
  TrendingUp,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Globe,
  Settings
} from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 2024',
    totalInterviews: 24,
    successRate: 85,
    averageScore: 8.2,
    preferredLanguage: 'English',
    notifications: true,
    publicProfile: false,
    twoFactor: false
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  const particlePositions = [
    { left: 10, top: 20 },
    { left: 80, top: 30 },
    { left: 30, top: 70 },
    { left: 90, top: 80 },
    { left: 15, top: 90 },
    { left: 70, top: 15 },
    { left: 50, top: 60 },
    { left: 25, top: 40 },
    { left: 85, top: 50 },
    { left: 40, top: 10 }
  ];

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the data to your backend
  };

  const stats = [
    { label: 'Total Interviews', value: userData.totalInterviews, icon: Target, color: 'from-blue-500 to-blue-600' },
    { label: 'Success Rate', value: `${userData.successRate}%`, icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { label: 'Average Score', value: userData.averageScore, icon: Award, color: 'from-purple-500 to-purple-600' },
    { label: 'Member Since', value: userData.joinDate, icon: Calendar, color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -inset-10 opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.3), transparent 50%)`,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
        
        {mounted && particlePositions.map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + (i * 0.2),
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Profile
            </h1>
            <p className="text-xl text-gray-300">
              Manage your account settings and view your progress
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold ring-4 ring-purple-500/30">
                      {userData.name[0]}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {userData.name}
                  </h2>
                  <p className="text-gray-300 mb-6">{userData.email}</p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                  >
                    {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Stats and Settings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Settings */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Settings className="w-6 h-6 mr-3" />
                  Account Settings
                </h3>

                <div className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={userData.name}
                          onChange={(e) => setUserData({...userData, name: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Preferred Language
                        </label>
                        <select
                          value={userData.preferredLanguage}
                          onChange={(e) => setUserData({...userData, preferredLanguage: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </select>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-white font-medium">Email Notifications</p>
                            <p className="text-gray-400 text-sm">Receive updates about your interviews</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userData.notifications}
                            onChange={(e) => setUserData({...userData, notifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-white font-medium">Public Profile</p>
                            <p className="text-gray-400 text-sm">Make your profile visible to others</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userData.publicProfile}
                            onChange={(e) => setUserData({...userData, publicProfile: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-white font-medium">Two-Factor Authentication</p>
                            <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userData.twoFactor}
                            onChange={(e) => setUserData({...userData, twoFactor: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
