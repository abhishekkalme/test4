import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, MessageSquare, Users, TrendingUp, Download } from 'lucide-react';

const ChatAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalChats: 0,
    activeUsers: 0,
    commonQuestions: [],
    dailyUsage: [],
    topCategories: []
  });

  useEffect(() => {
    // Simulate analytics data - in a real app, this would come from your backend
    const mockAnalytics = {
      totalChats: 1247,
      activeUsers: 89,
      commonQuestions: [
        { question: "How do I download notes?", count: 156, category: "Notes" },
        { question: "Where can I find syllabus?", count: 134, category: "Syllabus" },
        { question: "How to reset password?", count: 98, category: "Account" },
        { question: "What are user roles?", count: 87, category: "Account" },
        { question: "How to upload materials?", count: 76, category: "Upload" }
      ],
      dailyUsage: [
        { date: "2025-01-15", chats: 45 },
        { date: "2025-01-16", chats: 67 },
        { date: "2025-01-17", chats: 89 },
        { date: "2025-01-18", chats: 123 },
        { date: "2025-01-19", chats: 98 },
        { date: "2025-01-20", chats: 156 },
        { date: "2025-01-21", chats: 134 }
      ],
      topCategories: [
        { category: "Notes", percentage: 35 },
        { category: "Syllabus", percentage: 28 },
        { category: "Account", percentage: 22 },
        { category: "Upload", percentage: 10 },
        { category: "General", percentage: 5 }
      ]
    };

    setAnalytics(mockAnalytics);
  }, []);

  const exportData = () => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🤖 AI Chat Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor chat usage, popular questions, and user engagement metrics
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Chats</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.totalChats.toLocaleString()}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-indigo-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.activeUsers}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Daily Chats</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(analytics.dailyUsage.reduce((sum, day) => sum + day.chats, 0) / analytics.dailyUsage.length)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={exportData}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Export Data
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Download analytics
              </p>
            </div>
            <Download className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Common Questions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Most Common Questions
          </h3>
          <div className="space-y-3">
            {analytics.commonQuestions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {item.question}
                  </p>
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                <span className="text-lg font-bold text-indigo-600">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Question Categories
          </h3>
          <div className="space-y-4">
            {analytics.topCategories.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="bg-indigo-600 h-2 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Chat Usage (Last 7 Days)
        </h3>
        <div className="flex items-end justify-between h-40 space-x-2">
          {analytics.dailyUsage.map((day, index) => {
            const maxChats = Math.max(...analytics.dailyUsage.map(d => d.chats));
            const height = (day.chats / maxChats) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="w-full bg-indigo-600 rounded-t-md min-h-[4px] flex items-end justify-center"
                >
                  <span className="text-xs text-white font-medium mb-1">
                    {day.chats}
                  </span>
                </motion.div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(day.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border border-indigo-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📊 Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <p className="font-medium text-gray-800 dark:text-gray-200">Most Active Day</p>
            <p className="text-gray-600 dark:text-gray-400">
              {analytics.dailyUsage.reduce((max, day) => day.chats > max.chats ? day : max, analytics.dailyUsage[0])?.date}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <p className="font-medium text-gray-800 dark:text-gray-200">Top Question Category</p>
            <p className="text-gray-600 dark:text-gray-400">
              {analytics.topCategories[0]?.category} ({analytics.topCategories[0]?.percentage}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAnalytics;