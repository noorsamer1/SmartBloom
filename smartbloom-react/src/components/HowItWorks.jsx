import React from 'react'
import { motion } from 'framer-motion'


export default function HowItWorks(){
const steps = [
{ t:'Capture or Upload', d:'Provide a plant image using webcam or file upload.' },
{ t:'Flower Species', d:'EfficientNet-B0 classifies the flower into 1 of N species.' },
{ t:'Leaf Disease', d:'YOLO scans the leaves and lists any detected diseases.' },
{ t:'Actionable Output', d:'Results are returned instantly for your next step.' },
]
return (
<motion.section id="how" className="py-20" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
<h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">How it works</h2>
<div className="grid md:grid-cols-4 gap-6">
{steps.map((s,i)=> (
<div key={i} className="bg-white p-6 rounded-2xl shadow">
<div className="text-sm text-green-700 font-semibold">Step {i+1}</div>
<div className="mt-2 font-semibold">{s.t}</div>
<p className="text-sm text-gray-600 mt-1">{s.d}</p>
</div>
))}
</div>
</motion.section>
)
}