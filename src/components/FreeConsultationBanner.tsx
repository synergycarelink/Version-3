import React from 'react';
import { 
  Sparkles, 
  PhoneCall, 
  Calendar, 
  HelpCircle, 
  CheckCircle, 
  ChevronRight, 
  ShieldCheck, 
  HeartHandshake,
  Clock,
  MessageSquare
} from 'lucide-react';

interface FreeConsultationBannerProps {
  onOpenModal: (topic?: string) => void;
}

export default function FreeConsultationBanner({ onOpenModal }: FreeConsultationBannerProps) {
  return (
    <section className="bg-gradient-to-r from-teal-900 via-[#0b2240] to-slate-900 text-white py-12 sm:py-16 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & Highlight Content (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-[#0b2240] px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <Sparkles size={14} className="fill-[#0b2240]" />
              Free 1-on-1 Care Consultation
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white leading-tight">
              Confused about <span className="text-amber-300">NDIS Funding</span> or <span className="text-teal-300">Support at Home</span> Services?
            </h2>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Book a <strong>100% free, no-obligation session</strong> with our Senior Care Advisors. Whether you need help understanding your NDIS budget, transitioning to Support at Home care tiers, or exploring in-home support, we're here to answer all your questions.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                <span>Clear explanation of NDIS & Support at Home tiers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                <span>Phone, Video, or In-Person Coffee Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                <span>Personalized guidance for participants & families</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                <span>No pressure, zero lock-in contracts</span>
              </div>
            </div>
          </div>

          {/* Right Action Callout Box (5 cols) */}
          <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                  Instant Online Booking
                </span>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Advisors Available
                </span>
              </div>
              
              <h3 className="text-lg font-display font-bold text-[#0b2240]">
                Schedule Your Free Session
              </h3>
              <p className="text-xs text-slate-500">
                Choose a date and time that suits you. Select phone call, video, or face-to-face meeting.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onOpenModal('NDIS & Support at Home Guidance')}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0b2240] font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <Calendar size={18} />
                Book Free Consultation Now
                <ChevronRight size={16} />
              </button>

              <a
                href="tel:1300363177"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <PhoneCall size={14} className="text-teal-700" />
                Or Call Us Direct: 1300 363 177
              </a>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-teal-600" />
                Takes under 1 minute to book
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-teal-600" />
                Privacy Protected
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
