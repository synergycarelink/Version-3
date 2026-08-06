import React, { useState, useEffect } from 'react';
import { ReferralSubmission } from '../types';
import { SERVICES_DATA } from '../data/services';
import { 
  FileText, 
  Send, 
  Lock, 
  Search, 
  Trash2, 
  CheckSquare, 
  UserPlus, 
  ChevronRight, 
  Clock, 
  Database,
  ArrowRight,
  Eye,
  Settings,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Plus,
  Mail,
  AlertCircle
} from 'lucide-react';

interface ReferralPortalProps {
  preFilledServices: string[];
  preFilledNotes: string;
  onClearPreFill: () => void;
  showDashboardInitially: boolean;
}

export default function ReferralPortal({ 
  preFilledServices, 
  preFilledNotes, 
  onClearPreFill,
  showDashboardInitially
}: ReferralPortalProps) {
  // Navigation inside portal: 'form' | 'login' | 'dashboard'
  const [activeTab, setActiveTab] = useState<'form' | 'login' | 'dashboard'>('form');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (showDashboardInitially) {
      if (isAuthenticated) {
        setActiveTab('dashboard');
      } else {
        setActiveTab('login');
      }
    }
  }, [showDashboardInitially, isAuthenticated]);

  // Ensure that if they try to access the dashboard without authentication, they are forced to login
  useEffect(() => {
    if (activeTab === 'dashboard' && !isAuthenticated) {
      setActiveTab('login');
    }
  }, [activeTab, isAuthenticated]);

  // Form State
  const [referrerName, setReferrerName] = useState('');
  const [referrerEmail, setReferrerEmail] = useState('');
  const [referrerPhone, setReferrerPhone] = useState('');
  const [relationship, setRelationship] = useState<ReferralSubmission['relationship']>('self');
  const [referralType, setReferralType] = useState<'ndis' | 'support_at_home' | 'both'>('ndis');
  const [participantName, setParticipantName] = useState('');
  const [participantAge, setParticipantAge] = useState<number | ''>(25);
  const [participantGender, setParticipantGender] = useState('Prefer not to say');
  const [ndisNumber, setNdisNumber] = useState('');
  const [supportAtHomeNumber, setSupportAtHomeNumber] = useState('');
  const [primaryDisability, setPrimaryDisability] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [preferredContact, setPreferredContact] = useState<ReferralSubmission['preferredContact']>('any');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Submit Feedback
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync Prefill values
  useEffect(() => {
    if (preFilledServices.length > 0) {
      setSelectedServices(preFilledServices);
      // Auto switch referral type if prefill contains Support at Home services
      const hasSupportAtHome = preFilledServices.some(s => s.startsWith('sah-'));
      const hasNDIS = preFilledServices.some(s => !s.startsWith('sah-'));
      if (hasSupportAtHome && hasNDIS) {
        setReferralType('both');
      } else if (hasSupportAtHome) {
        setReferralType('support_at_home');
      }
    }
    if (preFilledNotes) {
      setAdditionalInfo(prev => prev ? `${prev}\n\n${preFilledNotes}` : preFilledNotes);
    }
  }, [preFilledServices, preFilledNotes]);

  // Submissions State
  const [submissions, setSubmissions] = useState<ReferralSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDetailSubmission, setSelectedDetailSubmission] = useState<ReferralSubmission | null>(null);

  // Email & SMTP Diagnostics State
  const [smtpStatus, setSmtpStatus] = useState<{ configured: boolean; targetEmail: string } | null>(null);
  const [submissionEmailResult, setSubmissionEmailResult] = useState<{
    method?: 'smtp' | 'mock' | 'smtp_error';
    message?: string;
    warning?: string;
  } | null>(null);

  // Dashboard Login Password
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // LocalStorage & Server Database loading
  useEffect(() => {
    // Check SMTP Readiness
    fetch('/api/smtp-status')
      .then(r => r.json())
      .then(data => setSmtpStatus(data))
      .catch(err => console.warn('SMTP status check failed:', err));

    // Fetch stored referrals from server
    fetch('/api/referrals')
      .then(r => r.json())
      .then(serverData => {
        if (Array.isArray(serverData) && serverData.length > 0) {
          setSubmissions(prev => {
            const map = new Map();
            serverData.forEach((item: any) => map.set(item.id, item));
            prev.forEach((item: any) => map.set(item.id, item));
            const merged = Array.from(map.values());
            localStorage.setItem('synergy_referrals', JSON.stringify(merged));
            return merged;
          });
        } else {
          const stored = localStorage.getItem('synergy_referrals');
          if (stored) {
            setSubmissions(JSON.parse(stored));
          } else {
            const mockData: ReferralSubmission[] = [
              {
                id: 'ref-1',
                referrerName: 'Sarah Jenkins',
                referrerEmail: 's.jenkins@westernhealth.org.au',
                referrerPhone: '0412 345 678',
                relationship: 'health_professional',
                referralType: 'ndis',
                participantName: 'James Henderson',
                participantAge: 29,
                participantGender: 'Male',
                ndisNumber: '430985214',
                primaryDisability: 'Autism Spectrum Disorder & Intellectual Disability',
                requestedServices: ['sil', 'community-hubs'],
                preferredContact: 'phone',
                additionalInfo: 'James is looking for an active shared house (SIL) near Parramatta with peers around his age. He is very social and loves music.',
                submittedAt: new Date(Date.now() - 86400000 * 2).toLocaleString(),
                status: 'reviewed'
              },
              {
                id: 'ref-2',
                referrerName: 'Robert Dow',
                referrerEmail: 'robert.dow@gmail.com',
                referrerPhone: '0499 888 777',
                relationship: 'self',
                referralType: 'support_at_home',
                participantName: 'Margaret Dow',
                participantAge: 76,
                participantGender: 'Female',
                supportAtHomeNumber: 'SAH-8822A',
                primaryDisability: 'Mobility impairment & post-stroke recovery',
                requestedServices: ['sah-domestic', 'sah-personal', 'sah-nursing'],
                preferredContact: 'email',
                additionalInfo: 'My mother needs 3 visits per week for showering, domestic assistance, and weekly registered nurse checkups.',
                submittedAt: new Date(Date.now() - 3600000 * 5).toLocaleString(),
                status: 'pending'
              }
            ];
            localStorage.setItem('synergy_referrals', JSON.stringify(mockData));
            setSubmissions(mockData);
          }
        }
      })
      .catch(() => {
        const stored = localStorage.getItem('synergy_referrals');
        if (stored) setSubmissions(JSON.parse(stored));
      });
  }, []);

  const saveToStorage = (updatedList: ReferralSubmission[]) => {
    localStorage.setItem('synergy_referrals', JSON.stringify(updatedList));
    setSubmissions(updatedList);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referrerName || !referrerEmail || !participantName || !primaryDisability) {
      alert("Please enter all required fields.");
      return;
    }

    setIsSubmitting(true);

    const newSubmission: ReferralSubmission = {
      id: `ref-${Date.now()}`,
      referrerName,
      referrerEmail,
      referrerPhone,
      relationship,
      referralType,
      participantName,
      participantAge: participantAge === '' ? 0 : Number(participantAge),
      participantGender,
      ndisNumber: ndisNumber || undefined,
      supportAtHomeNumber: supportAtHomeNumber || undefined,
      primaryDisability,
      requestedServices: selectedServices,
      preferredContact,
      additionalInfo: additionalInfo || undefined,
      submittedAt: new Date().toLocaleString(),
      status: 'pending'
    };

    try {
      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubmission),
      });
      
      if (emailRes.ok) {
        const resData = await emailRes.json();
        setSubmissionEmailResult(resData);
      } else {
        const errData = await emailRes.json().catch(() => ({}));
        setSubmissionEmailResult({
          method: 'smtp_error',
          warning: errData.error || 'Server returned an error when processing the email dispatch.'
        });
      }
    } catch (err) {
      console.error("Error calling send-email endpoint:", err);
      setSubmissionEmailResult({
        method: 'smtp_error',
        warning: 'Network connection issue contacting email server.'
      });
    } finally {
      const updated = [newSubmission, ...submissions];
      saveToStorage(updated);
      setIsSubmitted(true);
      setIsSubmitting(false);
      onClearPreFill();
    }
  };

  const handleServiceCheckbox = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'synergy2026') {
      setIsAuthenticated(true);
      setActiveTab('dashboard');
      setLoginError('');
    } else {
      setLoginError('Invalid Provider password. Try "synergy2026"');
    }
  };

  const updateStatus = (id: string, newStatus: ReferralSubmission['status']) => {
    const updated = submissions.map(sub => 
      sub.id === id ? { ...sub, status: newStatus } : sub
    );
    saveToStorage(updated);
    if (selectedDetailSubmission && selectedDetailSubmission.id === id) {
      setSelectedDetailSubmission(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const deleteSubmission = (id: string) => {
    if (window.confirm("Are you sure you want to delete this referral record?")) {
      const updated = submissions.filter(sub => sub.id !== id);
      saveToStorage(updated);
      setSelectedDetailSubmission(null);
    }
  };

  const addDemoReferral = () => {
    const names = ['Lachlan Smith', 'Emily Watson', 'Arthur Pendelton', 'Chloe Evans'];
    const disabilities = ['Cerebral Palsy', 'Down Syndrome', 'Age-related frailty & Parkinson\'s', 'Psychosocial Disability'];
    const services = [['community-hubs'], ['support-coordination', 'rec-social'], ['sah-personal', 'sah-domestic', 'sah-nursing'], ['in-home-care']];
    const types: ('ndis' | 'support_at_home' | 'both')[] = ['ndis', 'ndis', 'support_at_home', 'both'];
    
    const index = Math.floor(Math.random() * names.length);
    const mockRef: ReferralSubmission = {
      id: `ref-demo-${Date.now()}`,
      referrerName: `Coordinator ${names[index].split(' ')[0]}`,
      referrerEmail: `coord.${names[index].split(' ')[0].toLowerCase()}@care.org.au`,
      referrerPhone: '0400 111 222',
      relationship: 'coordinator',
      referralType: types[index],
      participantName: names[index],
      participantAge: types[index] === 'support_at_home' ? 78 : Math.floor(Math.random() * 40) + 18,
      participantGender: Math.random() > 0.5 ? 'Male' : 'Female',
      ndisNumber: types[index] !== 'support_at_home' ? Math.floor(100000000 + Math.random() * 900000000).toString() : undefined,
      supportAtHomeNumber: types[index] !== 'ndis' ? `SAH-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
      primaryDisability: disabilities[index],
      requestedServices: services[index],
      preferredContact: 'email',
      additionalInfo: 'Demonstration record added to illustrate system database operations.',
      submittedAt: new Date().toLocaleString(),
      status: 'pending'
    };

    const updated = [mockRef, ...submissions];
    saveToStorage(updated);
  };

  const handleResetForm = () => {
    setReferrerName('');
    setReferrerEmail('');
    setReferrerPhone('');
    setRelationship('self');
    setReferralType('ndis');
    setParticipantName('');
    setParticipantAge(25);
    setParticipantGender('Prefer not to say');
    setNdisNumber('');
    setSupportAtHomeNumber('');
    setPrimaryDisability('');
    setSelectedServices([]);
    setPreferredContact('any');
    setAdditionalInfo('');
    setIsSubmitted(false);
  };

  // Filter & Search computation
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.primaryDisability.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || sub.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      
      {/* Portal Tabs Header */}
      <div className="bg-[#0b2240] px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <FileText className="text-amber-400 shrink-0" size={22} />
          <div>
            <h3 className="text-white font-display font-bold text-lg tracking-tight">Synergy Client Referral Portal</h3>
            <p className="text-xs text-slate-300">Submit referrals for NDIS, Support at Home, or combined care packages.</p>
          </div>
        </div>
        
        {/* Navigation toggles */}
        <div className="flex bg-slate-950/40 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'form' 
                ? 'bg-teal-700 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Client Intake Form
          </button>
          <button
            onClick={() => {
              if (isAuthenticated) {
                setActiveTab('dashboard');
              } else {
                setActiveTab('login');
              }
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'login' || activeTab === 'dashboard'
                ? 'bg-amber-500 text-[#0b2240]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Staff Dashboard
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        
        {/* TAB 1: Intake Form */}
        {activeTab === 'form' && (
          <div>
            {!isSubmitted ? (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Referrer Details Grid */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-1.5">
                    <UserPlus size={14} /> 1. Contact Person (Your Details)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={referrerName}
                        onChange={(e) => setReferrerName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={referrerEmail}
                        onChange={(e) => setReferrerEmail(e.target.value)}
                        placeholder="e.g. sarah@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contact Number</label>
                      <input
                        type="tel"
                        value={referrerPhone}
                        onChange={(e) => setReferrerPhone(e.target.value)}
                        placeholder="e.g. 0400 000 000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">What is your relationship to the participant? *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {[
                        { id: 'self', label: 'Self (Applicant)' },
                        { id: 'family', label: 'Family / Carer' },
                        { id: 'coordinator', label: 'Support Coordinator' },
                        { id: 'health_professional', label: 'Local GP / Doctor' },
                        { id: 'other', label: 'Other advocate' }
                      ].map((rel) => (
                        <button
                          key={rel.id}
                          type="button"
                          onClick={() => setRelationship(rel.id as any)}
                          className={`p-2 rounded-lg text-center text-[11px] font-semibold border transition-all cursor-pointer ${
                            relationship === rel.id
                              ? 'border-teal-700 bg-teal-50 text-teal-800'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {rel.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Participant Details & Referral Program Section */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-1.5">
                    <ShieldCheck size={14} /> 2. Participant Details & Care Program
                  </h4>

                  {/* Referral Program Selector (NDIS / Support at Home / Both) */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                    <label className="block text-xs font-bold text-[#0b2240] uppercase tracking-wide">
                      Select Referral Type / Care Program *
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Choose whether you are submitting an NDIS referral, a Support at Home referral, or a combined care package.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { 
                          id: 'ndis', 
                          title: 'NDIS Referral', 
                          desc: 'Disability support for eligible NDIS participants' 
                        },
                        { 
                          id: 'support_at_home', 
                          title: 'Support at Home Referral', 
                          desc: 'Aged care and in-home support for seniors' 
                        },
                        { 
                          id: 'both', 
                          title: 'Both NDIS & Support at Home', 
                          desc: 'Combined or dual care support package' 
                        }
                      ].map((type) => (
                        <div
                          key={type.id}
                          onClick={() => setReferralType(type.id as any)}
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            referralType === type.id
                              ? 'border-teal-700 bg-teal-50/70 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0b2240]">{type.title}</span>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              referralType === type.id ? 'border-teal-700 bg-teal-700' : 'border-slate-300'
                            }`}>
                              {referralType === type.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{type.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Participant Name *</label>
                      <input
                        type="text"
                        required
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                        placeholder="e.g. James Henderson"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Age</label>
                      <input
                        type="number"
                        min="0"
                        max="110"
                        value={participantAge}
                        onChange={(e) => {
                          const val = e.target.value;
                          setParticipantAge(val === '' ? '' : Math.max(0, parseInt(val) || 0));
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Gender</label>
                      <select
                        value={participantGender}
                        onChange={(e) => setParticipantGender(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Primary Disability / Health Condition *</label>
                      <input
                        type="text"
                        required
                        value={primaryDisability}
                        onChange={(e) => setPrimaryDisability(e.target.value)}
                        placeholder="e.g. Autism, Stroke recovery, Frailty"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">NDIS Number (Optional)</label>
                      <input
                        type="text"
                        value={ndisNumber}
                        onChange={(e) => setNdisNumber(e.target.value)}
                        placeholder="e.g. 430985214"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Support at Home / Aged Care Ref ID (Optional)</label>
                      <input
                        type="text"
                        value={supportAtHomeNumber}
                        onChange={(e) => setSupportAtHomeNumber(e.target.value)}
                        placeholder="e.g. AC-998822"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Preferred Contact Method</label>
                    <div className="grid grid-cols-3 gap-2 max-w-md">
                      {[
                        { id: 'phone', label: 'Phone Call' },
                        { id: 'email', label: 'Email' },
                        { id: 'any', label: 'Any Option' }
                      ].map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setPreferredContact(c.id as any)}
                          className={`p-2 rounded-lg text-center text-[11px] font-semibold border transition-all cursor-pointer ${
                            preferredContact === c.id
                              ? 'border-teal-700 bg-teal-50 text-teal-800'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Services Requested Selection Checkboxes */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-1 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                      3. Select Services Needed (NDIS & Support at Home)
                    </h4>
                    <span className="text-[11px] text-slate-500 italic">
                      You can submit referrals for both NDIS and Support at Home services together.
                    </span>
                  </div>
                  
                  {/* NDIS Services Section */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-[#0b2240] uppercase tracking-wider flex items-center gap-1.5 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100 w-fit">
                      <CheckSquare size={13} className="text-teal-700" /> NDIS Services
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {SERVICES_DATA.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => handleServiceCheckbox(service.id)}
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                            selectedServices.includes(service.id)
                              ? 'border-teal-600 bg-teal-50/30 shadow-xs'
                              : 'border-slate-150 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => {}} // Handled by div click
                            className="mt-0.5 accent-teal-700 cursor-pointer"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#0b2240]">{service.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{service.shortDescription}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Support at Home Services Section */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 w-fit">
                      <CheckSquare size={13} className="text-amber-600" /> Support at Home Services
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'sah-domestic', title: 'Domestic Assistance', desc: 'Housekeeping, cleaning, laundry & meal prep.' },
                        { id: 'sah-personal', title: 'Personal Care & Hygiene', desc: 'Showering, dressing, grooming & mobility.' },
                        { id: 'sah-nursing', title: 'Clinical & Nursing Care', desc: 'RN nursing visits, wound management & care.' },
                        { id: 'sah-gardening', title: 'Home Maintenance & Repair', desc: 'Safety modifications, gardening & home repairs.' },
                        { id: 'sah-allied', title: 'Allied Health & Therapy', desc: 'Physiotherapy, OT, podiatry & speech therapy.' },
                        { id: 'sah-transport', title: 'Transport & Outings', desc: 'Travel to doctor appointments, shopping & socials.' },
                        { id: 'sah-management', title: 'Care Management', desc: 'Package coordination, care reviews & partner matching.' }
                      ].map((service) => (
                        <div
                          key={service.id}
                          onClick={() => handleServiceCheckbox(service.id)}
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                            selectedServices.includes(service.id)
                              ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                              : 'border-slate-150 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => {}} // Handled by div click
                            className="mt-0.5 accent-amber-600 cursor-pointer"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#0b2240]">{service.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{service.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Comments/Care Goals */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                    4. Support Goals, Specific Details & Special Instructions
                  </label>
                  <textarea
                    rows={4}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Provide details about care times, housing goals, assistive equipment used, or prefilled NDIS / Support at Home summaries..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                  ></textarea>
                </div>

                {/* Submit Panel */}
                <div className="pt-4 flex items-center justify-between gap-4 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400 max-w-md leading-relaxed">
                    By submitting, you consent to Synergy Care Link contacting you regarding this client intake. We process all personal medical data in alignment with Australian privacy guidelines.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-teal-700 hover:bg-amber-500 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-300 border-t-white"></span>
                        Submitting Intake...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Submit Client Intake
                      </>
                    )}
                  </button>
                </div>

              </form>
            ) : (
              <div className="text-center py-10 px-4 space-y-5 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle size={40} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-slate-800">
                    Referral Intake Logged Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
                    Thank you for contacting Synergy Care Link. Your client intake details for <strong className="text-teal-800 font-bold">{participantName}</strong> have been recorded in our intake database.
                  </p>
                </div>

                {/* Email Alert Status Card */}
                <div className="max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail size={15} className="text-teal-600" />
                      Email Alert Target: admin@synergycarelink.com
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                      submissionEmailResult?.method === 'smtp'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {submissionEmailResult?.method === 'smtp' ? '✅ Delivered' : '⚠️ Action Required'}
                    </span>
                  </div>

                  {submissionEmailResult?.method === 'smtp' ? (
                    <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-start gap-2">
                      <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>An automated email notification was dispatched directly to <strong>admin@synergycarelink.com</strong> via SMTP!</span>
                    </div>
                  ) : (
                    <div className="text-xs space-y-2 bg-amber-50/80 border border-amber-200 p-3 rounded-xl">
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {submissionEmailResult?.warning || "Intake saved to server database. Live SMTP credentials are not yet configured in AI Studio."}
                      </p>
                      <div className="pt-2 border-t border-amber-200 text-[11px] text-amber-900 leading-normal">
                        <strong>📌 Why wasn't the live email received?</strong><br />
                        Outbound SMTP email servers require authentication. To route emails directly into your inbox at <strong className="text-teal-800">admin@synergycarelink.com</strong>, configure <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono font-bold">SMTP_USER</code> and <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono font-bold">SMTP_PASS</code> in your project's <strong>Settings / Environment Variables</strong>.
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-6 py-3 rounded-lg border border-slate-300 transition-colors cursor-pointer"
                  >
                    Submit Another Intake
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="bg-teal-700 hover:bg-amber-500 text-white font-bold text-xs px-6 py-3 rounded-lg shadow transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    Staff Login <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Dashboard Password Login Screen */}
        {activeTab === 'login' && (
          <div className="max-w-md mx-auto py-12 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <Lock size={22} />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Secure Staff & Provider Access</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Referral records contain confidential health data. Please login to Synergy Care Link Database Manager.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Provider Access Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter staff password..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-500 font-semibold leading-none">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#0b2240] hover:bg-amber-500 hover:text-[#0b2240] text-white font-bold text-xs py-3 rounded-lg transition-all cursor-pointer"
              >
                Unlock Database Dashboard
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Provider Intake Management Database Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Stat row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Database className="text-teal-700" size={20} />
                <div>
                  <h4 className="text-lg font-bold text-slate-800">Synergy Intake Manager</h4>
                  <p className="text-xs text-slate-500">Live localStorage database of NDIS Care Enquiries & Referrals.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={addDemoReferral}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus size={14} /> Create Mock Referral
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthenticated(false);
                    setPassword('');
                    setActiveTab('form');
                  }}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer ml-auto"
                >
                  Lock & Logout
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by participant name, referrer, or disability..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              {/* Filter */}
              <div className="w-full sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">⏳ Pending Intake</option>
                  <option value="reviewed">🔎 Plan Reviewed</option>
                  <option value="contacted">📞 Contacted Client</option>
                  <option value="approved">✅ Service Agreement Active</option>
                </select>
              </div>
            </div>

            {/* Referrals list */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="p-3">Program Type</th>
                    <th className="p-3">Participant & Age</th>
                    <th className="p-3">Referrer Details</th>
                    <th className="p-3">Disability / Diagnosis</th>
                    <th className="p-3">Services Matching</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                            sub.referralType === 'support_at_home'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : sub.referralType === 'both'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : 'bg-teal-100 text-teal-800 border-teal-200'
                          }`}>
                            {sub.referralType === 'support_at_home' 
                              ? 'Support at Home' 
                              : sub.referralType === 'both' 
                              ? 'NDIS & Support at Home' 
                              : 'NDIS'}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-800">{sub.participantName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{sub.participantAge} yrs • {sub.participantGender}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-700">{sub.referrerName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{sub.referrerEmail} • {sub.referrerPhone || 'No Phone'}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-slate-600 font-medium truncate max-w-[150px]">{sub.primaryDisability}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Submitted: {sub.submittedAt.split(',')[0]}</p>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {sub.requestedServices.map((sid) => (
                              <span key={sid} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                sid.startsWith('sah-')
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-teal-50 text-teal-800 border-teal-100'
                              }`}>
                                {sid.toUpperCase()}
                              </span>
                            ))}
                            {sub.requestedServices.length === 0 && (
                              <span className="text-[10px] text-slate-400 italic">General Enquiry</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <select
                            value={sub.status}
                            onChange={(e) => updateStatus(sub.id, e.target.value as any)}
                            className={`p-1 rounded text-[11px] font-bold border ${
                              sub.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : sub.status === 'contacted'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : sub.status === 'reviewed'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="contacted">Contacted</option>
                            <option value="approved">Approved</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedDetailSubmission(sub)}
                              className="p-1.5 text-slate-400 hover:text-teal-700 rounded-md hover:bg-slate-100 cursor-pointer"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSubmission(sub.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 cursor-pointer"
                              title="Delete Intake"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No intake inquiries found matching current filters. Try adding a mock demo record!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Selected Detail Modal / Drawer Card */}
            {selectedDetailSubmission && (
              <div className="bg-slate-50 border-2 border-teal-600 rounded-2xl p-6 animate-fade-in space-y-4">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] bg-teal-600 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      ID: {selectedDetailSubmission.id}
                    </span>
                    <h5 className="text-base font-bold text-[#0b2240] mt-1">
                      Referral Record Detail: {selectedDetailSubmission.participantName}
                    </h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDetailSubmission(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                  >
                    Close Detail Panel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1">Client Profile & Program</p>
                    <p><strong className="text-slate-500">Program Stream:</strong> <span className="uppercase font-bold text-teal-800">{selectedDetailSubmission.referralType?.replace('_', ' ') || 'NDIS'}</span></p>
                    <p><strong className="text-slate-500">Full Name:</strong> {selectedDetailSubmission.participantName}</p>
                    <p><strong className="text-slate-500">Age / Gender:</strong> {selectedDetailSubmission.participantAge} years old • {selectedDetailSubmission.participantGender}</p>
                    <p><strong className="text-slate-500">NDIS Code:</strong> {selectedDetailSubmission.ndisNumber || 'Not specified'}</p>
                    <p><strong className="text-slate-500">Support at Home ID:</strong> {selectedDetailSubmission.supportAtHomeNumber || 'Not specified'}</p>
                    <p><strong className="text-slate-500">Primary Disability / Diagnosis:</strong> {selectedDetailSubmission.primaryDisability}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1">Referrer Contact</p>
                    <p><strong className="text-slate-500">Referrer Name:</strong> {selectedDetailSubmission.referrerName}</p>
                    <p><strong className="text-slate-500">Relationship:</strong> <span className="capitalize">{selectedDetailSubmission.relationship.replace('_', ' ')}</span></p>
                    <p><strong className="text-slate-500">Contact:</strong> {selectedDetailSubmission.referrerPhone || 'No Phone'} • {selectedDetailSubmission.referrerEmail}</p>
                    <p><strong className="text-slate-500">Preferred Contact:</strong> <span className="capitalize">{selectedDetailSubmission.preferredContact}</span></p>
                  </div>
                </div>

                {selectedDetailSubmission.additionalInfo && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Additional Care Notes & Goals:</p>
                    <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">
                      {selectedDetailSubmission.additionalInfo}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(selectedDetailSubmission.id, 'contacted')}
                      className="bg-[#0b2240] hover:bg-teal-700 text-white font-bold text-[11px] px-3.5 py-1.5 rounded transition-colors"
                    >
                      Mark Contacted
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(selectedDetailSubmission.id, 'approved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3.5 py-1.5 rounded transition-colors"
                    >
                      Approve Admission
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteSubmission(selectedDetailSubmission.id)}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Delete Record
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
