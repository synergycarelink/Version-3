import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Accessibility, 
  Eye, 
  Type, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { AccessibilitySettings } from '../types';

interface HeaderProps {
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export default function Header({ settings, setSettings, onNavigate, activeSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAccessPanel, setShowAccessPanel] = useState(false);

  const toggleContrast = () => {
    setSettings(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
  };

  const changeFontSize = (size: 'normal' | 'large' | 'extra-large') => {
    setSettings(prev => ({
      ...prev,
      fontSizeScale: size
    }));
  };

  const toggleTts = () => {
    setSettings(prev => {
      const updated = !prev.textToSpeech;
      if (updated) {
        // Speak a quick greeting
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Accessibility voice assist enabled. Hover over titles to hear them.");
          window.speechSynthesis.speak(utterance);
        }
      } else {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }
      return {
        ...prev,
        textToSpeech: updated
      };
    });
  };

  const navItems = [
    { label: 'Services', id: 'services' },
    { label: 'NDIS Plan Calculator', id: 'calculator' },
    { label: 'Submit Referral', id: 'referrals' },
    { label: 'About Us', id: 'about' },
    { label: 'Service Finder', id: 'finder' },
    { label: 'Provider Board', id: 'staff' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm transition-colors duration-200">
      {/* Top bar with quick contact */}
      <div className="bg-[#0b2240] text-white text-xs py-2 px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <a href="tel:1300363177" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Phone size={12} className="text-amber-400" />
            <span className="font-medium">1300 SYNERGY (1300 363 177)</span>
          </a>
          <a href="mailto:synergycarelink@gmail.com" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Mail size={12} className="text-amber-400" />
            <span>synergycarelink@gmail.com</span>
          </a>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-600/30 text-emerald-300 px-2 py-0.5 rounded font-medium border border-emerald-500/20">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            Registered NDIS Provider
          </span>
          <button 
            onClick={() => setShowAccessPanel(!showAccessPanel)}
            className="flex items-center gap-1 text-xs hover:text-amber-400 font-medium transition-colors bg-white/10 px-2.5 py-1 rounded border border-white/20"
            aria-label="Accessibility Options"
          >
            <Accessibility size={13} className="text-amber-400" />
            Accessibility Panel
          </button>
        </div>
      </div>

      {/* Accessibility Control Panel Drawdown */}
      {showAccessPanel && (
        <div className="bg-slate-100 border-b border-slate-200 py-3.5 px-4 sm:px-8 shadow-inner animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Accessibility size={16} className="text-[#0b2240]" />
                Synergy Accessibility Support Tool
              </h3>
              <p className="text-xs text-slate-500">We design for inclusion. Adjust the layout, colors, and voice assist to meet your comfort.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Contrast Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  <Eye size={14} /> High Contrast:
                </span>
                <button
                  onClick={toggleContrast}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    settings.highContrast 
                      ? 'bg-black text-amber-300 border-2 border-amber-300' 
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {settings.highContrast ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  <Type size={14} /> Font Size:
                </span>
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => changeFontSize('normal')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-l-md border ${
                      settings.fontSizeScale === 'normal'
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => changeFontSize('large')}
                    className={`px-2.5 py-1 text-xs font-semibold border-t border-b ${
                      settings.fontSizeScale === 'large'
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => changeFontSize('extra-large')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-r-md border ${
                      settings.fontSizeScale === 'extra-large'
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    A++
                  </button>
                </div>
              </div>

              {/* Text-to-Speech Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  {settings.textToSpeech ? <Volume2 size={14} className="text-emerald-600 animate-bounce" /> : <VolumeX size={14} />} Voice Assist:
                </span>
                <button
                  onClick={toggleTts}
                  className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    settings.textToSpeech 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {settings.textToSpeech ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setShowAccessPanel(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium pl-2"
              >
                Hide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Branding & Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
        {/* Brand Logo */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:bg-amber-500 transition-colors duration-300">
            <HeartHandshake size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#0b2240] font-display text-lg sm:text-xl font-bold tracking-tight leading-none group-hover:text-teal-700 transition-colors">
              SYNERGY
            </span>
            <span className="text-slate-500 text-xs sm:text-[13px] font-semibold tracking-wide flex items-center gap-1">
              Care Link <span className="text-teal-700 font-bold font-sans">|</span> NDIS Services
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                activeSection === item.id
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <button 
            onClick={() => onNavigate('referrals')}
            className="ml-4 bg-teal-700 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow hover:shadow-md transition-all duration-300 animate-pulse-gentle"
          >
            Submit NDIS Referral
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-500 hover:text-[#0b2240] p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? 'text-teal-700 bg-teal-50 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onNavigate('referrals');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center bg-teal-700 hover:bg-amber-500 text-white py-2.5 rounded-lg text-sm font-bold shadow transition-colors"
            >
              Submit NDIS Referral
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
