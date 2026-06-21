import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Loader, Bot, User, Copy, CheckCircle, AlertCircle,
  Sparkles, FileText, X, Download, RotateCcw, MessageSquare,
  FileOutput, ChevronRight, Zap, Lock, Upload, FileSearch,
  Target, TrendingUp, Award, ChevronDown, Eye,
} from 'lucide-react';
import clsx from 'clsx';

/* ────────────────────────────── types ─────────────────────────────────── */
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ATSReport {
  ats_score: number;
  keyword_match_pct: number;
  matched_skills: string[];
  missing_skills: string[];
  transferable_skills: string[];
  recruiter_feedback: string;
  strength_areas: string[];
  improvement_suggestions: string[];
  optimization_mode: string;
}

type ActiveMode = 'chat' | 'cv';
type CVSubTab = 'quick' | 'ats';

interface HomeAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
    : 'http://localhost:8000';

/* ─────────────────────────── helpers ───────────────────────────────────── */
function downloadBase64(b64: string, filename: string, mime: string) {
  const byteChars = atob(b64);
  const byteNums = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
  const blob = new Blob([new Uint8Array(byteNums)], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ScoreBadge({ value, label }: { value: number; label: string }) {
  const color =
    value >= 85 ? 'bg-green-100 text-green-700 border-green-200' :
    value >= 70 ? 'bg-primary-100 text-primary-700 border-primary-200' :
    value >= 55 ? 'bg-amber-100 text-amber-700 border-amber-200' :
    'bg-red-100 text-red-700 border-red-200';
  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${color}`}>
      <p className="text-2xl font-black">{value}%</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  );
}

/* ─────────────────────── CV Viewer (Quick CV) ──────────────────────────── */
function CVViewer({ cv, onClose }: { cv: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const cvContent = cv.includes('===== CV START =====')
    ? cv.split('===== CV START =====')[1]?.split('===== CV END =====')[0]?.trim() || cv
    : cv;

  const handleCopy = () => { navigator.clipboard.writeText(cvContent); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleDownload = () => {
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'custom_cv.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
      className="absolute inset-0 bg-white z-10 flex flex-col rounded-l-3xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-primary-600 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileOutput className="w-4 h-4 text-white" />
          <span className="font-bold text-white text-sm">Your Custom CV</span>
          <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">AI Generated</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg transition font-medium">
            {copied ? <CheckCircle size={12} /> : <Copy size={12} />}{copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1.5 text-xs bg-white text-primary-600 hover:bg-primary-50 px-2.5 py-1.5 rounded-lg transition font-semibold">
            <Download size={12} />Download .txt
          </button>
          <button onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"><X size={14} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <pre className="whitespace-pre-wrap font-mono text-xs text-gray-800 leading-relaxed bg-white rounded-xl p-4 border border-gray-200 shadow-sm">{cvContent}</pre>
      </div>
    </motion.div>
  );
}

/* ──────────────────────── ATS Results Panel ─────────────────────────────── */
function ATSResultsPanel({
  optimizedResume, atsReport, candidateName, docxB64, pdfB64, onReset,
}: {
  optimizedResume: string; atsReport: ATSReport; candidateName: string;
  docxB64: string; pdfB64: string; onReset: () => void;
}) {
  const [showResume, setShowResume] = useState(false);
  const [copiedResume, setCopiedResume] = useState(false);

  const copyResume = () => { navigator.clipboard.writeText(optimizedResume); setCopiedResume(true); setTimeout(() => setCopiedResume(false), 2000); };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Resume Preview Overlay */}
      <AnimatePresence>
        {showResume && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-10 flex flex-col rounded-l-3xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-primary-600 flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-white" />
                <span className="font-bold text-white text-sm">ATS Optimized Resume</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyResume} className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg transition font-medium">
                  {copiedResume ? <CheckCircle size={12} /> : <Copy size={12} />}{copiedResume ? 'Copied!' : 'Copy'}
                </button>
                {docxB64 && (
                  <button onClick={() => downloadBase64(docxB64, `${candidateName}_ATS_Resume.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
                    className="flex items-center gap-1.5 text-xs bg-white text-primary-600 hover:bg-primary-50 px-2.5 py-1.5 rounded-lg transition font-semibold">
                    <Download size={12} />DOCX
                  </button>
                )}
                {pdfB64 && (
                  <button onClick={() => downloadBase64(pdfB64, `${candidateName}_ATS_Resume.pdf`, 'application/pdf')}
                    className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 rounded-lg transition font-semibold">
                    <Download size={12} />PDF
                  </button>
                )}
                <button onClick={() => setShowResume(false)} className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"><X size={14} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <pre className="whitespace-pre-wrap font-mono text-xs text-gray-800 leading-relaxed bg-white rounded-xl p-4 border border-gray-200 shadow-sm">{optimizedResume}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 space-y-4">
        {/* Success header */}
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-green-800 text-sm">Resume Optimized! 🎉</p>
            <p className="text-xs text-green-600">ATS-ready resume generated for {candidateName}</p>
          </div>
        </div>

        {/* ATS Score row */}
        <div className="grid grid-cols-2 gap-3">
          <ScoreBadge value={Math.min(100, Math.round(atsReport.ats_score || 0))} label="ATS Score" />
          <ScoreBadge value={Math.min(100, Math.round(atsReport.keyword_match_pct || 0))} label="Keyword Match" />
        </div>

        {/* Download buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setShowResume(true)}
            className="flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 text-xs font-bold transition shadow-sm">
            <Eye size={13} />View Resume
          </button>
          {docxB64 && (
            <button onClick={() => downloadBase64(docxB64, `${candidateName}_ATS_Resume.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
              className="flex items-center justify-center gap-1.5 bg-primary-50 border border-primary-300 text-primary-700 hover:bg-primary-100 rounded-xl py-2.5 text-xs font-bold transition">
              <Download size={13} />DOCX
            </button>
          )}
          {pdfB64 && (
            <button onClick={() => downloadBase64(pdfB64, `${candidateName}_ATS_Resume.pdf`, 'application/pdf')}
              className="flex items-center justify-center gap-1.5 bg-green-50 border border-green-300 text-green-700 hover:bg-green-100 rounded-xl py-2.5 text-xs font-bold transition">
              <Download size={13} />PDF
            </button>
          )}
        </div>

        {/* ATS Report card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-primary-50 border-b border-primary-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary-600" />
            <h4 className="font-bold text-primary-900 text-sm">ATS Report</h4>
            <span className="ml-auto text-[10px] text-primary-600 bg-primary-100 border border-primary-200 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
              {atsReport.optimization_mode} mode
            </span>
          </div>
          <div className="p-4 space-y-3">
            {/* Recruiter feedback */}
            {atsReport.recruiter_feedback && (
              <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                💬 {atsReport.recruiter_feedback}
              </p>
            )}

            {/* Matched skills */}
            {atsReport.matched_skills?.length > 0 && (
              <div>
                <p className="text-[10px] text-green-700 font-bold uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <CheckCircle size={10} />Matched Skills ({atsReport.matched_skills.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {atsReport.matched_skills.slice(0, 12).map((s) => (
                    <span key={s} className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing skills */}
            {atsReport.missing_skills?.length > 0 && (
              <div>
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <AlertCircle size={10} />Missing Skills ({atsReport.missing_skills.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {atsReport.missing_skills.slice(0, 10).map((s) => (
                    <span key={s} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement suggestions */}
            {atsReport.improvement_suggestions?.length > 0 && (
              <div>
                <p className="text-[10px] text-primary-700 font-bold uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <TrendingUp size={10} />Suggestions
                </p>
                <ul className="space-y-1">
                  {atsReport.improvement_suggestions.slice(0, 4).map((s, i) => (
                    <li key={i} className="flex gap-1.5 text-[10px] text-gray-600">
                      <span className="text-primary-400 flex-shrink-0">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Reset button */}
        <button onClick={onReset}
          className="w-full btn-secondary rounded-xl py-2.5 text-xs font-medium flex items-center justify-center gap-1.5">
          <RotateCcw size={12} />Optimize Another Resume
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────── Main Drawer ────────────────────────────────── */
export default function HomeAIAssistant({ isOpen, onClose }: HomeAIAssistantProps) {
  /* ── Top-level tab state ── */
  const [mode, setMode] = useState<ActiveMode>('chat');
  const [cvSubTab, setCvSubTab] = useState<CVSubTab>('quick');

  /* ── Chat state ── */
  const [messages, setMessages] = useState<Message[]>([{
    id: '0', role: 'assistant', timestamp: new Date(),
    content: `Hi! I'm your AI Career Assistant 🚀 powered by Ollama (Mistral 7B).\n\nI can help you with:\n• Resume tips & optimization\n• Interview preparation\n• Career advice & planning\n• Skill gap analysis\n• Generate a custom CV for any job\n\nWhat would you like help with today?`,
  }]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  /* ── Quick CV state ── */
  const [quickCvMode, setQuickCvMode] = useState<'form' | 'generating' | 'done'>('form');
  const [jobDesc, setJobDesc] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [baseResume, setBaseResume] = useState('');
  const [generatedCV, setGeneratedCV] = useState('');
  const [showCVViewer, setShowCVViewer] = useState(false);

  /* ── ATS Optimizer state ── */
  const [atsMode, setAtsMode] = useState<'form' | 'parsing' | 'optimizing' | 'done'>('form');
  const [atsResumeFile, setAtsResumeFile] = useState<File | null>(null);
  const [atsJobDesc, setAtsJobDesc] = useState('');
  const [atsOptMode, setAtsOptMode] = useState<'aggressive' | 'standard'>('aggressive');
  const [atsOutputDocx, setAtsOutputDocx] = useState(true);
  const [atsOutputPdf, setAtsOutputPdf] = useState(true);
  const [atsResult, setAtsResult] = useState<{
    optimizedResume: string; atsReport: ATSReport;
    candidateName: string; docxB64: string; pdfB64: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  /* ── Shared ── */
  const [ollamaOnline, setOllamaOnline] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Health check */
  useEffect(() => {
    if (!isOpen) return;
    axios.get(`${API_URL}/api/v1/ai-assistant/health`, { timeout: 4000 })
      .then(r => setOllamaOnline(r.data?.status === 'healthy'))
      .catch(() => setOllamaOnline(false));
  }, [isOpen]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (isOpen && mode === 'chat') setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen, mode]);

  /* Clear errors when switching sub-tabs */
  useEffect(() => { setError(null); }, [cvSubTab, mode]);

  /* ── Send Chat ── */
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setError(null);
    setChatLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/v1/ai-assistant/chat`, {
        messages: [
          ...messages.filter(m => m.id !== '0').map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: input },
        ],
        feature_type: 'general',
      });
      setMessages(p => [...p, { id: (Date.now() + 1).toString(), role: 'assistant', content: res.data.response, timestamp: new Date() }]);
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.detail ? err.response.data.detail : 'Could not reach the AI. Make sure Ollama is running.';
      setMessages(p => [...p, { id: (Date.now() + 1).toString(), role: 'assistant', content: `⚠️ ${msg}`, timestamp: new Date() }]);
    } finally { setChatLoading(false); inputRef.current?.focus(); }
  };

  /* ── Quick CV ── */
  const handleGenerateQuickCV = async () => {
    if (!jobDesc.trim()) return;
    setQuickCvMode('generating');
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/api/v1/ai-assistant/generate-cv`, {
        job_description: jobDesc, user_name: userName || 'Your Name',
        user_email: userEmail || 'your@email.com', base_resume: baseResume,
      });
      setGeneratedCV(res.data.cv);
      setQuickCvMode('done');
      setShowCVViewer(true);
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.detail ? err.response.data.detail : 'CV generation failed. Please try again.';
      setError(msg);
      setQuickCvMode('form');
    }
  };

  /* ── ATS File Drop ── */
  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.pdf') || file.name.endsWith('.docx'))) {
      setAtsResumeFile(file);
    } else {
      setError('Please upload a PDF or DOCX file.');
    }
  }, []);

  /* ── ATS Optimize ── */
  const handleATSOptimize = async () => {
    if (!atsResumeFile || !atsJobDesc.trim()) return;
    setError(null);
    setAtsMode('parsing');
    const formats: string[] = [];
    if (atsOutputDocx) formats.push('docx');
    if (atsOutputPdf) formats.push('pdf');

    const formData = new FormData();
    formData.append('resume_file', atsResumeFile);
    formData.append('job_description', atsJobDesc);
    formData.append('optimization_mode', atsOptMode);
    formData.append('output_formats', formats.join(','));

    try {
      setAtsMode('optimizing');
      const res = await axios.post(`${API_URL}/api/v1/ai-assistant/ats-optimize`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000, // 5 minutes for slow models
      });
      setAtsResult({
        optimizedResume: res.data.optimized_resume,
        atsReport: res.data.ats_report,
        candidateName: res.data.candidate_name || 'Candidate',
        docxB64: res.data.docx_base64 || '',
        pdfB64: res.data.pdf_base64 || '',
      });
      setAtsMode('done');
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.detail ? err.response.data.detail : 'ATS optimization failed. Check that Ollama is running.';
      setError(msg);
      setAtsMode('form');
    }
  };

  /* ── Format chat message ── */
  const formatMessage = (content: string) =>
    content.split('\n').map((line, idx) => {
      if (line.startsWith('•') || line.startsWith('-'))
        return (
          <div key={idx} className="flex gap-1.5 ml-1 mb-0.5">
            <span className="text-primary-500 flex-shrink-0 font-bold">•</span>
            <span className="text-xs leading-relaxed text-gray-700">{line.replace(/^[•\-]\s*/, '')}</span>
          </div>
        );
      if (line.trim() === '') return <div key={idx} className="h-1.5" />;
      return <p key={idx} className="text-xs leading-relaxed text-gray-700 mb-0.5">{line}</p>;
    });

  const copyMsg = (text: string, i: number) => { navigator.clipboard.writeText(text); setCopiedIndex(i); setTimeout(() => setCopiedIndex(null), 2000); };

  /* ── ATS Progress text ── */
  const atsProgressSteps = {
    parsing: ['Parsing Resume', 'Extracting Sections', 'Structuring Data'],
    optimizing: ['Analysing JD', 'Computing Skill Gap', 'Rewriting Resume', 'Generating ATS Report', 'Building Documents'],
  };
  const atsCurrentSteps = atsMode === 'parsing' ? atsProgressSteps.parsing : atsProgressSteps.optimizing;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[440px] z-50"
          >
            <div className="relative flex flex-col h-full bg-white shadow-2xl rounded-l-3xl overflow-hidden border-l border-gray-200">

              {/* Quick CV viewer overlay */}
              <AnimatePresence>
                {showCVViewer && generatedCV && (
                  <CVViewer cv={generatedCV} onClose={() => setShowCVViewer(false)} />
                )}
              </AnimatePresence>

              {/* ── TOP BAR ─────────────────────────────────────────────── */}
              <div className="bg-primary-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">AI Career Assistant</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${ollamaOnline === null ? 'bg-yellow-300' : ollamaOnline ? 'bg-green-300' : 'bg-red-300'}`} />
                      <span className="text-xs text-white/80">
                        {ollamaOnline === null ? 'Connecting…' : ollamaOnline ? 'Ollama · Mistral 7B' : 'Offline — run ollama serve'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:flex items-center gap-1 bg-white/15 px-2 py-1 rounded-lg text-xs text-white/90 font-medium">
                    <Lock className="w-3 h-3" />Local AI
                  </span>
                  <button onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/15 p-1.5 rounded-lg transition"><X size={16} /></button>
                </div>
              </div>

              {/* ── MODE TABS (Chat / CV) ─────────────────────────────── */}
              <div className="flex gap-1 p-2 bg-primary-50 border-b border-primary-100 flex-shrink-0">
                {[
                  { id: 'chat' as ActiveMode, label: 'Chat', icon: MessageSquare },
                  { id: 'cv' as ActiveMode, label: 'CV Tools', icon: FileOutput },
                ].map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setMode(id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      mode === id ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'text-primary-600 hover:text-primary-700 hover:bg-primary-100'
                    }`}>
                    <Icon size={13} />{label}
                  </button>
                ))}
              </div>

              {/* ══════════════ CHAT MODE ═══════════════════════════════ */}
              {mode === 'chat' && (
                <>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                    {messages.map((msg, idx) => (
                      <div key={msg.id} className={clsx('flex gap-2', { 'justify-end': msg.role === 'user', 'justify-start': msg.role === 'assistant' })}>
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            <Bot size={12} className="text-white" />
                          </div>
                        )}
                        <div className={clsx('max-w-[85%] rounded-2xl px-3 py-2.5 break-words shadow-sm', {
                          'bg-primary-600 text-white rounded-br-sm': msg.role === 'user',
                          'bg-white text-gray-800 rounded-bl-sm border border-gray-200': msg.role === 'assistant',
                        })}>
                          {msg.role === 'assistant' ? <div>{formatMessage(msg.content)}</div> : <p className="text-xs leading-relaxed">{msg.content}</p>}
                          {msg.role === 'assistant' && (
                            <button onClick={() => copyMsg(msg.content, idx)} className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400 hover:text-primary-600 transition">
                              <Copy size={10} />{copiedIndex === idx ? 'Copied!' : 'Copy'}
                            </button>
                          )}
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            <User size={12} className="text-gray-600" />
                          </div>
                        )}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex gap-2 justify-start">
                        <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
                          <Loader size={12} className="animate-spin text-white" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2.5 shadow-sm">
                          <div className="flex gap-1 items-center h-3">
                            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:300ms]" />
                          </div>
                        </div>
                      </div>
                    )}
                    {ollamaOnline === false && (
                      <div className="flex gap-1.5 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                        <AlertCircle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">Ollama is offline. Run <code className="bg-amber-100 px-1 rounded font-mono">ollama serve</code> and refresh.</p>
                      </div>
                    )}
                    {messages.length === 1 && ollamaOnline && (
                      <div className="flex gap-1.5 bg-green-50 border border-green-200 rounded-xl p-2.5">
                        <CheckCircle size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-700">Ollama is running locally — your data stays private. Start chatting!</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {messages.length === 1 && (
                    <div className="px-3 pb-2 bg-gray-50 border-t border-gray-100 flex-shrink-0 pt-2">
                      <p className="text-[10px] text-gray-400 font-medium mb-1.5 uppercase tracking-wide">Quick actions</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['How do I improve my resume?', 'Tips for interview prep', 'How to negotiate salary?', 'Generate a custom CV →'].map(q => (
                          <button key={q} onClick={() => { if (q.includes('Generate')) { setMode('cv'); return; } setInput(q); inputRef.current?.focus(); }}
                            className="text-left text-[10px] text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg px-2.5 py-2 transition flex items-center gap-1 font-medium">
                            <ChevronRight size={9} className="flex-shrink-0 text-primary-500" />{q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSend} className="border-t border-gray-200 bg-white p-3 flex-shrink-0">
                    <div className="flex gap-2">
                      <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
                        placeholder={ollamaOnline === false ? 'Start Ollama first...' : 'Ask anything about your career...'}
                        disabled={chatLoading || ollamaOnline === false}
                        className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 transition" />
                      <button type="submit" disabled={chatLoading || !input.trim() || ollamaOnline === false}
                        className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-xl px-3 py-2.5 transition flex items-center gap-1.5 text-xs font-semibold shadow-sm">
                        {chatLoading ? <Loader size={13} className="animate-spin" /> : <Send size={13} />}
                        <span className="hidden sm:inline">{chatLoading ? '...' : 'Send'}</span>
                      </button>
                    </div>
                    <p className="text-[9px] text-gray-400 text-center mt-1.5">Powered by Ollama · Mistral 7B · Runs locally &amp; privately</p>
                  </form>
                </>
              )}

              {/* ══════════════ CV TOOLS MODE ════════════════════════════ */}
              {mode === 'cv' && (
                <div className="flex flex-col flex-1 overflow-hidden">

                  {/* CV Sub-tabs */}
                  <div className="flex gap-1 px-3 pt-2 pb-2 bg-white border-b border-gray-100 flex-shrink-0">
                    {[
                      { id: 'quick' as CVSubTab, label: 'Quick CV Generator', icon: Sparkles },
                      { id: 'ats' as CVSubTab, label: 'ATS Optimizer', icon: FileSearch },
                    ].map(({ id, label, icon: Icon }) => (
                      <button key={id} onClick={() => setCvSubTab(id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                          cvSubTab === id
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
                        }`}>
                        <Icon size={12} />
                        <span className="truncate">{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Sub-tab description */}
                  <div className="px-3 py-2 bg-primary-50 border-b border-primary-100 flex-shrink-0">
                    {cvSubTab === 'quick' ? (
                      <p className="text-[10px] text-primary-700 leading-relaxed">
                        Generate a complete CV from a job description and your background information.
                      </p>
                    ) : (
                      <p className="text-[10px] text-primary-700 leading-relaxed">
                        Upload your existing resume and a target job description to generate an ATS-optimized resume tailored specifically to the role.
                      </p>
                    )}
                  </div>

                  {/* ── QUICK CV GENERATOR ─────────────────────────────── */}
                  {cvSubTab === 'quick' && (
                    <div className="flex-1 overflow-y-auto flex flex-col bg-gray-50">
                      {quickCvMode === 'form' && (
                        <div className="flex-1 p-4 space-y-4">
                          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <h3 className="text-sm font-bold text-primary-900">Quick CV Generator</h3>
                            </div>
                            <p className="text-xs text-primary-700 leading-relaxed">Paste a job description and Mistral 7B will build a complete, ATS-optimised CV tailored to that role.</p>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Job Description <span className="text-red-500">*</span></label>
                            <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)}
                              placeholder="Paste the full job description here..." rows={6}
                              className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition" />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Name</label>
                              <input type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Palak Kushwaha"
                                className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Email</label>
                              <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} placeholder="palak@email.com"
                                className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Background <span className="text-gray-400 font-normal">(optional)</span></label>
                            <textarea value={baseResume} onChange={e => setBaseResume(e.target.value)}
                              placeholder="Paste your existing resume or background info..." rows={4}
                              className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition" />
                          </div>

                          {error && (
                            <div className="flex gap-1.5 bg-red-50 border border-red-200 rounded-xl p-2.5">
                              <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
                              <p className="text-xs text-red-700">{error}</p>
                            </div>
                          )}

                          <button onClick={handleGenerateQuickCV} disabled={!jobDesc.trim() || ollamaOnline === false}
                            className="w-full btn-primary py-3 text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-primary-200">
                            <Sparkles size={15} />Generate My Custom CV
                          </button>
                          <p className="text-[9px] text-gray-400 text-center">Takes ~30–60 seconds · Runs locally via Ollama</p>
                        </div>
                      )}

                      {quickCvMode === 'generating' && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center shadow-xl shadow-primary-200">
                            <FileText className="w-8 h-8 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Building Your CV…</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Mistral 7B is crafting your tailored,<br />ATS-optimised CV.</p>
                          </div>
                          <div className="flex gap-1.5">
                            {['Analysing JD', 'Tailoring Skills', 'Writing CV'].map((step, i) => (
                              <motion.span key={step} initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                                className="text-xs text-primary-600 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-lg font-medium">{step}</motion.span>
                            ))}
                          </div>
                        </div>
                      )}

                      {quickCvMode === 'done' && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6 text-center">
                          <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center shadow-xl shadow-green-100">
                            <CheckCircle className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">CV Ready! 🎉</h3>
                            <p className="text-sm text-gray-500">Your custom CV has been generated and tailored to the job.</p>
                          </div>
                          <div className="flex flex-col gap-2 w-full max-w-[240px]">
                            <button onClick={() => setShowCVViewer(true)} className="w-full btn-primary py-2.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2">
                              <FileOutput size={14} />View Full CV
                            </button>
                            <button onClick={() => { setQuickCvMode('form'); setGeneratedCV(''); setJobDesc(''); }}
                              className="w-full btn-secondary py-2.5 text-sm font-medium rounded-xl flex items-center justify-center gap-2">
                              <RotateCcw size={13} />Generate Another
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── ATS RESUME OPTIMIZER ───────────────────────────── */}
                  {cvSubTab === 'ats' && (
                    <div className="flex-1 overflow-y-auto flex flex-col relative bg-gray-50">

                      {/* Generating / Parsing overlay */}
                      <AnimatePresence>
                        {(atsMode === 'parsing' || atsMode === 'optimizing') && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center gap-6 p-8 text-center">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center shadow-xl shadow-primary-200">
                              <FileSearch className="w-8 h-8 text-white" />
                            </motion.div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {atsMode === 'parsing' ? 'Parsing Resume…' : 'Optimizing for ATS…'}
                              </h3>
                              <p className="text-sm text-gray-500 leading-relaxed">
                                {atsMode === 'parsing'
                                  ? 'Extracting and structuring your resume data.'
                                  : 'Running 3-step AI pipeline. This takes 60–120 seconds.'}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 justify-center max-w-[280px]">
                              {atsCurrentSteps.map((step, i) => (
                                <motion.span key={step} initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
                                  className="text-[10px] text-primary-600 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-lg font-semibold">{step}</motion.span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Done — show results */}
                      {atsMode === 'done' && atsResult && (
                        <ATSResultsPanel
                          optimizedResume={atsResult.optimizedResume}
                          atsReport={atsResult.atsReport}
                          candidateName={atsResult.candidateName}
                          docxB64={atsResult.docxB64}
                          pdfB64={atsResult.pdfB64}
                          onReset={() => { setAtsMode('form'); setAtsResult(null); setAtsResumeFile(null); setAtsJobDesc(''); }}
                        />
                      )}

                      {/* Form — default state */}
                      {(atsMode === 'form' || atsMode === 'parsing' || atsMode === 'optimizing') && (
                        <div className="flex-1 p-4 space-y-4">

                          {/* Upload Resume */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                              Upload Existing Resume <span className="text-red-500">*</span>
                              <span className="ml-1 font-normal text-gray-400">(PDF or DOCX)</span>
                            </label>
                            <div
                              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                              onDragLeave={() => setDragOver(false)}
                              onDrop={handleFileDrop}
                              onClick={() => fileInputRef.current?.click()}
                              className={`border-2 border-dashed rounded-xl px-4 py-5 cursor-pointer transition-all text-center ${
                                dragOver
                                  ? 'border-primary-500 bg-primary-50'
                                  : atsResumeFile
                                  ? 'border-green-400 bg-green-50'
                                  : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-primary-50/40'
                              }`}>
                              <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden"
                                onChange={e => { const f = e.target.files?.[0]; if (f) setAtsResumeFile(f); }} />
                              {atsResumeFile ? (
                                <div className="flex items-center justify-center gap-2">
                                  <FileText className="w-5 h-5 text-green-600" />
                                  <div className="text-left">
                                    <p className="text-xs font-semibold text-green-700 truncate max-w-[220px]">{atsResumeFile.name}</p>
                                    <p className="text-[10px] text-green-500">{(atsResumeFile.size / 1024).toFixed(0)} KB · Click to change</p>
                                  </div>
                                  <CheckCircle className="w-4 h-4 text-green-500 ml-1 flex-shrink-0" />
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                  <p className="text-xs text-gray-600 font-medium">Drop your resume here or click to browse</p>
                                  <p className="text-[10px] text-gray-400 mt-1">Supports PDF · DOCX</p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Job Description */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                              Job Description <span className="text-red-500">*</span>
                            </label>
                            <textarea value={atsJobDesc} onChange={e => setAtsJobDesc(e.target.value)}
                              placeholder="Paste the full job description — include all responsibilities, requirements, and tech stack..."
                              rows={7}
                              className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition" />
                          </div>

                          {/* Output Format */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Output Format</label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={atsOutputDocx} onChange={e => setAtsOutputDocx(e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                <span className="text-xs text-gray-700 group-hover:text-primary-700 font-medium flex items-center gap-1">
                                  <FileText size={11} className="text-primary-500" />DOCX
                                </span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={atsOutputPdf} onChange={e => setAtsOutputPdf(e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                <span className="text-xs text-gray-700 group-hover:text-primary-700 font-medium flex items-center gap-1">
                                  <FileOutput size={11} className="text-red-500" />PDF
                                </span>
                              </label>
                            </div>
                          </div>

                          {/* ATS Optimization Mode */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">ATS Optimization Mode</label>
                            <div className="relative">
                              <select value={atsOptMode} onChange={e => setAtsOptMode(e.target.value as 'aggressive' | 'standard')}
                                className="w-full appearance-none bg-white border border-gray-300 text-gray-800 rounded-xl px-3 py-2.5 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition cursor-pointer font-medium">
                                <option value="aggressive">Aggressive — Maximise ATS score (&gt;90)</option>
                                <option value="standard">Standard — Natural keyword integration (&gt;75)</option>
                              </select>
                              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                              {atsOptMode === 'aggressive'
                                ? '⚡ Rewrites every bullet for max keyword density. Best for ATS pass-through.'
                                : '📝 Integrates keywords naturally. Preserves more of your original wording.'}
                            </p>
                          </div>

                          {error && (
                            <div className="flex gap-1.5 bg-red-50 border border-red-200 rounded-xl p-2.5">
                              <AlertCircle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-red-700">{error}</p>
                            </div>
                          )}

                          {/* Generate Button */}
                          <button
                            onClick={handleATSOptimize}
                            disabled={!atsResumeFile || !atsJobDesc.trim() || (!atsOutputDocx && !atsOutputPdf) || ollamaOnline === false}
                            className="w-full btn-primary py-3 text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-primary-200">
                            <Target size={15} />Generate ATS Resume
                          </button>

                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                              ⏱️ Takes 60–120 seconds (3 AI calls) · Runs locally on Ollama · Your resume data never leaves your device
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
