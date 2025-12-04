
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { PageLayout } from '../components/ui/PageLayout';
import { generateUIContent, enhanceText } from '../services/geminiService';
import { Wand2, Sparkles, Loader2, LayoutTemplate } from '../components/icons/Icons';

export const AiPlayground: React.FC = () => {
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generated Content State
  const [cardTitle, setCardTitle] = useState('Product Title');
  const [cardBody, setCardBody] = useState('This is a placeholder for product description. Use the AI tool above to generate realistic content.');
  const [buttonLabel, setButtonLabel] = useState('Call to Action');
  const [generatedCount, setGeneratedCount] = useState(0);

  const handleGenerate = async () => {
    if (!context) return;

    setIsGenerating(true);
    try {
      // Parallel requests for faster UX
      const [title, body, btn] = await Promise.all([
        generateUIContent('Card Title', context),
        generateUIContent('Product Description', context),
        generateUIContent('Button Label', context)
      ]);

      setCardTitle(title);
      setCardBody(body);
      setButtonLabel(btn);
      setGeneratedCount(c => c + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhance = async () => {
      setIsGenerating(true);
      try {
          const improvedBody = await enhanceText(cardBody);
          setCardBody(improvedBody);
      } finally {
          setIsGenerating(false);
      }
  }

  return (
    <PageLayout
        title="ContextUI Studio"
        description="Test design system components with dynamic AI content"
        badge={<Badge status="neutral">Dev Tool</Badge>}
    >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-8">
            <div className="md:col-span-3">
                <Input 
                label="Context / Topic" 
                placeholder="e.g., A luxury coffee subscription service, or a SaaS dashboard for analytics"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                autoFocus
                />
            </div>
            <Button 
                onClick={handleGenerate} 
                disabled={!context || isGenerating}
                isLoading={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700"
                rightIcon={<Wand2 size={16} />}
            >
                Generate UI
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Visual Preview</h3>
                    <Badge status={generatedCount > 0 ? "success" : "neutral"} dot>
                        {generatedCount > 0 ? "Content Generated" : "Static Content"}
                    </Badge>
                </div>
                
                {/* The Component Being Tested */}
                <Card className="shadow-lg transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1">
                    <div className="h-48 bg-slate-100 relative overflow-hidden group">
                    {/* Placeholder Image Pattern */}
                    <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div className="absolute top-4 right-4">
                        <Badge status="info" className="bg-white/90 backdrop-blur">New</Badge>
                    </div>
                    </div>
                    <CardHeader>
                        <CardTitle>{cardTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-600 leading-relaxed">
                            {cardBody}
                        </p>
                    </CardContent>
                    <CardFooter className="flex gap-3">
                        <Button className="flex-1" variant="primary">{buttonLabel}</Button>
                        <Button variant="secondary">Details</Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Code & Props</h3>
            <Card className="bg-slate-900 text-slate-200 border-none shadow-inner">
                <CardContent className="space-y-4 text-sm font-mono p-6">
                    <div className="opacity-70 text-xs mb-2">// Dynamically generated props</div>
                    <div>
                        <span className="text-purple-400">const</span> <span className="text-blue-400">props</span> = {'{'}
                        <div className="pl-4">
                            <span className="text-sky-300">title</span>: <span className="text-orange-300">"{cardTitle}"</span>,
                        </div>
                        <div className="pl-4">
                            <span className="text-sky-300">body</span>: <span className="text-orange-300">"{cardBody.substring(0, 40)}..."</span>,
                        </div>
                        <div className="pl-4">
                            <span className="text-sky-300">action</span>: <span className="text-orange-300">"{buttonLabel}"</span>
                        </div>
                        {'}'};
                    </div>
                    
                    <div className="pt-4 border-t border-slate-700/50 mt-4">
                        <Button size="sm" variant="secondary" onClick={handleEnhance} disabled={isGenerating} leftIcon={<Sparkles size={14}/>} className="w-full bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white">
                            Enhance Text with AI
                        </Button>
                    </div>
                </CardContent>
            </Card>
            </div>

        </div>
    </PageLayout>
  );
};
