import { useState, useEffect } from 'react';
import { Calculator, HelpCircle, Check, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';

interface NDISCalculatorProps {
  onPreFillReferral: (services: string[], notes: string) => void;
  onNavigate: (sectionId: string) => void;
}

export default function NDISCalculator({ onPreFillReferral, onNavigate }: NDISCalculatorProps) {
  // Budget Inputs
  const [totalAnnualBudget, setTotalAnnualBudget] = useState<number | ''>(85000);
  
  // Weekly Hours inputs
  const [inHomeHours, setInHomeHours] = useState<number>(10); // Standard rate $67.50
  const [communityHours, setCommunityHours] = useState<number>(8); // Standard rate $38.20 (standard group/community participation weekday)
  const [coordinationHours, setCoordinationHours] = useState<number>(2); // Standard rate $104.90
  const [therapyHours, setTherapyHours] = useState<number>(1); // Standard rate $193.99

  // Pricing constants (NDIS Pricing Arrangements limits - NSW/national standard 2025/2026)
  const RATES = {
    inHome: 67.50,
    community: 38.20,
    coordination: 104.90,
    therapy: 193.99
  };

  const [weeklyCosts, setWeeklyCosts] = useState({
    inHome: 0,
    community: 0,
    coordination: 0,
    therapy: 0,
    total: 0
  });

  const [annualTotal, setAnnualTotal] = useState<number>(0);
  const [budgetPercentUsed, setBudgetPercentUsed] = useState<number>(0);

  useEffect(() => {
    const inHomeCost = inHomeHours * RATES.inHome;
    const communityCost = communityHours * RATES.community;
    const coordinationCost = coordinationHours * RATES.coordination;
    const therapyCost = therapyHours * RATES.therapy;
    const totalWeekly = inHomeCost + communityCost + coordinationCost + therapyCost;
    
    const calculatedAnnual = totalWeekly * 52; // 52 weeks
    
    setWeeklyCosts({
      inHome: inHomeCost,
      community: communityCost,
      coordination: coordinationCost,
      therapy: therapyCost,
      total: totalWeekly
    });

    setAnnualTotal(calculatedAnnual);
    const budgetLimit = Number(totalAnnualBudget) || 0;
    setBudgetPercentUsed(budgetLimit > 0 ? (calculatedAnnual / budgetLimit) * 100 : 0);
  }, [inHomeHours, communityHours, coordinationHours, therapyHours, totalAnnualBudget]);

  const handleApplyToReferral = () => {
    const selectedServices: string[] = [];
    if (inHomeHours > 0) selectedServices.push('in-home-care');
    if (communityHours > 0) selectedServices.push('community-hubs');
    if (coordinationHours > 0) selectedServices.push('support-coordination');
    if (therapyHours > 0) selectedServices.push('rec-social');

    const notesText = `Automatically loaded from NDIS Plan Budget Estimator:
- Simulated Annual NDIS Budget Limit: $${(Number(totalAnnualBudget) || 0).toLocaleString()}
- Simulated Weekly Care Schedule:
  * In-Home Support: ${inHomeHours} hrs/week ($${weeklyCosts.inHome.toFixed(2)}/wk)
  * Community & Social Hubs: ${communityHours} hrs/week ($${weeklyCosts.community.toFixed(2)}/wk)
  * Support Coordination: ${coordinationHours} hrs/week ($${weeklyCosts.coordination.toFixed(2)}/wk)
  * Therapy / Therapeutic Supports: ${therapyHours} hrs/week ($${weeklyCosts.therapy.toFixed(2)}/wk)
- Estimated Weekly Synergy Allocation: $${weeklyCosts.total.toFixed(2)}/week
- Total Projected Annual Care Cost: $${annualTotal.toFixed(2)}/year (${budgetPercentUsed.toFixed(1)}% of total plan)`;

    onPreFillReferral(selectedServices, notesText);
    onNavigate('referrals');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200">
            NDIS Budget Planning
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0b2240] mt-2 tracking-tight">
            Synergy NDIS Plan Estimator
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl mx-auto">
            Simulate your care hours and see your plan allocation in real-time. We use Australian NDIS price limit guidelines to ensure realistic planning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-1 border-b border-slate-100">
              1. Your NDIS Budget & Care Hours
            </h3>

            {/* Total Budget Input */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Your Total Annual NDIS Plan Budget ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">$</span>
                <input
                  type="number"
                  value={totalAnnualBudget}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTotalAnnualBudget(val === '' ? '' : Math.max(0, parseInt(val) || 0));
                  }}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 pl-7 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Tip: Enter your total Core + Capacity Building NDIS budget. The average Australian plan is approx. $85,000.
              </p>
            </div>

            {/* Care Hours Sliders */}
            <div className="space-y-4 pt-2">
              {/* In Home Hours */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    In-Home & Personal Support
                    <span className="text-[10px] text-slate-400 font-normal">(${RATES.inHome}/hr)</span>
                  </span>
                  <span className="font-bold text-teal-800">{inHomeHours} hours / wk</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={inHomeHours}
                  onChange={(e) => setInHomeHours(parseInt(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer h-1.5 bg-slate-150 rounded"
                />
              </div>

              {/* Community Access Hours */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    Community & Social Group Hubs
                    <span className="text-[10px] text-slate-400 font-normal">(${RATES.community}/hr)</span>
                  </span>
                  <span className="font-bold text-teal-800">{communityHours} hours / wk</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={communityHours}
                  onChange={(e) => setCommunityHours(parseInt(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer h-1.5 bg-slate-150 rounded"
                />
              </div>

              {/* Support Coordination */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    Support Coordination Support
                    <span className="text-[10px] text-slate-400 font-normal">(${RATES.coordination}/hr)</span>
                  </span>
                  <span className="font-bold text-teal-800">{coordinationHours} hours / wk</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={coordinationHours}
                  onChange={(e) => setCoordinationHours(parseInt(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer h-1.5 bg-slate-150 rounded"
                />
              </div>

              {/* Therapy & Allied Health */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    Therapeutic Services / Counselling
                    <span className="text-[10px] text-slate-400 font-normal">(${RATES.therapy}/hr)</span>
                  </span>
                  <span className="font-bold text-teal-800">{therapyHours} hours / wk</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={therapyHours}
                  onChange={(e) => setTherapyHours(parseInt(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer h-1.5 bg-slate-150 rounded"
                />
              </div>
            </div>
          </div>

          {/* Visualization Section */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-[#0b2240] uppercase tracking-wider pb-1 border-b border-slate-200 flex items-center gap-1">
                <Calculator size={14} /> 2. Estimation Summary
              </h3>

              {/* Weekly and Annual Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Weekly Cost</p>
                  <p className="text-xl font-bold text-[#0b2240] mt-0.5">${weeklyCosts.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Annual Projected</p>
                  <p className="text-xl font-bold text-teal-700 mt-0.5">${annualTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
              </div>

              {/* Budget Gauge */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Plan Budget Used</span>
                  <span className={budgetPercentUsed > 100 ? 'text-red-600 font-bold' : 'text-emerald-700'}>
                    {budgetPercentUsed.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      budgetPercentUsed > 100 
                        ? 'bg-red-500' 
                        : budgetPercentUsed > 85 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.min(100, budgetPercentUsed)}%` }}
                  ></div>
                </div>
                {budgetPercentUsed > 100 ? (
                  <p className="text-[11px] text-red-500 font-medium">
                    ⚠️ Your care hours exceed your plan budget! Try scaling down hours.
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <Check size={12} /> Care schedule fits comfortably within NDIS allocation.
                  </p>
                )}
              </div>

              {/* Services Share Visual */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-700 mb-2">Weekly Care Allocations:</p>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>🏠 Daily In-Home Support:</span>
                    <span className="font-semibold">${weeklyCosts.inHome.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🎨 Community Activities:</span>
                    <span className="font-semibold">${weeklyCosts.community.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🧭 Support Coordination:</span>
                    <span className="font-semibold">${weeklyCosts.coordination.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🩺 Therapy Sessions:</span>
                    <span className="font-semibold">${weeklyCosts.therapy.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 mt-6 space-y-3">
              <button
                type="button"
                onClick={handleApplyToReferral}
                disabled={weeklyCosts.total === 0}
                className="w-full inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-amber-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs py-3 rounded-lg shadow transition-all cursor-pointer"
              >
                <Sparkles size={13} />
                Send Care Plan to Referral Form
                <ArrowRight size={13} />
              </button>
              <p className="text-[10px] text-center text-slate-400">
                Calculations are approximations for planning. Synergy Care Link assists with final service configurations.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
