import React, { useState } from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AIAssistantChat from '@/components/AIAssistantChat';
import {
  FileText,
  Brain,
  Briefcase,
  MessageSquare,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState<
    'chat' | 'resume_tailoring' | 'gap_analysis' | 'interview_prep' | 'cover_letter'
  >('chat');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const features = [
    {
      id: 'resume_tailoring',
      title: 'Resume Tailoring',
      description: 'Get AI-powered suggestions to optimize your resume for specific jobs',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      benefits: ['Keyword optimization', 'Better bullet points', 'Highlighted achievements'],
    },
    {
      id: 'gap_analysis',
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills and get personalized learning paths',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      benefits: ['Learning resources', 'Certification paths', 'Timeline estimates'],
    },
    {
      id: 'interview_prep',
      title: 'Interview Preparation',
      description: 'Generate interview questions and practice answers',
      icon: Briefcase,
      color: 'from-green-500 to-green-600',
      benefits: ['Sample questions', 'Answer suggestions', 'Technical hints'],
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
        <AIAssistantChat
          resumeText={resumeText}
          jobDescription={jobDescription}
          featureType="general"
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume Text Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Resume
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content here..."
              className="w-full h-64 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Include your summary, experience, skills, and education
            </p>
          </div>

          {/* Job Description Text Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-64 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Include all responsibilities, requirements, and qualifications
            </p>
          </div>
        </div>

        {/* Additional Fields */}
        {(activeTab === 'gap_analysis' || activeTab === 'interview_prep') && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            {activeTab === 'gap_analysis' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Current Skills
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Add a skill and press Enter"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'interview_prep' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interview Details
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company name (optional)"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded"
                      defaultChecked={false}
                      onChange={(e) => {}}
                    />
                    <span className="text-sm text-gray-700">This is a technical role</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Assistant */}
        {(resumeText || jobDescription) && (
          <div className="h-96 border rounded-lg overflow-hidden">
            <AIAssistantChat
              resumeText={resumeText}
              jobDescription={jobDescription}
              featureType={activeTab as any}
            />
          </div>
        )}

        {!resumeText && !jobDescription && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Sparkles className="mx-auto text-blue-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Get Started with AI Assistance
            </h3>
            <p className="text-gray-600">
              Fill in your resume and job description above to unlock AI-powered insights and
              recommendations.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>AI Career Assistant - ResuMatch</title>
        <meta name="description" content="AI-powered career assistance for resume tailoring, interview prep, and more" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-blue-600" size={32} />
              <h1 className="text-4xl font-bold text-gray-900">AI Career Assistant</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get AI-powered guidance for resume optimization, interview preparation, and skill
              development
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() =>
                    setActiveTab(feature.id as 'resume_tailoring' | 'gap_analysis' | 'interview_prep')
                  }
                  className={`p-6 rounded-lg text-left transition transform hover:scale-105 ${
                    activeTab === feature.id
                      ? `bg-gradient-to-br ${feature.color} text-white`
                      : 'bg-white border border-gray-200 text-gray-900 hover:shadow-lg'
                  }`}
                >
                  <Icon size={28} className="mb-3" />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className={`text-sm mb-4 ${activeTab === feature.id ? 'text-blue-100' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                  {activeTab === feature.id && (
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <ChevronRight size={14} />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">{renderFeatureContent()}</div>

          {/* Quick Tips */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-gray-700">
                Be specific with your context. Include detailed job descriptions and complete
                resumes for better recommendations.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-2">🎯 Best Practice</h4>
              <p className="text-sm text-gray-700">
                Follow up with clarifying questions. Our AI improves with conversation and
                context.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-2">⚡ Quick Win</h4>
              <p className="text-sm text-gray-700">
                Copy suggestions directly. All assistant responses can be copied to clipboard
                for easy use.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
