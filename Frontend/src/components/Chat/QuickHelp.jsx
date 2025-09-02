import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const QuickHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I download notes?",
      answer: "To download notes: 1) Navigate to the Notes section 2) Select your branch (CSE, ECE, etc.) 3) Choose your year 4) Pick the semester 5) Select the subject 6) Click on the specific unit 7) Click 'Download Notes' button. Make sure you're logged in to access this feature.",
      category: "Notes"
    },
    {
      id: 2,
      question: "Where can I find the syllabus?",
      answer: "The syllabus is available in the 'Syllabus' section from the main navigation menu. You can filter by program (B.Tech, MCA), system type (Semester/Annual), and grading system (CBCS, CBGS, etc.) to find your specific syllabus documents.",
      category: "Syllabus"
    },
    {
      id: 3,
      question: "How do I upload study materials?",
      answer: "Only users with admin privileges can upload materials. If you're an admin: 1) Go to Admin Dashboard 2) Click 'Upload Notes' 3) Fill in all required fields (branch, year, semester, subject, unit) 4) Select your PDF file 5) Click upload. The system will organize it automatically.",
      category: "Upload"
    },
    {
      id: 4,
      question: "What are the different user roles?",
      answer: "There are three user roles: Student (can view and download content), Teacher (can view content with potential additional permissions), and Admin (can upload materials, manage syllabus, and handle user roles).",
      category: "Account"
    },
    {
      id: 5,
      question: "How do I reset my password?",
      answer: "On the login page, click 'Forgot Password?', enter your registered email address, and check your inbox for a reset link. The reset link is valid for 15 minutes. Follow the instructions in the email to set a new password.",
      category: "Account"
    },
    {
      id: 6,
      question: "Why can't I access certain features?",
      answer: "Some features require you to be logged in. If you're logged in but still can't access certain features, it might be due to your user role. Admin-only features include uploading notes and managing syllabus.",
      category: "Access"
    },
    {
      id: 7,
      question: "How do I change my user role?",
      answer: "User roles can only be changed by administrators. If you need a role change, contact an admin through the contact form or email support. Admins can modify roles through the Admin Dashboard > User Roles section.",
      category: "Account"
    },
    {
      id: 8,
      question: "What file formats are supported for uploads?",
      answer: "Currently, the platform supports PDF files only for notes and study materials. Make sure your files are in PDF format before uploading. The system automatically organizes uploads by branch, year, semester, subject, and unit.",
      category: "Upload"
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <>
      {/* Quick Help Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
      >
        <HelpCircle size={24} />
      </motion.button>

      {/* Quick Help Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 left-6 z-40 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-600 text-white p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <HelpCircle size={20} />
                  <span className="font-semibold">Quick Help</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search help topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white/20 border border-white/30 rounded-lg placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            {/* FAQ Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
              {filteredFAQs.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  No help topics found for "{searchTerm}"
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredFAQs.map((faq) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div>
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                            {faq.category}
                          </span>
                          <p className="font-medium text-gray-800 dark:text-gray-200 mt-2 text-sm">
                            {faq.question}
                          </p>
                        </div>
                        {expandedFAQ === faq.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      
                      <AnimatePresence>
                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-gray-200 dark:border-gray-600"
                          >
                            <div className="p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Still need help? <a href="/contact-us" className="text-green-600 hover:underline">Contact Support</a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickHelp;