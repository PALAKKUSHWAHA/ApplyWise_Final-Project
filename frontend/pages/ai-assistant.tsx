import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIAssistantChat from '@/components/AIAssistantChat';
import {
  FileText,
  Brain,
  Briefcase,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Zap,
  Lock,
  X,
} from 'lucide-react';

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState<
    'chat' | 'resume_tailoring' | 'gap_analysis' | 'interview_prep'
  >('chat');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const tabs = [
    {
      id: 'chat',
      label: 'General Chat',
      icon: MessageSquare,
      gradient: 'from-indigo-500 to-violet-600',
      description: 'Open-ended career advice & Q&A',
    },
    {
      id: 'resume_tailoring',
      label: 'Resume Tailoring',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-600',
      description: 'Keyword-optimize your resume',
      benefits: ['Keyword optimization', 'Better bullet points', 'Achievement highlights'],
    },
    {
      id: 'gap_analysis',
      label: 'Skill Gap Analysis',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-600',
      description: 'Identify & close skill gaps',
      benefits: ['Learning resources', 'Certification paths', 'Timeline estimates'],
    },
    {
      id: 'interview_prep',
      label: 'Interview Prep',
      icon: Briefcase,
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Practice questions & answers',
      benefits: ['Sample questions', 'STAR method answers', 'Technical hints'],
    },
  ];

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setCurrentSkills([...currentSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setCurrentSkills(currentSkills.filter((_, i) => i !== index));
  };

  const renderFeatureContent = () => {
    if (activeTab === 'chat') {
      return (
        <div className="h-[560px]">
          <AIAssistantChat resumeText={resumeText} jobDescription={jobDescription} featureType="general" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Context Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📄 Your Resume
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content here — include summary, experience, skills, and education..."
              className="w-full h-52 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-gray-50 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💼 Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description — include responsibilities, requirements, and qualifications..."
              className="w-full h-52 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-gray-50 transition"
            />
          </div>
        </div>

        {/* Extra Fields */}
        {activeTab === 'gap_analysis' && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🧠 Your Current Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Type a skill and press Enter"
                className="flex-1 border border-purple-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 bg-white"
              />
              <button
                onClick={handleAddSkill}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-purple-500 hover:text-purple-700 ml-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {currentSkills.length === 0 && (
                <p className="text-xs text-purple-400">Add skills to get a personalised gap report</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'interview_prep' && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🎤 Interview Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company name (optional)"
                className="border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" />
                <span className="text-sm text-gray-700">This is a technical role</span>
              </label>
            </div>
          </div>
        )}

        {/* Chat Component */}
        {(resumeText || jobDescription) ? (
          <div className="h-[460px]">
            <AIAssistantChat
              resumeText={resumeText}
              jobDescription={jobDescription}
              featureType={activeTab as any}
            />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Add context to unlock AI insights</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Paste your resume and/or job description above to get personalised AI-powered recommendations.
            </p>
          </div>
        )}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Head>
        <title>AI Career Assistant — ApplyWise</title>
        <meta
          name="description"
          content="AI-powered career assistance for resume tailoring, interview prep, and skill gap analysis. Powered by Ollama running locally."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex flex-col">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          {/* ── Hero ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12"
          >
            <motion.div variants={itemVariants} className="flex justify-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-200">
                <Zap className="w-3 h-3" />
                Powered by Ollama · Mistral 7B
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
                <Lock className="w-3 h-3" />
                Runs 100% locally
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Your{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                AI Career Assistant
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-gray-500 max-w-2xl mx-auto">
              Resume tailoring, interview coaching, and skill gap analysis — all powered by a local
              Ollama model. Your data never leaves your machine.
            </motion.p>
          </motion.div>

          {/* ── Tab Cards ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  variants={itemVariants}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`relative p-4 rounded-2xl text-left transition-all duration-200 border ${
                    isActive
                      ? `bg-gradient-to-br ${tab.gradient} text-white border-transparent shadow-xl`
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-200 hover:shadow-md'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
                      isActive
                        ? 'bg-white/20'
                        : `bg-gradient-to-br ${tab.gradient} text-white shadow-sm`
                    }`}
                  >
                    <Icon className="w-4 h-4" style={{ color: isActive ? 'white' : 'white' }} />
                  </div>
                  <p className={`text-sm font-bold mb-0.5 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {tab.label}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                    {tab.description}
                  </p>
                  {isActive && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-80" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* ── Main Content ── */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
          >
            {renderFeatureContent()}
          </motion.div>

          {/* ── Tips Row ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                emoji: '💡',
                title: 'Be Specific',
                body: 'Include detailed job descriptions and complete resumes for better AI recommendations.',
                bg: 'bg-amber-50 border-amber-100',
                title_color: 'text-amber-800',
              },
              {
                emoji: '🎯',
                title: 'Iterate & Refine',
                body: 'Follow up with questions. The AI improves its suggestions with each message.',
                bg: 'bg-indigo-50 border-indigo-100',
                title_color: 'text-indigo-800',
              },
              {
                emoji: '🔒',
                title: 'Fully Private',
                body: 'Everything runs locally via Ollama. No data is sent to external servers.',
                bg: 'bg-emerald-50 border-emerald-100',
                title_color: 'text-emerald-800',
              },
            ].map((tip) => (
              <motion.div
                key={tip.title}
                variants={itemVariants}
                className={`rounded-2xl p-5 border ${tip.bg}`}
              >
                <h4 className={`font-bold text-sm mb-1 ${tip.title_color}`}>
                  {tip.emoji} {tip.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">{tip.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
}
