import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Brain,
  Target,
  Zap,
  Users,
  Award,
  TrendingUp,
  Shield,
  Clock,
  Bot,
  Lock,
  Cpu,
  Server,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Text Processing',
    description: 'Natural language processing pipeline with entity recognition and skill extraction.',
  },
  {
    icon: Target,
    title: 'Similarity Analysis',
    description: 'Semantic similarity calculation using transformer-based sentence embeddings.',
  },
  {
    icon: Zap,
    title: 'Multi-Format Input',
    description: 'Text extraction from PDF, DOC, DOCX, TXT, and image files.',
  },
  {
    icon: Users,
    title: 'Batch Processing',
    description: 'API endpoints for processing multiple files programmatically.',
  },
  {
    icon: Award,
    title: 'Component Scoring',
    description: 'Detailed analysis across skills, experience, education, and keyword matching.',
  },
  {
    icon: TrendingUp,
    title: 'Scalable Solution',
    description: 'Built with modern architecture for growing recruitment needs.',
  },
];

const stats = [
  { number: 'AI', label: 'Powered Analysis' },
  { number: 'NLP', label: 'Text Processing' },
  { number: 'Open', label: 'Source Code' },
  { number: 'Python', label: 'Backend Tech' },
];

const ollamaSteps = [
  {
    step: '1',
    title: 'Download Ollama',
    desc: 'Install Ollama from the official website. Available for macOS, Linux, and Windows.',
    code: 'https://ollama.ai',
    isLink: true,
  },
  {
    step: '2',
    title: 'Pull Mistral 7B',
    desc: 'Download the Mistral model (4 GB) — the AI brain powering ApplyWise.',
    code: 'ollama pull mistral',
  },
  {
    step: '3',
    title: 'Start Ollama',
    desc: 'Run the Ollama server. It starts automatically on port 11434.',
    code: 'ollama serve',
  },
  {
    step: '4',
    title: 'Use ApplyWise AI',
    desc: 'Click "Talk to AI Assistant" on the home page. The green dot confirms Ollama is connected.',
    code: 'localhost:3000',
    isLink: true,
  },
];

export default function About() {
  return (
    <>
      <Head>
        <title>About ApplyWise - AI Resume Analysis Platform</title>
        <meta
          name="description"
          content="Learn about ApplyWise's AI-powered resume analysis platform using natural language processing, machine learning, and local LLMs via Ollama for smart recruitment."
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="pt-20 md:pt-24 pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* ── Hero ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
                About
                <span className="gradient-text block">ApplyWise</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
                AI-powered resume analysis platform using natural language processing and local LLMs
                to intelligently match resume content with job descriptions — 100% privately.
              </p>
            </motion.div>

            {/* ── Mission ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-8 md:p-12 mb-12 md:mb-16 text-center"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Our Mission</h2>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  ApplyWise transforms the job-search process by combining advanced natural language
                  processing with locally-running AI (via Ollama) to analyze resumes, generate
                  tailored CVs, and coach candidates for interviews — all without sending your data
                  to any external server. Your career data stays on your machine, always.
                </p>
              </div>
            </motion.div>

            {/* ── Platform Features ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Platform Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="card p-8 text-center group hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-primary-600 group-hover:to-purple-600 transition-all duration-300">
                      <feature.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Stats Banner ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-12 mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Trusted by Job Seekers</h2>
                <p className="text-primary-100 text-lg">
                  Reliable AI-powered career tools — open source &amp; free
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-primary-100 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ══════════ OLLAMA SECTION ══════════ */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mb-16"
            >
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Bot className="w-4 h-4" />
                  Local AI — Powered by Ollama
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  What is Ollama &amp; Why We Use It
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  ApplyWise uses <strong>Ollama</strong> to run large language models directly on
                  your computer — no cloud subscription, no API key, no data ever leaving your
                  machine.
                </p>
              </div>

              {/* Two columns: What + Why */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* What is Ollama */}
                <div className="card p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">What is Ollama?</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-5">
                    <strong>Ollama</strong> is an open-source tool that lets you download and run
                    state-of-the-art large language models (LLMs) locally on your own hardware —
                    just like running any other app. No internet connection required once the model
                    is downloaded.
                  </p>
                  <div className="space-y-3">
                    {[
                      'Free &amp; open-source — always',
                      'Supports 50+ models (Mistral, Llama, Gemma, Phi…)',
                      'Runs on CPU or GPU — works without a GPU',
                      'Simple REST API on localhost:11434',
                      'Available for macOS, Linux, and Windows',
                    ].map((point) => (
                      <div key={point} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span
                          className="text-sm text-gray-700"
                          dangerouslySetInnerHTML={{ __html: point }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why local LLM */}
                <div className="card p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Why Local AI?</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-5">
                    Your resume and personal career data are sensitive. With ApplyWise, everything
                    stays on your device. No data is uploaded to OpenAI, Google, or any third party.
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Lock,
                        color: 'text-green-600',
                        title: '100% Private',
                        desc: 'Your resume never leaves your computer',
                      },
                      {
                        icon: Zap,
                        color: 'text-primary-600',
                        title: 'No API Costs',
                        desc: 'Free to use — no OpenAI subscription needed',
                      },
                      {
                        icon: Server,
                        color: 'text-purple-600',
                        title: 'Works Offline',
                        desc: 'Full AI features without internet after setup',
                      },
                      {
                        icon: Shield,
                        color: 'text-amber-600',
                        title: 'No Rate Limits',
                        desc: 'Generate as many CVs as you want, instantly',
                      },
                    ].map(({ icon: Icon, color, title, desc }) => (
                      <div key={title} className="flex items-start gap-3">
                        <div className={`w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{title}</p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Model Card */}
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-200 rounded-2xl p-6 mb-10">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-5 h-5 text-primary-600" />
                      <h4 className="font-bold text-gray-900 text-lg">Model: Mistral 7B Instruct</h4>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold border border-primary-200">
                        Default
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      ApplyWise uses <strong>Mistral 7B</strong> — a 7-billion-parameter open-source
                      model by Mistral AI. It delivers GPT-3.5-level performance for resume writing,
                      career coaching, and interview preparation while running on most modern laptops.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:min-w-[180px]">
                    {[
                      { label: 'Model Size', value: '~4 GB' },
                      { label: 'Context Window', value: '32 768 tokens' },
                      { label: 'RAM Needed', value: '8 GB minimum' },
                      { label: 'Quantisation', value: 'Q4_K_M (fast)' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white border border-primary-100 rounded-lg px-3 py-2">
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                        <p className="text-sm font-bold text-gray-800">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Setup Steps */}
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Get Started with Ollama in 4 Steps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ollamaSteps.map(({ step, title, desc, code, isLink }) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: Number(step) * 0.1 }}
                    className="card p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
                  >
                    <div className="absolute top-3 right-3 text-5xl font-black text-gray-100 group-hover:text-primary-50 transition-colors select-none">
                      {step}
                    </div>
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mb-4 relative z-10">
                      <span className="text-white font-bold text-sm">{step}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 relative z-10">{title}</h4>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed relative z-10">{desc}</p>
                    <div className="relative z-10">
                      {isLink ? (
                        <a
                          href={code.startsWith('http') ? code : `http://${code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary-600 font-mono bg-primary-50 border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition"
                        >
                          {code} <ExternalLink size={10} />
                        </a>
                      ) : (
                        <code className="text-xs text-primary-700 font-mono bg-primary-50 border border-primary-200 px-3 py-1.5 rounded-lg block">
                          $ {code}
                        </code>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Tech Stack ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-16"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Advanced Technology Stack</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    ApplyWise is built using a modern technology stack to deliver professional-grade
                    AI-powered career tools. Our platform combines NLP, local LLMs, and a fast
                    React/Next.js frontend for a seamless experience.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Shield className="w-6 h-6 text-primary-600 mr-3" />
                      <span className="text-gray-700">Enterprise-ready data processing capabilities</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-6 h-6 text-primary-600 mr-3" />
                      <span className="text-gray-700">Real-time analysis and AI responses</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-6 h-6 text-primary-600 mr-3" />
                      <span className="text-gray-700">Local LLM via Ollama — no cloud dependency</span>
                    </div>
                  </div>
                </div>
                <div className="card p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Core Technologies</h3>
                  <div className="space-y-4">
                    {[
                      {
                        name: 'Ollama + Mistral 7B',
                        detail: 'Local LLM for CV generation & career coaching',
                        badge: 'AI Engine',
                        badgeColor: 'bg-primary-100 text-primary-700',
                      },
                      {
                        name: 'Natural Language Processing',
                        detail: 'spaCy + sentence-transformers for text understanding',
                        badge: 'NLP',
                        badgeColor: 'bg-purple-100 text-purple-700',
                      },
                      {
                        name: 'FastAPI Backend',
                        detail: 'High-performance async Python API',
                        badge: 'Backend',
                        badgeColor: 'bg-green-100 text-green-700',
                      },
                      {
                        name: 'Next.js + TypeScript',
                        detail: 'Modern, responsive React frontend',
                        badge: 'Frontend',
                        badgeColor: 'bg-amber-100 text-amber-700',
                      },
                    ].map(({ name, detail, badge, badgeColor }) => (
                      <div key={name} className="bg-gray-50 p-4 rounded-xl flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${badgeColor}`}>
                          {badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── CTA ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-center"
            >
              <div className="card p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ready to Land Your Dream Job?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Experience AI-driven resume analysis, custom CV generation, and interview coaching
                  — powered locally by Ollama and Mistral 7B. Completely free.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="/analyze"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Start Analyzing
                  </motion.a>
                  <motion.a
                    href="/"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <Bot className="w-5 h-5" />
                    Talk to AI Assistant
                  </motion.a>
                </div>
              </div>
            </motion.div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
