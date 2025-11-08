import React from 'react'


export default function Footer(){
return (
<footer className="py-10 text-center text-sm text-gray-500">
<div className="max-w-7xl mx-auto px-4">
<div>© {new Date().getFullYear()} SmartBloom. Built with ❤️ for plants.</div>
</div>
</footer>
)
}