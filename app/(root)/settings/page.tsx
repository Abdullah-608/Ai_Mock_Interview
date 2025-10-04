'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette,
  Database,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RotateCcw
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Privacy Settings
    profileVisibility: 'private',
    showEmail: false,
    showStats: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    interviewReminders: true,
    weeklyReports: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    
    // Appearance Settings
    theme: 'dark',
    language: 'en',
    fontSize: 'medium',
    
    // Data Settings
    dataRetention: '1year',
    exportFormat: 'json',
    autoBackup: true
  });

  const handleSave = () => {
    // Save settings to backend
    console.log('Settings saved:', settings);
  };

  const handleReset = () => {
    // Reset to default settings
    setSettings({
      profileVisibility: 'private',
      showEmail: false,
      showStats: true,
      emailNotifications: true,
      pushNotifications: true,
      interviewReminders: true,
      weeklyReports: true,
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginNotifications: true,
      theme: 'dark',
      language: 'en',
      fontSize: 'medium',
      dataRetention: '1year',
      exportFormat: 'json',
      autoBackup: true
    });
  };

  const settingSections = [
    {
      title: 'Privacy & Profile',
      icon: User,
      settings: [
        {
          key: 'profileVisibility',
          label: 'Profile Visibility',
          description: 'Control who can see your profile',
          type: 'select',
          options: [
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
            { value: 'friends', label: 'Friends Only' }
          ]
        },
        {
          key: 'showEmail',
          label: 'Show Email Address',
          description: 'Display your email on your profile',
          type: 'toggle'
        },
        {
          key: 'showStats',
          label: 'Show Interview Statistics',
          description: 'Display your interview performance publicly',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive notifications via email',
          type: 'toggle'
        },
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive push notifications in browser',
          type: 'toggle'
        },
        {
          key: 'interviewReminders',
          label: 'Interview Reminders',
          description: 'Get reminded about upcoming interviews',
          type: 'toggle'
        },
        {
          key: 'weeklyReports',
          label: 'Weekly Progress Reports',
          description: 'Receive weekly summaries of your progress',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      settings: [
        {
          key: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'toggle'
        },
        {
          key: 'sessionTimeout',
          label: 'Session Timeout (minutes)',
          description: 'Automatically log out after inactivity',
          type: 'select',
          options: [
            { value: 15, label: '15 minutes' },
            { value: 30, label: '30 minutes' },
            { value: 60, label: '1 hour' },
            { value: 120, label: '2 hours' }
          ]
        },
        {
          key: 'loginNotifications',
          label: 'Login Notifications',
          description: 'Get notified of new login attempts',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      settings: [
        {
          key: 'theme',
          label: 'Theme',
          description: 'Choose your preferred color scheme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto' }
          ]
        },
        {
          key: 'language',
          label: 'Language',
          description: 'Select your preferred language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' }
          ]
        },
        {
          key: 'fontSize',
          label: 'Font Size',
          description: 'Adjust the text size for better readability',
          type: 'select',
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ]
        }
      ]
    },
    {
      title: 'Data & Privacy',
      icon: Database,
      settings: [
        {
          key: 'dataRetention',
          label: 'Data Retention Period',
          description: 'How long to keep your interview data',
          type: 'select',
          options: [
            { value: '6months', label: '6 months' },
            { value: '1year', label: '1 year' },
            { value: '2years', label: '2 years' },
            { value: 'forever', label: 'Forever' }
          ]
        },
        {
          key: 'exportFormat',
          label: 'Export Format',
          description: 'Default format for data exports',
          type: 'select',
          options: [
            { value: 'json', label: 'JSON' },
            { value: 'csv', label: 'CSV' },
            { value: 'pdf', label: 'PDF' }
          ]
        },
        {
          key: 'autoBackup',
          label: 'Automatic Backup',
          description: 'Automatically backup your data weekly',
          type: 'toggle'
        }
      ]
    }
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center">
              <Settings className="w-12 h-12 mr-4" />
              Settings
            </h1>
            <p className="text-xl text-gray-300">
              Customize your PrepWise experience
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset to Defaults</span>
            </motion.button>
          </motion.div>

          {/* Settings Sections */}
          <div className="space-y-8">
            {settingSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + sectionIndex * 0.1 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.settings.map((setting, settingIndex) => (
                    <motion.div
                      key={setting.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + sectionIndex * 0.1 + settingIndex * 0.05 }}
                      className="space-y-2"
                    >
                      <label className="block text-white font-medium">
                        {setting.label}
                      </label>
                      <p className="text-gray-400 text-sm mb-3">
                        {setting.description}
                      </p>
                      
                      {setting.type === 'toggle' ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[setting.key as keyof typeof settings] as boolean}
                            onChange={(e) => setSettings({
                              ...settings,
                              [setting.key]: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      ) : (
                        <select
                          value={settings[setting.key as keyof typeof settings] as string}
                          onChange={(e) => setSettings({
                            ...settings,
                            [setting.key]: e.target.value
                          })}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                          {setting.options?.map((option) => (
                            <option key={option.value} value={option.value} className="bg-gray-800">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-lg rounded-2xl p-8 border border-red-500/20 shadow-2xl"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Danger Zone</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-white font-medium">
                  Export Data
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  Download all your interview data and progress
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </motion.button>
              </div>

              <div className="space-y-2">
                <label className="block text-white font-medium">
                  Delete Account
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  Permanently delete your account and all data
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
