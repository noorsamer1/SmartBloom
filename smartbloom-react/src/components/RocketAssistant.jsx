import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * SmartBloom Rocket Assistant Component
 * Shows rocket animation → transforms to chat → displays AI recommendations
 */

const OPENROUTER_API_KEY = "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "deepseek/deepseek-chat";

export default function RocketAssistant({ detections, isVisible, onClose }) {
  const { language, t } = useLanguage();
  const [phase, setPhase] = useState('hidden'); // hidden | rocket | chat
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageRef = useRef(null);

  useEffect(() => {
    console.log("🚀 RocketAssistant useEffect:", { isVisible, detectionsLength: detections?.length, phase });
    
    if (isVisible && detections && detections.length > 0) {
      console.log("✅ Starting rocket animation...");
      // Reset and start rocket animation
      setPhase('hidden'); // Reset first
      setTimeout(() => {
        setPhase('rocket');
        setMessage('');
        setIsTyping(false);
        
        // After rocket animation, add impact bounce then transform to chat
        setTimeout(() => {
          console.log("💬 Adding impact bounce...");
          // Small delay for impact effect
          setTimeout(() => {
            console.log("💬 Transforming to chat...");
            setPhase('chat');
            setIsTyping(true);
            fetchRecommendations(detections);
          }, 200); // Impact bounce delay
        }, 2200); // Match rocket animation duration (slower)
      }, 50); // Small delay to ensure reset
    } else {
      console.log("❌ Hiding assistant");
      setPhase('hidden');
      setMessage('');
      setIsTyping(false);
    }
  }, [isVisible, detections, language]);

  async function fetchRecommendations(detections) {
    // Check if API key is configured
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "YOUR_OPENROUTER_API_KEY_HERE") {
      console.warn("⚠️ OpenRouter API key not configured. Showing fallback message.");
      setIsTyping(false);
      const diseaseNames = detections.map(d => d.label).join(", ");
      const fallbackMessage = `🌿 **Detected Disease: ${diseaseNames}**

⚠️ **Note:** AI recommendations require an OpenRouter API key.

**Quick Treatment Tips:**
• Isolate affected plants immediately
• Remove and dispose of infected leaves
• Improve air circulation around plants
• Avoid overhead watering
• Apply appropriate fungicide if needed
• Monitor plant health regularly

**Prevention:**
• Maintain proper spacing between plants
• Water at the base, not on leaves
• Keep garden tools clean
• Rotate crops if possible

For detailed AI-powered recommendations, please add your OpenRouter API key in RocketAssistant.jsx`;
      setMessage(fallbackMessage);
      return;
    }
    
    try {
      const diseaseNames = detections.map(d => d.label);
      const diseaseText = diseaseNames.length === 1 
        ? diseaseNames[0] 
        : diseaseNames.join(", ");
      
      // Language-aware prompt - STRICT: Only respond in the requested language
      const prompt = language === 'ar'
        ? `أعطني توصيات واضحة حول مرض النبات المكتشف: ${diseaseText}.

**مهم جداً:** يجب أن تكون جميع الإجابات باللغة العربية فقط. لا تستخدم الإنجليزية أبداً.

اشرح:
- ما هو المرض
- لماذا يحدث
- درجة الخطورة
- خطوات العلاج السريعة
- نصائح الوقاية

بأسلوب بسيط وعملي. استخدم 4-6 نقاط. اكتب بأسلوب دافئ ومفيد مثل خبير رعاية النباتات. استخدم اللغة العربية فقط في كل شيء.`
        : `Given these detected leaf diseases: ${diseaseText}

**IMPORTANT:** All responses must be in English only. Do not use Arabic or any other language.

Write a friendly, plant-doctor-style recommendation that includes:
- What the disease is
- Why it happens
- Severity assessment
- Fast treatment steps
- Prevention advice

Keep it simple but professional. Use 4-6 bullet points. Write in a warm, helpful tone like a plant care expert. Use English only for everything.`;

      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "SmartBloom AI Assistant"
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 600  // Increased from 350 to allow complete responses
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const recommendation = data.choices[0]?.message?.content || 
        (language === 'ar' ? "تعذر جلب التوصيات في هذا الوقت." : "Unable to fetch recommendations at this time.");

      setIsTyping(false);
      // Small delay to ensure container is ready
      setTimeout(() => {
        typeWriterEffect(recommendation);
      }, 100);
      
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setIsTyping(false);
      
      // Show helpful fallback message
      const diseaseNames = detections.map(d => d.label).join(", ");
      const fallbackMessage = `🌿 **Detected Disease: ${diseaseNames}**

⚠️ **Note:** AI recommendations require an OpenRouter API key.

**Quick Treatment Tips:**
• Isolate affected plants immediately
• Remove and dispose of infected leaves
• Improve air circulation around plants
• Avoid overhead watering
• Apply appropriate fungicide if needed
• Monitor plant health regularly

**Prevention:**
• Maintain proper spacing between plants
• Water at the base, not on leaves
• Keep garden tools clean
• Rotate crops if possible

For detailed AI-powered recommendations, please add your OpenRouter API key in RocketAssistant.jsx`;
      
      setMessage(fallbackMessage);
    }
  }

  function typeWriterEffect(text, speed = 25) {
    let i = 0;
    let htmlContent = "";
    
    function type() {
      if (i < text.length) {
        const char = text[i];
        
        // Handle markdown formatting
        if (text.substring(i, i + 3) === '**') {
          // Bold text
          htmlContent += '<strong>';
          i += 2;
          // Find closing **
          while (i < text.length && text.substring(i, i + 2) !== '**') {
            htmlContent += text[i];
            i++;
          }
          if (i < text.length) {
            htmlContent += '</strong>';
            i += 2;
          }
        } else if (text.substring(i, i + 2) === '*•') {
          // Special bullet point (handle Arabic formatting)
          htmlContent += '<span class="text-primary-green font-bold">•</span> ';
          i += 2;
        } else if (text.substring(i, i + 2) === '* ') {
          htmlContent += '<span class="text-primary-green font-bold">•</span> ';
          i += 2;
        } else if (text.substring(i, i + 2) === '- ') {
          htmlContent += '<span class="text-primary-green font-bold">•</span> ';
          i += 2;
        } else if (text.substring(i, i + 3) === '###') {
          // Heading
          htmlContent += '<h3 class="text-lg font-bold text-primary-green mt-4 mb-2">';
          i += 3;
          // Skip whitespace after ###
          while (i < text.length && (text[i] === ' ' || text[i] === '\t')) {
            i++;
          }
          // Find newline
          while (i < text.length && text[i] !== '\n') {
            htmlContent += text[i];
            i++;
          }
          htmlContent += '</h3>';
          if (i < text.length) {
            htmlContent += '<br>';
            i++;
          }
        } else if (char === '\n') {
          htmlContent += '<br>';
          i++;
        } else {
          // Escape HTML special characters
          if (char === '<') {
            htmlContent += '&lt;';
          } else if (char === '>') {
            htmlContent += '&gt;';
          } else {
            htmlContent += char;
          }
          i++;
        }
        
        setMessage(htmlContent);
        
        // Auto-scroll to bottom after DOM update
        setTimeout(() => {
          if (messageRef.current) {
            messageRef.current.scrollTop = messageRef.current.scrollHeight;
          }
        }, 10);
        
        setTimeout(type, speed);
      }
    }
    
    type();
  }

  if (phase === 'hidden') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" style={{ overflow: 'visible' }}>
      {/* Rocket Phase - ENLARGED & ENHANCED */}
      <AnimatePresence mode="wait">
        {phase === 'rocket' && (
          <motion.div
            key="rocket"
            initial={{ 
              x: -150,
              y: typeof window !== 'undefined' ? window.innerHeight + 150 : 1200,
              rotate: -45,
              scale: 1.4, // 40% larger
              opacity: 0
            }}
            animate={{ 
              x: typeof window !== 'undefined' ? window.innerWidth / 2 - 48 : 600, // Center horizontally (48px = half of 96px rocket width)
              y: typeof window !== 'undefined' ? window.innerHeight / 2 - 48 : 500, // Center vertically
              rotate: [0, 15, -10, 0], // Spinning animation
              scale: [1.4, 1.5, 0.4], // Scale down for transformation
              opacity: [0, 1, 1, 0.8]
            }}
            exit={{ 
              opacity: 0,
              scale: 0.3,
              rotate: 0
            }}
            transition={{ 
              duration: 2.2, // Slower animation (was 1.4)
              ease: [0.18, 0.89, 0.32, 1.28], // More dramatic curve
              times: [0, 0.6, 0.9, 1] // Timing for different phases
            }}
            className="fixed"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 60px rgba(16, 185, 129, 0.6))',
              zIndex: 10000,
              pointerEvents: 'none',
              left: 0,
              top: 0
            }}
          >
            {/* Leaf-shaped Rocket - ENLARGED */}
            <div className="relative w-24 h-24" style={{ width: '96px', height: '96px' }}>
              <svg width="96" height="96" viewBox="0 0 60 60" className="rocket-svg" style={{ filter: 'blur(0.5px)' }}>
                <defs>
                  <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#10b981", stopOpacity:1}} />
                    <stop offset="50%" style={{stopColor:"#34d399", stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:"#ec4899", stopOpacity:1}} />
                  </linearGradient>
                  <filter id="motionBlur">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
                  </filter>
                  <radialGradient id="glowGradient">
                    <stop offset="0%" style={{stopColor:"#ec4899", stopOpacity:0.8}} />
                    <stop offset="100%" style={{stopColor:"#10b981", stopOpacity:0.4}} />
                  </radialGradient>
                </defs>
                <path 
                  d="M30 5 L45 20 L40 30 L30 25 L20 30 L15 20 Z" 
                  fill="url(#rocketGradient)" 
                  filter="url(#motionBlur)"
                  className="rocket-body"
                />
                <circle cx="30" cy="5" r="4" fill="#ec4899" style={{ filter: 'drop-shadow(0 0 8px #ec4899)' }} />
              </svg>
              
              {/* Enhanced Glowing Tail - More Intense */}
              <motion.div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full"
                style={{
                  width: '6px',
                  height: '60px',
                  background: 'linear-gradient(to top, rgba(236, 72, 153, 1) 0%, rgba(16, 185, 129, 0.8) 50%, transparent 100%)',
                  boxShadow: '0 0 30px rgba(236, 72, 153, 0.8), 0 0 60px rgba(16, 185, 129, 0.6)'
                }}
                animate={{
                  height: ['60px', '80px', '60px'],
                  opacity: [0.8, 1, 0.8],
                  boxShadow: [
                    '0 0 30px rgba(236, 72, 153, 0.8), 0 0 60px rgba(16, 185, 129, 0.6)',
                    '0 0 50px rgba(236, 72, 153, 1), 0 0 100px rgba(16, 185, 129, 0.8)',
                    '0 0 30px rgba(236, 72, 153, 0.8), 0 0 60px rgba(16, 185, 129, 0.6)'
                  ]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Particle Trail - More Dense */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: '4px',
                    height: '4px',
                    background: `radial-gradient(circle, rgba(236, 72, 153, ${0.9 - i * 0.04}), rgba(16, 185, 129, ${0.7 - i * 0.03}), transparent)`,
                    left: '50%',
                    bottom: `${-20 - i * 8}px`,
                    boxShadow: '0 0 8px rgba(236, 72, 153, 0.8)'
                  }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 40],
                    y: [0, -60 - i * 10],
                    opacity: [1, 0],
                    scale: [1, 0.2]
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.03,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Phase - Enhanced Transformation */}
      <AnimatePresence mode="wait">
        {phase === 'chat' && (
          <motion.div
            key="chat"
            initial={{ 
              opacity: 0, 
              scale: 1.2, // Start larger for impact
              rotate: 360, // Magic twirl
              filter: 'blur(10px)',
              left: typeof window !== 'undefined' ? '50%' : '50%',
              top: typeof window !== 'undefined' ? '50%' : '50%',
              x: '-50%',
              y: '-50%'
            }}
            animate={{ 
              opacity: [0, 1, 1],
              scale: [1.2, 1.05, 1], // Impact bounce: 120% → 105% → 100%
              rotate: 0,
              filter: 'blur(0px)',
              left: typeof window !== 'undefined' ? (language === 'ar' ? '20px' : 'auto') : 'auto',
              right: typeof window !== 'undefined' ? (language === 'ar' ? 'auto' : '20px') : 'auto',
              bottom: '20px',
              top: 'auto',
              x: 0,
              y: 0
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1],
              times: [0, 0.5, 1]
            }}
            className="fixed pointer-events-auto"
            style={{
              transformOrigin: 'center center',
              zIndex: 10000,
              maxWidth: '320px',
              width: '320px'
            }}
          >
            {/* Glow Bloom Effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ 
                scale: 0.8,
                opacity: 0.8,
                boxShadow: '0 0 0px rgba(16, 185, 129, 0), 0 0 0px rgba(236, 72, 153, 0)'
              }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.8, 0, 0],
                boxShadow: [
                  '0 0 0px rgba(16, 185, 129, 0), 0 0 0px rgba(236, 72, 153, 0)',
                  '0 0 80px rgba(16, 185, 129, 0.6), 0 0 120px rgba(236, 72, 153, 0.4)',
                  '0 0 0px rgba(16, 185, 129, 0), 0 0 0px rgba(236, 72, 153, 0)'
                ]
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut"
              }}
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="glass-strong rounded-2xl shadow-2xl max-w-[calc(100vw-40px)] max-h-[500px] flex flex-col overflow-hidden border border-white/30 relative w-full"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(16, 185, 129, 0.3), 0 0 60px rgba(236, 72, 153, 0.2)'
              }}
            >
              {/* Gradient border top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-green via-pink-glow to-purple-accent" />
              
              {/* Header */}
              <div className={`flex items-center justify-between p-4 border-b border-white/10 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 font-bold text-lg text-gradient ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🍃
                  </motion.span>
                  <span>{t('assistant.title')}</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div 
                ref={messageRef}
                className={`p-4 overflow-y-auto flex-1 max-h-[400px] ${language === 'ar' ? 'text-right' : 'text-left'}`}
                style={{ scrollBehavior: 'smooth' }}
              >
                <div className={`text-sm text-gray-200 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {isTyping ? (
                    <div className={`flex gap-1.5 items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <span className="w-2 h-2 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <span className="w-2 h-2 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      <span className="ml-2 text-gray-400 text-xs">{t('assistant.typing')}</span>
                    </div>
                  ) : (
                    <div 
                      dangerouslySetInnerHTML={{ __html: message || '' }}
                      className="whitespace-pre-line"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

