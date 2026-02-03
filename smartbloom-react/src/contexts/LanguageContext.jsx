import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Translation dictionary
const translations = {
  en: {
    // Navbar
    nav: {
      liveDemo: "Live Demo",
      howItWorks: "How it works",
      getStarted: "Get Started",
      tryNow: "Try now"
    },
    // Hero
    hero: {
      badge: "AI-Powered Plant Health",
      title: "AI for",
      titleFlower: "Flowers",
      titleAnd: "&",
      titleHealth: "Plant Health",
      description: "SmartBloom identifies flower species and detects common leaf diseases in real-time from a single photo or your camera feed.",
      tryDemo: "Try the Demo",
      learnMore: "Learn More"
    },
    // Metrics
    metrics: {
      title: "Powered by Advanced AI",
      accuracy: "Accuracy",
      detection: "Disease Detection",
      species: "Flower Species",
      fastInference: "Fast Inference"
    },
    // Demo
    demo: {
      title: "Live Demo",
      subtitle: "Upload a plant photo or use your camera. We'll identify the flower and detect visible leaf diseases in one go.",
      flowerTab: "Flower Species",
      diseaseTab: "Leaf Disease",
      tipFlower: "Tip: Aim at the bloom (petals and center) for best species classification.",
      tipDisease: "Tip: Fill the frame with leaves so the model can localize infected regions.",
      input: "Input",
      camera: "Camera",
      upload: "Upload",
      confidence: "Confidence threshold:",
      uploadText: "Click to upload or drag & drop",
      uploadHint: "Supports JPG, PNG, WebP",
      capture: "Capture & Analyze",
      analyzing: "Analyzing…",
      results: "Results",
      noImage: "No image yet",
      flowerSpecies: "Flower Species",
      diseasesDetected: "Diseases Detected:",
      noDiseases: "No diseases detected!",
      healthy: "Your plant appears healthy.",
      chooseFlower: "Choose or capture a bloom image to classify the species.",
      chooseDisease: "Choose or capture a leaf image to detect diseases."
    },
    // How it works
    howItWorks: {
      title: "How it works",
      subtitle: "Two-stage AI pipeline for comprehensive plant analysis",
      step1: {
        title: "Capture or Upload",
        desc: "Provide a plant image using webcam or file upload."
      },
      step2: {
        title: "Flower Species",
        desc: "EfficientNet-B0 classifies the flower into 1 of 102+ species."
      },
      step3: {
        title: "Leaf Disease",
        desc: "YOLOv11 scans the leaves and lists any detected diseases."
      },
      step4: {
        title: "Actionable Output",
        desc: "Results are returned instantly for your next step."
      }
    },
    // Assistant
    assistant: {
      title: "SmartBloom Assistant",
      typing: "Analyzing...",
      noApiKey: "AI recommendations require an OpenRouter API key.",
      quickTips: "Quick Treatment Tips:",
      prevention: "Prevention:",
      addApiKey: "For detailed AI-powered recommendations, please add your OpenRouter API key in RocketAssistant.jsx"
    },
    // FeatureGrid
    features: {
      title: "Why SmartBloom",
      camera: {
        title: "Camera or Upload",
        desc: "Switch instantly between webcam capture or file upload."
      },
      twoStage: {
        title: "Two-Stage AI",
        desc: "EfficientNet for species + YOLO for leaf diseases."
      },
      realtime: {
        title: "Real-time",
        desc: "Optimized pipeline with GPU acceleration."
      },
      privacy: {
        title: "Privacy First",
        desc: "Images are processed locally on your machine/server."
      },
      api: {
        title: "Simple API",
        desc: "FastAPI backend with clean endpoints."
      },
      artifacts: {
        title: "Artifacts & Logs",
        desc: "Every run is saved for reproducibility."
      }
    },
    // CTA
    cta: {
      title: "Bring AI to your garden, lab, or classroom.",
      subtitle: "Run locally or deploy to the cloud with the same API. Start with the live demo above.",
      button: "Try SmartBloom"
    },
    // Footer
    footer: {
      brand: "SmartBloom",
      copyright: "Built with AI & ❤️ for plants.",
      demo: "Demo",
      howItWorks: "How It Works"
    }
  },
  ar: {
    // Navbar
    nav: {
      liveDemo: "تجربة مباشرة",
      howItWorks: "كيف يعمل",
      getStarted: "ابدأ الآن",
      tryNow: "جرب الآن"
    },
    // Hero
    hero: {
      badge: "صحة النبات بالذكاء الاصطناعي",
      title: "الذكاء الاصطناعي لـ",
      titleFlower: "الزهور",
      titleAnd: "و",
      titleHealth: "صحة النبات",
      description: "SmartBloom يحدد أنواع الزهور ويكتشف أمراض الأوراق الشائعة في الوقت الفعلي من صورة واحدة أو كاميرا الجهاز.",
      tryDemo: "جرب العرض التوضيحي",
      learnMore: "اعرف المزيد"
    },
    // Metrics
    metrics: {
      title: "مدعوم بالذكاء الاصطناعي المتقدم",
      accuracy: "الدقة",
      detection: "كشف الأمراض",
      species: "أنواع الزهور",
      fastInference: "الاستدلال السريع"
    },
    // Demo
    demo: {
      title: "تجربة مباشرة",
      subtitle: "قم بتحميل صورة نبات أو استخدم الكاميرا. سنحدد الزهرة ونكتشف أمراض الأوراق المرئية دفعة واحدة.",
      flowerTab: "أنواع الزهور",
      diseaseTab: "أمراض الأوراق",
      tipFlower: "نصيحة: ركز على الزهرة (البتلات والمركز) للحصول على أفضل تصنيف للأنواع.",
      tipDisease: "نصيحة: املأ الإطار بالأوراق حتى يتمكن النموذج من تحديد المناطق المصابة.",
      input: "الإدخال",
      camera: "الكاميرا",
      upload: "رفع",
      confidence: "عتبة الثقة:",
      uploadText: "انقر للرفع أو اسحب وأفلت",
      uploadHint: "يدعم JPG, PNG, WebP",
      capture: "التقاط والتحليل",
      analyzing: "جارٍ التحليل…",
      results: "النتائج",
      noImage: "لا توجد صورة بعد",
      flowerSpecies: "نوع الزهرة",
      diseasesDetected: "الأمراض المكتشفة:",
      noDiseases: "لم يتم اكتشاف أمراض!",
      healthy: "نباتك يبدو بصحة جيدة.",
      chooseFlower: "اختر أو التقط صورة زهرة لتصنيف النوع.",
      chooseDisease: "اختر أو التقط صورة ورقة لاكتشاف الأمراض."
    },
    // How it works
    howItWorks: {
      title: "كيف يعمل",
      subtitle: "خط أنابيب ذكاء اصطناعي من مرحلتين لتحليل شامل للنباتات",
      step1: {
        title: "التقاط أو رفع",
        desc: "قدم صورة نبات باستخدام كاميرا الويب أو رفع الملف."
      },
      step2: {
        title: "نوع الزهرة",
        desc: "EfficientNet-B0 يصنف الزهرة إلى واحدة من 102+ نوع."
      },
      step3: {
        title: "أمراض الأوراق",
        desc: "YOLOv11 يفحص الأوراق ويسرد أي أمراض مكتشفة."
      },
      step4: {
        title: "مخرجات قابلة للتنفيذ",
        desc: "تُعاد النتائج فوراً لخطوتك التالية."
      }
    },
    // Assistant
    assistant: {
      title: "مساعد SmartBloom",
      typing: "جارٍ التحليل...",
      noApiKey: "تتطلب التوصيات بالذكاء الاصطناعي مفتاح OpenRouter API.",
      quickTips: "نصائح العلاج السريع:",
      prevention: "الوقاية:",
      addApiKey: "للحصول على توصيات مفصلة بالذكاء الاصطناعي، يرجى إضافة مفتاح OpenRouter API في RocketAssistant.jsx"
    },
    // FeatureGrid
    features: {
      title: "لماذا SmartBloom",
      camera: {
        title: "الكاميرا أو الرفع",
        desc: "التبديل فوراً بين التقاط الكاميرا أو رفع الملف."
      },
      twoStage: {
        title: "ذكاء اصطناعي من مرحلتين",
        desc: "EfficientNet للأنواع + YOLO لأمراض الأوراق."
      },
      realtime: {
        title: "في الوقت الفعلي",
        desc: "خط أنابيب محسّن مع تسريع GPU."
      },
      privacy: {
        title: "الخصوصية أولاً",
        desc: "يتم معالجة الصور محلياً على جهازك/الخادم."
      },
      api: {
        title: "واجهة برمجة بسيطة",
        desc: "خادم FastAPI مع نقاط نهاية نظيفة."
      },
      artifacts: {
        title: "القطع الأثرية والسجلات",
        desc: "يتم حفظ كل تشغيل لإمكانية إعادة الإنتاج."
      }
    },
    // CTA
    cta: {
      title: "أحضر الذكاء الاصطناعي إلى حديقتك أو مختبرك أو فصلك الدراسي.",
      subtitle: "شغّل محلياً أو انشره على السحابة بنفس واجهة البرمجة. ابدأ بالعرض التوضيحي المباشر أعلاه.",
      button: "جرب SmartBloom"
    },
    // Footer
    footer: {
      brand: "SmartBloom",
      copyright: "مبني بالذكاء الاصطناعي و ❤️ للنباتات.",
      demo: "تجربة",
      howItWorks: "كيف يعمل"
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Load from localStorage or default to English
    return localStorage.getItem('smartbloom-language') || 'en';
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('smartbloom-language', language);
    
    // Update document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

