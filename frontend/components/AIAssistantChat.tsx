import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Loader, AlertCircle, CheckCircle, Copy, Bot, User, Zap } from 'lucide-react';
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
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const getInitialMessage = (type: string) => {
    const prompts: Record<string, string> = {
      resume_tailoring: `I'm your Resume Tailoring Assistant! 📄 I'll help you optimize your resume for specific job descriptions. I can:\n• Identify key skills and keywords to emphasize\n• Reword your experiences to match job requirements\n• Suggest which experiences to highlight\n• Generate compelling bullet points\n\nUpload your resume and job description to get started!`,
      gap_analysis: `I'm your Career Gap Analyzer! 🎯 I'll help you understand what skills you need for your target role. I can:\n• Identify gaps between your skills and job requirements\n• Suggest specific learning resources and certifications\n• Provide realistic timelines for skill development\n• Recommend alternative roles where your skills shine\n\nLet's analyze what you need to succeed!`,
      interview_prep: `I'm your Interview Coach! 🎤 I'll help you prepare for interviews with confidence. I can:\n• Generate likely interview questions for your target role\n• Provide answer suggestions based on your resume\n• Create technical challenges and hints for tech roles\n• Teach you the STAR method for behavioral questions\n\nShare your target role and let's get you ready!`,
      general: `I'm your AI Career Assistant! 🚀 I'm here to help with:\n• Resume optimization and tailoring\n• Interview preparation\n• Skill gap analysis\n• Career planning and advice\n\nHow can I help you advance your career today?`,
    };
    return prompts[type] || prompts.general;
  };

  // Health check
  useEffect(() => {
    axios
      .get(`${API_URL}/api/v1/ai-assistant/health`, { timeout: 5000 })
      .then((r) => setOllamaStatus(r.data?.status === 'healthy' ? 'online' : 'offline'))
      .catch(() => setOllamaStatus('offline'));
  }, [API_URL]);

  // Init message
  useEffect(() => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: getInitialMessage(featureType),
        timestamp: new Date(),
      },
    ]);
  }, [featureType]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

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
          .map((msg) => ({ role: msg.role, content: msg.content }))
          .concat({ role: 'user', content: input }),
        feature_type: featureType,
        resume_text: resumeText,
        job_description: jobDescription,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.detail
          ? err.response.data.detail
          : 'Failed to get response. Please check Ollama is running.';
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ ${errorMessage}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatMessage = (content: string) =>
    content.split('\n').map((line, idx) => {
      if (line.startsWith('•') || line.startsWith('-'))
        return (
          <div key={idx} className="flex gap-1.5 ml-1 mb-1">
            <span className="text-primary-500 font-bold flex-shrink-0">•</span>
            <span className="text-sm leading-relaxed text-gray-700">{line.replace(/^[•\-]\s*/, '')}</span>
          </div>
        );
      if (/^\d+\./.test(line.trim()))
        return (
          <div key={idx} className="flex gap-1.5 ml-1 mb-1">
            <span className="text-primary-600 font-semibold text-sm flex-shrink-0">
              {line.match(/^\d+\./)?.[0]}
            </span>
            <span className="text-sm leading-relaxed text-gray-700">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      if (line.trim() === '') return <div key={idx} className="h-2" />;
      return (
        <p key={idx} className="text-sm leading-relaxed text-gray-700 mb-1">
          {line}
        </p>
      );
    });

  const statusConfig = {
    checking: { dot: 'bg-yellow-400', label: 'Connecting…' },
    online:   { dot: 'bg-green-500',  label: 'Ollama · Mistral 7B' },
    offline:  { dot: 'bg-red-500',    label: 'Offline — run ollama serve' },
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      {/* ── Header ── */}
      <div className="bg-primary-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">AI Career Assistant</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusConfig[ollamaStatus].dot}`}
              />
              <span className="text-xs text-white/80">{statusConfig[ollamaStatus].label}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-lg">
            <Zap className="w-3 h-3 text-yellow-300" />
            <span className="text-xs text-white/90 font-medium">Local AI</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/15 rounded-lg p-1.5 transition"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={clsx('flex gap-3', {
              'justify-end': message.role === 'user',
              'justify-start': message.role === 'assistant',
            })}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={clsx(
                'max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-3 break-words shadow-sm',
                {
                  'bg-primary-600 text-white rounded-br-sm': message.role === 'user',
                  'bg-white text-gray-800 rounded-bl-sm border border-gray-200': message.role === 'assistant',
                }
              )}
            >
              {message.role === 'assistant' ? (
                <div>{formatMessage(message.content)}</div>
              ) : (
                <p className="text-sm leading-relaxed">{message.content}</p>
              )}

              <div
                className={clsx('flex items-center gap-2 mt-2', {
                  'justify-end': message.role === 'user',
                  'justify-start': message.role === 'assistant',
                })}
              >
                <span className={clsx('text-xs', {
                  'text-white/60': message.role === 'user',
                  'text-gray-400': message.role === 'assistant',
                })}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(message.content, index)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600 transition"
                  >
                    <Copy size={11} />
                    {copiedIndex === index ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm">
              <Loader size={14} className="animate-spin text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-4">
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex gap-2 items-start bg-red-50 border border-red-200 rounded-xl p-3">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {messages.length === 1 && ollamaStatus === 'online' && (
          <div className="flex gap-2 items-start bg-green-50 border border-green-200 rounded-xl p-3">
            <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">
              Ollama is running locally — your data stays private. Start chatting!
            </p>
          </div>
        )}

        {messages.length === 1 && ollamaStatus === 'offline' && (
          <div className="flex gap-2 items-start bg-amber-50 border border-amber-200 rounded-xl p-3">
            <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              Ollama is not running. Start it with{' '}
              <code className="bg-amber-100 px-1 rounded font-mono">ollama serve</code> then reload.
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              ollamaStatus === 'offline'
                ? 'Start Ollama to chat...'
                : 'Ask about your resume, interview, or career...'
            }
            disabled={loading || ollamaStatus === 'offline'}
            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || ollamaStatus === 'offline'}
            className="btn-primary rounded-xl px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold text-sm"
          >
            {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
            <span className="hidden sm:inline">{loading ? 'Thinking...' : 'Send'}</span>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Powered by Ollama · Mistral 7B · Runs locally, 100% private
        </p>
      </form>
    </div>
  );
};

export default AIAssistantChat;
