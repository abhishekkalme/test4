import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2, MessageSquare } from 'lucide-react';

const ChatHistory = ({ isVisible, onClose }) => {
  const [chatSessions, setChatSessions] = useState([]);

  useEffect(() => {
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatSessions(JSON.parse(savedHistory));
    }
  }, []);

  const saveChatSession = (messages) => {
    const session = {
      id: Date.now(),
      timestamp: new Date(),
      messages: messages.slice(1), // Remove the initial bot message
      preview: messages[messages.length - 1]?.text.substring(0, 50) + '...' || 'New conversation'
    };

    const updatedSessions = [session, ...chatSessions.slice(0, 9)]; // Keep last 10 sessions
    setChatSessions(updatedSessions);
    localStorage.setItem('chatHistory', JSON.stringify(updatedSessions));
  };

  const clearHistory = () => {
    setChatSessions([]);
    localStorage.removeItem('chatHistory');
  };

  const deleteSession = (sessionId) => {
    const updated = chatSessions.filter(session => session.id !== sessionId);
    setChatSessions(updated);
    localStorage.setItem('chatHistory', JSON.stringify(updated));
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-full right-0 mb-4 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
          <Clock size={16} className="mr-2" />
          Chat History
        </h3>
        {chatSessions.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {chatSessions.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chat history yet</p>
          </div>
        ) : (
          <div className="p-2">
            {chatSessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                      {session.preview}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(session.timestamp).toLocaleDateString()} at{' '}
                      {new Date(session.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatHistory;