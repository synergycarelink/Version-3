import { useState } from 'react';
import { SERVICES_DATA } from '../data/services';
import { NDISService } from '../types';
import { Search, Compass, ArrowRight, Check, CheckCircle2, UserCheck, HelpCircle } from 'lucide-react';

interface ServiceFinderProps {
  onPreFillReferral: (services: string[], notes: string) => void;
  onNavigate: (sectionId: string) => void;
}

export default function ServiceFinder({ onPreFillReferral, onNavigate }: ServiceFinderProps) {
  const [whoNeedsSupport, setWhoNeedsSupport] = useState<string>('');
  const [primaryGoal, setPrimaryGoal] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [fundingType, setFundingType] = useState<string>('');
  
  const [matchedService, setMatchedService] = useState<NDISService | null>(null);
  const [matchingReason, setMatchingReason] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!whoNeedsSupport || !primaryGoal || !region) {
      alert("Please fill in all options to find your matches.");
      return;
    }

    // Determine matched service based on primary goal
    let matchedId = 'in-home-care';
    let explanation = '';

    if (primaryGoal === 'independent-living') {
      matchedId = 'sil';
      explanation = `Based on your goal to live independently, Supported Independent Living (SIL) at Synergy Care Link is your top recommendation. We provide comfortable homes in the ${region} region with 24/7 dedicated support staff to assist with your physical and personal goals.`;
    } else if (primaryGoal === 'social-skills') {
      matchedId = 'community-hubs';
      explanation = `Since you're seeking to build skills and make friendships, our Community Access & Day Hubs are a perfect fit. We offer highly interactive day programs, cooking workshops, and community access outings with other participants around your age group.`;
    } else if (primaryGoal === 'home-support') {
      matchedId = 'in-home-care';
      explanation = `Since you want to maintain your current lifestyle in your own private home, our In-Home Care support matches you with dedicated workers in ${region} for personal care, cooking, cleaning, and social outings.`;
    } else if (primaryGoal === 'navigation') {
      matchedId = 'support-coordination';
      explanation = `Navigating NDIS is much easier with dedicated support. Our Support Coordination service is highly recommended for you to fully activate your budget, coordinate therapeutic services, and set up agreements.`;
    } else if (primaryGoal === 'recreation') {
      matchedId = 'rec-social';
      explanation = `For fun, friendship, and weekend adventures, our Social & Recreational Programs offer the best escape. We organize outings, retreats, and sports meetups suited for your active interests.`;
    }

    const foundService = SERVICES_DATA.find(s => s.id === matchedId) || SERVICES_DATA[3];
    setMatchedService(foundService);
    setMatchingReason(explanation);
    setHasSearched(true);
  };

  const handleApplyToReferral = () => {
    if (!matchedService) return;
    const notesText = `Automatically matched via Care Finder Tool.\n- Participant support seeker: ${whoNeedsSupport}\n- Goal: ${primaryGoal}\n- Region requested: ${region}\n- NDIS funding management: ${fundingType}`;
    onPreFillReferral([matchedService.id], notesText);
    onNavigate('referrals');
  };

  const handleReset = () => {
    setWhoNeedsSupport('');
    setPrimaryGoal('');
    setRegion('');
    setFundingType('');
    setMatchedService(null);
    setHasSearched(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-teal-200">
            Smart Care Assistant
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0b2240] mt-2 tracking-tight">
            Interactive Service Finder
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Answer 4 simple questions to find the best Synergy Care Link service match for your NDIS goals.
          </p>
        </div>

        {!hasSearched ? (
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <UserCheck size={16} className="text-teal-600" />
                1. Who is looking for support today?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'myself', label: 'Myself (Participant)' },
                  { id: 'child', label: 'My Child' },
                  { id: 'family', label: 'My Family Member or Friend' },
                  { id: 'coordinator', label: 'An NDIS Participant (I am a Coordinator/GP)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWhoNeedsSupport(opt.id)}
                    className={`p-3 text-left rounded-xl text-xs font-medium border transition-all ${
                      whoNeedsSupport === opt.id
                        ? 'border-teal-600 bg-teal-50/50 text-teal-800 font-semibold ring-2 ring-teal-600/10'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Compass size={16} className="text-teal-600" />
                2. What is the primary support goal?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'independent-living', label: 'Living independently in a safe, shared home' },
                  { id: 'social-skills', label: 'Learning new skills and making friends at a hub' },
                  { id: 'home-support', label: 'Getting general help inside my current home' },
                  { id: 'navigation', label: 'Understanding my plan and coordinating clinical staff' },
                  { id: 'recreation', label: 'Fun weekend social clubs, travel, and adventure activities' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPrimaryGoal(opt.id)}
                    className={`p-3 text-left rounded-xl text-xs font-medium border transition-all ${
                      primaryGoal === opt.id
                        ? 'border-teal-600 bg-teal-50/50 text-teal-800 font-semibold ring-2 ring-teal-600/10'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid for Q3 and Q4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Question 3 */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  3. Where is support required?
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                >
                  <option value="">Select your region...</option>
                  <option value="Western Sydney / Parramatta">Western Sydney (Parramatta, Blacktown, Penrith)</option>
                  <option value="Sydney Inner Metro">Sydney Metro & CBD</option>
                  <option value="South Western Sydney">South Western Sydney (Liverpool, Campbelltown)</option>
                  <option value="Northern Sydney & Hills">Northern Sydney & Hills District</option>
                  <option value="Regional NSW">Regional / Hunter / Illawarra</option>
                </select>
              </div>

              {/* Question 4 */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  4. NDIS Funding Management Style
                </label>
                <select
                  value={fundingType}
                  onChange={(e) => setFundingType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                >
                  <option value="">Select funding type...</option>
                  <option value="plan-managed">Plan Managed (Most popular)</option>
                  <option value="agency-managed">NDIS Agency Managed (NDIA)</option>
                  <option value="self-managed">Self Managed</option>
                  <option value="not-sure">I don't have NDIS yet / Need help applying</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex items-center gap-2 bg-teal-700 hover:bg-amber-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Search size={16} />
                Find My Care Solution Match
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Support Match Generated!</h3>
                  <p className="text-xs text-slate-500">Based on your goals and preferences.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-teal-700 font-semibold underline cursor-pointer"
              >
                Reset & Search Again
              </button>
            </div>

            {matchedService && (
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <span className="inline-block bg-teal-50 text-teal-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-teal-200">
                    {matchedService.ndisCategory}
                  </span>
                  <h4 className="text-xl font-display font-bold text-[#0b2240]">
                    {matchedService.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {matchedService.fullDescription}
                  </p>
                  
                  {/* Service features */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-slate-800 mb-2">Key Service Benefits Included:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {matchedService.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <Check size={14} className="text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI / Matching Reason rationale */}
                <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-r-xl">
                  <p className="text-xs font-semibold text-teal-900 flex items-center gap-1">
                    <Compass size={14} /> Synergy Matching Reason:
                  </p>
                  <p className="text-xs text-teal-800 mt-1 leading-relaxed">
                    {matchingReason}
                  </p>
                </div>

                {/* Direct booking/referral prefill CTA */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleApplyToReferral}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-amber-500 text-white font-bold text-xs px-6 py-3 rounded-lg shadow transition-all cursor-pointer"
                  >
                    Use This Match & Pre-fill Referral Form
                    <ArrowRight size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('services');
                    }}
                    className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-6 py-3 rounded-lg border border-slate-300 transition-colors cursor-pointer"
                  >
                    View All 6 Services
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
