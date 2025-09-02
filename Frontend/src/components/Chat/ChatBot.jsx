import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Clock } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI learning assistant. I can help you with academic questions, study tips, and platform navigation. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useContext(AuthContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage) => {
    try {
      // Initialize Gemini AI (you'll need to add your API key to .env)
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'demo-key');
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `You are an AI assistant for JIT Learning Management System, an educational platform for engineering students. 
      
      Context about the platform:
      - It's designed for engineering students (CSE, ECE, ME, CE, EE branches)
      - Provides notes, syllabus, and study materials
      - Has features like PDF downloads, unit-wise content, previous year questions
      - Users can be students, teachers, or admins
      - Current user: ${user?.name || 'Guest'} (Role: ${user?.role || 'Not logged in'})
      
      Guidelines for responses:
      - Be helpful, friendly, and educational
      - Keep responses concise but informative
      - If asked about platform features, explain them clearly
      - For academic questions, provide study guidance
      - If you don't know something specific about the platform, suggest contacting support
      - Use emojis sparingly but appropriately
      
      User question: "${userMessage}"
      
      Provide a helpful response:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Response Error:', error);
      return "I'm having trouble connecting right now. Please try asking your question again, or contact our support team for assistance.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm experiencing technical difficulties. Please try again later or contact support.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How do I download notes?",
    "Where can I find the syllabus?",
    "How to upload study materials?",
    "What are the different user roles?",
    "How to reset my password?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot size={20} />
                <span className="font-semibold">AI Learning Assistant</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Online</span>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
                      {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-200 dark:border-gray-600'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <Bot size={16} className="text-gray-700 dark:text-gray-300" />
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-md border border-gray-200 dark:border-gray-600">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2 py-1 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question..."
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                  disabled={isTyping}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;