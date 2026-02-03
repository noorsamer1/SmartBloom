import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'


export default function HowItWorks(){
  const { t, language } = useLanguage();
  
  const steps = [
    { t: t('howItWorks.step1.title'), d: t('howItWorks.step1.desc'), icon: '📸', num: 1 },
    { t: t('howItWorks.step2.title'), d: t('howItWorks.step2.desc'), icon: '🌺', num: 2 },
    { t: t('howItWorks.step3.title'), d: t('howItWorks.step3.desc'), icon: '🍃', num: 3 },
    { t: t('howItWorks.step4.title'), d: t('howItWorks.step4.desc'), icon: '📊', num: 4 },
  ]

return (
<motion.section 
  id="how" 
  className="py-20 relative" 
  initial={{opacity:0}} 
  whileInView={{opacity:1}} 
  viewport={{once:true}}
  transition={{duration: 0.6}}
>
  <h2 className={`text-3xl md:text-5xl font-extrabold mb-6 text-center text-gradient ${language === 'ar' ? 'text-right' : 'text-left'}`}>
    {t('howItWorks.title')}
  </h2>
  <p className={`text-center text-gray-400 mb-12 text-lg ${language === 'ar' ? 'text-right' : 'text-left'}`}>
    {t('howItWorks.subtitle')}
  </p>
  
  {/* Connecting line */}
  <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-green via-pink-glow to-primary-green opacity-20" style={{ transform: 'translateY(-50%)' }}></div>
  
  <div className="grid md:grid-cols-4 gap-6 relative">
    {steps.map((s, i)=> (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: i * 0.15 }}
        whileHover={{ scale: 1.05, y: -8 }}
        className="card p-6 text-center relative z-10"
      >
        {/* Step number badge */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-primary-green to-pink-glow flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {s.num}
        </div>
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
          className="text-5xl mb-4 mt-2"
        >
          {s.icon}
        </motion.div>
        
        <div className="font-bold text-lg mb-2">{s.t}</div>
        <p className="text-sm text-gray-400 leading-relaxed">{s.d}</p>
      </motion.div>
    ))}
  </div>
</motion.section>
)
}
