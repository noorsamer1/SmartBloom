import React from 'react'
import { motion } from 'framer-motion'


export default function Hero(){
return (
<section className="pt-12 md:pt-20">
<div className="grid md:grid-cols-2 gap-10 items-center">
<motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.6}}>
<h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
AI for 🌸 Flowers & 🍃 Plant Health
</h1>
<p className="mt-4 text-lg text-gray-600">
SmartBloom identifies flower species and detects common leaf diseases in real-time from a single photo or your camera feed.
</p>
<div className="mt-6 flex items-center gap-3">
<a href="#demo" className="px-5 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700">Try the Demo</a>
<a href="#how" className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-white">How it works</a>
</div>
</motion.div>
<motion.div initial={{opacity:0, scale:0.95}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{type:'spring', stiffness:80}}>
<div className="relative rounded-3xl overflow-hidden shadow-2xl">
<div className="aspect-video bg-gradient-to-br from-green-200 via-white to-pink-200" />
<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.20),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(236,72,153,0.18),transparent_40%)]" />
</div>
</motion.div>
</div>
</section>
)
}