
import React, { useState, useRef, useEffect } from 'react';
import { AgentMsg } from '../components/ui/AgentMsg';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { AgentMessage } from '../types';
import { 
    Bot, 
    Passport, 
    ShieldCheck,
    PlaneTakeoff,
    FileText,
    Map,
    ChevronDown,
    Building,
    PieChart,
    DollarSign,
    Sparkles,
    CheckCircle,
    ArrowRight
} from '../components/icons/Icons';
import { cn } from '../utils';
import { useToast } from '../components/ui/Toast';
import { AgentInput } from '../components/ui/AgentInput';

type Persona = 'travel' | 'loan' | 'wealth';

const FLIGHTS = [
    { id: 'f1', airline: 'Qantas', code: 'QF1', route: 'SFO → LHR', time: '17:05', arrival: '11:55', duration: '10h 50m', price: '$2,450', stops: 'Non-stop' },
    { id: 'f2', airline: 'British Airways', code: 'BA16', route: 'SFO → LHR', time: '18:10', arrival: '12:45', duration: '10h 35m', price: '$2,100', stops: 'Non-stop' },
    { id: 'f3', airline: 'United', code: 'UA930', route: 'SFO → LHR', time: '13:00', arrival: '07:20', duration: '10h 20m', price: '$1,950', stops: '1 Stop' },
];

export const RichExperience: React.FC = () => {
    const { showToast } = useToast();
    
    // --- State ---
    const [activePersona, setActivePersona] = useState<Persona>('travel');
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Business Logic State
    const [selectedFlight, setSelectedFlight] = useState<any | null>(null);
    const [passportNumber, setPassportNumber] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    
    // Loan State
    const [loanAmount, setLoanAmount] = useState('850000');
    
    // Reset state when switching persona
    useEffect(() => {
        setMessages([getInitialMessage(activePersona)]);
        setInputValue('');
        setIsThinking(false);
        // Reset sub-states
        setSelectedFlight(null);
        setPassportNumber('');
        setIsConfirmed(false);
    }, [activePersona]);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const getInitialMessage = (persona: Persona): AgentMessage => {
        switch (persona) {
            case 'travel':
                return { 
                    id: '1', role: 'assistant', 
                    content: 'Good afternoon, Alex. I can help you book travel, submit expenses, or update your profile. What do you need today?', 
                    timestamp: new Date() 
                };
            case 'loan':
                return { 
                    id: '1', role: 'assistant', 
                    content: 'Hello Alex. I am the Home Loan Origination Bot. I can help you check eligibility, calculate borrowing power, and start your application.', 
                    timestamp: new Date() 
                };
            case 'wealth':
                return { 
                    id: '1', role: 'assistant', 
                    content: 'Welcome to your Financial Health Check. I have analyzed your linked accounts. Ready to review your Net Worth report?', 
                    timestamp: new Date() 
                };
        }
    };

    // Handle user input
    const handleQuickAction = async (action: string) => {
        const userMsg: AgentMessage = { id: `u-${Date.now()}`, role: 'user', content: action, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setIsThinking(true);
        setInputValue('');

        await new Promise(r => setTimeout(r, 1000));

        let botMsg: AgentMessage;

        // --- Logic Router based on Persona ---
        if (activePersona === 'travel') {
            if (action.toLowerCase().includes('book') || action.includes('London')) {
                botMsg = {
                    id: `b-${Date.now()}`, role: 'assistant',
                    content: 'I found 3 flights matching your preferences for **San Francisco to London** on **Oct 24**.',
                    timestamp: new Date()
                };
            } else if (action.toLowerCase().includes('expense')) {
                 botMsg = {
                    id: `b-${Date.now()}`, role: 'assistant',
                    content: 'Your expense report **#EXP-2024-001** is currently **Pending Approval** by Sarah Chen. \n\n Would you like to send a reminder?',
                    timestamp: new Date(),
                    actions: [{ label: 'Send Reminder', actionId: 'remind', variant: 'secondary' }]
                };
            } else if (action.toLowerCase().includes('remind')) {
                 botMsg = { id: `b-${Date.now()}`, role: 'assistant', content: 'Reminder sent to Sarah Chen via Slack.', timestamp: new Date() };
            } else {
                 botMsg = { id: `b-${Date.now()}`, role: 'assistant', content: "I'm tuned for Travel. Try asking to 'Book a flight'.", timestamp: new Date() };
            }
        } 
        else if (activePersona === 'loan') {
            if (action.toLowerCase().includes('eligibility') || action.toLowerCase().includes('borrow')) {
                botMsg = {
                    id: `b-${Date.now()}`, role: 'assistant',
                    content: 'Based on your income of **$140k** and expenses, your estimated borrowing power is **$880,000**. \n\nWould you like to pre-fill the application form?',
                    timestamp: new Date(),
                    actions: [{ label: 'Start Application', actionId: 'start_app', variant: 'primary' }]
                };
            } else if (action.toLowerCase().includes('start')) {
                botMsg = { id: `b-${Date.now()}`, role: 'assistant', content: 'I have opened the **Residential Loan Application** form on the right. Please verify your details.', timestamp: new Date() };
            } else {
                botMsg = { id: `b-${Date.now()}`, role: 'assistant', content: "I can help with loans. Ask to 'Check eligibility'.", timestamp: new Date() };
            }
        }
        else { // wealth
            if (action.toLowerCase().includes('report') || action.toLowerCase().includes('summary')) {
                botMsg = {
                    id: `b-${Date.now()}`, role: 'assistant',
                    content: 'Here is your current financial snapshot. You are tracking **ahead** of your retirement goal.',
                    timestamp: new Date()
                };
            } else {
                botMsg = { id: `b-${Date.now()}`, role: 'assistant', content: "Ask for a 'Financial Report' to see your summary.", timestamp: new Date() };
            }
        }

        setMessages(prev => [...prev, botMsg]);
        setIsThinking(false);
    };

    const handleSelectFlight = (flight: any) => {
        setSelectedFlight(flight);
        const sysMsg: AgentMessage = { id: `s-${Date.now()}`, role: 'system', content: `Selected Flight ${flight.code} (${flight.price})`, timestamp: new Date() };
        setMessages(prev => [...prev, sysMsg]);
    };

    const handleConfirmBooking = async () => {
        if (!passportNumber) {
            showToast('Passport Number is required', { type: 'error' });
            return;
        }
        setIsThinking(true);
        setIsConfirmed(true);
        await new Promise(r => setTimeout(r, 1500));
        
        const successMsg: AgentMessage = {
            id: `b-final-${Date.now()}`, role: 'assistant',
            content: `All set! I've confirmed your booking on **${selectedFlight.airline} ${selectedFlight.code}**.`,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, successMsg]);
        setIsThinking(false);
    };

    // --- Sub-Components for Documents ---

    const TravelDocument = () => (
        <div className="p-8 overflow-y-auto space-y-8 font-serif h-full">
            <section>
                <h3 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">01. Trip Summary</h3>
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl font-bold text-slate-900">SFO</div>
                            <div className="text-slate-400"><PlaneTakeoff size={24}/></div>
                            <div className="text-3xl font-bold text-slate-900">LHR</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-slate-900">{selectedFlight?.date || 'Oct 24, 2024'}</div>
                            <div className="text-xs text-slate-500">Business Class</div>
                        </div>
                    </div>
                    {selectedFlight && (
                        <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                            <div><span className="text-slate-500 block text-xs">Airline</span><span className="font-medium text-slate-900">{selectedFlight.airline} ({selectedFlight.code})</span></div>
                            <div><span className="text-slate-500 block text-xs">Duration</span><span className="font-medium text-slate-900">{selectedFlight.duration}</span></div>
                        </div>
                    )}
                </div>
            </section>
            <section>
                <h3 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">02. Traveler Verification</h3>
                <div className="text-lg leading-relaxed text-slate-700">
                    <p>
                        I, <span className="font-bold text-slate-900 border-b border-slate-300 px-1">Alex Johnson</span>, 
                        Employee ID <span className="font-mono text-base bg-slate-100 px-2 py-0.5 rounded text-slate-600">E-4921</span>, 
                        hereby request travel authorization.
                    </p>
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                        <div className="mt-1 text-yellow-600"><Passport size={24}/></div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-yellow-800 mb-1">Passport Verification Required</label>
                            <p className="text-sm text-yellow-700 mb-3">Your profile is missing a valid passport number.</p>
                            <div className="flex items-center gap-2 bg-white p-2 rounded border border-yellow-300 shadow-sm">
                                <span className="text-slate-400 font-mono text-sm">PASS#</span>
                                <input 
                                    type="text" placeholder="Enter Passport Number" value={passportNumber}
                                    onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                                    disabled={isConfirmed}
                                    className="flex-1 outline-none text-slate-900 font-mono font-bold tracking-widest uppercase bg-transparent"
                                />
                                {passportNumber.length > 5 && <CheckCircle size={16} className="text-green-500" />}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    const LoanDocument = () => (
        <div className="p-8 overflow-y-auto space-y-8 font-sans h-full">
            <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">01. Applicant Details</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-xs text-slate-500 block mb-1">Primary Applicant</span>
                        <div className="font-bold text-slate-900 text-lg">Alex Johnson</div>
                        <div className="text-sm text-slate-600 mt-1">alex.johnson@lumina.so</div>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-xs text-slate-500 block mb-1">Employment</span>
                        <div className="font-bold text-slate-900 text-lg">Product Lead</div>
                        <div className="text-sm text-slate-600 mt-1">Lumina Corp (3.5 yrs)</div>
                    </div>
                </div>
            </section>
            
            <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">02. Loan Parameters</h3>
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-blue-900 mb-2">Loan Amount</label>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
                            <DollarSign className="text-blue-500" size={20}/>
                            <input 
                                type="text" 
                                value={loanAmount} 
                                onChange={(e) => setLoanAmount(e.target.value)}
                                className="flex-1 font-mono text-xl font-bold text-slate-900 outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-blue-900 mb-1">Interest Rate</label>
                            <div className="font-mono text-lg font-bold text-slate-700">6.14% p.a.</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-900 mb-1">Term</label>
                            <div className="font-mono text-lg font-bold text-slate-700">30 Years</div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">03. Declaration</h3>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                    I declare that the information provided is true and correct. I authorize ContextOS to retrieve my credit score and employment history.
                </p>
                <div className="mt-4 flex gap-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => showToast('Application Submitted', {type: 'success'})}>Sign & Submit Application</Button>
                </div>
            </section>
        </div>
    );

    const WealthDocument = () => (
        <div className="p-8 overflow-y-auto space-y-8 font-sans h-full">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl font-bold shadow-inner">A+</div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Financial Health Score</h2>
                    <p className="text-slate-500">Last updated: Today</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border-l-4 border-l-green-500">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Net Worth</div>
                    <div className="text-2xl font-bold text-slate-900">$1.25M</div>
                    <div className="text-xs text-green-600 font-medium mt-1">+12% YoY</div>
                </Card>
                <Card className="p-4 border-l-4 border-l-blue-500">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Savings Rate</div>
                    <div className="text-2xl font-bold text-slate-900">32%</div>
                    <div className="text-xs text-slate-500 mt-1">Target: 30%</div>
                </Card>
            </div>

            <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Asset Allocation</h3>
                <div className="space-y-4">
                    {[
                        { label: 'Real Estate', val: '65%', color: 'bg-indigo-500' },
                        { label: 'Equities', val: '25%', color: 'bg-teal-500' },
                        { label: 'Cash', val: '10%', color: 'bg-slate-300' }
                    ].map(item => (
                        <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700">{item.label}</span>
                                <span className="font-bold text-slate-900">{item.val}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full", item.color)} style={{ width: item.val }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-500"/>
                    AI Recommendation
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Your cash buffer is higher than necessary. Consider moving **$15,000** into a high-interest ETF to maximize returns while maintaining liquidity.
                </p>
            </div>
        </div>
    );

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden">
            
            {/* --- LEFT PANEL: CONCIERGE CHAT --- */}
            <div className="flex-1 flex flex-col max-w-xl border-r border-slate-200 bg-white z-10 shadow-xl transition-all">
                {/* Header with Persona Selector */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 shrink-0">
                    <div className="relative group">
                        <button className="flex items-center gap-3 hover:bg-slate-50 p-2 -ml-2 rounded-lg transition-colors">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-colors",
                                activePersona === 'travel' ? "bg-indigo-600" : 
                                activePersona === 'loan' ? "bg-blue-600" : "bg-green-600"
                            )}>
                                {activePersona === 'travel' && <Bot size={20} />}
                                {activePersona === 'loan' && <Building size={20} />}
                                {activePersona === 'wealth' && <PieChart size={20} />}
                            </div>
                            <div className="text-left">
                                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                                    {activePersona === 'travel' && "Travel Concierge"}
                                    {activePersona === 'loan' && "Loan Specialist"}
                                    {activePersona === 'wealth' && "Wealth Advisor"}
                                    <ChevronDown size={14} className="text-slate-400"/>
                                </h2>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-slate-500">Online</span>
                                </div>
                            </div>
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl mt-2 p-1 hidden group-hover:block z-50">
                            <button onClick={() => setActivePersona('travel')} className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-lg text-left">
                                <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center"><Bot size={16}/></div>
                                <div><div className="text-sm font-bold text-slate-900">Travel</div><div className="text-xs text-slate-500">Bookings & Expenses</div></div>
                            </button>
                            <button onClick={() => setActivePersona('loan')} className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-lg text-left">
                                <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center"><Building size={16}/></div>
                                <div><div className="text-sm font-bold text-slate-900">Loans</div><div className="text-xs text-slate-500">Origination & Refi</div></div>
                            </button>
                            <button onClick={() => setActivePersona('wealth')} className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-lg text-left">
                                <div className="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center"><PieChart size={16}/></div>
                                <div><div className="text-sm font-bold text-slate-900">Wealth</div><div className="text-xs text-slate-500">Portfolio Health</div></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chat Stream */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                    {messages.map(msg => (
                        <div key={msg.id}>
                            <div className={cn("flex gap-3 animate-fadeIn", msg.role === 'system' ? "opacity-75" : "")}>
                                {msg.role !== 'system' && (
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                                        msg.role === 'assistant' 
                                            ? (activePersona === 'travel' ? "bg-indigo-600 text-white" : activePersona === 'loan' ? "bg-blue-600 text-white" : "bg-green-600 text-white")
                                            : "bg-slate-100 text-slate-500"
                                    )}>
                                        {msg.role === 'assistant' ? <Bot size={16} /> : <div className="text-xs font-bold">You</div>}
                                    </div>
                                )}
                                <div className={cn("flex-1 space-y-3 max-w-[85%]", msg.role === 'system' ? "mx-auto text-center" : "")}>
                                    <div className={cn(
                                        "p-3 rounded-2xl shadow-sm text-sm leading-relaxed border",
                                        msg.role === 'assistant' ? "bg-white text-slate-700 rounded-tl-none border-slate-100" : 
                                        (activePersona === 'travel' ? "bg-indigo-50 text-indigo-900 border-indigo-100" : activePersona === 'loan' ? "bg-blue-50 text-blue-900 border-blue-100" : "bg-green-50 text-green-900 border-green-100") + " rounded-tr-none"
                                    )}>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    {msg.actions && (
                                        <div className="flex gap-2">
                                            {msg.actions.map(action => (
                                                <Button 
                                                    key={action.actionId} 
                                                    size="sm" 
                                                    variant={action.variant}
                                                    onClick={() => {
                                                        if (action.actionId === 'remind') handleQuickAction("Send a reminder");
                                                        if (action.actionId === 'start_app') handleQuickAction("Start Application");
                                                    }}
                                                    className="h-8 text-xs"
                                                >
                                                    {action.label}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Render Flight Widget Logic (Only for Travel) */}
                            {activePersona === 'travel' && msg.content.includes('I found 3 flights') && (
                                <div className="ml-11 mt-3 space-y-3 animate-fadeIn">
                                    {FLIGHTS.map(flight => (
                                        <div 
                                            key={flight.id}
                                            onClick={() => handleSelectFlight(flight)}
                                            className={cn(
                                                "group border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md relative overflow-hidden",
                                                selectedFlight?.id === flight.id 
                                                    ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500/30" 
                                                    : "bg-white border-slate-200 hover:border-indigo-300"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                        {flight.airline.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 text-sm">{flight.time} — {flight.arrival}</div>
                                                        <div className="text-xs text-slate-500">{flight.airline} • {flight.duration}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-indigo-700">{flight.price}</div>
                                                    <div className="text-xs text-slate-400">{flight.stops}</div>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 transition-transform duration-300",
                                                selectedFlight?.id === flight.id ? "translate-y-0" : "translate-y-1"
                                            )}></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex items-center gap-2 text-slate-400 text-xs ml-11 animate-pulse">
                            <Bot size={14} /> Processing...
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                        {activePersona === 'travel' && (
                            <>
                                <button onClick={() => handleQuickAction("Book a flight to London")} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 shadow-sm whitespace-nowrap">✈️ Book Flight</button>
                                <button onClick={() => handleQuickAction("Expense report status")} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 shadow-sm whitespace-nowrap">🧾 Expenses</button>
                            </>
                        )}
                        {activePersona === 'loan' && (
                            <>
                                <button onClick={() => handleQuickAction("Check eligibility")} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-600 shadow-sm whitespace-nowrap">📋 Check Eligibility</button>
                                <button onClick={() => handleQuickAction("Calculate borrowing power")} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-600 shadow-sm whitespace-nowrap">🧮 Borrowing Power</button>
                            </>
                        )}
                        {activePersona === 'wealth' && (
                            <>
                                <button onClick={() => handleQuickAction("Show financial report")} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-green-600 shadow-sm whitespace-nowrap">📊 Financial Report</button>
                                <button onClick={() => handleQuickAction("Analyze cashflow")} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-green-600 shadow-sm whitespace-nowrap">📈 Cashflow</button>
                            </>
                        )}
                    </div>
                    
                    <AgentInput 
                        value={inputValue}
                        onChange={setInputValue}
                        onSubmit={() => handleQuickAction(inputValue)}
                        placeholder={`Ask ${activePersona}...`}
                        isThinking={isThinking}
                    />
                </div>
            </div>

            {/* --- RIGHT PANEL: CONTEXTUAL DOCUMENT --- */}
            <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col items-center justify-center p-8">
                
                {/* Fallback Empty State if no "Document" is active yet */}
                {!selectedFlight && activePersona === 'travel' ? (
                    <div className="text-center space-y-4 max-w-sm animate-fadeIn">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-200 text-slate-300">
                            <Map size={48} />
                        </div>
                        <h3 className="text-slate-900 font-medium text-lg">Waiting for Selection</h3>
                        <p className="text-slate-500 text-sm">Select a flight from the chat to generate the travel authorization document.</p>
                    </div>
                ) : (
                    <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden animate-slideInRight flex flex-col max-h-full h-full">
                        
                        {/* Doc Header */}
                        <div className={cn(
                            "p-6 text-white flex justify-between items-center shrink-0",
                            activePersona === 'travel' ? "bg-indigo-600" : activePersona === 'loan' ? "bg-blue-600" : "bg-green-600"
                        )}>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
                                    <FileText size={20} className="opacity-80"/>
                                    {activePersona === 'travel' && "Travel Authorization"}
                                    {activePersona === 'loan' && "Residential Loan Application"}
                                    {activePersona === 'wealth' && "Financial Health Report"}
                                </h1>
                                <p className="text-white/60 text-xs mt-1 font-mono uppercase tracking-widest">Ref: {activePersona.toUpperCase().slice(0,3)}-{Date.now().toString().slice(-6)}</p>
                            </div>
                            {isConfirmed && (
                                <Badge status="success" className="bg-white/20 text-white border-none backdrop-blur-md">
                                    <CheckCircle size={14} className="mr-1"/> Authorized
                                </Badge>
                            )}
                        </div>

                        {/* Document Content Switcher */}
                        {activePersona === 'travel' && <TravelDocument />}
                        {activePersona === 'loan' && <LoanDocument />}
                        {activePersona === 'wealth' && <WealthDocument />}

                        {/* Doc Footer Action (Conditional) */}
                        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                                <ShieldCheck size={14}/> Secure {activePersona === 'travel' ? 'Corporate Travel' : 'Banking'} System
                            </div>
                            
                            {activePersona === 'travel' && !isConfirmed && (
                                <Button 
                                    onClick={handleConfirmBooking}
                                    disabled={!passportNumber}
                                    className={cn("bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg", !passportNumber && "opacity-50 cursor-not-allowed")}
                                    rightIcon={<ArrowRight size={16}/>}
                                >
                                    Verify & Submit Request
                                </Button>
                            )}
                            
                            {activePersona === 'travel' && isConfirmed && (
                                <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                                    <CheckCircle size={20} /> Request Approved
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>

        </div>
    );
};
