import React, { useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { predictFlower, predictDisease } from "../api";
import { Camera, Upload, Sparkles, Loader2 } from "lucide-react";
import RocketAssistant from "./RocketAssistant";
import { useLanguage } from "../contexts/LanguageContext";

/* ----------------------------- UI helpers ----------------------------- */

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-40 bg-gray-800 rounded-xl" />
      <div className="h-4 bg-gray-800 rounded" />
      <div className="h-4 bg-gray-800 rounded w-2/3" />
    </div>
  );
}

// Draw normalized (0..1) bounding boxes over an image container
function BoundingBoxes({ boxes = [], containerRef }) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const updateSize = () => {
      // Get the actual image element inside the container
      const img = el.querySelector('img');
      if (img) {
        // Use the image's natural dimensions or displayed dimensions
        const imgWidth = img.offsetWidth || img.clientWidth;
        const imgHeight = img.offsetHeight || img.clientHeight;
        setSize({ w: imgWidth, h: imgHeight });
      } else {
        setSize({ w: el.clientWidth, h: el.clientHeight });
      }
    };

    // Initial size
    updateSize();

    // Watch for resize
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    
    // Also watch the image if it exists
    const img = el.querySelector('img');
    if (img) {
      img.addEventListener('load', updateSize);
      ro.observe(img);
    }

    // Watch for window resize
    window.addEventListener('resize', updateSize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
      if (img) {
        img.removeEventListener('load', updateSize);
      }
    };
  }, [containerRef, boxes]);

  if (size.w === 0 || size.h === 0) {
    return null; // Don't render until we have dimensions
  }

  return (
    <div className="pointer-events-none absolute inset-0" style={{ width: size.w, height: size.h }}>
      {boxes.map((d, i) => {
        const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = d.box || {};
        const left = x1 * size.w;
        const top = y1 * size.h;
        const width = (x2 - x1) * size.w;
        const height = (y2 - y1) * size.h;
        
        // Only render if dimensions are valid
        if (width <= 0 || height <= 0) return null;
        
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              delay: i * 0.1
            }}
            className="absolute border-[3px] border-pink-glow rounded-md shadow-lg shadow-pink-glow/50 bg-pink-glow/10"
            style={{ 
              left: `${left}px`, 
              top: `${top}px`, 
              width: `${width}px`, 
              height: `${height}px`,
              zIndex: 10
            }}
          >
            <div className="absolute -top-7 left-0 bg-gradient-to-r from-pink-glow to-purple-accent text-white text-xs px-3 py-1 rounded-lg shadow-lg font-semibold whitespace-nowrap">
              {d.label} · {Math.round((d.confidence || 0) * 100)}%
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ----------------------------- Main component ----------------------------- */

export default function LiveDemo() {
  const { t, language } = useLanguage();
  
  // Tabs: "flower" | "disease"
  const [tab, setTab] = useState("flower");

  // Source: camera vs upload
  const [useCam, setUseCam] = useState(false);
  const webcamRef = useRef(null);

  // Preview & results
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [flowerRes, setFlowerRes] = useState(null);
  const [diseaseRes, setDiseaseRes] = useState(null);
  
  // Rocket Assistant state
  const [showAssistant, setShowAssistant] = useState(false);

  // Disease extras
  const [confThresh, setConfThresh] = useState(0.25); // 0..1
  const filteredDetections = useMemo(() => {
    const arr = diseaseRes?.detections || [];
    return arr.filter((d) => (d.confidence || 0) >= confThresh);
  }, [diseaseRes, confThresh]);

  // Bounding box sizing
  const imageBoxRef = useRef(null);

  const hint = tab === "flower" ? t('demo.tipFlower') : t('demo.tipDisease');

  const videoConstraints = { facingMode: "environment", width: 640, height: 480 };

  // Reset result state when changing tab
  useEffect(() => {
    setFlowerRes(null);
    setDiseaseRes(null);
    setError("");
    setShowAssistant(false); // Hide assistant when switching tabs
    setImgPreview(null); // Clear preview
  }, [tab]);

  /* ------------------------------- Actions ------------------------------- */

  async function runFlower(fileOrBlob) {
    setLoading(true);
    setError("");
    setFlowerRes(null);
    try {
      const file =
        fileOrBlob instanceof Blob
          ? new File([fileOrBlob], "frame.jpg", { type: "image/jpeg" })
          : fileOrBlob;
      const res = await predictFlower(file);
      setFlowerRes(res);
    } catch (e) {
      setError(e?.message || "Flower prediction failed");
    } finally {
      setLoading(false);
    }
  }

  async function runDisease(fileOrBlob) {
    setLoading(true);
    setError("");
    setDiseaseRes(null);
    try {
      const file =
        fileOrBlob instanceof Blob
          ? new File([fileOrBlob], "frame.jpg", { type: "image/jpeg" })
          : fileOrBlob;
      const res = await predictDisease(file);
      setDiseaseRes(res);
      
      // Show assistant if diseases detected
      if (res?.detections && res.detections.length > 0) {
        console.log("🍃 Diseases detected! Showing assistant...", res.detections);
        setShowAssistant(true);
      } else {
        console.log("✅ No diseases detected, hiding assistant");
        setShowAssistant(false);
      }
    } catch (e) {
      setError(e?.message || "Disease detection failed");
      setShowAssistant(false);
    } finally {
      setLoading(false);
    }
  }

  async function capture() {
    const shot = webcamRef.current?.getScreenshot();
    if (!shot) {
      setError("Camera not ready. Try again in a second.");
      return;
    }
    
    // Reset assistant when capturing new image
    setShowAssistant(false);
    
    const blob = await (await fetch(shot)).blob();
    setImgPreview(shot);
    tab === "flower" ? runFlower(blob) : runDisease(blob);
  }

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset assistant when new file uploaded
    setShowAssistant(false);
    
    setImgPreview(URL.createObjectURL(file));
    tab === "flower" ? runFlower(file) : runDisease(file);
  }

  /* --------------------------------- View -------------------------------- */

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex glass rounded-2xl p-1.5 gap-2">
          <motion.button
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all relative overflow-hidden ${
              tab === "flower" 
                ? "bg-gradient-to-r from-primary-green to-primary-green-dark text-white shadow-lg shadow-primary-green/30" 
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setTab("flower")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              🌸 {t('demo.flowerTab')}
            </span>
          </motion.button>
          <motion.button
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all relative overflow-hidden ${
              tab === "disease" 
                ? "bg-gradient-to-r from-pink-glow to-purple-accent text-white shadow-lg shadow-pink-glow/30" 
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setTab("disease")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              🍃 {t('demo.diseaseTab')}
            </span>
          </motion.button>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400">{hint}</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input card */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className={`flex items-center justify-between mb-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <h3 className="font-bold text-xl text-gradient">{t('demo.input')}</h3>
            <div className={`flex gap-2 glass rounded-xl p-1 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <motion.button
                onClick={() => setUseCam(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  useCam 
                    ? "bg-gradient-to-r from-primary-green to-primary-green-dark text-white shadow-lg" 
                    : "text-gray-400 hover:text-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className={`w-4 h-4 inline ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t('demo.camera')}
              </motion.button>
              <motion.button
                onClick={() => setUseCam(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !useCam 
                    ? "bg-gradient-to-r from-primary-green to-primary-green-dark text-white shadow-lg" 
                    : "text-gray-400 hover:text-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload className={`w-4 h-4 inline ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t('demo.upload')}
              </motion.button>
            </div>
          </div>

          {/* Disease-only controls */}
          {tab === "disease" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 glass rounded-xl p-4"
            >
              <label className={`text-xs text-gray-400 block mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {t('demo.confidence')} <b className="text-primary-green">{Math.round(confThresh * 100)}%</b>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(confThresh * 100)}
                onChange={(e) => setConfThresh(Number(e.target.value) / 100)}
                className="w-full accent-primary-green"
              />
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {useCam ? (
              <motion.div
                key="camera"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <div className="relative rounded-xl overflow-hidden border-2 border-primary-green/30">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full"
                  />
                  <div className="absolute inset-0 pointer-events-none border-4 border-primary-green/50 rounded-xl" style={{
                    clipPath: 'inset(20% 10% 20% 10%)'
                  }}></div>
                </div>
                <motion.button
                  onClick={capture}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-green to-primary-green-dark text-white font-semibold hover:shadow-lg hover:shadow-primary-green/50 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('demo.analyzing')}
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      {t('demo.capture')}
                    </>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <label className="block">
                  <div className="border-2 border-dashed border-primary-green/30 rounded-xl p-12 text-center cursor-pointer hover:border-primary-green hover:bg-primary-green/5 transition-all duration-300 group">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-primary-green group-hover:scale-110 transition-transform" />
                    <p className="text-gray-300 font-medium mb-2">{t('demo.uploadText')}</p>
                    <p className="text-sm text-gray-500">{t('demo.uploadHint')}</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={onUpload}
                    className="hidden"
                  />
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results card */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className={`font-bold text-xl text-gradient mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t('demo.results')}</h3>

          <div className="space-y-4">
            {/* Preview + boxes */}
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-700 bg-dark-bg-darker min-h-[200px]">
              {imgPreview ? (
                <div ref={imageBoxRef} className="relative w-full">
                  <img 
                    src={imgPreview} 
                    alt="preview" 
                    className="w-full h-auto block"
                  />
                  {tab === "disease" && filteredDetections.length > 0 && (
                    <BoundingBoxes
                      boxes={filteredDetections}
                      containerRef={imageBoxRef}
                    />
                  )}
                </div>
              ) : (
                <div className="text-gray-500 flex flex-col items-center justify-center gap-3 min-h-[200px]">
                  <Sparkles className="w-12 h-12 opacity-50" />
                  <p>{t('demo.noImage')}</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="glass rounded-xl p-4 min-h-[120px]">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-pink-glow mb-2 font-medium"
                >
                  ⚠️ {error}
                </motion.div>
              )}
              {loading && <Skeleton />}

              {!loading && !error && tab === "flower" && (
                <>
                  {!flowerRes ? (
                    <p className={`text-gray-400 text-center py-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {t('demo.chooseFlower')}
                    </p>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`space-y-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    >
                      <div className="text-sm text-gray-400">{t('demo.flowerSpecies')}</div>
                      <div className="text-2xl font-bold text-gradient">
                        {flowerRes.prediction}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(flowerRes.confidence || 0) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary-green to-primary-green-light rounded-full"
                          />
                        </div>
                        <span className="text-primary-green font-semibold">
                          {Math.round((flowerRes.confidence || 0) * 100)}%
                        </span>
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {!loading && !error && tab === "disease" && (
                <>
                  {!diseaseRes ? (
                    <p className={`text-gray-400 text-center py-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {t('demo.chooseDisease')}
                    </p>
                  ) : filteredDetections.length ? (
                    <motion.ul
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    >
                      <div className={`text-sm text-gray-400 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        {t('demo.diseasesDetected')}
                      </div>
                      {filteredDetections.map((d, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: language === 'ar' ? 10 : -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`flex items-center justify-between glass rounded-lg px-3 py-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                        >
                          <span className="font-medium">{d.label}</span>
                          <span className="text-pink-glow font-semibold">
                            {Math.round((d.confidence || 0) * 100)}%
                          </span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  ) : (
                    <div className={`text-center py-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      <div className="text-4xl mb-2">✅</div>
                      <div className="text-primary-green font-semibold">{t('demo.noDiseases')}</div>
                      <div className="text-sm text-gray-400 mt-1">{t('demo.healthy')}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Rocket Assistant */}
      <RocketAssistant 
        detections={filteredDetections}
        isVisible={showAssistant && tab === "disease" && filteredDetections.length > 0}
        onClose={() => setShowAssistant(false)}
      />
    </div>
  );
}
