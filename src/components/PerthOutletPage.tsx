import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  ChevronRight, 
  HeartHandshake, 
  ShieldCheck, 
  Send,
  Building,
  Check,
  Compass,
  FileText,
  ArrowRight
} from 'lucide-react';

interface PerthOutletPageProps {
  onNavigate: (section: string) => void;
  onOpenConsultation: (topic?: string) => void;
}

export default function PerthOutletPage({ onNavigate, onOpenConsultation }: PerthOutletPageProps) {
  // Expression of Interest (EOI) Form State
  const [eoiName, setEoiName] = useState('');
  const [eoiEmail, setEoiEmail] = useState('');
  const [eoiPhone, setEoiPhone] = useState('');
  const [eoiRole, setEoiRole] = useState<'participant' | 'family' | 'coordinator' | 'worker' | 'other'>('participant');
  const [eoiSuburbs, setEoiSuburbs] = useState('');
  const [eoiServices, setEoiServices] = useState<string[]>([]);
  const [eoiNotes, setEoiNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const availableServices = [
    'Core Daily In-Home Support',
    'Community Participation & Social Hubs',
    'Supported Independent Living (SIL) / Respite',
    'Support at Home (Aged Care Subsidies)',
    'Support Coordination & Psychosocial Coaching',
    'Employment & Capacity Building Pathways',
    'Support Worker Career Opportunities in WA'
  ];

  const handleToggleService = (service: string) => {
    if (eoiServices.includes(service)) {
      setEoiServices(eoiServices.filter(s => s !== service));
    } else {
      setEoiServices([...eoiServices, service]);
    }
  };

  const handleSubmitEOI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eoiName.trim() || !eoiEmail.trim()) return;

    setIsSubmitting(true);

    // Save to local registry so staff dashboard can track Perth expressions of interest
    try {
      const stored = localStorage.getItem('synergy_eoi_submissions');
      const existing = stored ? JSON.parse(stored) : [];
      const newEntry = {
        id: `perth-eoi-${Date.now()}`,
        name: eoiName,
        email: eoiEmail,
        phone: eoiPhone,
        role: eoiRole,
        suburbs: eoiSuburbs,
        services: eoiServices,
        notes: eoiNotes,
        date: new Date().toLocaleString(),
        location: 'Perth, WA'
      };
      localStorage.setItem('synergy_eoi_submissions', JSON.stringify([newEntry, ...existing]));

      // Also log as direct referral inquiry with [Perth Waitlist] tag
      const refStored = localStorage.getItem('synergy_care_submissions');
      const existingRefs = refStored ? JSON.parse(refStored) : [];
      const newRef = {
        id: `ref-wa-${Date.now().toString().slice(-6)}`,
        referrerName: eoiName,
        referrerEmail: eoiEmail,
        referrerPhone: eoiPhone,
        relationship: eoiRole === 'coordinator' ? 'coordinator' : eoiRole === 'family' ? 'family' : 'self',
        referralType: 'both',
        participantName: eoiName,
        participantAge: 0,
        participantGender: 'Not specified',
        primaryDisability: 'Perth Hub Early Waitlist & Enquiry',
        requestedServices: eoiServices.length > 0 ? eoiServices : ['General Care Enquiry'],
        preferredContact: 'email',
        additionalInfo: `[PERTH OUTLET EOI] Suburb: ${eoiSuburbs || 'Perth Metro'}. Role: ${eoiRole}. Notes: ${eoiNotes}`,
        submittedAt: new Date().toLocaleString(),
        status: 'pending'
      };
      localStorage.setItem('synergy_care_submissions', JSON.stringify([newRef, ...existingRefs]));
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 600);
  };

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      
      {/* Top Breadcrumb & Announcement Bar */}
      <div className="bg-amber-500 text-slate-950 text-xs font-bold py-2.5 px-4 sm:px-6 lg:px-8 border-b border-amber-600 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-slate-950 text-amber-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
              Expansion Update
            </span>
            <span>Western Australia: Synergy CareLink Perth Outlet & Community Hub Coming Soon!</span>
          </div>
          <span className="text-[11px] font-medium text-slate-900 hidden md:inline-block">
            Priority intake waitlist now open for participants & support coordinators
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0b2240] via-slate-900 to-[#0b2240] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs text-amber-300 font-bold uppercase tracking-wider">
            <MapPin size={14} className="text-amber-400" />
            Western Australia Care Network
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-tight">
              Perth Outlet <span className="text-amber-400 font-normal">| Coming Soon</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Synergy CareLink is expanding westward to bring our compassionate, person-centered Registered NDIS and Support at Home services to Perth and regional Western Australia.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#waitlist-form"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              Join the Priority Perth Waitlist
              <ChevronRight size={15} />
            </a>
            <button
              onClick={() => onNavigate('referrals')}
              className="bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl border border-teal-500/40 shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText size={15} className="text-teal-300" />
              Move to Client Referrals
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => onOpenConsultation('Perth Outlet Expansion & Services')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-6 py-3.5 rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar size={15} className="text-amber-400" />
              Book Perth Consultation
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800 max-w-4xl">
            <div>
              <p className="text-2xl font-bold text-teal-400 font-display">WA Metro</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide">Coverage Area</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400 font-display">Registered</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide">NDIS Quality Standards</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-display">Zero</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide">Waitlist Bottlenecks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400 font-display">2026</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide">Grand Launch Target</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: What We Are Bringing to Perth */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Why Perth */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <span className="text-teal-700 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Compass size={14} />
                Western Australia Vision
              </span>
              <h2 className="text-2xl font-display font-bold text-[#0b2240] tracking-tight">
                Bringing Authentic, Coordinated Care to WA Families
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                For years, Synergy CareLink has championed genuine human care across Sydney, operating with deep transparency, reliable support workers, and direct coordination. In response to consistent requests from local participants, families, and allied health coordinators seeking dependable providers in Western Australia, we are establishing our dedicated Perth presence.
              </p>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Our upcoming Perth Hub will function not only as an administrative headquarters, but as a lively community space for skills workshops, social outings, respite planning, and in-person family consultations.
              </p>
            </div>

            {/* Core Offerings in Perth */}
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-[#0b2240]">
                Upcoming Perth Service Offerings
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <HeartHandshake size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#0b2240]">Core Daily Living & In-Home</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Assistance with personal routines, meal prep, domestic chores, and community mobility by carefully vetted, culturally aligned WA support workers.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Building size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#0b2240]">Perth Community Social Hubs</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Interactive day programs, creative arts, culinary skill-building, sports excursions, and weekend friendship circles across Perth metro.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <ShieldCheck size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#0b2240]">Support at Home (Aged Care 65+)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dedicated navigation for older Australians in WA eligible for government-funded Support at Home packages to remain comfortable and safe at home.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <Users size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#0b2240]">SIL & Respite Accommodation</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Supported Independent Living homes with 1:1, 1:2, or 1:3 care ratios and Short-Term Accommodation (STA) for planned family respite.
                  </p>
                </div>
              </div>
            </div>

            {/* Geographic Coverage across Perth */}
            <div className="bg-slate-900 text-white p-7 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <MapPin size={15} />
                Western Australia Regional Footprint
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                Suburbs & Areas We Will Be Servicing
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our support worker network and mobile coordinators will cover the following key corridors across Greater Perth:
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                {[
                  'Perth CBD & Inner Suburbs',
                  'Joondalup & Northern Suburbs',
                  'Fremantle & Southern Coast',
                  'Midland & Swan Valley',
                  'Stirling & Scarborough',
                  'Cannington & Victoria Park',
                  'Rockingham & Mandurah',
                  'Armadale & Gosnells',
                  'Belmont & Airport Corridor'
                ].map((area, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
                    <CheckCircle2 size={13} className="text-teal-400 shrink-0" />
                    <span className="text-slate-200">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Roadmap */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-display font-bold text-[#0b2240] flex items-center gap-2">
                <Clock size={18} className="text-teal-700" />
                Perth Launch Roadmap
              </h3>
              
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 text-xs">
                <div className="pl-5 relative">
                  <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-200"></div>
                  <p className="font-bold text-slate-800 text-sm">Phase 1: Priority Registration & Consultation (Now Active)</p>
                  <p className="text-slate-500 mt-1">Accepting early expressions of interest from NDIS participants, carers, and local WA support coordinators for prioritized intake spots.</p>
                </div>

                <div className="pl-5 relative">
                  <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white ring-2 ring-amber-200"></div>
                  <p className="font-bold text-slate-800 text-sm">Phase 2: Local Care Team Onboarding & Site Fit-out</p>
                  <p className="text-slate-500 mt-1">Screening and credentialing local Perth support workers and establishing our accessible community space.</p>
                </div>

                <div className="pl-5 relative">
                  <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                  <p className="font-bold text-slate-800 text-sm">Phase 3: Grand Opening & Full Service Commencement</p>
                  <p className="text-slate-500 mt-1">Official ribbon cutting and active delivery of regular rostered shifts and group activities across Perth.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Waitlist / EOI Form Card */}
          <div id="waitlist-form" className="lg:col-span-5 sticky top-24 space-y-6">
            
            <div className="bg-white p-6 sm:p-7 rounded-2xl border-2 border-teal-600/30 shadow-md space-y-5">
              <div className="space-y-1.5 border-b border-slate-200 pb-4">
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Priority Intake
                </span>
                <h3 className="text-xl font-display font-bold text-[#0b2240] pt-1">
                  Register Your Perth Interest
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lock in early consultation or register as a participant, family member, or care worker ahead of our Perth opening.
                </p>
              </div>

              {submittedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-3 animate-scale-up">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-base font-bold text-emerald-950">Thank You for Registering!</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Your details have been registered into our Western Australia Priority Waitlist. Our Perth Intake Coordinator will be in touch with regular updates and early service scheduling.
                  </p>
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => onNavigate('referrals')}
                      className="w-full bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText size={14} />
                      <span>Move Right to Full Client Referral Portal</span>
                      <ArrowRight size={14} className="text-amber-400" />
                    </button>
                    <button
                      onClick={() => {
                        setSubmittedSuccess(false);
                        setEoiName('');
                        setEoiEmail('');
                        setEoiPhone('');
                        setEoiNotes('');
                        setEoiServices([]);
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-teal-800 underline cursor-pointer py-1"
                    >
                      Submit another Perth enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitEOI} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={eoiName}
                      onChange={(e) => setEoiName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-teal-600 bg-slate-50 focus:bg-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={eoiEmail}
                        onChange={(e) => setEoiEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-teal-600 bg-slate-50 focus:bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={eoiPhone}
                        onChange={(e) => setEoiPhone(e.target.value)}
                        placeholder="0400 000 000"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-teal-600 bg-slate-50 focus:bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">I am registering as:</label>
                    <select
                      value={eoiRole}
                      onChange={(e) => setEoiRole(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-teal-600 bg-slate-50 focus:bg-white text-xs"
                    >
                      <option value="participant">NDIS / Aged Care Participant</option>
                      <option value="family">Family Member / Carer</option>
                      <option value="coordinator">Support Coordinator / Plan Manager</option>
                      <option value="worker">Support Worker / Nurse Seeking Employment</option>
                      <option value="other">Community Partner / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Preferred Perth Suburb / Area</label>
                    <input
                      type="text"
                      value={eoiSuburbs}
                      onChange={(e) => setEoiSuburbs(e.target.value)}
                      placeholder="e.g. Joondalup, Fremantle, Cannington"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-teal-600 bg-slate-50 focus:bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Services of Interest:</label>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 border border-slate-200 p-2.5 rounded-lg bg-slate-50">
                      {availableServices.map((service, index) => {
                        const isChecked = eoiServices.includes(service);
                        return (
                          <label 
                            key={index}
                            className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                              isChecked ? 'bg-teal-50 text-teal-900 font-semibold' : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleService(service)}
                              className="rounded text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-[11px] leading-tight">{service}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Specific Goals or Questions</label>
                    <textarea
                      rows={3}
                      value={eoiNotes}
                      onChange={(e) => setEoiNotes(e.target.value)}
                      placeholder="Tell us about preferred schedules, worker matching, or accessibility needs..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-teal-600 bg-slate-50 focus:bg-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0b2240] hover:bg-slate-900 text-white font-bold text-xs py-3.5 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Submitting Registration...</span>
                    ) : (
                      <>
                        <Send size={14} className="text-amber-400" />
                        <span>Join Priority Perth Waitlist</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-slate-400 text-center">
                    Your details remain strictly confidential and will never be shared without consent.
                  </p>
                </form>
              )}
            </div>

            {/* Direct Contact for WA Inquiries */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Phone size={15} className="text-amber-500" />
                <span>Speak to our Expansion Coordinator</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Have immediate questions regarding participant transitions, coordinator panels, or WA operations?
              </p>
              <div className="space-y-1.5 pt-1">
                <a 
                  href="tel:1300363177" 
                  className="flex items-center gap-2 text-teal-700 hover:text-amber-600 font-bold"
                >
                  <Phone size={13} />
                  1300 SYNERGY (1300 363 177)
                </a>
                <a 
                  href="mailto:admin@synergycarelink.com?subject=Perth%20Outlet%20Expansion%20Inquiry" 
                  className="flex items-center gap-2 text-teal-700 hover:text-amber-600 font-medium"
                >
                  <Mail size={13} />
                  admin@synergycarelink.com
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Move Right to Client Referrals Callout Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-teal-600 text-white px-2.5 py-1 rounded-full inline-block">
              Immediate Intake
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Ready to submit an official intake referral for Perth?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Support coordinators, medical practitioners, family carers, and self-managed participants can move straight to our full Client Referral Portal. All Western Australia referrals receive priority triage.
            </p>
          </div>
          <button
            onClick={() => onNavigate('referrals')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2.5 shrink-0 cursor-pointer"
          >
            <FileText size={18} />
            <span>Move Right to Client Referrals</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

    </div>
  );
}
