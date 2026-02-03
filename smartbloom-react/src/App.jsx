import React from 'react'
import { motion } from 'framer-motion'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MetricsStrip from './components/MetricsStrip'
import FeatureGrid from './components/FeatureGrid'
import LiveDemo from './components/LiveDemo'
import HowItWorks from './components/HowItWorks'
import CTA from './components/CTA'
import Footer from './components/Footer'
import { useLanguage } from './contexts/LanguageContext'

function AppContent() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen relative">
      {/* Animated Background Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Hero />
          <MetricsStrip />
          <FeatureGrid />
          <motion.section 
            id="demo" 
            className="py-20" 
            initial={{opacity:0, y:40}} 
            whileInView={{opacity:1, y:0}} 
            viewport={{once:true}}
            transition={{duration: 0.6}}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-center text-gradient">
              {t('demo.title')}
            </h2>
            <p className="text-center text-gray-400 mb-12 text-lg">
              {t('demo.subtitle')}
            </p>
            <LiveDemo />
          </motion.section>
          <HowItWorks />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}
