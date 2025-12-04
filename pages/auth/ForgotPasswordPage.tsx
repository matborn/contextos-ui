import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { requestPasswordReset } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';
import { ChevronLeft, MessageSquare } from '../../components/icons/Icons';
import { AuthView } from '../../types';

interface ForgotPasswordPageProps {
    onNavigate: (view: AuthView) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await requestPasswordReset(email);
            setIsSubmitted(true);
            showToast('Reset link sent', { type: 'success' });
        } catch (error) {
            showToast('Error sending email', { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
            <div className="w-full max-w-md space-y-8 animate-fadeIn">
                
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reset password</h1>
                    <p className="mt-2 text-slate-500">We'll send you instructions to reset your password.</p>
                </div>

                <Card className="p-8 shadow-xl border-0">
                    {isSubmitted ? (
                        <div className="text-center space-y-6">
                             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <MessageSquare size={32} />
                             </div>
                             <div className="space-y-2">
                                 <h3 className="font-semibold text-slate-900">Check your email</h3>
                                 <p className="text-sm text-slate-500">
                                     We have sent a password reset link to <span className="font-medium text-slate-900">{email}</span>.
                                 </p>
                             </div>
                             <Button 
                                onClick={() => onNavigate('login')}
                                className="w-full"
                                variant="outline"
                            >
                                Back to Sign in
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input 
                                label="Email address" 
                                type="email" 
                                placeholder="name@company.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                            />

                            <Button 
                                type="submit" 
                                className="w-full h-11" 
                                isLoading={isLoading}
                            >
                                Send Reset Link
                            </Button>
                        </form>
                    )}
                </Card>

                <div className="text-center">
                    <button 
                        onClick={() => onNavigate('login')}
                        className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center justify-center gap-2 mx-auto"
                    >
                        <ChevronLeft size={16} /> Back to Sign in
                    </button>
                </div>
            </div>
        </div>
    );
};