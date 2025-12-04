
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { NavItem, LifeView, FinancialSnapshot, LifeScenario } from '../types';
import { Home, Activity, Target, Settings, MessageSquare, Zap, Plus, ArrowRight, ShieldCheck } from '../components/icons/Icons';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { fetchFinancialSnapshot, fetchScenarios } from '../services/lifeService';
import { cn } from '../utils';

interface LifeOSProps {
    onExit: () => void;
    onLaunch: (appId: string) => void;
}

export const LifeOS: React.FC<LifeOSProps> = ({ onExit, onLaunch }) => {
    const [currentView, setCurrentView] = useState<LifeView>('dashboard');
    const [snapshot, setSnapshot] = useState<FinancialSnapshot | null>(null);
    const [scenarios, setScenarios] = useState<LifeScenario[]>([]);
    
    // Freedom Engine State
    const [savingsRate, setSavingsRate] = useState(2500);
    const [returnRate, setReturnRate] = useState(7);

    useEffect(() => {
        fetchFinancialSnapshot().then(setSnapshot);
        fetchScenarios().then(setScenarios);
    }, []);

    const NAV_ITEMS: NavItem[] = [
        { id: 'dashboard', label: 'Overview', icon: <Home size={16} /> },
        { id: 'wealth', label: 'Net Worth', icon: <Activity size={16} /> },
        { id: 'freedom', label: 'Freedom Engine', icon: <Target size={16} /> },
        { id: 'scenarios', label: 'Scenarios', icon: <Zap size={16} /> },
        { id: 'copilot', label: 'Copilot', icon: <MessageSquare size={16} /> },
    ];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(val);
    };

    // --- Sub-Views ---

    const DashboardView = () => (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Good Morning, Alex & Sarah</h1>
                    <p className="text-slate-500 mt-1">Here is your unified life & wealth picture.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" leftIcon={<Plus size={16}/>}>Add Transaction</Button>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">Refresh Data</Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-l-4 border-l-teal-500 hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Net Worth</div>
                    <div className="text-3xl font-bold text-slate-900">{snapshot ? formatCurrency(snapshot.netWorth) : '...'}</div>
                    <div className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
                        <Activity size={14}/> +$12,400 this month
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Monthly Free Cashflow</div>
                    <div className="text-3xl font-bold text-slate-900">{snapshot ? formatCurrency(snapshot.cashflow) : '...'}</div>
                    <div className="text-sm text-slate-500 mt-2">
                        Includes rent & investment income
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Work Optional Date</div>
                    <div className="text-3xl font-bold text-slate-900">{snapshot?.freedomDate}</div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${snapshot?.freedomProgress}%` }}></div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 text-right">{snapshot?.freedomProgress}% to target</div>
                </Card>
            </div>

            {/* Recent Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-900">LifeOS Insights</h3>
                        <Badge status="info">3 New</Badge>
                    </div>
                    <div className="divide-y divide-slate-50">
                        <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg h-fit"><Zap size={18}/></div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900">Zombie Subscription Detected</h4>
                                <p className="text-xs text-slate-500 mt-1">You haven't used "Adobe Cloud" in 3 months. Cancel to save $45/mo?</p>
                            </div>
                        </div>
                        <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg h-fit"><Target size={18}/></div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900">Milestone Reached</h4>
                                <p className="text-xs text-slate-500 mt-1">Your offset account buffer hit 6 months of expenses. Well done!</p>
                            </div>
                        </div>
                        <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg h-fit"><Settings size={18}/></div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900">Rate Review Due</h4>
                                <p className="text-xs text-slate-500 mt-1">Your home loan rate is 0.5% above market average.</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                        <button className="text-xs font-semibold text-teal-700 hover:underline">Ask Copilot for details</button>
                    </div>
                </Card>

                {/* Quick Scenarios */}
                <Card className="p-0 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-semibold text-slate-900">Scenario Playground</h3>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
                        <p className="text-sm text-slate-500 mb-2">Simulate big life decisions without the spreadsheet headache.</p>
                        {scenarios.slice(0, 2).map(scen => (
                            <div key={scen.id} className="border border-slate-200 rounded-xl p-4 hover:border-teal-400 cursor-pointer transition-all group relative overflow-hidden" onClick={() => setCurrentView('scenarios')}>
                                <div className="absolute right-0 top-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="text-teal-500" />
                                </div>
                                <h4 className="font-bold text-slate-900">{scen.title}</h4>
                                <p className="text-xs text-slate-500">{scen.description}</p>
                                <div className="mt-2 flex gap-2">
                                    <Badge status={scen.impact.freedomYearDelta > 0 ? 'warning' : 'success'}>
                                        {scen.impact.freedomYearDelta > 0 ? `+${scen.impact.freedomYearDelta} yrs to freedom` : `${scen.impact.freedomYearDelta} yrs to freedom`}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );

    const FreedomView = () => (
        <div className="p-8 max-w-4xl mx-auto animate-fadeIn">
            <PageHeader title="Freedom Engine" description="Model your path to a work-optional life." />
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="p-6 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Monthly Savings</label>
                            <input 
                                type="range" min="0" max="10000" step="100" 
                                value={savingsRate} onChange={(e) => setSavingsRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                            />
                            <div className="text-right font-mono font-bold text-teal-700 mt-1">{formatCurrency(savingsRate)}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assumed Return</label>
                            <input 
                                type="range" min="2" max="12" step="0.5" 
                                value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                            />
                            <div className="text-right font-mono font-bold text-teal-700 mt-1">{returnRate}% p.a.</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Inflation</label>
                            <div className="text-sm text-slate-600">Fixed at 3.0% (Conservative)</div>
                        </div>
                    </Card>

                    <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl text-sm text-teal-800">
                        <strong className="block mb-1">Impact</strong>
                        Increasing your savings by $500/mo brings your freedom date forward by <strong>2 years</strong>.
                    </div>
                </div>

                {/* Chart Placeholder */}
                <div className="md:col-span-2">
                    <Card className="h-full p-6 flex flex-col">
                         <h3 className="font-bold text-slate-900 mb-4">Net Worth Projection</h3>
                         <div className="flex-1 flex items-end justify-between gap-2 pl-4 pb-4 border-l border-b border-slate-200 h-64 relative">
                             {/* Fake Bars */}
                             {[...Array(10)].map((_, i) => (
                                 <div key={i} className="w-full bg-teal-200 rounded-t-sm relative group" style={{ height: `${20 + (i * 8) + (savingsRate / 500)}%` }}>
                                     <div className="absolute bottom-0 w-full bg-teal-500" style={{ height: '40%' }}></div>
                                     <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded">
                                         {2024 + i * 2}
                                     </div>
                                 </div>
                             ))}
                             {/* Freedom Line */}
                             <div className="absolute top-[30%] left-0 right-0 border-t-2 border-dashed border-purple-400 flex items-center">
                                 <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full ml-auto mr-2 -mt-3">Target: $2.5M</span>
                             </div>
                         </div>
                         <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                             <span>2024</span>
                             <span>2044</span>
                         </div>
                    </Card>
                </div>
            </div>
        </div>
    );

    const AssetView = () => (
         <div className="p-8 max-w-5xl mx-auto animate-fadeIn">
            <PageHeader title="Net Worth" description="Your consolidated balance sheet." />
            
            <div className="mt-8 space-y-6">
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">Asset</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3 text-right">Value</th>
                                    <th className="px-6 py-3 text-right">Performance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {snapshot?.assets.map(asset => (
                                    <tr key={asset.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{asset.name}</td>
                                        <td className="px-6 py-4 capitalize text-slate-500">{asset.type}</td>
                                        <td className={cn("px-6 py-4 text-right font-mono font-medium", asset.value < 0 ? "text-red-600" : "text-slate-900")}>
                                            {formatCurrency(asset.value)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {asset.growthRate ? (
                                                <Badge status="success">+{asset.growthRate}%</Badge>
                                            ) : <span className="text-slate-300">-</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t border-slate-200">
                                <tr>
                                    <td colSpan={2} className="px-6 py-4 font-bold text-slate-700">Total Net Worth</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900 text-lg">{formatCurrency(snapshot?.netWorth || 0)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </Card>
            </div>
         </div>
    );

    return (
        <Layout 
            appName="LifeOS" 
            appIcon={<div className="w-6 h-6 bg-teal-600 rounded-md flex items-center justify-center text-white font-bold text-xs">L</div>}
            navItems={NAV_ITEMS}
            currentView={currentView} 
            onNavigate={setCurrentView}
            onExitApp={onExit}
            onLaunchApp={onLaunch}
        >
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'freedom' && <FreedomView />}
            {currentView === 'wealth' && <AssetView />}
            {/* Fallbacks */}
            {(currentView === 'scenarios' || currentView === 'copilot') && (
                <div className="p-12 text-center text-slate-400">
                    <Zap size={48} className="mx-auto mb-4 opacity-20"/>
                    <h2 className="text-lg font-semibold text-slate-600">Coming Soon</h2>
                    <p className="max-w-md mx-auto mt-2">The {currentView} module is currently under development in the privacy lab.</p>
                </div>
            )}
        </Layout>
    );
};
