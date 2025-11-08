import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { predictFlower, predictDisease } from "../api";
import { motion } from "framer-motion";

// Simple loading skeleton
function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-40 bg-gray-200 rounded-xl" />
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

// Absolute overlay for bounding boxes (normalized 0..1)
function BoundingBoxes({ boxes = [], containerRef }) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {boxes.map((d, i) => {
        const { x1, y1, x2, y2 } = d.box || {};
        const left = (x1 || 0) * size.w;
        const top = (y1 || 0) * size.h;
        const width = ((x2 || 0) - (x1 || 0)) * size.w;
        const height = ((y2 || 0) - (y1 || 0)) * size.h;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="absolute border-2 border-green-500/80 rounded-md"
            style={{ left, top, width, height }}
          >
            <div className="absolute -top-6 left-0 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
              {d.label} · {Math.round((d.confidence || 0) * 100)}%
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function LiveDemo() {
  // Tabs
  const [tab, setTab] = useState("flower"); // "flower" | "disease"

  // Input sources
  const webcamRef = useRef(null);
  const [useCam, setUseCam] = useState(true);

  // Preview + results
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [flowerRes, setFlowerRes] = useState(null);
  const [diseaseRes, setDiseaseRes] = useState(null);

  // For overlay sizing
  const imageBoxRef = useRef(null);

  // Dynamic hint per tab
  const hint =
    tab === "flower"
      ? "Tip: Aim at the bloom (petals/center) for best flower classification."
      : "Tip: Fill the frame with leaves to help detect infected regions.";

  const videoConstraints = { facingMode: "environment", width: 640, height: 480 };

  // Reset results when switching tabs
  useEffect(() => {
    setFlowerRes(null);
    setDiseaseRes(null);
    setError("");
  }, [tab]);

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
    } catch (e) {
      setError(e?.message || "Disease detection failed");
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
    const blob = await (await fetch(shot)).blob();
    setImgPreview(shot);
    tab === "flower" ? runFlower(blob) : runDisease(blob);
  }

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgPreview(URL.createObjectURL(file));
    tab === "flower" ? runFlower(file) : runDisease(file);
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="inline-flex rounded-xl bg-gray-100 p-1">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "flower" ? "bg-white shadow" : "text-gray-600"
          }`}
          onClick={() => setTab("flower")}
        >
          🌸 Flower species
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "disease" ? "bg-white shadow" : "text-gray-600"
          }`}
          onClick={() => setTab("disease")}
        >
          🍃 Leaf disease
        </button>
      </div>

      <p className="text-xs text-gray-500">{hint}</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input */}
        <motion.div
          className="bg-white rounded-2xl shadow p-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Input</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setUseCam(true)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  useCam ? "bg-green-600 text-white" : "bg-gray-100"
                }`}
              >
                Camera
              </button>
              <button
                onClick={() => setUseCam(false)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  !useCam ? "bg-green-600 text-white" : "bg-gray-100"
                }`}
              >
                Upload
              </button>
            </div>
          </div>

          {useCam ? (
            <div className="space-y-3">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="rounded-xl border"
              />
              <button
                onClick={capture}
                disabled={loading}
                className="w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "Analyzing…" : "Capture & Analyze"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input type="file" accept="image/*" onChange={onUpload} />
            </div>
          )}
        </motion.div>

        {/* Results */}
        <motion.div
          className="bg-white rounded-2xl shadow p-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-semibold mb-3">Results</h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Image + boxes */}
            <div ref={imageBoxRef} className="relative rounded-xl overflow-hidden border">
              {imgPreview ? (
                <>
                  <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
                  {/* Boxes only for disease tab */}
                  {tab === "disease" && diseaseRes?.detections?.length > 0 && (
                    <BoundingBoxes boxes={diseaseRes.detections} containerRef={imageBoxRef} />
                  )}
                </>
              ) : (
                <div className="aspect-video flex items-center justify-center text-gray-400">
                  No image yet
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {error && <p className="text-red-600 mb-2">{error}</p>}
              {loading && <Skeleton />}

              {!loading && !error && tab === "flower" && (
                <>
                  {!flowerRes ? (
                    <p className="text-gray-500">Choose/submit a bloom image to classify.</p>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1"
                    >
                      <div className="text-sm text-gray-500">Flower</div>
                      <div className="text-lg font-semibold">
                        {flowerRes.prediction}{" "}
                        <span className="text-gray-500 text-sm">
                          ({Math.round((flowerRes.confidence || 0) * 100)}%)
                        </span>
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {!loading && !error && tab === "disease" && (
                <>
                  {!diseaseRes ? (
                    <p className="text-gray-500">Choose/submit a leaf image to detect diseases.</p>
                  ) : diseaseRes.detections?.length ? (
                    <motion.ul
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 space-y-1 text-sm"
                    >
                      {diseaseRes.detections.map((d, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between bg-gray-50 rounded px-2 py-1"
                        >
                          <span>{d.label}</span>
                          <span className="text-gray-500">
                            {Math.round((d.confidence || 0) * 100)}%
                          </span>
                        </li>
                      ))}
                    </motion.ul>
                  ) : (
                    <div className="text-gray-600">No diseases detected</div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
