import React from 'react'
import { motion } from 'framer-motion'


export default function CTA(){
return (
<motion.section id="cta" className="py-24" initial={{opacity:0, scale:0.98}} whileInView={{opacity:1, scale:1}} viewport={{once:true}}>
<div className="rounded-3xl bg-gradient-to-r from-green-200 via-white to-pink-200 p-10 text-center shadow">
<h3 className="text-2xl md:text-3xl font-bold">Bring AI to your garden, lab, or classroom.</h3>
<p className="text-gray-700 mt-2">Run locally or deploy to the cloud with the same API. Start with the live demo above.</p>
<a href="#demo" className="inline-block mt-6 px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700">Try SmartBloom</a>
</div>
</motion.section>
)
}