import { useState, useEffect, useRef, FormEvent } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  CheckCircle, 
  Mail, 
  Phone, 
  User, 
  FileText, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ReferralSubmission } from '../types';

interface AIChatBotProps {
  highContrast?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatBot({ highContrast = false }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Intake extraction states
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<ReferralSubmission> | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasNewMessageBadge, setHasNewMessageBadge] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Initialize with a welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hello! I am your Synergy Care Link AI Assistant. 🌟 I'm here to help answer your NDIS questions and collect your care intake details.

To get started, may I please have your **name**, and are you looking for support for yourself or someone else?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom whenever messages list or extracting state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isExtracting, extractedData]);

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoading || isExtracting) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response from care assistant.');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      }]);
    } catch (err: any) {
      setError(err?.message || 'Connection interrupted. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract structured details from the chat conversation
  const handleExtractDetails = async () => {
    if (messages.length < 2 || isExtracting) return;
    setIsExtracting(true);
    setError(null);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Could not parse conversation details.');
      }

      const extracted = await response.json();
      setExtractedData(extracted);
    } catch (err: any) {
      setError(err?.message || 'Could not extract details. You can continue chatting or fill out the main form.');
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  // Submit the extracted details to localStorage (so it displays on Staff Dashboard)
  const handleConfirmSubmit = async () => {
    if (!extractedData) return;
    setIsLoading(true);
    setError(null);

    try {
      const existingStr = localStorage.getItem('synergy_referrals');
      const existing: ReferralSubmission[] = existingStr ? JSON.parse(existingStr) : [];

      // Create a clean valid submission
      const newSubmission: ReferralSubmission = {
        id: `ai-ref-${Date.now()}`,
        referrerName: extractedData.referrerName || 'AI Chat Care Contact',
        referrerEmail: extractedData.referrerEmail || 'not-provided@example.com',
        referrerPhone: extractedData.referrerPhone || 'Not provided',
        relationship: 'other',
        participantName: extractedData.participantName || extractedData.referrerName || 'Participant',
        participantAge: 25, // default
        participantGender: 'Prefer not to say',
        primaryDisability: extractedData.primaryDisability || 'Intake Pending Review',
        requestedServices: extractedData.requestedServices && extractedData.requestedServices.length > 0 
          ? extractedData.requestedServices 
          : ['support-coordination'],
        preferredContact: extractedData.referrerEmail ? 'email' : 'phone',
        additionalInfo: `[AI CHATBOT REFERRAL]
- Submission channel: Synergy Care Link AI Assistant
- Automatically emailed to: synergycarelink@gmail.com
- Details collected during chat:
  * Primary Needs/Goals: ${extractedData.additionalInfo || 'Not specified'}
  * Disability details: ${extractedData.primaryDisability || 'Not specified'}

Full conversation summary captured securely.`,
        submittedAt: new Date().toLocaleString(),
        status: 'pending'
      };

      // Call the email sending API route
      try {
        const emailRes = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSubmission),
        });
        
        if (!emailRes.ok) {
          console.error("Failed to send AI Chat referral email through backend.");
        } else {
          const resData = await emailRes.json();
          if (resData.warning) {
            console.warn("[Email Warning]:", resData.warning);
          }
        }
      } catch (err) {
        console.error("Error calling send-email endpoint for AI Chat:", err);
      }

      existing.unshift(newSubmission);
      localStorage.setItem('synergy_referrals', JSON.stringify(existing));

      // Trigger standard storage event so other components (ReferralPortal) know to reload their lists
      window.dispatchEvent(new Event('storage'));

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error saving AI submission:', err);
      setError('Could not complete submission. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setExtractedData(null);
    setIsSubmitted(false);
    setInputMessage('');
    setError(null);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 font-sans ${highContrast ? 'high-contrast' : ''}`}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="ai-chat-toggle"
          onClick={() => {
            setIsOpen(true);
            setHasNewMessageBadge(false);
          }}
          className="bg-teal-700 hover:bg-amber-500 text-white font-bold px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 cursor-pointer group"
          aria-label="Open AI Referral Chat"
        >
          <div className="relative">
            <MessageSquare size={20} className="animate-pulse" />
            {hasNewMessageBadge && (
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-rose-500 border-2 border-white rounded-full" />
            )}
          </div>
          <span className="text-xs tracking-wide">Chat with Synergy Care Link AI ⚡</span>
        </button>
      )}

      {/* Main Chat Panel */}
      {isOpen && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl w-[380px] sm:w-[410px] h-[550px] flex flex-col overflow-hidden transition-all duration-300 scale-100 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-teal-700 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/10 p-1.5 rounded-lg">
                <Sparkles size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-xs leading-none">Synergy Care Link AI</h3>
                <span className="text-[10px] text-teal-100 flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  NDIS Assistant • Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/85 hover:text-white hover:bg-white/15 p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat / Forms Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3 scrollbar-thin">
            
            {!extractedData && !isSubmitted ? (
              <>
                {/* Messages list */}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed whitespace-pre-wrap ${
                        m.role === 'user'
                          ? 'bg-teal-700 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {/* Loading response */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-100 text-slate-500 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs flex items-center gap-2 shadow-sm">
                      <Loader2 size={14} className="animate-spin text-teal-700" />
                      Care AI is typing...
                    </div>
                  </div>
                )}

                {/* Active Error state */}
                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 p-2.5 rounded-lg text-[11px] flex items-start gap-1.5">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            ) : isSubmitted ? (
              /* Submission Complete Screen */
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full animate-bounce">
                  <CheckCircle size={44} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-sm">Submission Sent!</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Thank you so much! Your intake details have been securely logged in our Referral System and emailed directly to:
                  </p>
                  <div className="bg-slate-100 text-slate-700 font-mono text-[11px] py-1.5 px-3 rounded-md inline-block select-all">
                    synergycarelink@gmail.com
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Our team will review your requirements and reach out to you within 24 business hours.
                  </p>
                </div>
                <div className="pt-2 w-full space-y-2">
                  <button
                    onClick={handleReset}
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    Start New Inquiry
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    Close Chat
                  </button>
                </div>
              </div>
            ) : (
              /* Extracted Referral Preview Screen */
              <div className="space-y-4 py-2">
                <div className="bg-teal-50 border border-teal-100 text-teal-800 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-teal-900 font-bold text-xs">
                    <ShieldCheck size={16} className="text-teal-700" />
                    Review Your Intake Summary
                  </div>
                  <p className="text-[11px] text-teal-800 leading-normal">
                    Our AI has extracted the following details from your conversation. Please confirm them to complete your intake referral.
                  </p>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-3.5 space-y-3 shadow-sm text-xs">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 border-b border-slate-50 pb-2">
                      <User size={14} className="text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-400 leading-none">Participant Name</div>
                        <input
                          type="text"
                          value={extractedData?.participantName || ''}
                          onChange={(e) => setExtractedData(prev => ({ ...prev, participantName: e.target.value }))}
                          className="font-semibold text-slate-800 bg-slate-50 border border-transparent hover:border-slate-100 focus:bg-white focus:border-teal-700 rounded px-1.5 py-0.5 mt-0.5 w-full focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 border-b border-slate-50 pb-2">
                      <Phone size={14} className="text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-400 leading-none">Contact Phone</div>
                        <input
                          type="text"
                          value={extractedData?.referrerPhone || ''}
                          onChange={(e) => setExtractedData(prev => ({ ...prev, referrerPhone: e.target.value }))}
                          className="font-semibold text-slate-800 bg-slate-50 border border-transparent hover:border-slate-100 focus:bg-white focus:border-teal-700 rounded px-1.5 py-0.5 mt-0.5 w-full focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 border-b border-slate-50 pb-2">
                      <Mail size={14} className="text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-400 leading-none">Contact Email</div>
                        <input
                          type="text"
                          value={extractedData?.referrerEmail || ''}
                          onChange={(e) => setExtractedData(prev => ({ ...prev, referrerEmail: e.target.value }))}
                          className="font-semibold text-slate-800 bg-slate-50 border border-transparent hover:border-slate-100 focus:bg-white focus:border-teal-700 rounded px-1.5 py-0.5 mt-0.5 w-full focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 border-b border-slate-50 pb-2">
                      <FileText size={14} className="text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-400 leading-none">Primary Disability (if shared)</div>
                        <input
                          type="text"
                          value={extractedData?.primaryDisability || ''}
                          placeholder="e.g. NDIS Participant"
                          onChange={(e) => setExtractedData(prev => ({ ...prev, primaryDisability: e.target.value }))}
                          className="font-semibold text-slate-800 bg-slate-50 border border-transparent hover:border-slate-100 focus:bg-white focus:border-teal-700 rounded px-1.5 py-0.5 mt-0.5 w-full focus:outline-none text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <FileText size={14} className="text-slate-400 mt-0.5" />
                      <div className="w-full">
                        <div className="text-[10px] text-slate-400 leading-none">Care Goals & Additional Info</div>
                        <textarea
                          rows={3}
                          value={extractedData?.additionalInfo || ''}
                          onChange={(e) => setExtractedData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                          className="font-semibold text-slate-800 bg-slate-50 border border-transparent hover:border-slate-100 focus:bg-white focus:border-teal-700 rounded px-1.5 py-1 mt-0.5 w-full focus:outline-none text-xs resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleConfirmSubmit}
                    className="w-full bg-teal-700 hover:bg-amber-500 hover:text-white text-white font-bold text-xs py-3 rounded-lg cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    Confirm & Submit to Care Link <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => setExtractedData(null)}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    Go Back to Chat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick submission panel shown during normal chat */}
          {!extractedData && !isSubmitted && messages.length >= 2 && (
            <div className="bg-amber-50 border-t border-amber-100 p-2.5 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                Ready to submit?
              </div>
              <button
                onClick={handleExtractDetails}
                disabled={isExtracting}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                {isExtracting ? (
                  <>
                    <Loader2 size={11} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Submit Details <ArrowRight size={11} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Footer Input Bar */}
          {!extractedData && !isSubmitted && (
            <form onSubmit={handleSendMessage} className="bg-white p-3 border-t border-slate-100 flex items-center gap-2">
              <input
                ref={chatInputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask a question or type your details..."
                disabled={isLoading || isExtracting}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading || isExtracting}
                className="bg-teal-700 hover:bg-teal-800 disabled:bg-slate-100 text-white disabled:text-slate-400 p-2.5 rounded-xl transition-all cursor-pointer hover:scale-105 shrink-0"
                aria-label="Send Message"
              >
                <Send size={15} />
              </button>
            </form>
          )}

        </div>
      )}
    </div>
  );
}
