import React from 'react'
import { motion } from 'framer-motion'
import { Camera, Cpu, Upload, ImageDown, Zap, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'


export default function FeatureGrid(){
  const { t, language } = useLanguage();
  
  const items = [
    { 
      icon: <Camera className="w-6 h-6" />, 
      title: t('features.camera.title'), 
      desc: t('features.camera.desc'), 
      gradient: 'from-primary-green to-primary-green-light' 
    },
    { 
      icon: <Cpu className="w-6 h-6" />, 
      title: t('features.twoStage.title'), 
      desc: t('features.twoStage.desc'), 
      gradient: 'from-pink-glow to-purple-accent' 
    },
    { 
      icon: <Zap className="w-6 h-6" />, 
      title: t('features.realtime.title'), 
      desc: t('features.realtime.desc'), 
      gradient: 'from-purple-accent to-blue-accent' 
    },
    { 
      icon: <ShieldCheck className="w-6 h-6" />, 
      title: t('features.privacy.title'), 
      desc: t('features.privacy.desc'), 
      gradient: 'from-blue-accent to-primary-green' 
    },
    { 
      icon: <Upload className="w-6 h-6" />, 
      title: t('features.api.title'), 
      desc: t('features.api.desc'), 
      gradient: 'from-primary-green to-pink-glow' 
    },
    { 
      icon: <ImageDown className="w-6 h-6" />, 
      title: t('features.artifacts.title'), 
      desc: t('features.artifacts.desc'), 
      gradient: 'from-pink-glow to-purple-accent' 
    },
  ]

return (
<motion.section 
  className="py-20" 
  initial={{opacity:0, y:40}} 
  whileInView={{opacity:1, y:0}} 
  viewport={{once:true}}
  transition={{duration: 0.6}}
>
  <h2 className={`text-3xl md:text-5xl font-extrabold mb-12 text-center text-gradient ${language === 'ar' ? 'text-right' : 'text-left'}`}>
    {t('features.title')}
  </h2>
  <div className="grid md:grid-cols-3 gap-6">
    {items.map((it, i)=> (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
        whileHover={{ scale: 1.05, y: -8 }}
        className="card p-6 relative overflow-hidden group"
      >
        {/* Gradient background on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r ${it.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
        
        <div className={`relative z-10 w-12 h-12 rounded-xl bg-gradient-to-r ${it.gradient} flex items-center justify-center text-white mb-4 shadow-lg`}>
          {it.icon}
        </div>
        
        <div className={`relative z-10 font-bold text-lg mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{it.title}</div>
        <p className={`relative z-10 text-sm text-gray-400 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>{it.desc}</p>
      </motion.div>
    ))}
  </div>
</motion.section>
)
}
