import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'


export default function Footer(){
  const { t, language } = useLanguage();
  
  return (
<footer className="py-12 text-center border-t border-gray-800 relative">
  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-green to-transparent opacity-50"></div>
  <div className="max-w-7xl mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col md:flex-row items-center justify-between gap-4"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Brand - Left in LTR, Right in RTL */}
      <div className={`text-gradient font-bold text-lg ${language === 'ar' ? 'order-3' : 'order-1'}`}>
        🌸 {t('footer.brand')}
      </div>
      
      {/* Copyright - Center */}
      <div className={`text-sm text-gray-400 order-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        © {new Date().getFullYear()} {t('footer.brand')}. {t('footer.copyright')}
      </div>
      
      {/* Links - Right in LTR, Left in RTL */}
      <div className={`flex gap-6 text-sm ${language === 'ar' ? 'flex-row-reverse order-1' : 'order-3'}`}>
        <a href="#demo" className="text-gray-400 hover:text-primary-green transition-colors">{t('footer.demo')}</a>
        <a href="#how" className="text-gray-400 hover:text-primary-green transition-colors">{t('footer.howItWorks')}</a>
      </div>
    </motion.div>
  </div>
</footer>
)
}
