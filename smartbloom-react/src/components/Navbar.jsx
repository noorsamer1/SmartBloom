import React from 'react'
import { Leaf, Github } from 'lucide-react'
import { motion } from 'framer-motion'


export default function Navbar(){
return (
<motion.header initial={{y:-30, opacity:0}} animate={{y:0, opacity:1}} transition={{type:'spring', stiffness:90}}
className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-black/5">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
<a href="#top" className="flex items-center gap-2 font-semibold">
<Leaf className="text-green-600" />
<span>SmartBloom</span>
</a>
<nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
<a href="#demo" className="hover:text-gray-900">Live Demo</a>
<a href="#how" className="hover:text-gray-900">How it works</a>
<a href="#cta" className="hover:text-gray-900">Get Started</a>
</nav>
<a href="#demo" className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700">Try now</a>
</div>
</motion.header>
)
}