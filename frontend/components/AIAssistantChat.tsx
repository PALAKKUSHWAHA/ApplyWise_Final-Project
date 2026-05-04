import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Loader, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import clsx from 'clsx';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatProps {
  resumeText?: string;
  jobDescription?: string;
  featureType?: 'resume_tailoring' | 'gap_analysis' | 'interview_prep' | 'general';
  onClose?: () => void;
}

const AIAssistantChat: React.FC<ChatProps> = ({
  resumeText = '',
  jobDescription = '',
  featureType = 'general',
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // System prompts for different feature types
  const getInitialMessage = (type: string) => {
    const prompts = {
      resume_tailoring: `I'm your Resume Tailoring Assistant! 📄 I'll help you optimize your resume for specific job descriptions. I can:
• Identify key skills and keywords to emphasize
• Reword your experiences to match job requirements
• Suggest which experiences to highlight
• Generate compelling bullet points

Upload your resume and job description to get started, or ask me questions about tailoring your resume!`,

      gap_analysis: `I'm your Career Gap Analyzer! 🎯 I'll help you understand what skills you need to develop for your target role. I can:
• Identify gaps between your skills and job requirements
• Suggest specific learning resources and certifications
• Provide realistic timelines for skill development
• Recommend alternative roles where your skills are valuable

Let's analyze what you need to succeed in your target role!`,

      interview_prep: `I'm your Interview Coach! 🎤 I'll help you prepare for interviews with confidence. I can:
• Generate likely interview questions for your target role
• Provide answer suggestions based on your resume
• Create technical challenges and hints for tech roles
• Teach you the STAR method for behavioral questions

Share your target role and let's prepare you to ace that interview!`,

      general: `I'm your AI Career Assistant! 🚀 I'm here to help with:
• Resume optimization and tailoring
• Interview preparation
• Skill gap analysis
• Career planning and advice

How can I help you advance your career today?`,
    };

    return prompts[type as keyof typeof prompts] || prompts.general;
  };

  // Initialize with system message
  useEffect(() => {
    const systemMessage: Message = {
      id: '0',
      role: 'assistant',
      content: getInitialMessage(featureType),
      timestamp: new Date(),
    };
    setMessages([systemMessage]);
  }, [featureType]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/v1/ai-assistant/chat`, {
        messages: messages
          .filter((msg) => msg.id !== '0')
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }))
          .concat({ role: 'user', content: input }),
        feature_type: featureType,
        resume_text: resumeText,
        job_description: jobDescription,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.detail
          ? err.response.data.detail
          : 'Failed to get response. Please try again.';

      setError(errorMessage);
      console.error('Chat error:', err);

      // Add error message to chat
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I encountered an error: ${errorMessage}. Please check your API configuration and try again.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatMessage = (content: string) => {
    // Split by numbered lists and format
    const parts = content.split(/(?=\d+\.)/);
    return parts.map((part, idx) => {
      if (/^\d+\./.test(part.trim())) {
        return (
          <div key={idx} className="mb-2">
            <p className="text-sm leading-relaxed">{part.trim()}</p>
          </div>
        );
      }
      return (
        <p key={idx} className="text-sm leading-relaxed">
          {part.trim()}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">AI Career Assistant</h3>
          <p className="text-sm text-blue-100">Powered by Advanced LLM</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-600 rounded-full p-2 transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={clsx('flex gap-3 animate-fadeIn', {
              'justify-end': message.role === 'user',
              'justify-start': message.role === 'assistant',
            })}
          >
            {/* Avatar */}
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={clsx(
                'max-w-xs lg:max-w-md xl:max-w-lg rounded-lg p-3 text-sm break-words',
                {
                  'bg-blue-600 text-white': message.role === 'user',
                  'bg-white text-gray-800 border border-gray-200': message.role === 'assistant',
                }
              )}
            >
              {message.role === 'assistant' ? formatMessage(message.content) : message.content}

              {/* Copy button for assistant messages */}
              {message.role === 'assistant' && (
                <button
                  onClick={() => copyToClipboard(message.content, index)}
                  className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition"
                >
                  <Copy size={12} />
                  {copiedIndex === index ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            {/* User Avatar */}
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <Loader size={16} className="animate-spin" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">Thinking...</p>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="flex gap-2 items-start bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* API Health Check */}
        {messages.length === 1 && (
          <div className="flex gap-2 items-start bg-green-50 border border-green-200 rounded-lg p-3">
            <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">AI Assistant is ready. Start asking questions!</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="border-t bg-white p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your career, resume, or interview prep..."
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg px-4 py-2 transition flex items-center gap-2"
          >
            {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAssistantChat;
