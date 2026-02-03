import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'


export default function Hero(){
  const { t, language } = useLanguage();
  
  return (
<section className="pt-20 md:pt-32 pb-20 min-h-screen flex items-center">
<div className={`grid md:grid-cols-2 gap-12 items-center w-full ${language === 'ar' ? 'md:grid-flow-dense' : ''}`}>
  <motion.div 
    initial={{opacity:0, y:30}} 
    animate={{opacity:1, y:0}} 
    transition={{duration:0.8, delay: 0.2}}
    className={`space-y-6 ${language === 'ar' ? 'md:col-start-2' : ''}`}
  >
    {/* Badge */}
    <motion.div
      initial={{opacity:0, scale:0.9}}
      animate={{opacity:1, scale:1}}
      transition={{duration:0.5, delay: 0.3}}
      className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-gray-300"
    >
      <span className="text-lg">✨</span>
      <span>{t('hero.badge')}</span>
    </motion.div>

    <h1 className={`text-5xl md:text-7xl font-extrabold leading-tight ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      {t('hero.title')}{' '}
      <motion.span
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          repeatDelay: 1
        }}
        className="inline-block"
      >
        🌸
      </motion.span>{' '}
      {t('hero.titleFlower')} {t('hero.titleAnd')}{' '}
      <span className="text-gradient">{t('hero.titleHealth')}</span>
    </h1>
    
    <p className={`text-xl text-gray-400 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      {t('hero.description')}
    </p>
    
    <div className={`flex items-center gap-4 flex-wrap ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
      <motion.a 
        href="#demo" 
        className="px-6 py-3 bg-gradient-to-r from-primary-green to-primary-green-dark text-white rounded-xl font-semibold shadow-lg shadow-primary-green/30 hover:shadow-xl hover:shadow-primary-green/50 transition-all duration-300 relative overflow-hidden group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className={`relative z-10 flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          {t('hero.tryDemo')}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={`group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`}>
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-glow to-purple-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </motion.a>
      
      <motion.a 
        href="#how" 
        className="px-6 py-3 glass rounded-xl font-semibold hover:glass-strong transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('hero.learnMore')}
      </motion.a>
    </div>
  </motion.div>
  
  <motion.div 
    initial={{opacity:0, scale:0.9, rotateY: -10}} 
    animate={{opacity:1, scale:1, rotateY: 0}} 
    transition={{type:'spring', stiffness:80, delay: 0.4}}
    className={`relative ${language === 'ar' ? 'md:col-start-1 md:row-start-1' : ''}`}
  >
    <div className="relative rounded-3xl overflow-hidden glass-strong shadow-2xl">
      {/* Scan ripple effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 border-2 border-primary-green rounded-3xl"
          animate={{
            opacity: [0.5, 0, 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="aspect-video bg-gradient-to-br from-primary-green/20 via-transparent to-pink-glow/20 relative">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-green/30 via-transparent to-pink-glow/30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating particles effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-green rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  </motion.div>
</div>
</section>
)
}
