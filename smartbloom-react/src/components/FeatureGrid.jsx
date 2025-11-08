import React from 'react'
import { motion } from 'framer-motion'
import { Camera, Cpu, Upload, ImageDown, Zap, ShieldCheck } from 'lucide-react'


const items = [
{ icon: <Camera />, title: 'Camera or Upload', desc: 'Switch instantly between webcam capture or file upload.' },
{ icon: <Cpu />, title: 'Two-Stage AI', desc: 'EfficientNet for species + YOLO for leaf diseases.' },
{ icon: <Zap />, title: 'Real-time', desc: 'Optimized pipeline with GPU acceleration.' },
{ icon: <ShieldCheck />, title: 'Privacy First', desc: 'Images are processed locally on your machine/server.' },
{ icon: <Upload />, title: 'Simple API', desc: 'FastAPI backend with clean endpoints.' },
{ icon: <ImageDown />, title: 'Artifacts & Logs', desc: 'Every run is saved for reproducibility.' },
]


export default function FeatureGrid(){
return (
<motion.section className="py-16" initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
<h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Why SmartBloom</h2>
<div className="grid md:grid-cols-3 gap-6">
{items.map((it, i)=> (
<div key={i} className="rounded-2xl p-6 bg-white shadow hover:shadow-lg transition">
<div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">{it.icon}</div>
<div className="mt-4 font-semibold">{it.title}</div>
<p className="text-sm text-gray-600 mt-1">{it.desc}</p>
</div>
))}
</div>
</motion.section>
)
}