import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageLayout } from '../components/ui/PageLayout';
import { Avatar } from '../components/ui/Avatar';
import { Users, Plus, MessageSquare } from '../components/icons/Icons';

export const Team: React.FC = () => {
  const members = [
    { id: 1, name: 'Alex Johnson', role: 'Product Lead', email: 'alex@lumina.so', status: 'active', avatar: undefined },
    { id: 2, name: 'Sarah Chen', role: 'CTO', email: 'sarah@lumina.so', status: 'active', avatar: undefined },
    { id: 3, name: 'Mike Ross', role: 'Engineering Lead', email: 'mike@lumina.so', status: 'away', avatar: undefined },
    { id: 4, name: 'Jessica Pearson', role: 'Legal Counsel', email: 'jessica@lumina.so', status: 'active', avatar: undefined },
    { id: 5, name: 'System Bot', role: 'ContextOS', email: 'bot@lumina.so', status: 'active', avatar: 'AI' }, // Mocking AI as a name initial hack for now or image
  ];

  return (
    <PageLayout
        title="Project Titan Team"
        description="Manage access and roles for this workspace."
    >
        <Button leftIcon={<Plus size={16} />}>Invite Member</Button>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(member => (
                <Card key={member.id} className="p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="mb-4">
                        <Avatar 
                            name={member.name} 
                            size="lg" 
                            status={member.status as 'active' | 'away'} 
                            className={member.name === 'System Bot' ? 'bg-purple-100 text-purple-600 from-purple-100 to-purple-200' : ''}
                        />
                    </div>
                    
                    <h3 className="font-semibold text-slate-900">{member.name}</h3>
                    <p className="text-sm text-slate-500 mb-2">{member.role}</p>
                    <p className="text-xs text-slate-400 mb-4">{member.email}</p>

                    <div className="flex items-center gap-2 w-full mt-auto">
                        <Button variant="secondary" size="sm" className="flex-1">Profile</Button>
                        <Button variant="ghost" size="sm" className="px-2 text-slate-400 hover:text-blue-600">
                            <MessageSquare size={16} />
                        </Button>
                    </div>
                </Card>
            ))}
            
            {/* Invite Card Placeholder */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 text-slate-400 group-hover:text-blue-600 transition-colors">
                    <Plus size={24} />
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">Add Team Member</h3>
                <p className="text-sm text-slate-500 mt-1">Invite via email or link</p>
            </div>
        </div>

        {/* Roles Section */}
        <div className="pt-8 border-t border-slate-200">
             <h2 className="text-lg font-semibold text-slate-900 mb-4">DACI Framework Roles</h2>
             <Card className="divide-y divide-slate-100">
                 <div className="p-4 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">D</div>
                     <div className="flex-1">
                         <h4 className="text-sm font-semibold text-slate-900">Driver</h4>
                         <p className="text-xs text-slate-500">Alex Johnson</p>
                     </div>
                     <Button size="sm" variant="ghost">Edit</Button>
                 </div>
                 <div className="p-4 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center font-bold">A</div>
                     <div className="flex-1">
                         <h4 className="text-sm font-semibold text-slate-900">Approver</h4>
                         <p className="text-xs text-slate-500">Sarah Chen</p>
                     </div>
                     <Button size="sm" variant="ghost">Edit</Button>
                 </div>
                 <div className="p-4 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold">C</div>
                     <div className="flex-1">
                         <h4 className="text-sm font-semibold text-slate-900">Contributors</h4>
                         <p className="text-xs text-slate-500">Engineering Team, Legal Team</p>
                     </div>
                     <Button size="sm" variant="ghost">Edit</Button>
                 </div>
                 <div className="p-4 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold">I</div>
                     <div className="flex-1">
                         <h4 className="text-sm font-semibold text-slate-900">Informed</h4>
                         <p className="text-xs text-slate-500">Sales, Support</p>
                     </div>
                     <Button size="sm" variant="ghost">Edit</Button>
                 </div>
             </Card>
        </div>
    </PageLayout>
  );
};