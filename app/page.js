'use client';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import HowItWorks from './sections/HowItWorks';
import Wizard from './sections/Wizard';
import Pricing from './sections/Pricing';
import Roadmap from './sections/Roadmap';
import CTA from './sections/CTA';
import Footer from './components/Footer';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Wizard
        onAnalysisComplete={(score, fastTracked) =>
          setAnalysisResult({ score, fastTracked })
        }
      />
      <Pricing
        score={analysisResult?.score}
        fastTracked={analysisResult?.fastTracked}
      />
      <Roadmap />
      <CTA />
      <Footer />
    </>
  );
}
