import React from 'react'
import { motion } from 'framer-motion'


export default function MetricsStrip(){
const metrics = [
{ kpi: '89%+', label: 'Flower Top-1 Accuracy (EfficientNet-B0)' },
{ kpi: 'YOLOv8', label: 'Real-time disease detection' },
{ kpi: 'GPU‑Ready', label: 'CUDA accelerated inference' },
]
return (
<motion.section className="py-12" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
<div className="grid md:grid-cols-3 gap-6">
{metrics.map((m, i)=> (
<div key={i} className="rounded-2xl p-6 bg-white shadow text-center">
<div className="text-3xl font-extrabold text-gray-900">{m.kpi}</div>
<div className="mt-2 text-gray-500 text-sm">{m.label}</div>
</div>
))}
</div>
</motion.section>
)
}