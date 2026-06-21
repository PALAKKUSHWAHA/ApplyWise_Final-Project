import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Target, CheckCircle, AlertCircle,
  Download, RotateCcw, ChevronDown, Eye, X,
  FileSearch, Lock, TrendingUp, Copy,
} from 'lucide-react';

const API_URL =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
    : 'http://localhost:8000';

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

function downloadBase64(b64: string, filename: string, mime: string) {
  const byteChars = atob(b64);
  const byteNums = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
  const blob = new Blob([new Uint8Array(byteNums)], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function ScorePill({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl px-5 py-4 border ${color}`}>
      <span className="text-3xl font-black">{value}%</span>
      <span className="text-[11px] font-semibold uppercase tracking-wide mt-0.5 opacity-80">{label}</span>
    </div>
  );
}

export default function ATSOptimizerSection() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState('');
  const [mode, setMode] = useState<'aggressive' | 'standard'>('aggressive');
  const [outputDocx, setOutputDocx] = useState(true);
  const [outputPdf, setOutputPdf] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState<{
    optimizedResume: string;
    atsReport: ATSReport;
    candidateName: string;
    docxB64: string;
    pdfB64: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.pdf') || f.name.endsWith('.docx'))) setResumeFile(f);
    else setError('Only PDF or DOCX files are supported.');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile || !jobDesc.trim()) return;
    setStatus('loading'); setError('');

    const formats: string[] = [];
    if (outputDocx) formats.push('docx');
    if (outputPdf) formats.push('pdf');

    const fd = new FormData();
    fd.append('resume_file', resumeFile);
    fd.append('job_description', jobDesc);
    fd.append('optimization_mode', mode);
    fd.append('output_formats', formats.join(',') || 'docx');

    try {
      const res = await axios.post(`${API_URL}/api/v1/ai-assistant/ats-optimize`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000,
      });
      setResult({
        optimizedResume: res.data.optimized_resume,
        atsReport: res.data.ats_report,
        candidateName: res.data.candidate_name || 'Candidate',
        docxB64: res.data.docx_base64 || '',
        pdfB64: res.data.pdf_base64 || '',
      });
      setStatus('done');
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.detail
        ? err.response.data.detail
        : 'Optimization failed. Make sure Ollama is running.';
      setError(msg); setStatus('error');
    }
  };

  const reset = () => {
    setResult(null); setStatus('idle'); setError('');
    setResumeFile(null); setJobDesc(''); setShowPreview(false);
  };

  const copyResume = () => {
    if (result) { navigator.clipboard.writeText(result.optimizedResume); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const report = result?.atsReport;
  const atsScore = Math.min(100, Math.round(report?.ats_score || 0));
  const kwMatch = Math.min(100, Math.round(report?.keyword_match_pct || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto mt-10 px-4"
    >
      {/* ── Header card ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5 justify-center">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-200">
          <FileSearch className="w-5 h-5 text-white" />
        </div>
        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-900">ATS Resume Optimizer</h2>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Lock size={10} className="text-green-500" />
            Powered by Ollama · Runs locally · Your data stays private
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">

        {/* ── LOADING STATE ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {status === 'loading' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-5 rounded-3xl">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
                <Target className="w-7 h-7 text-white" />
              </motion.div>
              <div className="text-center">
                <p className="font-bold text-gray-900 text-lg">Optimizing your resume…</p>
                <p className="text-sm text-gray-500 mt-1">Single AI call · ~60–90 seconds</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                {['Parsing Resume', 'Matching Keywords', 'Rewriting Bullets', 'Building DOCX + PDF'].map((s, i) => (
                  <motion.span key={s} initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    className="text-[11px] bg-primary-50 border border-primary-200 text-primary-700 px-3 py-1 rounded-full font-semibold">{s}</motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── DONE STATE ─────────────────────────────────────────────────── */}
        {status === 'done' && result && (
          <div className="p-6 space-y-5">
            {/* Resume Preview Modal */}
            <AnimatePresence>
              {showPreview && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                    className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 bg-primary-600 flex-shrink-0">
                      <span className="font-bold text-white">ATS Optimized Resume</span>
                      <div className="flex items-center gap-2">
                        <button onClick={copyResume} className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition font-medium">
                          {copied ? <CheckCircle size={12} /> : <Copy size={12} />}{copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button onClick={() => setShowPreview(false)} className="text-white/70 hover:text-white p-1 rounded-lg transition"><X size={16} /></button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
                      <pre className="whitespace-pre-wrap font-mono text-xs text-gray-800 leading-relaxed bg-white rounded-xl p-4 border border-gray-200">{result.optimizedResume}</pre>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success banner */}
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-green-800">Resume Optimized for {result.candidateName} 🎉</p>
                <p className="text-xs text-green-600 mt-0.5">ATS-ready resume generated — download below</p>
              </div>
            </div>

            {/* Score row */}
            <div className="grid grid-cols-2 gap-4">
              <ScorePill value={atsScore} label="ATS Score"
                color={atsScore >= 80 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-primary-50 border-primary-200 text-primary-700'} />
              <ScorePill value={kwMatch} label="Keyword Match"
                color={kwMatch >= 75 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'} />
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setShowPreview(true)}
                className="col-span-3 sm:col-span-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-3 text-sm font-bold transition shadow-sm">
                <Eye size={15} />View Resume
              </button>
              {result.docxB64 && (
                <button onClick={() => downloadBase64(result.docxB64, `${result.candidateName}_ATS.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
                  className="flex items-center justify-center gap-2 bg-primary-50 border border-primary-300 text-primary-700 hover:bg-primary-100 rounded-xl py-3 text-sm font-bold transition">
                  <Download size={14} />DOCX
                </button>
              )}
              {result.pdfB64 && (
                <button onClick={() => downloadBase64(result.pdfB64, `${result.candidateName}_ATS.pdf`, 'application/pdf')}
                  className="flex items-center justify-center gap-2 bg-green-50 border border-green-300 text-green-700 hover:bg-green-100 rounded-xl py-3 text-sm font-bold transition">
                  <Download size={14} />PDF
                </button>
              )}
            </div>

            {/* ATS Report */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-primary-50 border-b border-primary-100 px-4 py-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary-600" />
                <h3 className="font-bold text-primary-900 text-sm">ATS Report</h3>
                <span className="ml-auto text-[10px] bg-primary-100 border border-primary-200 text-primary-700 px-2 py-0.5 rounded-full font-semibold uppercase">
                  {report?.optimization_mode} mode
                </span>
              </div>
              <div className="p-4 space-y-4">
                {report?.recruiter_feedback && (
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 leading-relaxed">
                    💬 {report.recruiter_feedback}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(report?.matched_skills?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-[11px] text-green-700 font-bold uppercase tracking-wide mb-2 flex items-center gap-1">
                        <CheckCircle size={11} />Matched ({report!.matched_skills.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {report!.matched_skills.slice(0, 10).map(s => (
                          <span key={s} className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(report?.missing_skills?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-[11px] text-amber-700 font-bold uppercase tracking-wide mb-2 flex items-center gap-1">
                        <AlertCircle size={11} />Missing ({report!.missing_skills.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {report!.missing_skills.slice(0, 10).map(s => (
                          <span key={s} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {(report?.improvement_suggestions?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-[11px] text-primary-700 font-bold uppercase tracking-wide mb-2 flex items-center gap-1">
                      <TrendingUp size={11} />Suggestions
                    </p>
                    <ul className="space-y-1">
                      {report!.improvement_suggestions.slice(0, 4).map((s, i) => (
                        <li key={i} className="flex gap-2 text-xs text-gray-600">
                          <span className="text-primary-400">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button onClick={reset}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-600 hover:text-primary-700 rounded-xl py-2.5 text-sm font-medium transition">
              <RotateCcw size={13} />Optimize Another Resume
            </button>
          </div>
        )}

        {/* ── FORM STATE ─────────────────────────────────────────────────── */}
        {(status === 'idle' || status === 'error') && (
          <form onSubmit={handleSubmit} className="relative p-6 space-y-5">

            {/* Upload zone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Your Resume <span className="text-red-500">*</span>
                <span className="ml-1.5 text-gray-400 font-normal text-xs">PDF or DOCX</span>
              </label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl px-6 py-8 text-center cursor-pointer transition-all ${
                  dragOver ? 'border-primary-500 bg-primary-50 scale-[1.01]' :
                  resumeFile ? 'border-green-400 bg-green-50' :
                  'border-gray-200 bg-gray-50 hover:border-primary-400 hover:bg-primary-50/50'
                }`}>
                <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) setResumeFile(f); }} />
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-green-700 text-sm truncate max-w-[260px]">{resumeFile.name}</p>
                      <p className="text-xs text-green-500">{(resumeFile.size / 1024).toFixed(0)} KB · Click to change</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-600">Drop your resume here, or <span className="text-primary-600 font-semibold">browse</span></p>
                    <p className="text-xs text-gray-400 mt-1">Supports PDF · DOCX</p>
                  </>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                rows={6}
                placeholder="Paste the full job description here — include all requirements, responsibilities, and tech stack..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition"
              />
            </div>

            {/* Controls row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Output format */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1.5">Output Format</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={outputDocx} onChange={e => setOutputDocx(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-xs font-medium text-gray-700">DOCX</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={outputPdf} onChange={e => setOutputPdf(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-xs font-medium text-gray-700">PDF</span>
                  </label>
                </div>
              </div>

              {/* Mode selector */}
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 mb-1.5">Optimization Mode</p>
                <div className="relative">
                  <select value={mode} onChange={e => setMode(e.target.value as 'aggressive' | 'standard')}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-3 py-2 pr-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition cursor-pointer">
                    <option value="aggressive">⚡ Aggressive — Max ATS Score (&gt;90)</option>
                    <option value="standard">📝 Standard — Natural Keywords (&gt;75)</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!resumeFile || !jobDesc.trim()}
              className="w-full flex items-center justify-center gap-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-4 text-base transition shadow-lg shadow-primary-200 relative overflow-hidden group"
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
              />
              <span className="relative flex items-center gap-2.5">
                <Target size={18} />
                Generate ATS Resume
              </span>
            </button>

            <p className="text-center text-[11px] text-gray-400">
              ⏱ ~60–90 seconds · 🔒 Runs locally via Ollama · Your data never leaves your device
            </p>
          </form>
        )}
      </div>
    </motion.div>
  );
}
