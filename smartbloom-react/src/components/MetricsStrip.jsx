import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'


export default function MetricsStrip(){
  const { t, language } = useLanguage();
  const [counters, setCounters] = useState({ accuracy: 0, species: 0 });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      // Animate accuracy counter
      let accuracyCount = 0;
      const accuracyInterval = setInterval(() => {
        accuracyCount += 2;
        if (accuracyCount >= 94) {
          accuracyCount = 94;
          clearInterval(accuracyInterval);
        }
        setCounters(prev => ({ ...prev, accuracy: accuracyCount }));
      }, 30);

      // Animate species counter
      let speciesCount = 0;
      const speciesInterval = setInterval(() => {
        speciesCount += 3;
        if (speciesCount >= 102) {
          speciesCount = 102;
          clearInterval(speciesInterval);
        }
        setCounters(prev => ({ ...prev, species: speciesCount }));
      }, 20);

      return () => {
        clearInterval(accuracyInterval);
        clearInterval(speciesInterval);
      };
    }
  }, [isInView]);

  const metrics = [
    { 
      kpi: `${counters.accuracy}%`, 
      label: t('metrics.accuracy'),
      icon: '🎯',
      gradient: 'from-primary-green to-primary-green-light'
    },
    { 
      kpi: 'YOLOv11', 
      label: t('metrics.detection'),
      icon: '🚀',
      gradient: 'from-pink-glow to-purple-accent'
    },
    { 
      kpi: `${counters.species}+`, 
      label: t('metrics.species'),
      icon: '🌺',
      gradient: 'from-purple-accent to-blue-accent'
    },
    { 
      kpi: 'GPU-Ready', 
      label: t('metrics.fastInference'),
      icon: '⚡',
      gradient: 'from-blue-accent to-primary-green'
    },
  ]

  return (
    <motion.section 
      ref={ref}
      className="py-16" 
      initial={{opacity:0, y:40}} 
      whileInView={{opacity:1, y:0}} 
      viewport={{once:true}}
      transition={{duration: 0.6}}
    >
      <h2 className={`text-3xl md:text-5xl font-extrabold mb-12 text-center text-gradient ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        {t('metrics.title')}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i)=> (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.05, y: -8 }}
            className="card p-6 text-center relative overflow-hidden group"
          >
            {/* Gradient border on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${m.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`}></div>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              className="text-4xl mb-4"
            >
              {m.icon}
            </motion.div>
            
            <div className={`text-4xl font-extrabold mb-2 bg-gradient-to-r ${m.gradient} bg-clip-text text-transparent`}>
              {m.kpi}
            </div>
            <div className={`text-sm text-gray-400 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{m.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
