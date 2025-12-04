import React, { useState } from 'react';
import { User, AuthView } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { PageHeader } from '../../components/ui/PageHeader';
import { updateProfile, logout } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';
import { Users, ShieldCheck, Settings, LogOut } from '../../components/icons/Icons';
import { cn } from '../../utils';

interface ProfilePageProps {
    user: User;
    onUpdateUser: (user: User) => void;
    onNavigate: (view: AuthView) => void;
    onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, onNavigate, onLogout }) => {
    const [activeTab, setActiveTab] = useState<'general' | 'security' | 'preferences'>('general');
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    // Form States
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            const updated = await updateProfile({ name, email });
            onUpdateUser(updated);
            showToast('Profile updated successfully', { type: 'success' });
        } catch (e) {
            showToast('Failed to update profile', { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        onLogout();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <PageHeader 
                title="Account Settings" 
                onBack={() => {
                    // Logic to go back to previous screen or launcher
                    // Since this is a full page, we'll navigate to launcher via props or just let parent handle unmount
                    // For now, assume parent handles back navigation if we provided a back button, 
                    // but standard is to just use the Layout header. 
                    // We'll override this behavior in App.tsx typically.
                }}
            >
                <Button variant="danger" size="sm" onClick={handleLogout} leftIcon={<LogOut size={16}/>}>
                    Sign Out
                </Button>
            </PageHeader>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* Sidebar */}
                    <div className="space-y-1">
                        <button 
                            onClick={() => setActiveTab('general')}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-3",
                                activeTab === 'general' ? "bg-white text-primary-700 shadow-sm" : "text-slate-600 hover:bg-slate-100"
                            )}
                        >
                            <Users size={16}/> General
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-3",
                                activeTab === 'security' ? "bg-white text-primary-700 shadow-sm" : "text-slate-600 hover:bg-slate-100"
                            )}
                        >
                            <ShieldCheck size={16}/> Security
                        </button>
                        <button 
                            onClick={() => setActiveTab('preferences')}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-3",
                                activeTab === 'preferences' ? "bg-white text-primary-700 shadow-sm" : "text-slate-600 hover:bg-slate-100"
                            )}
                        >
                            <Settings size={16}/> Preferences
                        </button>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3 space-y-6">
                        
                        {activeTab === 'general' && (
                            <Card className="animate-fadeIn">
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <Avatar name={user.name} size="xl" className="shadow-md" />
                                        <div className="space-y-2">
                                            <Button variant="secondary" size="sm">Change Avatar</Button>
                                            <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
                                        <Input label="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center bg-slate-50">
                                    <span className="text-xs text-slate-500">Member since {new Date(user.joinedAt).toLocaleDateString()}</span>
                                    <Button onClick={handleSaveProfile} isLoading={isLoading}>Save Changes</Button>
                                </CardFooter>
                            </Card>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-fadeIn">
                                <Card>
                                    <CardHeader><CardTitle>Password</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <Input label="Current Password" type="password" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="New Password" type="password" />
                                            <Input label="Confirm New Password" type="password" />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-end bg-slate-50">
                                        <Button variant="secondary">Update Password</Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <Card className="animate-fadeIn">
                                <CardHeader><CardTitle>App Preferences</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-900">Email Notifications</h4>
                                            <p className="text-xs text-slate-500">Receive weekly digests and alerts.</p>
                                        </div>
                                        <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-primary-600 rounded-full cursor-pointer border-2 border-transparent">
                                            <span className="translate-x-4 inline-block w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ease-in-out"></span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-900">Dark Mode</h4>
                                            <p className="text-xs text-slate-500">Use system theme or force dark mode.</p>
                                        </div>
                                        <select className="text-sm border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                                            <option>System Default</option>
                                            <option>Light</option>
                                            <option>Dark</option>
                                        </select>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};