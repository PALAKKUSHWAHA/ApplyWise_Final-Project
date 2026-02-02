import React, { useState } from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Welcome from '@/components/Welcome';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleStartClick = () => {
    setShowWelcome(false);
  };

  return (
    <>
      <Head>
        <title>ApplyWise - Your Resume Analyser</title>
        <meta 
          name="description" 
          content="AI-powered resume analysis and job matching using intelligent algorithms." 
        />
        <meta name="keywords" content="resume analysis, AI matching, job compatibility, NLP, machine learning" />
        <meta property="og:title" content="ApplyWise - Your Resume Analyser" />
        <meta property="og:description" content="AI-powered resume and job description matching." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="min-h-screen">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <Welcome key="welcome" onStart={handleStartClick} />
          ) : (
            <div key="main">
              <Header />
              <main>
                <Hero />
                <Features />
              </main>
              <Footer />
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
