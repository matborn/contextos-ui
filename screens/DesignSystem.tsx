
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { ListItem } from '../components/ui/ListItem';
import { AgentMsg } from '../components/ui/AgentMsg';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { PageSection } from '../components/ui/PageSection';
import { Search, Check, AlertCircle, FileText, ChevronRight, Layers, MessageSquare, Bell, LayoutTemplate, Bot, Plane, Calendar, CreditCard, Activity, Database } from '../components/icons/Icons';
import { useToast } from '../components/ui/Toast';
import { cn } from '../utils';

type Category = 'foundations' | 'atoms' | 'molecules' | 'organisms';

export const DesignSystem: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('organisms');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const navItems: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'foundations', label: 'Foundations', icon: <Layers size={16}/> },
    { id: 'atoms', label: 'Atoms (Inputs/Btns)', icon: <Check size={16}/> },
    { id: 'molecules', label: 'Molecules (Cards)', icon: <FileText size={16}/> },
    { id: 'organisms', label: 'Organisms (Layouts)', icon: <LayoutTemplate size={16}/> },
  ];

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-white border-r border-slate-200 flex-shrink-0 overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">ContextUI</h1>
          <p className="text-xs text-slate-500 mt-1">Design System v1.3</p>
        </div>
        <div className="p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === item.id 
                  ? "bg-primary-50 text-primary-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 scroll-smooth">
        
        {/* Using New PageHeader Component */}
        <PageHeader 
            title={activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} 
            description={
                activeCategory === 'foundations' ? "Core design tokens: colors, typography, and spacing." :
                activeCategory === 'atoms' ? "Base UI elements that cannot be broken down further." :
                activeCategory === 'molecules' ? "Collections of atoms functioning together as a unit." :
                "Complex UI patterns and interactive modules."
            }
        >
             <Button variant="outline" size="sm">Download Assets</Button>
        </PageHeader>

        <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-12">

            {/* FOUNDATIONS */}
            {activeCategory === 'foundations' && (
                <div className="space-y-8 animate-fadeIn">
                    <PageSection title="Brand Colors (Primary)">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[50, 100, 300, 500, 600, 700, 900].map(step => (
                                <div key={step} className="space-y-2">
                                    <div className={`h-16 rounded-lg shadow-sm bg-primary-${step}`}></div>
                                    <div className="text-xs font-mono text-slate-500">primary-{step}</div>
                                </div>
                            ))}
                        </div>
                    </PageSection>

                    <PageSection title="AI Brand Colors">
                         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[50, 100, 300, 500, 600, 700, 900].map(step => (
                                <div key={step} className="space-y-2">
                                    <div className={`h-16 rounded-lg shadow-sm bg-brand-ai-${step}`}></div>
                                    <div className="text-xs font-mono text-slate-500">brand-ai-{step}</div>
                                </div>
                            ))}
                        </div>
                    </PageSection>

                    <PageSection title="Typography (Inter)">
                        <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-200">
                            <h1 className="text-4xl font-bold text-slate-900">Heading 1 (4xl)</h1>
                            <h2 className="text-3xl font-bold text-slate-900">Heading 2 (3xl)</h2>
                            <h3 className="text-2xl font-semibold text-slate-900">Heading 3 (2xl)</h3>
                            <p className="text-base text-slate-600">Body text (base). Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <p className="text-sm text-slate-500">Caption text (sm). Used for secondary information.</p>
                        </div>
                    </PageSection>
                </div>
            )}

            {/* ATOMS */}
            {activeCategory === 'atoms' && (
                <div className="space-y-12 animate-fadeIn">
                    <PageSection title="Buttons" variant="card">
                        <div className="flex flex-wrap gap-4 items-center">
                            <Button>Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="danger">Danger</Button>
                            <div className="w-px h-8 bg-slate-200 mx-2"></div>
                            <Button size="sm">Small</Button>
                            <Button isLoading>Loading</Button>
                        </div>
                    </PageSection>

                    <PageSection title="Inputs" variant="card">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Email Address" placeholder="alex@example.com" />
                            <Input label="Search" leftIcon={<Search size={16}/>} placeholder="Filter items..." />
                            <Input label="With Error" error="Invalid input detected" defaultValue="Wrong Value" />
                            <Input label="Read Only" readOnly defaultValue="System Generated ID" />
                        </div>
                    </PageSection>

                    <PageSection title="Badges" variant="card">
                        <div className="flex flex-wrap gap-4">
                            <Badge status="success" dot>Success</Badge>
                            <Badge status="warning">Warning</Badge>
                            <Badge status="error">Error</Badge>
                            <Badge status="info">Info</Badge>
                            <Badge status="neutral">Neutral</Badge>
                        </div>
                    </PageSection>
                </div>
            )}

            {/* MOLECULES */}
            {activeCategory === 'molecules' && (
                <div className="space-y-12 animate-fadeIn">
                    <PageSection title="List Items">
                        <Card className="max-w-md">
                            <ListItem 
                                title="Standard List Item" 
                                subtitle="With description text"
                                leftIcon={<FileText size={18}/>}
                            />
                            <ListItem 
                                title="Interactive Item" 
                                subtitle="Clickable row with hover state"
                                onClick={() => showToast('Clicked Item')}
                            />
                            <ListItem 
                                title="Complex Item" 
                                subtitle="With right-side status"
                                leftIcon={<AlertCircle size={18} className="text-orange-500"/>}
                                rightContent={<Badge status="warning">Review</Badge>}
                                isActive
                            />
                        </Card>
                    </PageSection>

                    <PageSection title="Cards">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader><CardTitle>Static Card</CardTitle></CardHeader>
                                <CardContent>Standard container for content spacing.</CardContent>
                                <CardFooter><Button size="sm" variant="secondary">Action</Button></CardFooter>
                            </Card>
                            <Card onClick={() => showToast('Card Clicked')} className="flex flex-col items-center justify-center text-center p-8">
                                <div className="p-3 bg-primary-50 text-primary-600 rounded-full mb-3">
                                    <Layers size={24}/>
                                </div>
                                <h3 className="font-semibold text-slate-900">Interactive Card</h3>
                                <p className="text-sm text-slate-500">Behaves like a large button</p>
                            </Card>
                        </div>
                    </PageSection>
                </div>
            )}

            {/* ORGANISMS */}
            {activeCategory === 'organisms' && (
                <div className="space-y-12 animate-fadeIn">
                     <PageSection title="Standard Chat Interface">
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4 max-w-lg mx-auto">
                            <AgentMsg message={{
                                id: '1', role: 'user', content: 'What is the status of the project?', timestamp: new Date()
                            }} />
                            <AgentMsg message={{
                                id: '2', role: 'assistant', content: 'The project is currently on track. No major risks identified.', timestamp: new Date()
                            }} />
                             <AgentMsg message={{
                                id: '3', role: 'assistant', content: 'Would you like to generate a report?', timestamp: new Date(),
                                actions: [{ label: 'Generate Report', actionId: 'gen', variant: 'primary' }, { label: 'View Timeline', actionId: 'view' }]
                            }} />
                        </div>
                    </PageSection>

                    <PageSection title="Rich Conversational UI (Widgets)" description="Showcasing mixed content types (Forms, Lists, Stats) within the chat stream.">
                        <div className="p-6 bg-slate-100 rounded-xl border border-slate-200 space-y-6 max-w-xl mx-auto h-[600px] overflow-y-auto">
                            
                            {/* Example 1: Information Widget */}
                            <AgentMsg 
                                message={{
                                    id: 'w1', role: 'assistant', content: 'Here is the current system health overview.', timestamp: new Date()
                                }} 
                                attachment={
                                    <Card className="bg-white border-slate-200 shadow-sm mt-2">
                                        <div className="grid grid-cols-2 gap-4 p-4">
                                            <div className="space-y-1">
                                                <div className="text-xs text-slate-500 flex items-center gap-1"><Activity size={12}/> CPU Usage</div>
                                                <div className="text-lg font-bold text-slate-900">42%</div>
                                                <div className="w-full bg-slate-100 h-1 rounded-full"><div className="bg-green-500 w-[42%] h-full rounded-full"></div></div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs text-slate-500 flex items-center gap-1"><Database size={12}/> Memory</div>
                                                <div className="text-lg font-bold text-slate-900">1.2GB</div>
                                                <div className="w-full bg-slate-100 h-1 rounded-full"><div className="bg-blue-500 w-[60%] h-full rounded-full"></div></div>
                                            </div>
                                        </div>
                                        <CardFooter className="py-2 px-4 bg-slate-50 border-t border-slate-100">
                                            <span className="text-[10px] text-slate-400">Updated 2m ago</span>
                                        </CardFooter>
                                    </Card>
                                }
                            />

                            {/* Example 2: Interactive List / Table */}
                            <AgentMsg 
                                message={{
                                    id: 'w2', role: 'assistant', content: 'I found 3 flights matching your criteria for **SFO to JFK**.', timestamp: new Date()
                                }} 
                                attachment={
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-2">
                                        <div className="divide-y divide-slate-100">
                                            {[
                                                { time: '08:00 AM', price: '$420', stops: 'Non-stop', airline: 'United' },
                                                { time: '10:30 AM', price: '$380', stops: '1 Stop', airline: 'Delta' },
                                                { time: '01:15 PM', price: '$450', stops: 'Non-stop', airline: 'Alaska' }
                                            ].map((flight, i) => (
                                                <div key={i} className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                                            <Plane size={14} />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-900 text-sm">{flight.time}</div>
                                                            <div className="text-xs text-slate-500">{flight.airline} • {flight.stops}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-slate-900">{flight.price}</div>
                                                        <Button size="sm" variant="secondary" className="h-6 text-xs px-2 opacity-0 group-hover:opacity-100 transition-opacity">Select</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-2 bg-slate-50 text-center border-t border-slate-100">
                                            <button className="text-xs font-medium text-blue-600 hover:underline">View 12 more flights</button>
                                        </div>
                                    </div>
                                }
                            />

                            {/* Example 3: Embedded Form */}
                            <AgentMsg 
                                message={{
                                    id: 'w3', role: 'assistant', content: 'Please verify your booking details to proceed.', timestamp: new Date()
                                }} 
                                attachment={
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-2 space-y-3">
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Passenger Info</span>
                                        </div>
                                        <Input label="Full Name" placeholder="e.g. John Doe" className="text-sm" />
                                        <Input label="Frequent Flyer #" placeholder="Optional" className="text-sm" />
                                        <div className="pt-2 flex gap-2">
                                            <Button className="w-full h-8 text-xs" onClick={() => showToast('Details Confirmed', {type: 'success'})}>Confirm Booking</Button>
                                            <Button variant="ghost" className="w-full h-8 text-xs text-slate-500">Edit</Button>
                                        </div>
                                    </div>
                                }
                            />

                        </div>
                    </PageSection>

                    <PageSection title="Feedback & Overlays" variant="card">
                        <div className="flex gap-4">
                            <Button onClick={() => showToast('Operation Successful', { type: 'success' })}>
                                Trigger Success Toast
                            </Button>
                            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                                Open Modal
                            </Button>
                        </div>
                    </PageSection>
                </div>
            )}

        </div>
      </div>

      {/* Modal Example */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        footer={<Button onClick={() => setIsModalOpen(false)}>Close</Button>}
      >
          <div className="text-slate-600">
              This is a standard modal dialog. It traps focus and handles scroll locking on the body.
          </div>
      </Modal>

    </div>
  );
};
