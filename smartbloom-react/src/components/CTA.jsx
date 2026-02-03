import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'


export default function CTA(){
  const { t, language } = useLanguage();
  
  return (
<motion.section 
  id="cta" 
  className="py-24" 
  initial={{opacity:0, scale:0.98}} 
  whileInView={{opacity:1, scale:1}} 
  viewport={{once:true}}
  transition={{duration: 0.6}}
>
  <div className="relative rounded-3xl glass-strong p-12 text-center overflow-hidden">
    {/* Animated gradient background */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-primary-green/20 via-pink-glow/20 to-purple-accent/20"
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    
    <div className="relative z-10">
      <h3 className="text-3xl md:text-4xl font-extrabold mb-4 text-gradient">
        {t('cta.title')}
      </h3>
      <p className="text-gray-400 mt-2 text-lg mb-8">
        {t('cta.subtitle')}
      </p>
      <motion.a 
        href="#demo" 
        className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-primary-green to-primary-green-dark text-white font-bold hover:shadow-2xl hover:shadow-primary-green/50 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('cta.button')}
      </motion.a>
    </div>
  </div>
</motion.section>
)
}
