import { HeartHandshake, Phone, Mail, MapPin, ExternalLink, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#0b2240] text-slate-300 border-t-4 border-amber-500 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
              <HeartHandshake size={20} />
            </div>
            <span className="text-white font-display text-lg font-bold tracking-tight">
              SYNERGY <span className="text-teal-400">CARE LINK</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Empowering individuals of all abilities to connect with their community, build lifelong skills, and live independently under the National Disability Insurance Scheme (NDIS).
          </p>
          <div className="inline-flex items-center gap-1.5 bg-teal-950/40 border border-teal-500/20 px-3 py-1.5 rounded text-xs text-teal-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Registered NDIS Provider
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-white font-display text-sm font-bold tracking-wider uppercase mb-4 pb-2 border-b border-slate-700">
            Our Services
          </h3>
          <ul className="space-y-2 text-xs">
            {[
              { label: 'Supported Independent Living (SIL)', id: 'services' },
              { label: 'Community & Day Hubs', id: 'services' },
              { label: 'Support Coordination', id: 'services' },
              { label: 'In-Home Care Support', id: 'services' },
              { label: 'Specialist Accommodations (SDA)', id: 'services' },
              { label: 'Social & Recreational Programs', id: 'services' }
            ].map((link, index) => (
              <li key={index}>
                <button
                  onClick={() => onNavigate(link.id)}
                  className="hover:text-amber-400 hover:underline transition-colors flex items-center gap-1 cursor-pointer text-left"
                >
                  <span className="text-teal-500 font-bold">›</span> {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="text-white font-display text-sm font-bold tracking-wider uppercase mb-4 pb-2 border-b border-slate-700">
            Get in Touch
          </h3>
          <ul className="space-y-3.5 text-xs text-slate-400">
            <li className="flex items-start gap-2.5">
              <Phone size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Call Us:</p>
                <a href="tel:1300363177" className="hover:text-amber-400 transition-colors">1300 SYNERGY (1300 363 177)</a>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Email Us:</p>
                <a href="mailto:synergycarelink@gmail.com" className="hover:text-amber-400 transition-colors">synergycarelink@gmail.com</a>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Office Location:</p>
                <span>Suite 2, Level 2, 34 Charles Street, Parramatta NSW 2150</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Resources & Compliance Column */}
        <div>
          <h3 className="text-white font-display text-sm font-bold tracking-wider uppercase mb-4 pb-2 border-b border-slate-700">
            NDIS Resources
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <a 
                href="https://www.ndis.gov.au" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
              >
                Official NDIS Website <ExternalLink size={11} className="text-slate-500" />
              </a>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('calculator')}
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
              >
                Plan Budget Calculator
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('finder')}
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
              >
                Find Custom Supports
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('staff')}
                className="hover:text-amber-400 text-teal-400 font-semibold transition-colors flex items-center gap-1.5 text-left cursor-pointer border border-teal-500/30 px-2 py-0.5 rounded bg-teal-950/20"
              >
                Provider & Staff Portal
              </button>
            </li>
          </ul>
          
          <div className="mt-4 flex items-center gap-2 border border-slate-700 p-2 rounded bg-slate-800/40">
            <ShieldAlert size={14} className="text-amber-500" />
            <span className="text-[10px] text-slate-400 leading-tight">
              We operate strictly under the NDIS Quality and Safeguards Commission standards.
            </span>
          </div>
        </div>

      </div>

      {/* Acknowledgement of Country */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800">
        <div className="bg-slate-950/40 p-5 rounded-lg border border-slate-800 text-center max-w-4xl mx-auto space-y-2">
          <p className="text-xs text-amber-500/90 font-semibold tracking-wide uppercase">Acknowledgement of Country</p>
          <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed italic">
            "In the spirit of reconciliation, Synergy Care Link acknowledges the Traditional Custodians of country throughout Australia and their connections to land, sea and community. We pay our respect to their elders past and present and extend that respect to all Aboriginal and Torres Strait Islander peoples today."
          </p>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2026 Synergy Care Link. All Rights Reserved. NSW Registered Provider.</p>
        <div className="flex gap-4">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-300">Privacy Policy</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-300">Feedback & Complaints</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-300">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}
