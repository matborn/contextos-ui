import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { login } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';
import { Network, ShieldCheck } from '../../components/icons/Icons';
import { User, AuthView } from '../../types';

interface LoginPageProps {
    onLoginSuccess: (user: User) => void;
    onNavigate: (view: AuthView) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setIsLoading(true);
        try {
            const user = await login(email, password);
            showToast('Welcome back!', { type: 'success' });
            onLoginSuccess(user);
        } catch (error) {
            showToast('Invalid email or password', { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            // Mock social login success
            login('alex@example.com', 'mock').then(user => {
                showToast('Signed in with Google', { type: 'success' });
                onLoginSuccess(user);
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
            <div className="w-full max-w-md space-y-8 animate-fadeIn">
                
                {/* Logo & Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 text-white shadow-lg mb-6">
                        <Network size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
                    <p className="mt-2 text-slate-500">Sign in to the Elori Platform</p>
                </div>

                <Card className="p-8 shadow-xl border-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <Input 
                                label="Email address" 
                                type="email" 
                                placeholder="name@company.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                            />
                            <div>
                                <Input 
                                    label="Password" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="flex justify-end mt-1">
                                    <button 
                                        type="button"
                                        onClick={() => onNavigate('forgot-password')}
                                        className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-11 text-base shadow-md" 
                            isLoading={isLoading}
                        >
                            Sign in
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">Or continue with</span></div>
                        </div>

                        <Button 
                            type="button" 
                            variant="secondary" 
                            className="w-full h-11" 
                            onClick={handleSocialLogin}
                            isLoading={isLoading}
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Google
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-slate-600">
                    Don't have an account?{' '}
                    <button 
                        onClick={() => onNavigate('register')}
                        className="font-semibold text-primary-600 hover:text-primary-500 hover:underline"
                    >
                        Create one now
                    </button>
                </p>

                <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                     <ShieldCheck size={14} /> Secured by Elori Identity
                </div>
            </div>
        </div>
    );
};