import React, { useEffect, useState } from 'react'
import { Leaf } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'


export default function Navbar(){
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{y:-30, opacity:0}} 
      animate={{y:0, opacity:1}} 
      transition={{type:'spring', stiffness:90}}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-strong shadow-2xl' 
          : 'glass'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-bold text-xl group">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Leaf className="text-primary-green w-6 h-6" />
          </motion.div>
          <span className="text-gradient">SmartBloom</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a 
            href="#demo" 
            className="text-gray-300 hover:text-white transition-colors relative group"
          >
            {t('nav.liveDemo')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-green to-pink-glow group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="#how" 
            className="text-gray-300 hover:text-white transition-colors relative group"
          >
            {t('nav.howItWorks')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-green to-pink-glow group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="#cta" 
            className="text-gray-300 hover:text-white transition-colors relative group"
          >
            {t('nav.getStarted')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-green to-pink-glow group-hover:w-full transition-all duration-300"></span>
          </a>
        </nav>
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <motion.button
            onClick={toggleLanguage}
            className="relative px-3 py-2 rounded-xl glass hover:glass-strong transition-all duration-300 overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ perspective: '1000px' }}
          >
            <motion.div
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.5 }}
              key={language}
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <span className="text-xl">{language === 'en' ? '🇬🇧' : '🇯🇴'}</span>
              <span className="text-gradient">{language === 'en' ? 'EN' : 'AR'}</span>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-green/20 to-pink-glow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
          
          <motion.a 
            href="#demo" 
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-green to-primary-green-dark text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary-green/50 transition-all duration-300 relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">{t('nav.tryNow')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-glow to-purple-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.a>
        </div>
      </div>
    </motion.header>
  )
}
