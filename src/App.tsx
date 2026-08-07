import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NDISCalculator from './components/NDISCalculator';
import SupportAtHomeCalculator from './components/SupportAtHomeCalculator';
import ReferralPortal from './components/ReferralPortal';
import FreeConsultationModal from './components/FreeConsultationModal';
import FreeConsultationBanner from './components/FreeConsultationBanner';
import { SERVICES_DATA } from './data/services';
import { AccessibilitySettings, NDISService } from './types';
import heroCaringImage from './assets/images/hero_caring_support_1786006266477.jpg';
import communityHubImage from './assets/images/community_hub_group_1786006280169.jpg';
import inHomeCareImage from './assets/images/in_home_care_support_1786006291768.jpg';
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
  FileText,
  HeartHandshake as HeartHandshakeIcon,
  Key,
  Sparkles as SparklesIcon,
  HelpCircle,
  ThumbsUp,
  MessageSquareQuote,
  Stethoscope,
  Activity,
  Car,
  Wrench
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

  // Free Consultation Modal State
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState<boolean>(false);
  const [consultationModalTopic, setConsultationModalTopic] = useState<string | undefined>(undefined);

  const handleOpenConsultation = (topic?: string) => {
    setConsultationModalTopic(topic);
    setIsConsultationModalOpen(true);
  };

  // Service Category Filter (All / NDIS / Support at Home)
  const [serviceFilter, setServiceFilter] = useState<'all' | 'ndis' | 'support_at_home'>('all');

  // References for scrolling
  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    'support-at-home': useRef<HTMLDivElement>(null),
    calculator: useRef<HTMLDivElement>(null),
    referrals: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
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

  // Scroll to page top & set active page route handler
  const handleNavigate = (sectionId: string) => {
    let targetPage = sectionId;
    if (sectionId === 'services' || sectionId === 'calculator') {
      targetPage = 'ndis';
    }
    setActiveSection(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      case 'Stethoscope': return <Stethoscope size={size} className="text-amber-600" />;
      case 'Activity': return <Activity size={size} className="text-amber-600" />;
      case 'Car': return <Car size={size} className="text-amber-600" />;
      case 'Wrench': return <Wrench size={size} className="text-amber-600" />;
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
      quote: "The team at Synergy CareLink doesn't just manage cases; they genuinely care. Their Support Coordinator took all the stress out of our plan review and got our social programs fully funded.",
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
        onOpenConsultationModal={() => handleOpenConsultation()}
      />

      {/* Main Page Layout - Separated Page Architecture */}
      <main className="flex-1">

        {/* ========================================== */}
        {/* PAGE 1: HOME PAGE OVERVIEW                 */}
        {/* ========================================== */}
        {(activeSection === 'home' || activeSection === '') && (
          <>
            {/* HERO BANNER SECTION */}
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
                    onClick={() => speakText("Synergy CareLink. Connecting capabilities, enriching lives. Your trusted care partner across Sydney.")}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold tracking-tight text-white leading-tight cursor-help hover:text-amber-300 transition-colors"
                    title="Click to read aloud"
                  >
                    Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-amber-300">Capabilities</span>,<br />
                    Enriching <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-teal-300">Lives</span>.
                  </h1>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                    Synergy CareLink is a registered care provider delivering specialized Support at Home packages and NDIS supported independent living, community hubs, in-home support, and care advocacy across Greater Sydney.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                    <button
                      onClick={() => handleNavigate('support-at-home')}
                      className="bg-amber-500 hover:bg-amber-400 text-[#0b2240] font-bold text-xs sm:text-sm px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                    >
                      Explore Support at Home & Budget
                      <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={() => handleNavigate('ndis')}
                      className="bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs sm:text-sm px-6 py-4 rounded-xl border border-teal-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      NDIS Services & Plan Estimator
                    </button>
                  </div>

                  {/* Service metrics inline */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 max-w-md">
                    <div>
                      <p className="text-2xl font-bold text-teal-400 font-display">100%</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">Registered Provider</p>
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

                {/* Hero Right Interactive Card & Caring Image Banner */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Authentic Care Image Frame */}
                  <div className="relative group rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 bg-slate-800">
                    <img 
                      src={heroCaringImage} 
                      alt="Compassionate Synergy CareLink support worker smiling warmly with participant" 
                      referrerPolicy="no-referrer" 
                      className="w-full h-56 sm:h-64 object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>
                    
                    {/* Overlaid Trust Badge */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                          <HeartHandshake size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Authentic & Caring Support</p>
                          <p className="text-[10px] text-teal-300">Matching languages, culture & goals</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Sydney Wide
                      </span>
                    </div>
                  </div>

                  {/* Quick Service Selector Box */}
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
                    <div className="space-y-0.5">
                      <h3 className="text-white font-display font-bold text-base">Looking for immediate support?</h3>
                      <p className="text-[11px] text-slate-400">Select a program to navigate directly for further information:</p>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        { title: "Support at Home Program (SAH)", desc: "Aged care packages, 8 funding tiers & budget allocator", target: "support-at-home" },
                        { title: "NDIS Disability Services", desc: "SIL, Community Day Hubs & annual budget estimator", target: "ndis" },
                        { title: "Submit a Client Referral", desc: "Fast intake for coordinators, families & self-referrals", target: "referrals" }
                      ].map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleNavigate(item.target)}
                          className="w-full text-left bg-white/5 hover:bg-teal-700/40 p-3 rounded-xl border border-white/10 hover:border-teal-500/40 transition-all cursor-pointer group flex justify-between items-center"
                        >
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{item.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                          <ChevronRight size={15} className="text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* PROGRAM NAVIGATION HUB CARDS SECTION */}
            <section className="py-16 bg-slate-100 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
                  <span className="text-teal-700 font-display text-xs font-bold uppercase tracking-wider">
                    Information & Service Portals
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0b2240]">
                    Select a Program Below for Detailed Information
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Access dedicated program information, interactive budget allocators, and intake services.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1: Support at Home */}
                  <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                        <Home size={24} />
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                        Aged Care Reform
                      </span>
                      <h3 className="text-lg font-display font-bold text-[#0b2240] group-hover:text-amber-600 transition-colors">
                        Support at Home (SAH)
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Comprehensive information on Australia's 8 Support at Home classification tiers, care categories, co-contributions, and dedicated budget allocator.
                      </p>
                    </div>
                    <button
                      onClick={() => handleNavigate('support-at-home')}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-[#0b2240] font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                    >
                      Go to Support at Home Page
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  {/* Card 2: NDIS Services */}
                  <div className="bg-white rounded-2xl border-2 border-teal-200 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                        <Users size={24} />
                      </div>
                      <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                        Disability Support
                      </span>
                      <h3 className="text-lg font-display font-bold text-[#0b2240] group-hover:text-teal-700 transition-colors">
                        NDIS Services & Budget
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Explore Supported Independent Living (SIL), Community Hubs, Support Coordination, and calculate your annual NDIS plan budget allocation.
                      </p>
                    </div>
                    <button
                      onClick={() => handleNavigate('ndis')}
                      className="w-full bg-[#0b2240] hover:bg-teal-700 text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                    >
                      Go to NDIS Page
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  {/* Card 3: Referral Portal */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
                        <FileText size={24} />
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                        Client Intake
                      </span>
                      <h3 className="text-lg font-display font-bold text-[#0b2240] group-hover:text-blue-700 transition-colors">
                        Client Referrals Portal
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Streamlined intake form for doctors, support coordinators, families, and self-referring participants across Greater Sydney.
                      </p>
                    </div>
                    <button
                      onClick={() => handleNavigate('referrals')}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                    >
                      Submit a Referral
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  {/* Card 4: About Us */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold">
                        <HeartHandshake size={24} />
                      </div>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                        Who We Are
                      </span>
                      <h3 className="text-lg font-display font-bold text-[#0b2240] group-hover:text-purple-700 transition-colors">
                        About Synergy CareLink
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Learn about our founding vision, Parramatta office hub, multicultural care worker matching, and quality assurance standards.
                      </p>
                    </div>
                    <button
                      onClick={() => handleNavigate('about')}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer border border-slate-300"
                    >
                      Learn About Us
                      <ChevronRight size={15} />
                    </button>
                  </div>

                </div>
              </div>
            </section>

            {/* COMPLIANCE & SAFETY ASSURANCE TICKER BAR */}
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

            {/* FREE CARE CONSULTATION FEATURE HIGHLIGHT BANNER */}
            <FreeConsultationBanner onOpenModal={handleOpenConsultation} />

            {/* SYNERGY VALUE PROPOSITION SECTION */}
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
                      Synergy CareLink was founded with the belief that care is most powerful when customized. We recruit local support workers who share our client’s languages, cultural values, hobbies, and dietary styles to ensure true companionship.
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
                  <div className="lg:col-span-7 bg-[#0b2240] rounded-2xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl space-y-6">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-teal-400 via-emerald-500"></div>
                    
                    <div className="relative h-44 sm:h-52 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-2 overflow-hidden rounded-t-2xl group">
                      <img 
                        src={inHomeCareImage} 
                        alt="Attentive support worker preparing a fresh meal with participant in home" 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b2240] via-[#0b2240]/40 to-transparent"></div>
                      
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                        <p className="text-xs font-bold text-teal-300">Personalized In-Home Companionship</p>
                        <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase">
                          Respect & Dignity
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-display font-bold text-amber-400">Our Pillars of Care Quality</h3>
                    <p className="text-xs text-slate-300">Every team member operates strictly under our high quality assurance pillars:</p>

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
                        <p className="text-[11px] text-slate-400">Our Support Coordinators placement client welfare and budget optimization above all else.</p>
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

            {/* CUSTOMER TESTIMONIAL BOARD SECTION */}
            <section className="py-16 bg-[#0b2240] text-white">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block">
                  Inspiring Stories
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold">
                  Synergy Success Journeys
                </h2>

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
          </>
        )}


        {/* ========================================== */}
        {/* PAGE 2: SUPPORT AT HOME PAGE & CALCULATOR  */}
        {/* ========================================== */}
        {activeSection === 'support-at-home' && (
          <div className="animate-fade-in">
            {/* SAH Page Header Banner */}
            <section className="bg-gradient-to-r from-[#0b2240] via-slate-900 to-[#0b2240] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500">
              <div className="max-w-7xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-full text-xs text-amber-300 font-bold uppercase tracking-wider">
                  <Home size={14} className="text-amber-400" />
                  Aged Care Reform Framework
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                  Support at Home Program & Budget Allocator
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                  Understand Australia's Support at Home classification tiers (Tiers 1 to 8), calculate your personalized care budget, and estimate co-contributions for nursing, personal care, domestic support, and allied health.
                </p>
              </div>
            </section>

            {/* Dedicated Support at Home Calculator Component */}
            <section className="py-12 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SupportAtHomeCalculator 
                  onPreFillReferral={handlePreFillReferral} 
                  onNavigate={handleNavigate} 
                />
              </div>
            </section>

            {/* Support at Home Services Catalogue Preview */}
            <section className="py-16 bg-white border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
                  <span className="text-amber-600 font-display text-xs font-bold uppercase tracking-wider">
                    Care Categories
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0b2240]">
                    Available Services Under Support at Home
                  </h2>
                  <p className="text-slate-500 text-sm">
                    All care services are provided by screened care workers and registered nurses across Sydney.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SERVICES_DATA.filter(s => s.programType === 'support_at_home' || s.programType === 'both').map((service) => (
                    <div key={service.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200 uppercase">
                            Support at Home
                          </span>
                          {getServiceIcon(service.iconName, 20)}
                        </div>
                        <h3 className="text-lg font-display font-bold text-[#0b2240]">{service.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{service.shortDescription}</p>
                      </div>
                      <button
                        onClick={() => setSelectedServiceDetail(service)}
                        className="w-full bg-[#0b2240] hover:bg-amber-500 hover:text-[#0b2240] text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Read Full Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}


        {/* ========================================== */}
        {/* PAGE 3: NDIS SERVICES PAGE & CALCULATOR   */}
        {/* ========================================== */}
        {activeSection === 'ndis' && (
          <div className="animate-fade-in">
            {/* NDIS Page Header Banner */}
            <section className="bg-gradient-to-r from-[#0b2240] via-slate-900 to-[#0b2240] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-teal-500">
              <div className="max-w-7xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 px-3 py-1 rounded-full text-xs text-teal-300 font-bold uppercase tracking-wider">
                  <Users size={14} className="text-teal-400" />
                  Registered NDIS Provider
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                  NDIS Disability Services & Plan Budget Estimator
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                  Discover our Supported Independent Living (SIL), Community Day Hubs, and Support Coordination offerings — and estimate your annual NDIS plan budget.
                </p>
              </div>
            </section>

            {/* NDIS Services Catalog Grid */}
            <section className="py-12 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
                  <span className="text-teal-700 font-display text-xs font-bold uppercase tracking-wider">
                    Service Catalog
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0b2240]">
                    NDIS Core & Capacity Building Supports
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {SERVICES_DATA.filter(s => s.programType === 'ndis' || s.programType === 'both').map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group"
                    >
                      <div className="space-y-4">
                        {service.imageUrl && (
                          <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden bg-slate-100 rounded-t-2xl">
                            <img 
                              src={service.imageUrl} 
                              alt={service.title} 
                              referrerPolicy="no-referrer" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded border border-teal-200 uppercase">
                            NDIS Registered
                          </span>
                          {getServiceIcon(service.iconName, 20)}
                        </div>
                        <h3 className="text-lg font-display font-bold text-[#0b2240]">{service.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{service.shortDescription}</p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                        <button
                          onClick={() => setSelectedServiceDetail(service)}
                          className="text-xs font-bold text-[#0b2240] hover:text-teal-700 flex items-center gap-0.5 cursor-pointer"
                        >
                          Read Guide
                          <ChevronRight size={14} />
                        </button>
                        <button
                          onClick={() => {
                            handlePreFillReferral([service.id], `Enquiring directly from NDIS Page for: ${service.title}`);
                            handleNavigate('referrals');
                          }}
                          className="bg-[#0b2240] text-white text-[10px] font-bold px-3.5 py-2 rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
                        >
                          Enquire Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Dedicated NDIS Plan Calculator Component */}
            <section className="py-16 bg-white border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <NDISCalculator 
                  onPreFillReferral={handlePreFillReferral} 
                  onNavigate={handleNavigate} 
                />
              </div>
            </section>
          </div>
        )}


        {/* ========================================== */}
        {/* PAGE 4: CLIENT REFERRALS PORTAL PAGE       */}
        {/* ========================================== */}
        {activeSection === 'referrals' && (
          <div className="animate-fade-in">
            {/* Referrals Header Banner */}
            <section className="bg-gradient-to-r from-[#0b2240] via-slate-900 to-[#0b2240] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500">
              <div className="max-w-7xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs text-blue-300 font-bold uppercase tracking-wider">
                  <FileText size={14} className="text-blue-400" />
                  Intake & Assessment Hub
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                  Client Referral Portal
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                  Submit a new client referral for NDIS disability support or Support at Home care. Care coordinators, medical providers, families, and self-referring participants are welcome.
                </p>
              </div>
            </section>

            <section className="py-12 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ReferralPortal 
                  preFilledServices={preFilledServices}
                  preFilledNotes={preFilledNotes}
                  onClearPreFill={handleClearPreFill}
                  showDashboardInitially={showReferralDashboard}
                />
              </div>
            </section>
          </div>
        )}


        {/* ========================================== */}
        {/* PAGE 5: ABOUT US PAGE                     */}
        {/* ========================================== */}
        {activeSection === 'about' && (
          <div className="animate-fade-in">
            {/* About Us Banner */}
            <section className="bg-gradient-to-r from-[#0b2240] via-slate-900 to-[#0b2240] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-purple-500">
              <div className="max-w-7xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full text-xs text-purple-300 font-bold uppercase tracking-wider">
                  <HeartHandshake size={14} className="text-purple-400" />
                  Our Story & Mission
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                  About Synergy CareLink
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                  Delivering person-centered, culturally respectful care and advocacy across Greater Sydney and Parramatta.
                </p>
              </div>
            </section>

            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Column Description */}
                  <div className="lg:col-span-6 space-y-6">
                    <span className="text-teal-700 font-display text-xs font-bold uppercase tracking-wider">
                      Who We Are
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0b2240] tracking-tight">
                      Connecting Capabilities, Enriching Lives
                    </h2>
                    <div className="text-slate-600 text-xs sm:text-sm space-y-4 leading-relaxed">
                      <p>
                        Synergy CareLink is a fully registered service provider operating across the Greater Sydney region with a deep focus on Parramatta, Blacktown, and South-Western Sydney. We were established by certified human services professionals who recognized the need for a more empathetic, highly adaptive approach to care coordination.
                      </p>
                      <p>
                        The word <strong>Synergy</strong> is our core blueprint: we believe the best independent care outcomes are achieved when the participant, their medical team, their family advocates, and our highly skilled support workers operate in perfect, transparent alignment.
                      </p>
                      <p>
                        Whether you are coordinating 24/7 Supported Independent Living (SIL), planning weekly group activities at our modern Hubs, or navigating a complex NDIS or Support at Home review, Synergy CareLink stands by your side with professional advocacy, safety compliance, and deep warmth.
                      </p>
                    </div>

                    <div className="pt-4 flex flex-wrap gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center min-w-[140px] flex-1">
                        <p className="text-2xl font-bold text-teal-700">100%</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium mt-1">Registered Provider</p>
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

                  {/* Right Column image & contact */}
                  <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 overflow-hidden shadow-sm">
                    <div className="relative h-52 sm:h-60 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-2 overflow-hidden bg-slate-800 group">
                      <img 
                        src={communityHubImage} 
                        alt="Participants enjoying activities at Synergy CareLink Community Hub" 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                      
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                        <div>
                          <p className="text-xs font-bold text-amber-300">Community Hubs & Day Programs</p>
                          <p className="text-[10px] text-slate-200">Building skills, friendships & creative expression</p>
                        </div>
                        <span className="text-[10px] bg-teal-600/90 text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-teal-400/40">
                          Parramatta & Sydney
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-display font-bold text-[#0b2240] flex items-center gap-1.5">
                      <HeartHandshake className="text-teal-700" size={20} />
                      Synergy Service Quality Commitment
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Our service models prioritize your goals. We collaborate with all allied health therapists, speech pathologists, behavior coordinators, and medical professionals to support your absolute quality of life.
                    </p>

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
          </div>
        )}

        {/* SERVICE EXPANDED DETAIL MODAL (GLOBAL) */}
        {selectedServiceDetail && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 animate-scale-up overflow-hidden">
              
              {selectedServiceDetail.imageUrl && (
                <div className="relative h-48 sm:h-56 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-4 overflow-hidden bg-slate-100">
                  <img 
                    src={selectedServiceDetail.imageUrl} 
                    alt={selectedServiceDetail.title} 
                    referrerPolicy="no-referrer" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  <button
                    type="button"
                    onClick={() => setSelectedServiceDetail(null)}
                    className="absolute top-4 right-4 bg-slate-950/60 text-white hover:bg-slate-900 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors border border-white/20"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                    {selectedServiceDetail.ndisCategory}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0b2240] mt-1.5">
                    {selectedServiceDetail.title}
                  </h3>
                </div>
                {!selectedServiceDetail.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setSelectedServiceDetail(null)}
                    className="bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p className="whitespace-pre-wrap">{selectedServiceDetail.fullDescription}</p>

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

                <div className="bg-amber-50/50 border-l-4 border-amber-500 p-3.5 rounded-r-lg">
                  <p className="text-xs font-bold text-amber-950">NDIS / Support at Home Funding:</p>
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
                  Pre-fill Into Referral Form
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

      </main>

      {/* Footer coordinates section triggers */}
      <Footer onNavigate={handleNavigate} />

      {/* Free 1-on-1 Consultation Booking Modal */}
      <FreeConsultationModal 
        isOpen={isConsultationModalOpen} 
        onClose={() => setIsConsultationModalOpen(false)} 
        defaultTopic={consultationModalTopic}
      />

    </div>
  );
}
