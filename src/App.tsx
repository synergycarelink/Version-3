import { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import Footer from './components/Footer';
import ServiceFinder from './components/ServiceFinder';
import NDISCalculator from './components/NDISCalculator';
import ReferralPortal from './components/ReferralPortal';
import AIChatBot from './components/AIChatBot';
import { SERVICES_DATA } from './data/services';
import { AccessibilitySettings, NDISService } from './types';
import { 
  HeartHandshake, 
  Smile, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Volume2, 
  Play, 
  BookOpen,
  ArrowRight,
  Home,
  Users,
  Compass,
  HeartHandshake as HeartHandshakeIcon,
  Key,
  Sparkles as SparklesIcon,
  HelpCircle,
  ThumbsUp,
  MessageSquareQuote
} from 'lucide-react';

export default function App() {
  // Accessibility state
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSizeScale: 'normal',
    textToSpeech: false
  });

  // Active navigation section
  const [activeSection, setActiveSection] = useState('home');

  // Referral portal state: prefilled parameters from calculator/finder
  const [preFilledServices, setPreFilledServices] = useState<string[]>([]);
  const [preFilledNotes, setPreFilledNotes] = useState<string>('');
  const [showReferralDashboard, setShowReferralDashboard] = useState<boolean>(false);

  // Active expanded service modal
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<NDISService | null>(null);

  // References for scrolling
  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    calculator: useRef<HTMLDivElement>(null),
    referrals: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    finder: useRef<HTMLDivElement>(null),
    staff: useRef<HTMLDivElement>(null),
  };

  // Speak assistant helper
  const speakText = (text: string) => {
    if (settings.textToSpeech && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for maximum clear accessibility
      window.speechSynthesis.speak(utterance);
    }
  };

  // Scroll to section handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    
    if (sectionId === 'staff') {
      setShowReferralDashboard(true);
      const targetRef = sectionRefs.referrals;
      if (targetRef.current) {
        targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (sectionId === 'finder') {
      const finderRef = sectionRefs.finder;
      if (finderRef.current) {
        finderRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Pre-fill parameters trigger from calculator or care-finder
  const handlePreFillReferral = (services: string[], notes: string) => {
    setPreFilledServices(services);
    setPreFilledNotes(notes);
    setShowReferralDashboard(false); // Make sure form shows up, not dashboard
  };

  const handleClearPreFill = () => {
    setPreFilledServices([]);
    setPreFilledNotes('');
  };

  // Map icon strings to Lucide components
  const getServiceIcon = (name: string, size = 24) => {
    switch (name) {
      case 'Home': return <Home size={size} className="text-teal-600" />;
      case 'Users': return <Users size={size} className="text-teal-600" />;
      case 'Compass': return <Compass size={size} className="text-teal-600" />;
      case 'HeartHandshake': return <HeartHandshakeIcon size={size} className="text-teal-600" />;
      case 'Key': return <Key size={size} className="text-teal-600" />;
      case 'Sparkles': return <SparklesIcon size={size} className="text-teal-600" />;
      default: return <HeartHandshake size={size} className="text-teal-600" />;
    }
  };

  // Interactive testimonial state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      name: "Marcus K.",
      role: "SIL Resident (Parramatta)",
      quote: "Moving into the Synergy SIL house changed everything for me. I have my own spacious room, but I live with great mates and our support worker, Dan, makes the best weekend BBQs!",
      tag: "Supported Independent Living"
    },
    {
      name: "Elizabeth S.",
      role: "Parent of Client",
      quote: "The team at Synergy Care Link doesn't just manage cases; they genuinely care. Their Support Coordinator took all the stress out of our plan review and got our social programs fully funded.",
      tag: "Support Coordination"
    },
    {
      name: "Daniel T.",
      role: "Hub & Social Club Member",
      quote: "I look forward to the Wednesday cooking class and Friday sports outings. I have made real lifelong friends here, and the vans pick me up directly from my home.",
      tag: "Community Day Programs"
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-250 ${
      settings.highContrast ? 'high-contrast' : ''
    } ${
      settings.fontSizeScale === 'large' 
        ? 'font-scale-large' 
        : settings.fontSizeScale === 'extra-large' 
        ? 'font-scale-xl' 
        : ''
    }`}>
      
      {/* Header Accessibility & Nav coordinator */}
      <Header 
        settings={settings} 
        setSettings={setSettings} 
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Main Page Layout */}
      <main className="flex-1">

        {/* 1. HERO BANNER SECTION (Inspiration from civic.org.au split-design banner) */}
        <section 
          ref={sectionRefs.home}
          id="home"
          className="relative bg-gradient-to-br from-slate-900 via-[#0b2240] to-slate-950 text-white overflow-hidden py-16 sm:py-24"
        >
          {/* Ambient graphic overlays */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400 via-emerald-500 to-indigo-900"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/25 px-3 py-1.5 rounded-full text-xs text-teal-300 font-semibold tracking-wider uppercase animate-fade-in">
                <Sparkles size={13} className="text-amber-400" />
                Empowering Abilities, Building Synergy
              </div>

              <h1 
                onClick={() => speakText("Synergy Care Link. Connecting capabilities, enriching lives. Your trusted NDIS care partner.")}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold tracking-tight text-white leading-tight cursor-help hover:text-amber-300 transition-colors"
                title="Click to read aloud"
              >
                Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-amber-300">Capabilities</span>,<br />
                Enriching <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-teal-300">Lives</span>.
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Synergy Care Link is a registered NDIS provider delivering highly personalized supported independent living, community hubs, in-home support, and coordinator advocacy. We work with participants to unlock their plans and live with choice and control.
              </p>

              {/* Action Cards & Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => handleNavigate('finder')}
                  className="bg-amber-500 hover:bg-amber-400 text-[#0b2240] font-bold text-xs sm:text-sm px-7 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  Try Interactive Care Finder
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => handleNavigate('services')}
                  className="bg-teal-700/80 hover:bg-teal-600/90 text-white font-semibold text-xs sm:text-sm px-6 py-4 rounded-xl border border-teal-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Explore Our 6 Core Services
                </button>
              </div>

              {/* Service metrics inline */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 max-w-md">
                <div>
                  <p className="text-2xl font-bold text-teal-400 font-display">100%</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">NDIS Registered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400 font-display">24/7</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">SIL & Home Care</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-teal-400 font-display">50+</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Sydney Care Mates</p>
                </div>
              </div>
            </div>

            {/* Hero Right Interactive Card (Quick Service Selector) */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-md space-y-6">
              <div className="space-y-1">
                <h3 className="text-white font-display font-bold text-lg">Looking for immediate support?</h3>
                <p className="text-xs text-slate-400">Tell us what you need, and we will guide you to booking.</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Supported Independent Living (SIL)", desc: "Shared high-care housing options", target: "sil" },
                  { title: "Community Hub Day Activities", desc: "Workshops, cooking, and social groups", target: "community-hubs" },
                  { title: "NDIS Plan Budget Coordination", desc: "Managing agreements and therapy", target: "support-coordination" }
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handlePreFillReferral([item.target], `Immediate enquiry from Hero Section Quick Selection cards for: ${item.title}`);
                      handleNavigate('referrals');
                    }}
                    className="w-full text-left bg-white/5 hover:bg-teal-700/30 p-3 rounded-xl border border-white/10 hover:border-teal-500/40 transition-all cursor-pointer group flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{item.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-center text-slate-500 italic">
                Need to calculate hours? <button onClick={() => handleNavigate('calculator')} className="text-teal-400 underline font-semibold">Try the NDIS calculator</button>
              </p>
            </div>

          </div>
        </section>


        {/* 2. COMPLIANCE & SAFETY ASSURANCE TICKER BAR */}
        <section className="bg-white border-b border-slate-200 py-6 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0b2240]">Certified NDIS Provider</p>
                <p className="text-[11px] text-slate-500">Fully compliant with the NDIS Quality and Safeguards Commission.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0b2240]">100% Screened Care Professionals</p>
                <p className="text-[11px] text-slate-500">All staff hold verified NDIS Workers Screening Checks and CPR.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Smile size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0b2240]">Person-Centred Framework</p>
                <p className="text-[11px] text-slate-500">We prioritize individual goals, cultural background, and dignity.</p>
              </div>
            </div>
          </div>
        </section>


        {/* 3. CORE SERVICES GRID SECTION */}
        <section 
          ref={sectionRefs.services}
          id="services"
          className="py-16 sm:py-24 bg-slate-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
              <span className="text-teal-700 font-display text-xs font-bold uppercase tracking-wider">
                Support Options
              </span>
              <h2 
                onClick={() => speakText("Our professional NDIS support services. We provide Supported Independent Living, Community Access Hubs, Support Coordination, In Home Care, Specialist Disability Housing, and Social weekend clubs.")}
                className="text-2xl sm:text-3xl font-display font-bold text-[#0b2240] cursor-help hover:text-teal-700 transition-colors"
                title="Click to read section description aloud"
              >
                Comprehensive NDIS Care Services
              </h2>
              <p className="text-slate-500 text-sm">
                We design specialized programs helping participants achieve independence, safety, and community links in Greater Parramatta and wider Sydney.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES_DATA.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Icon & Category Header */}
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 group-hover:bg-teal-600 transition-colors duration-300">
                        <div className="group-hover:text-white transition-colors">
                          {getServiceIcon(service.iconName, 22)}
                        </div>
                      </div>
                      
                      {/* Audio reader helper per service */}
                      <button
                        onClick={() => speakText(`${service.title}. ${service.shortDescription}`)}
                        className="p-1.5 rounded-full text-slate-300 hover:text-teal-700 hover:bg-slate-100 transition-all cursor-pointer"
                        title="Read this service aloud"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        {service.ndisCategory.split(' - ')[0]}
                      </span>
                      <h3 className="text-lg font-display font-bold text-[#0b2240] group-hover:text-teal-700 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {service.shortDescription}
                      </p>
                    </div>

                    {/* Highlights bullets preview */}
                    <ul className="space-y-1 pt-1 border-t border-slate-100">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                          <Check size={12} className="text-emerald-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedServiceDetail(service)}
                      className="text-xs font-bold text-[#0b2240] hover:text-amber-500 flex items-center gap-0.5 cursor-pointer"
                    >
                      Read Full Guide
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => {
                        handlePreFillReferral([service.id], `Enquiring directly about service: ${service.title}`);
                        handleNavigate('referrals');
                      }}
                      className="bg-[#0b2240] text-white text-[10px] font-bold px-3.5 py-2 rounded-lg hover:bg-amber-500 hover:text-[#0b2240] transition-colors cursor-pointer shadow-sm"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* SERVICE EXPANDED DETAIL MODAL */}
        {selectedServiceDetail && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 animate-scale-up">
              
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                    {selectedServiceDetail.ndisCategory}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0b2240] mt-1.5">
                    {selectedServiceDetail.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedServiceDetail(null)}
                  className="bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p className="whitespace-pre-wrap">{selectedServiceDetail.fullDescription}</p>

                {/* Features Checklist */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800 mb-2">Detailed Services Included:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedServiceDetail.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Funding Guide Box */}
                <div className="bg-amber-50/50 border-l-4 border-amber-500 p-3.5 rounded-r-lg">
                  <p className="text-xs font-bold text-amber-950">NDIS Funding and Price Limits:</p>
                  <p className="text-xs text-amber-900 mt-1">{selectedServiceDetail.pricingGuide}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    handlePreFillReferral([selectedServiceDetail.id], `Enquiring from full modal details for: ${selectedServiceDetail.title}`);
                    setSelectedServiceDetail(null);
                    handleNavigate('referrals');
                  }}
                  className="flex-1 bg-teal-700 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl shadow transition-colors cursor-pointer text-center text-xs"
                >
                  Pre-fill This Service Into Referral Form
                </button>
                <button
                  onClick={() => setSelectedServiceDetail(null)}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-6 rounded-xl border border-slate-300 transition-colors cursor-pointer text-center text-xs"
                >
                  Close Guide
                </button>
              </div>

            </div>
          </div>
        )}


        {/* 4. THE INTERACTIVE CARE FINDER WIZARD SECTION */}
        <section 
          ref={sectionRefs.finder}
          id="finder"
          className="py-16 sm:py-24 bg-white border-t border-b border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ServiceFinder 
              onPreFillReferral={handlePreFillReferral} 
              onNavigate={handleNavigate} 
            />
          </div>
        </section>


        {/* 5. DYNAMIC NDIS PLAN ESTIMATOR CALCULATOR */}
        <section 
          ref={sectionRefs.calculator}
          id="calculator"
          className="py-16 sm:py-24 bg-slate-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NDISCalculator 
              onPreFillReferral={handlePreFillReferral} 
              onNavigate={handleNavigate} 
            />
          </div>
        </section>


        {/* 6. SYNERGY VALUE PROPOSITION SECTION */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Values Left */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-teal-700 font-display text-xs font-bold uppercase tracking-wider">
                  The Synergy Difference
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0b2240] tracking-tight">
                  Designed Around Your Culture, Comfort, and Independence
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Synergy Care Link was founded with the belief that care is most powerful when customized. We recruit local support workers who share our client’s languages, cultural values, hobbies, and dietary styles to ensure true companionship.
                </p>

                <div className="space-y-4 pt-2">
                  {[
                    { title: "Multicultural Care Matchmaking", desc: "Access staff skilled in multi-lingual supports." },
                    { title: "Transparent Pricing Logs", desc: "No hidden administrative exit fees or surprise costs." },
                    { title: "Flexible Scheduling Adjustments", desc: "Change support times easily with zero penalties." }
                  ].map((value, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0b2240]">{value.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{value.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphic/Values Right */}
              <div className="lg:col-span-7 bg-[#0b2240] rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-teal-400 via-emerald-500"></div>
                
                <h3 className="text-xl font-display font-bold text-amber-400">Our Pillars of NDIS Care Quality</h3>
                <p className="text-xs text-slate-300 mt-2">Every team member operates strictly under our high quality assurance pillars:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600/30 text-teal-300 border border-teal-500/20 flex items-center justify-center font-bold text-xs">
                      01
                    </div>
                    <p className="text-xs font-bold text-white">Full Choice & Control</p>
                    <p className="text-[11px] text-slate-400">We work directly for you. You choose your housing, your roommates, your hubs, and worker matches.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600/30 text-teal-300 border border-teal-500/20 flex items-center justify-center font-bold text-xs">
                      02
                    </div>
                    <p className="text-xs font-bold text-white">Honest Advocacy</p>
                    <p className="text-[11px] text-slate-400">Our Support Coordinators are independent, placing client welfare and budget optimization above all else.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600/30 text-teal-300 border border-teal-500/20 flex items-center justify-center font-bold text-xs">
                      03
                    </div>
                    <p className="text-xs font-bold text-white">Continuous Training</p>
                    <p className="text-[11px] text-slate-400">All workers undergo regular specialized clinical modules including behaviour management and heavy hoist operations.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600/30 text-teal-300 border border-teal-500/20 flex items-center justify-center font-bold text-xs">
                      04
                    </div>
                    <p className="text-xs font-bold text-white">Community Uplift</p>
                    <p className="text-[11px] text-slate-400">We partner with local NSW colleges, sports clubs, and councils to build social pathways for our clients.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* 7. CUSTOMER TESTIMONIAL BOARD SECTION */}
        <section className="py-16 bg-[#0b2240] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block">
              Inspiring Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold">
              Synergy Success Journeys
            </h2>

            {/* Testimonial Active Display */}
            <div className="bg-slate-900/60 p-6 sm:p-10 rounded-2xl border border-slate-800 shadow-xl max-w-3xl mx-auto relative space-y-4 min-h-[220px] flex flex-col justify-center">
              <p className="text-xs text-teal-400 font-bold uppercase tracking-wider">{testimonials[currentTestimonial].tag}</p>
              <p className="text-sm sm:text-base italic leading-relaxed text-slate-200">
                "{testimonials[currentTestimonial].quote}"
              </p>
              <div>
                <p className="font-bold text-white">{testimonials[currentTestimonial].name}</p>
                <p className="text-xs text-slate-400">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>

            {/* Carousel controllers */}
            <div className="flex justify-center gap-2 pt-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                    currentTestimonial === i ? 'bg-amber-500 w-8' : 'bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`Testimonial slide ${i + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </section>


        {/* 8. CLIENT REFERRAL PORTAL & STAFF MANAGEMENT SECTION */}
        <section 
          ref={sectionRefs.referrals}
          id="referrals"
          className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="text-teal-700 font-display text-xs font-bold uppercase tracking-wider">
                Intake & Onboarding
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0b2240]">
                NDIS Client Referral Portal
              </h2>
              <p className="text-slate-500 text-sm">
                Easily register as a participant, or refer an NDIS client. Care coordinators, medical providers, or parents can submit client assessments here.
              </p>
            </div>

            {/* Referral portal coordinating prefill state */}
            <ReferralPortal 
              preFilledServices={preFilledServices}
              preFilledNotes={preFilledNotes}
              onClearPreFill={handleClearPreFill}
              showDashboardInitially={showReferralDashboard}
            />
          </div>
        </section>


        {/* 9. ABOUT SYNERGY CARE LINK SECTION */}
        <section 
          ref={sectionRefs.about}
          id="about"
          className="py-16 sm:py-24 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column Description */}
              <div className="lg:col-span-6 space-y-6">
                <span className="text-teal-700 font-display text-xs font-bold uppercase tracking-wider">
                  About Us
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0b2240] tracking-tight">
                  About Synergy Care Link
                </h2>
                <div className="text-slate-500 text-xs sm:text-sm space-y-4 leading-relaxed">
                  <p>
                    Synergy Care Link is a fully registered NDIS service provider operating across the Greater Sydney region with a deep focus on Parramatta, Blacktown, and South-Western Sydney. We were established by certified human services professionals who recognized the need for a more empathetic, highly adaptive approach to care coordination.
                  </p>
                  <p>
                    The word <strong>Synergy</strong> is our core blueprint: we believe the best independent care outcomes are achieved when the participant, their medical team, their family advocates, and our highly skilled support workers operate in perfect, transparent alignment.
                  </p>
                  <p>
                    Whether you are coordinating 24/7 Supported Independent Living (SIL), planning weekly group activities at our modern Hubs, or navigating a complex NDIS annual plan review, Synergy Care Link stands by your side with professional advocacy, safety compliance, and deep warmth.
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center min-w-[140px] flex-1">
                    <p className="text-2xl font-bold text-teal-700">100%</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium mt-1">NDIS Registered</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center min-w-[140px] flex-1">
                    <p className="text-2xl font-bold text-[#0b2240]">Parramatta</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium mt-1">NSW Office Hub</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center min-w-[140px] flex-1">
                    <p className="text-2xl font-bold text-teal-700">24 Hours</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium mt-1">Response Guarantee</p>
                  </div>
                </div>
              </div>

              {/* Right Column compliance & contact card */}
              <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-6">
                <h3 className="text-lg font-display font-bold text-[#0b2240] flex items-center gap-1.5">
                  <HeartHandshake className="text-teal-700" size={20} />
                  Synergy Service Quality Commitment
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Our service models prioritize your goals. We collaborate with all allied health therapists, speech pathologists, behavior coordinators, and medical professionals to support your absolute quality of life.
                </p>

                <div className="space-y-4 text-xs text-slate-600">
                  <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-emerald-500 font-bold shrink-0 text-base">✓</span>
                    <div>
                      <p className="font-bold text-slate-800">Direct Plan Integration</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">We link direct care worker schedules with your NDIS Portal, so your budget is updated in real-time.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-emerald-500 font-bold shrink-0 text-base">✓</span>
                    <div>
                      <p className="font-bold text-slate-800">Culturally & Linguistically Diverse (CALD) Competence</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Specialized assistance for non-English speaking households to safely navigate and utilize NDIS budgets.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-emerald-500 font-bold shrink-0 text-base">✓</span>
                    <div>
                      <p className="font-bold text-slate-800">No Hidden Costs</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">We charge strictly within the NDIS Price Limit arrangements, with zero extra administration premiums.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-500 font-semibold">Got general inquiries? Speak to our team today</p>
                  <a 
                    href="tel:1300363177" 
                    className="inline-flex items-center gap-1.5 text-teal-700 hover:text-amber-500 font-bold text-sm mt-2 transition-colors"
                  >
                    Call 1300 SYNERGY (1300 363 177)
                  </a>
                </div>

              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer coordinates section triggers */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating AI Intake Chat Widget */}
      <AIChatBot highContrast={settings.highContrast} />

      {/* Vercel Web Analytics */}
      <Analytics />

    </div>
  );
}
