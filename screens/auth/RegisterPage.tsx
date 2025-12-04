import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { register } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';
import { Network, ArrowRight, ShieldCheck } from '../../components/icons/Icons';
import { User, AuthView } from '../../types';

interface RegisterPageProps {
    onLoginSuccess: (user: User) => void;
    onNavigate: (view: AuthView) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onLoginSuccess, onNavigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) return;

        setIsLoading(true);
        try {
            const user = await register(name, email, password);
            showToast('Account created successfully!', { type: 'success' });
            onLoginSuccess(user);
        } catch (error) {
            showToast('Registration failed', { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
            <div className="w-full max-w-md space-y-8 animate-fadeIn">
                
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-slate-900 shadow-sm border border-slate-200 mb-6">
                        <Network size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h1>
                    <p className="mt-2 text-slate-500">Start building your knowledge graph today</p>
                </div>

                <Card className="p-8 shadow-xl border-0">
                    <form onSubmit={handleSubmit} className="space-y-5">
                         <Input 
                            label="Full Name" 
                            placeholder="Alex Johnson" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                        <Input 
                            label="Email address" 
                            type="email" 
                            placeholder="name@company.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="space-y-1">
                            <Input 
                                label="Password" 
                                type="password" 
                                placeholder="Create a strong password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                             <p className="text-xs text-slate-500">Must be at least 8 characters</p>
                        </div>

                        <div className="pt-2">
                             <Button 
                                type="submit" 
                                className="w-full h-11 text-base shadow-md" 
                                isLoading={isLoading}
                                rightIcon={<ArrowRight size={16}/>}
                            >
                                Create Account
                            </Button>
                        </div>
                    </form>
                </Card>

                <p className="text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <button 
                        onClick={() => onNavigate('login')}
                        className="font-semibold text-primary-600 hover:text-primary-500 hover:underline"
                    >
                        Sign in
                    </button>
                </p>

                <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2 mt-4">
                     <ShieldCheck size={14} /> Secured by Elori Identity
                </div>
            </div>
        </div>
    );
};