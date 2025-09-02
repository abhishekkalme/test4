// Chat service for handling AI responses and conversation management
import { GoogleGenerativeAI } from '@google/generative-ai';

class ChatService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initializeAI();
  }

  initializeAI() {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey && apiKey !== 'demo-key') {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      }
    } catch (error) {
      console.error('Failed to initialize AI:', error);
    }
  }

  async generateResponse(userMessage, userContext = {}) {
    // Fallback responses if AI is not available
    const fallbackResponses = {
      'how do i download notes': 'To download notes: 1) Go to Notes section 2) Select your branch and year 3) Choose the subject 4) Click on the unit you need 5) Click "Download Notes" button.',
      'where can i find syllabus': 'You can find the syllabus in the "Syllabus" section from the main navigation. Use the filters to select your program, branch, and semester.',
      'how to upload': 'Only admins can upload materials. If you\'re an admin, go to Admin Dashboard > Upload Notes and fill in the required details.',
      'forgot password': 'Click on "Forgot Password?" on the login page, enter your email, and follow the reset instructions sent to your email.',
      'user roles': 'There are 3 user roles: Student (can view/download content), Teacher (can view content), and Admin (can upload and manage content).',
      'default': 'I can help you with questions about downloading notes, finding syllabus, user roles, password reset, and platform navigation. What would you like to know?'
    };

    // If AI is not available, use fallback
    if (!this.model) {
      const key = userMessage.toLowerCase();
      for (const [keyword, response] of Object.entries(fallbackResponses)) {
        if (key.includes(keyword)) {
          return response;
        }
      }
      return fallbackResponses.default;
    }

    try {
      const prompt = this.buildPrompt(userMessage, userContext);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Generation Error:', error);
      return "I'm having trouble processing your request right now. Please try rephrasing your question or contact our support team.";
    }
  }

  buildPrompt(userMessage, userContext) {
    return `You are an AI assistant for JIT Learning Management System, an educational platform for engineering students.

Platform Context:
- Engineering branches: CSE, ECE, ME, CE, EE
- Features: Notes download, syllabus viewing, PDF materials, unit-wise content
- User roles: Student, Teacher, Admin
- Current user: ${userContext.name || 'Guest'} (${userContext.role || 'Not logged in'})

Platform Features:
- Notes: Organized by branch → year → semester → subject → unit
- Syllabus: Filterable by program, system type, grading system
- Admin functions: Upload notes, manage syllabus, user management
- Authentication: Email/password and Google OAuth

Guidelines:
- Be helpful, concise, and educational
- For platform questions, provide step-by-step guidance
- For academic questions, offer study tips and learning strategies
- If unsure about specific platform details, suggest contacting support
- Keep responses under 150 words
- Use a friendly, supportive tone

User question: "${userMessage}"

Provide a helpful response:`;
  }

  // Predefined quick responses for common questions
  getQuickResponses() {
    return [
      {
        question: "How do I download notes?",
        answer: "Navigate to Notes → Select your branch → Choose year → Pick semester → Select subject → Click on the unit → Download PDF. Make sure you're logged in!"
      },
      {
        question: "Where is the syllabus?",
        answer: "Go to the 'Syllabus' section in the main navigation. Use the filters to select your program (B.Tech, MCA, etc.), system type, and grading system to find your specific syllabus."
      },
      {
        question: "How to upload materials?",
        answer: "Only admins can upload materials. If you're an admin, go to Admin Dashboard → Upload Notes, then fill in branch, year, semester, subject, and unit details before uploading the PDF."
      },
      {
        question: "What are user roles?",
        answer: "Student: Can view and download content. Teacher: Can view content and may have additional permissions. Admin: Can upload, manage content, and handle user roles."
      },
      {
        question: "Forgot my password?",
        answer: "On the login page, click 'Forgot Password?', enter your registered email, and check your inbox for a reset link. The link is valid for 15 minutes."
      }
    ];
  }
}

export default new ChatService();