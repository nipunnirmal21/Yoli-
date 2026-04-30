import { Link } from 'react-router-dom';

import mainLogo from '../assets/Colombo Centi Logo.png'; 


export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-12 border-t-4 border-yellow-500">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand & Logos Section */}
                    <div className="flex flex-col gap-6 col-span-1 lg:col-span-1">
                        <div className="flex flex-col gap-4">
                            {/* Main Large Logo */}
                            <img 
                                src={mainLogo} 
                                alt="Colombo Centennial Logo" 
                                className="h-28 w-auto object-contain self-start"
                            />
                            
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mt-2">
                            Rotary Club of Colombo Centennial - "Service Above Self". 
                            Empowering communities and creating lasting change in Sri Lanka through impactful service projects.
                        </p>
                        {/* WhatsApp Link */}
                        <div className="flex items-center gap-2 text-[#25D366] text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Contact via WhatsApp
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            {[
                                { l: 'About Our Club', to: '/about' },
                                { l: 'Community Projects', to: '/projects' },
                                { l: 'Club Members', to: '/members' },
                                { l: 'News & Events', to: '/news' },
                                { l: 'Gallery', to: '/gallery' },
                                { l: 'Contact Us', to: '/contact' },
                            ].map(({ l, to }) => (
                                <li key={l}>
                                    <Link to={to} className="text-gray-400 hover:text-yellow-500 transition-colors">{l}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Rotary Focus Areas */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Our Focus</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>Peace Promotion</li>
                            <li>Disease Prevention</li>
                            <li>Water & Sanitation</li>
                            <li>Maternal & Child Health</li>
                            <li>Basic Education</li>
                        </ul>
                    </div>

                    {/* Trust/Impact Badges */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Impact</h3>
                        <div className="space-y-4">
                            {[
                                { emoji: '🌍', title: 'Global Network', desc: 'Connecting world leaders' },
                                { emoji: '🤝', title: 'Community Service', desc: 'Volunteering for change' },
                                { emoji: '✨', title: '100+ Years', desc: 'Legacy of Centennial' },
                            ].map(({ emoji, title, desc }) => (
                                <div key={title} className="flex items-start gap-3 bg-gray-800/50 p-3 rounded-lg">
                                    <span className="text-xl flex-shrink-0">{emoji}</span>
                                    <div>
                                        <p className="text-white text-xs font-bold">{title}</p>
                                        <p className="text-gray-500 text-[10px]">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
                    <p>© 2026 Rotary Club of Colombo Centennial. All rights reserved.</p>
                    <div className="flex gap-4">
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                    <p>Designed with Excellence</p>
                </div>
            </div>
        </footer>
    );
}