import React from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MetricsStrip from './components/MetricsStrip'
import FeatureGrid from './components/FeatureGrid'
import LiveDemo from './components/LiveDemo'
import HowItWorks from './components/HowItWorks'
import CTA from './components/CTA'
import Footer from './components/Footer'


export default function App() {
return (
<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50 text-gray-800">
<Navbar />
<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<Hero />
<MetricsStrip />
<FeatureGrid />
<motion.section id="demo" className="py-20" initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
<h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Live Demo</h2>
<p className="text-center text-gray-600 mb-10">Upload a plant photo or use your camera. We’ll identify the flower and detect visible leaf diseases in one go.</p>
<LiveDemo />
</motion.section>
<HowItWorks />
<CTA />
</main>
<Footer />
</div>
)
}