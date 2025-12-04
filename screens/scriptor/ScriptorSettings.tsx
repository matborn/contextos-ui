
import React, { useState } from 'react';
import { PageLayout } from '../../components/ui/PageLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TabBar, TabItem } from '../../components/ui/TabBar';
import { Settings, ShieldCheck, Bot, FileText, CheckCircle } from '../../components/icons/Icons';
import { useToast } from '../../components/ui/Toast';
import { cn } from '../../utils';

type SettingsTab = 'general' | 'ai' | 'governance';

export const ScriptorSettings: React.FC = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [isSaving, setIsSaving] = useState(false);

    // Mock State
    const [config, setConfig] = useState({
        defaultVisibility: 'team',
        exportFormat: 'markdown',
        autoCorrect: true,
        defaultTone: 'professional',
        strictness: 'flexible',
        requireReview: true,
        enforceTemplates: false
    });

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            showToast('Settings saved successfully', { type: 'success' });
        }, 800);
    };

    const toggleConfig = (key: keyof typeof config) => {
        setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const setConfigValue = (key: keyof typeof config, value: string) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const navItems: TabItem[] = [
        { id: 'general', label: 'General', icon: <Settings size={16} /> },
        { id: 'ai', label: 'AI Assistance', icon: <Bot size={16} /> },
        { id: 'governance', label: 'Governance', icon: <ShieldCheck size={16} /> },
    ];

    return (
        <PageLayout
            title="Scriptor Settings"
            description="Configure global document standards and AI behavior."
            headerTabs={
                <TabBar 
                    items={navItems} 
                    activeId={activeTab} 
                    onSelect={(id) => setActiveTab(id as SettingsTab)} 
                />
            }
        >
            <div className="max-w-4xl mx-auto space-y-6">
                
                {activeTab === 'general' && (
                    <Card className="animate-fadeIn">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText size={18} className="text-slate-400"/> Defaults
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Default Visibility</label>
                                    <p className="text-xs text-slate-500 mb-2">Applied to new documents unless specified.</p>
                                    <div className="flex gap-2">
                                        {['private', 'team', 'public'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setConfigValue('defaultVisibility', opt)}
                                                className={cn(
                                                    "px-4 py-2 text-sm rounded-lg border capitalize transition-all",
                                                    config.defaultVisibility === opt 
                                                        ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500" 
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                )}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Preferred Export Format</label>
                                    <p className="text-xs text-slate-500 mb-2">Default option for download actions.</p>
                                    <select 
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all"
                                        value={config.exportFormat}
                                        onChange={(e) => setConfigValue('exportFormat', e.target.value)}
                                    >
                                        <option value="markdown">Markdown (.md)</option>
                                        <option value="docx">Word Document (.docx)</option>
                                        <option value="pdf">PDF Document (.pdf)</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 justify-end">
                            <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
                        </CardFooter>
                    </Card>
                )}

                {activeTab === 'ai' && (
                    <Card className="animate-fadeIn">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bot size={18} className="text-slate-400"/> AI Behavior
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900">Auto-Correction</h4>
                                    <p className="text-xs text-slate-500 mt-1">Automatically fix spelling and grammar as you type.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={config.autoCorrect}
                                        onChange={() => toggleConfig('autoCorrect')}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-700">Default Tone</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'professional', label: 'Professional', desc: 'Objective & formal' },
                                        { id: 'casual', label: 'Casual', desc: 'Friendly & direct' },
                                        { id: 'academic', label: 'Academic', desc: 'Detailed & structured' }
                                    ].map(tone => (
                                        <div 
                                            key={tone.id}
                                            onClick={() => setConfigValue('defaultTone', tone.id)}
                                            className={cn(
                                                "cursor-pointer p-3 rounded-xl border text-center transition-all",
                                                config.defaultTone === tone.id
                                                    ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                                                    : "bg-white border-slate-200 hover:border-slate-300"
                                            )}
                                        >
                                            <div className="text-sm font-medium text-slate-900">{tone.label}</div>
                                            <div className="text-[10px] text-slate-500">{tone.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-700">Knowledge Strictness</label>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                                    <div className="flex gap-4">
                                        <label className="flex items-start gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="strictness" 
                                                value="strict"
                                                checked={config.strictness === 'strict'}
                                                onChange={(e) => setConfigValue('strictness', e.target.value)}
                                                className="mt-1"
                                            />
                                            <div>
                                                <span className="block text-sm font-medium text-slate-900">Strict</span>
                                                <span className="text-xs text-slate-500">AI only uses facts from Atlas. Citations required.</span>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="strictness" 
                                                value="flexible"
                                                checked={config.strictness === 'flexible'}
                                                onChange={(e) => setConfigValue('strictness', e.target.value)}
                                                className="mt-1"
                                            />
                                            <div>
                                                <span className="block text-sm font-medium text-slate-900">Flexible</span>
                                                <span className="text-xs text-slate-500">AI can use general knowledge to fill gaps.</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="bg-slate-50 justify-end">
                            <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
                        </CardFooter>
                    </Card>
                )}

                {activeTab === 'governance' && (
                    <Card className="animate-fadeIn">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck size={18} className="text-slate-400"/> Governance Rules
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            
                            <div className="flex items-start justify-between p-4 border border-slate-200 rounded-xl bg-white">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900">Mandatory Peer Review</h4>
                                    <p className="text-xs text-slate-500 mt-1">Documents cannot be approved without at least one human review.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer mt-1">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={config.requireReview}
                                        onChange={() => toggleConfig('requireReview')}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-start justify-between p-4 border border-slate-200 rounded-xl bg-white">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900">Enforce Template Usage</h4>
                                    <p className="text-xs text-slate-500 mt-1">Users must start from a template (Blank Draft disabled).</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer mt-1">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={config.enforceTemplates}
                                        onChange={() => toggleConfig('enforceTemplates')}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                                <CheckCircle size={20} className="text-blue-600 shrink-0"/>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-900">Approval Workflow</h4>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Default approval flow: <span className="font-mono bg-white/50 px-1 rounded">{'Author -> Reviewer -> Owner'}</span>.
                                        This can be overridden per project.
                                    </p>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="bg-slate-50 justify-end">
                            <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
                        </CardFooter>
                    </Card>
                )}

            </div>
        </PageLayout>
    );
};
