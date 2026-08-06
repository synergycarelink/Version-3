import { useState, useEffect } from 'react';
import { 
  Calculator, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  Home, 
  Activity, 
  Heart, 
  Briefcase, 
  Clock, 
  Printer, 
  ShieldCheck, 
  Sliders, 
  AlertTriangle,
  ChevronDown,
  DollarSign
} from 'lucide-react';

interface SupportAtHomeCalculatorProps {
  onPreFillReferral: (services: string[], notes: string) => void;
  onNavigate: (sectionId: string) => void;
}

// Support at Home Government Classification Funding Tiers (2025/2026 Framework)
const CLASSIFICATION_TIERS = [
  { id: 'tier-1', name: 'Tier 1 - Low Care', annualBudget: 11000, desc: 'Entry-level support for basic household assistance & check-ins.' },
  { id: 'tier-2', name: 'Tier 2 - Low-Moderate Care', annualBudget: 18500, desc: 'Support for personal care & light domestic tasks.' },
  { id: 'tier-3', name: 'Tier 3 - Moderate Care', annualBudget: 27000, desc: 'Regular daily living assistance, social transport & nursing.' },
  { id: 'tier-4', name: 'Tier 4 - Moderate-High Care', annualBudget: 38000, desc: 'Frequent personal care, therapy & clinical nursing support.' },
  { id: 'tier-5', name: 'Tier 5 - High Care Level A', annualBudget: 48000, desc: 'High-level daily care, complex mobility & nursing.' },
  { id: 'tier-6', name: 'Tier 6 - High Care Level B', annualBudget: 58000, desc: 'Comprehensive daily care, behavior support & frequent nursing.' },
  { id: 'tier-7', name: 'Tier 7 - Complex High Care', annualBudget: 68000, desc: 'High clinical oversight, 7-day personal care & respite.' },
  { id: 'tier-8', name: 'Tier 8 - Maximum Support', annualBudget: 78000, desc: 'Intensive 24/7 wrap-around care, high nursing & complex needs.' },
];

// Standard hourly rates for Support at Home care services (National / Synergy care benchmarks)
const DEFAULT_RATES = {
  clinicalCare: 120.00, // Clinical nursing / Allied health ($/hr)
  personalCare: 67.50,  // Showering, mobility, grooming ($/hr)
  domesticSupport: 58.00, // Meal prep, cleaning, laundry, gardening ($/hr)
  socialTransport: 62.00, // Community transport, social outings ($/hr)
  respiteDays: 380.00,   // In-home day respite ($/day - 6 hrs)
};

export default function SupportAtHomeCalculator({ onPreFillReferral, onNavigate }: SupportAtHomeCalculatorProps) {
  // Classification selection
  const [selectedTierId, setSelectedTierId] = useState<string>('tier-3');
  const [customAnnualBudget, setCustomAnnualBudget] = useState<number | ''>(27000);
  
  // Display frequency toggle: 'weekly' | 'fortnightly' | 'monthly' | 'annual'
  const [frequency, setFrequency] = useState<'weekly' | 'fortnightly' | 'monthly' | 'annual'>('weekly');

  // Input Hours & Allowances (Weekly basis)
  const [clinicalHours, setClinicalHours] = useState<number>(1); // hrs/wk
  const [personalCareHours, setPersonalCareHours] = useState<number>(5); // hrs/wk
  const [domesticHours, setDomesticHours] = useState<number>(3); // hrs/wk
  const [socialHours, setSocialHours] = useState<number>(2); // hrs/wk
  const [respiteDaysPerMonth, setRespiteDaysPerMonth] = useState<number>(1); // days/mo
  const [techMonthlyAllowance, setTechMonthlyAllowance] = useState<number>(150); // $/mo for equipment/mods
  const [careManagementPct, setCareManagementPct] = useState<number>(10); // % of budget for care management

  // Co-contribution state
  const [enableCoContribution, setEnableCoContribution] = useState<boolean>(false);
  const [coContributionPct, setCoContributionPct] = useState<number>(15); // e.g. 15% income-tested participant contribution

  // Modal print view
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Computed financial results
  const [calculations, setCalculations] = useState({
    annualBudget: 27000,
    weeklyClinicalCost: 0,
    weeklyPersonalCost: 0,
    weeklyDomesticCost: 0,
    weeklySocialCost: 0,
    weeklyRespiteCost: 0,
    weeklyTechCost: 0,
    weeklyCareMgmtCost: 0,
    totalWeeklyCost: 0,
    totalAnnualCost: 0,
    remainingAnnualBuffer: 0,
    budgetPercentUsed: 0,
    weeklyCoContribution: 0,
    weeklyGovtFundingUsed: 0
  });

  // Handle tier selection change
  const handleTierChange = (tierId: string) => {
    setSelectedTierId(tierId);
    if (tierId === 'custom') {
      return;
    }
    const found = CLASSIFICATION_TIERS.find(t => t.id === tierId);
    if (found) {
      setCustomAnnualBudget(found.annualBudget);
    }
  };

  // Perform real-time budget calculations
  useEffect(() => {
    const annualBudgetLimit = Number(customAnnualBudget) || 0;

    // Weekly cost calculations
    const weeklyClinicalCost = clinicalHours * DEFAULT_RATES.clinicalCare;
    const weeklyPersonalCost = personalCareHours * DEFAULT_RATES.personalCare;
    const weeklyDomesticCost = domesticHours * DEFAULT_RATES.domesticSupport;
    const weeklySocialCost = socialHours * DEFAULT_RATES.socialTransport;
    const weeklyRespiteCost = (respiteDaysPerMonth * DEFAULT_RATES.respiteDays * 12) / 52;
    const weeklyTechCost = (techMonthlyAllowance * 12) / 52;

    // Subtotal of direct services before Care Management
    const directServicesWeekly = weeklyClinicalCost + weeklyPersonalCost + weeklyDomesticCost + weeklySocialCost + weeklyRespiteCost + weeklyTechCost;
    
    // Care management calculated as percentage of total target or direct services
    const weeklyCareMgmtCost = (directServicesWeekly * (careManagementPct / 100));

    const totalWeeklyCost = directServicesWeekly + weeklyCareMgmtCost;
    const totalAnnualCost = totalWeeklyCost * 52;

    const remainingAnnualBuffer = annualBudgetLimit - totalAnnualCost;
    const budgetPercentUsed = annualBudgetLimit > 0 ? (totalAnnualCost / annualBudgetLimit) * 100 : 0;

    // Co-contribution calculation
    const weeklyCoContribution = enableCoContribution ? (totalWeeklyCost * (coContributionPct / 100)) : 0;
    const weeklyGovtFundingUsed = totalWeeklyCost - weeklyCoContribution;

    setCalculations({
      annualBudget: annualBudgetLimit,
      weeklyClinicalCost,
      weeklyPersonalCost,
      weeklyDomesticCost,
      weeklySocialCost,
      weeklyRespiteCost,
      weeklyTechCost,
      weeklyCareMgmtCost,
      totalWeeklyCost,
      totalAnnualCost,
      remainingAnnualBuffer,
      budgetPercentUsed,
      weeklyCoContribution,
      weeklyGovtFundingUsed
    });
  }, [
    customAnnualBudget, 
    clinicalHours, 
    personalCareHours, 
    domesticHours, 
    socialHours, 
    respiteDaysPerMonth, 
    techMonthlyAllowance, 
    careManagementPct,
    enableCoContribution,
    coContributionPct
  ]);

  // Frequency multiplier helper for display
  const getFreqMultiplier = () => {
    switch (frequency) {
      case 'fortnightly': return 2;
      case 'monthly': return 52 / 12; // ~4.333
      case 'annual': return 52;
      case 'weekly': default: return 1;
    }
  };

  const mult = getFreqMultiplier();

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
  };

  // Transfer calculated budget directly into the Client Referral Form
  const handleApplyToReferral = () => {
    const selectedServices: string[] = [];
    if (clinicalHours > 0) selectedServices.push('in-home-care');
    if (personalCareHours > 0) selectedServices.push('in-home-care');
    if (domesticHours > 0) selectedServices.push('in-home-care');
    if (socialHours > 0) selectedServices.push('community-hubs');
    if (careManagementPct > 0) selectedServices.push('support-coordination');

    const tierName = CLASSIFICATION_TIERS.find(t => t.id === selectedTierId)?.name || 'Custom Support Package';

    const notesText = `Automatically transferred from Support at Home Budget Calculator:
- Care Package / Classification Level: ${tierName} ($${calculations.annualBudget.toLocaleString()}/yr)
- Scheduled Care Hours & Items:
  * Clinical Nursing & Therapy: ${clinicalHours} hrs/wk (${formatMoney(calculations.weeklyClinicalCost)}/wk)
  * Personal Care & Mobility: ${personalCareHours} hrs/wk (${formatMoney(calculations.weeklyPersonalCost)}/wk)
  * Domestic Assistance & Meals: ${domesticHours} hrs/wk (${formatMoney(calculations.weeklyDomesticCost)}/wk)
  * Social & Transport Support: ${socialHours} hrs/wk (${formatMoney(calculations.weeklySocialCost)}/wk)
  * In-Home Care Respite: ${respiteDaysPerMonth} day(s)/month (${formatMoney(calculations.weeklyRespiteCost)}/wk)
  * Assistive Tech / Home Mods Allowance: $${techMonthlyAllowance}/month (${formatMoney(calculations.weeklyTechCost)}/wk)
  * Synergy Dedicated Care Management (${careManagementPct}%): ${formatMoney(calculations.weeklyCareMgmtCost)}/wk
- Financial Summary:
  * Total Weekly Estimated Cost: ${formatMoney(calculations.totalWeeklyCost)}/week
  * Total Projected Annual Care Budget: ${formatMoney(calculations.totalAnnualCost)}/year (${calculations.budgetPercentUsed.toFixed(1)}% of funded package)
  * Annual Contingency Buffer Available: ${formatMoney(calculations.remainingAnnualBuffer)}`;

    onPreFillReferral(selectedServices, notesText);
    onNavigate('referrals');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-[#0b2240] via-slate-900 to-teal-950 text-white p-6 sm:p-10 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 px-3 py-1 rounded-full text-xs font-semibold text-teal-300 uppercase tracking-widest">
            <Sparkles size={14} className="text-amber-400" />
            Aged Care & Home Support Framework
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight">
            Support at Home Budget Calculator
          </h2>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            Estimate your Support at Home care budget, itemized service hours, clinical nursing needs, and government subsidies. Adjust care hours in real time to see your weekly breakdown and annual plan utilization.
          </p>

          {/* Quick Pillars info strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
              <span>Clinical Nursing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
              <span>Personal Care & Hygiene</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
              <span>Everyday Domestic Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
              <span>Care Management & Tech</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10 max-w-7xl mx-auto">
        
        {/* STEP 1: Select Government Classification Tier */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-display font-bold text-[#0b2240] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs flex items-center justify-center font-bold">1</span>
                Select Funding Classification Level or Custom Budget
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose a Support at Home / Home Care funding tier or enter your allocated annual budget.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-600 px-2">View Breakdown by:</span>
              {(['weekly', 'fortnightly', 'monthly', 'annual'] as const).map(freq => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md capitalize transition-all cursor-pointer ${
                    frequency === freq 
                      ? 'bg-teal-700 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CLASSIFICATION_TIERS.map(tier => {
              const isSelected = selectedTierId === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => handleTierChange(tier.id)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-teal-50/80 border-teal-600 shadow-md ring-2 ring-teal-500/30' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                        {tier.name}
                      </span>
                      {isSelected && <CheckCircle2 size={16} className="text-teal-700 shrink-0" />}
                    </div>
                    <p className="text-lg font-display font-bold text-teal-800 mt-1">
                      {formatMoney(tier.annualBudget)}<span className="text-[10px] text-slate-500 font-normal">/yr</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {tier.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Annual Budget Input Override */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0b2240]">Custom Package Funding Limit</p>
                <p className="text-[11px] text-slate-500">Specify an exact annual amount if your package includes extra top-ups.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">$</span>
              <input 
                type="number"
                value={customAnnualBudget}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  setCustomAnnualBudget(val);
                  setSelectedTierId('custom');
                }}
                placeholder="e.g. 35000"
                className="w-36 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-medium">/ year</span>
            </div>
          </div>
        </div>

        {/* STEP 2: Main Calculation Grid (Inputs vs Real-time Financial Dashboard) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Service Hours & Item Inputs */}
          <div className="lg:col-span-7 space-y-6 bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-base font-display font-bold text-[#0b2240] flex items-center gap-2 border-b border-slate-200 pb-3">
              <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs flex items-center justify-center font-bold">2</span>
              Configure Weekly Care Hours & Services
            </h3>

            {/* Service Item 1: Clinical Care & Nursing */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-700">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Clinical Nursing & Allied Health</h4>
                    <p className="text-[11px] text-slate-500">Medication administration, nursing visits, wound care (${DEFAULT_RATES.clinicalCare}/hr)</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded">
                  {formatMoney(calculations.weeklyClinicalCost * mult)} / {frequency}
                </span>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  step="0.5"
                  value={clinicalHours}
                  onChange={(e) => setClinicalHours(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <input 
                    type="number" 
                    min="0" 
                    max="40" 
                    value={clinicalHours}
                    onChange={(e) => setClinicalHours(Math.max(0, Number(e.target.value)))}
                    className="w-16 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-center"
                  />
                  <span className="text-xs text-slate-500 font-medium">hrs/wk</span>
                </div>
              </div>
            </div>

            {/* Service Item 2: Personal Care & Mobility */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                    <Heart size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Personal Care & Daily Hygiene</h4>
                    <p className="text-[11px] text-slate-500">Showering, grooming, dressing, morning/evening care routine (${DEFAULT_RATES.personalCare}/hr)</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded">
                  {formatMoney(calculations.weeklyPersonalCost * mult)} / {frequency}
                </span>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <input 
                  type="range" 
                  min="0" 
                  max="40" 
                  step="0.5"
                  value={personalCareHours}
                  onChange={(e) => setPersonalCareHours(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <input 
                    type="number" 
                    min="0" 
                    max="60" 
                    value={personalCareHours}
                    onChange={(e) => setPersonalCareHours(Math.max(0, Number(e.target.value)))}
                    className="w-16 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-center"
                  />
                  <span className="text-xs text-slate-500 font-medium">hrs/wk</span>
                </div>
              </div>
            </div>

            {/* Service Item 3: Domestic Support & Everyday Living */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                    <Home size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Domestic Support & Everyday Living</h4>
                    <p className="text-[11px] text-slate-500">House cleaning, laundry, meal preparation, gardening support (${DEFAULT_RATES.domesticSupport}/hr)</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded">
                  {formatMoney(calculations.weeklyDomesticCost * mult)} / {frequency}
                </span>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  step="0.5"
                  value={domesticHours}
                  onChange={(e) => setDomesticHours(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <input 
                    type="number" 
                    min="0" 
                    max="50" 
                    value={domesticHours}
                    onChange={(e) => setDomesticHours(Math.max(0, Number(e.target.value)))}
                    className="w-16 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-center"
                  />
                  <span className="text-xs text-slate-500 font-medium">hrs/wk</span>
                </div>
              </div>
            </div>

            {/* Service Item 4: Social & Transport Support */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Social Outings & Medical Transport</h4>
                    <p className="text-[11px] text-slate-500">Community participation, grocery shopping trips, medical appointments (${DEFAULT_RATES.socialTransport}/hr)</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2 py-1 rounded">
                  {formatMoney(calculations.weeklySocialCost * mult)} / {frequency}
                </span>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  step="0.5"
                  value={socialHours}
                  onChange={(e) => setSocialHours(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <input 
                    type="number" 
                    min="0" 
                    max="40" 
                    value={socialHours}
                    onChange={(e) => setSocialHours(Math.max(0, Number(e.target.value)))}
                    className="w-16 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-center"
                  />
                  <span className="text-xs text-slate-500 font-medium">hrs/wk</span>
                </div>
              </div>
            </div>

            {/* Service Item 5: In-Home Respite & Care Management */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* In-Home Respite Days */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">In-Home Respite Care</h4>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {formatMoney(calculations.weeklyRespiteCost * mult)} / {frequency}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Primary carer relief days (${DEFAULT_RATES.respiteDays}/day)</p>
                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="number" 
                    min="0" 
                    max="10" 
                    value={respiteDaysPerMonth}
                    onChange={(e) => setRespiteDaysPerMonth(Math.max(0, Number(e.target.value)))}
                    className="w-16 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-center"
                  />
                  <span className="text-xs text-slate-600 font-medium">days / month</span>
                </div>
              </div>

              {/* Care Management Percentage */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Synergy Care Management</h4>
                  <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">
                    {formatMoney(calculations.weeklyCareMgmtCost * mult)} / {frequency}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Dedicated care coordinator & service reviews</p>
                <div className="flex items-center gap-2 pt-1">
                  <select 
                    value={careManagementPct}
                    onChange={(e) => setCareManagementPct(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800"
                  >
                    <option value={5}>5% - Basic Oversight</option>
                    <option value={10}>10% - Standard Care Management (Recommended)</option>
                    <option value={15}>15% - Intensive Clinical Oversight</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Optional Equipment Allowance & Co-Contribution Toggle */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Assistive Tech & Home Modifications Allowance</h4>
                  <p className="text-[10px] text-slate-500">Monthly budget reserve for shower chairs, grab rails, alarms</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold">$</span>
                  <input 
                    type="number"
                    value={techMonthlyAllowance}
                    onChange={(e) => setTechMonthlyAllowance(Math.max(0, Number(e.target.value)))}
                    className="w-24 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-center"
                  />
                  <span className="text-xs text-slate-500">/ mo</span>
                </div>
              </div>

              {/* Co-contribution Checkbox */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={enableCoContribution}
                    onChange={(e) => setEnableCoContribution(e.target.checked)}
                    className="rounded text-teal-700 focus:ring-teal-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-slate-700">Calculate Participant Co-Contribution (e.g., 15% income tested)</span>
                </label>

                {enableCoContribution && (
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={coContributionPct}
                      onChange={(e) => setCoContributionPct(Number(e.target.value))}
                      className="w-14 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-bold text-center"
                    />
                    <span className="text-xs font-bold text-slate-500">%</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: Real-time Budget Financial Summary Dashboard */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            <div className="bg-gradient-to-b from-[#0b2240] to-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-6 border border-slate-800">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Calculator className="text-amber-400" size={20} />
                  <h3 className="font-display font-bold text-base text-white">Live Financial Breakdown</h3>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-900/60 border border-teal-500/30 px-2 py-0.5 rounded">
                  {frequency} Mode
                </span>
              </div>

              {/* Major Cost Numbers */}
              <div className="space-y-2 text-center bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Estimated Care Allocation</p>
                <p className="text-3xl sm:text-4xl font-display font-bold text-amber-400">
                  {formatMoney(calculations.totalWeeklyCost * mult)}
                  <span className="text-xs text-slate-300 font-normal ml-1">/ {frequency}</span>
                </p>
                <p className="text-xs text-slate-300 font-medium">
                  Annualized Care Total: <span className="text-white font-bold">{formatMoney(calculations.totalAnnualCost)}</span>
                </p>
              </div>

              {/* Progress Bar & Budget Status Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">Target Annual Package:</span>
                  <span className="font-bold text-white">{formatMoney(calculations.annualBudget)}</span>
                </div>

                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      calculations.budgetPercentUsed > 100 
                        ? 'bg-rose-500' 
                        : calculations.budgetPercentUsed > 90 
                        ? 'bg-amber-400' 
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, calculations.budgetPercentUsed)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Budget Utilized: {calculations.budgetPercentUsed.toFixed(1)}%</span>
                  <span className={`font-bold ${
                    calculations.remainingAnnualBuffer >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {calculations.remainingAnnualBuffer >= 0 
                      ? `+${formatMoney(calculations.remainingAnnualBuffer)} Buffer` 
                      : `-${formatMoney(Math.abs(calculations.remainingAnnualBuffer))} Exceeded`
                    }
                  </span>
                </div>
              </div>

              {/* Status Alert Badge */}
              {calculations.budgetPercentUsed > 100 ? (
                <div className="bg-rose-950/80 border border-rose-500/40 p-3 rounded-xl flex items-start gap-2 text-rose-200 text-xs">
                  <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-rose-300">Package Limit Exceeded</p>
                    <p className="text-[11px] mt-0.5 text-rose-200/80">
                      Your current schedule exceeds the package funding by {formatMoney(Math.abs(calculations.remainingAnnualBuffer))}/year. You can reduce hours or apply for a higher classification tier.
                    </p>
                  </div>
                </div>
              ) : calculations.budgetPercentUsed > 90 ? (
                <div className="bg-amber-950/80 border border-amber-500/40 p-3 rounded-xl flex items-start gap-2 text-amber-200 text-xs">
                  <Sparkles size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-300">Optimal Package Utilization</p>
                    <p className="text-[11px] mt-0.5 text-amber-200/80">
                      Great planning! Your schedule maximizes care hours with a healthy contingency buffer of {formatMoney(calculations.remainingAnnualBuffer)}.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-950/80 border border-emerald-500/40 p-3 rounded-xl flex items-start gap-2 text-emerald-200 text-xs">
                  <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-300">Sufficient Budget Available</p>
                    <p className="text-[11px] mt-0.5 text-emerald-200/80">
                      You have {formatMoney(calculations.remainingAnnualBuffer)} remaining in annual funding for additional allied health or unexpected care needs.
                    </p>
                  </div>
                </div>
              )}

              {/* Itemized Table Breakdown */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Itemized Breakdown ({frequency}):</p>
                
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span> Clinical Care
                    </span>
                    <span className="font-mono text-white">{formatMoney(calculations.weeklyClinicalCost * mult)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400"></span> Personal Care
                    </span>
                    <span className="font-mono text-white">{formatMoney(calculations.weeklyPersonalCost * mult)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span> Domestic Support
                    </span>
                    <span className="font-mono text-white">{formatMoney(calculations.weeklyDomesticCost * mult)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Social & Transport
                    </span>
                    <span className="font-mono text-white">{formatMoney(calculations.weeklySocialCost * mult)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> In-Home Respite
                    </span>
                    <span className="font-mono text-white">{formatMoney(calculations.weeklyRespiteCost * mult)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span> Care Management ({careManagementPct}%)
                    </span>
                    <span className="font-mono text-white">{formatMoney(calculations.weeklyCareMgmtCost * mult)}</span>
                  </div>

                  {enableCoContribution && (
                    <div className="flex justify-between items-center py-1.5 border-t border-amber-500/30 text-amber-300 font-medium">
                      <span>Participant Co-Contribution ({coContributionPct}%):</span>
                      <span className="font-mono font-bold">{formatMoney(calculations.weeklyCoContribution * mult)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleApplyToReferral}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-[#0b2240] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Transfer Budget to Synergy Referral Portal</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => setShowPrintModal(true)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2.5 px-4 rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>View Printable Summary Report</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* PRINTABLE / SUMMARY REPORT MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 border border-slate-200">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <span className="text-teal-700 font-bold text-xs uppercase tracking-widest">Synergy CareLink Report</span>
                <h3 className="text-xl font-display font-bold text-[#0b2240] mt-1">Support at Home Budget Breakdown</h3>
                <p className="text-xs text-slate-500">Official estimate for care coordinators & family advocates.</p>
              </div>
              <button 
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Funding Classification</p>
                  <p className="font-bold text-slate-900 text-sm">{CLASSIFICATION_TIERS.find(t => t.id === selectedTierId)?.name || 'Custom Package'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Annual Target Funding</p>
                  <p className="font-bold text-teal-700 text-sm">{formatMoney(calculations.annualBudget)} / year</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-800">
                    <tr>
                      <th className="p-3">Service Category</th>
                      <th className="p-3 text-center">Weekly Hours/Days</th>
                      <th className="p-3 text-right">Weekly Cost</th>
                      <th className="p-3 text-right">Annual Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-medium text-slate-900">Clinical Care & Nursing</td>
                      <td className="p-3 text-center">{clinicalHours} hrs/wk</td>
                      <td className="p-3 text-right">{formatMoney(calculations.weeklyClinicalCost)}</td>
                      <td className="p-3 text-right">{formatMoney(calculations.weeklyClinicalCost * 52)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-900">Personal Care & Hygiene</td>
                      <td className="p-3 text-center">{personalCareHours} hrs/wk</td>
                      <td className="p-3 text-right">{formatMoney(calculations.weeklyPersonalCost)}</td>
                      <td className="p-3 text-right">{formatMoney(calculations.weeklyPersonalCost * 52)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-900">Domestic Support & Meals</td>
                      <td className="p-3 text-center">{domesticHours} hrs/wk</td>
                      <td className="p-3 text-right">{formatMoney(calculations.weeklyDomesticCost)}</td>
                      <td className="p-3 text-right">{formatMoney(calculations.weeklyDomesticCost * 52)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-900">Social Outings & Transport</td>
                      <td className="p-3 text-center">{socialHours} hrs/wk</td>
                      <td className="p-3 text-right">{formatMoney(calculations.weeklySocialCost)}</td>
                      <td className="p-3 text-right">{formatMoney(calculations.weeklySocialCost * 52)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-900">In-Home Respite Care</td>
                      <td className="p-3 text-center">{respiteDaysPerMonth} days/mo</td>
                      <td className="p-3 text-right">{formatMoney(calculations.weeklyRespiteCost)}</td>
                      <td className="p-3 text-right">{formatMoney(calculations.weeklyRespiteCost * 52)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-900">Synergy Care Management ({careManagementPct}%)</td>
                      <td className="p-3 text-center">-</td>
                      <td className="p-3 text-right">{formatMoney(calculations.weeklyCareMgmtCost)}</td>
                      <td className="p-3 text-right">{formatMoney(calculations.weeklyCareMgmtCost * 52)}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td className="p-3 text-slate-900">Total Projected Budget</td>
                      <td className="p-3 text-center">-</td>
                      <td className="p-3 text-right text-teal-700">{formatMoney(calculations.totalWeeklyCost)}</td>
                      <td className="p-3 text-right text-teal-700">{formatMoney(calculations.totalAnnualCost)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <p className="text-[11px] text-slate-500 italic bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
                Disclaimer: Prices are based on standard NDIS and Support at Home benchmark rates. Final agreements are customized to individual care plans upon intake review.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="bg-slate-900 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              >
                <Printer size={14} />
                Print PDF Report
              </button>
              <button
                onClick={() => {
                  setShowPrintModal(false);
                  handleApplyToReferral();
                }}
                className="bg-amber-500 text-[#0b2240] font-bold px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors cursor-pointer text-xs"
              >
                Proceed to Intake Referral
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
