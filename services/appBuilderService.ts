

import { ViewSpec, ChartSpec, TableSpec, DashboardSpec, SmartFormSpec, InsightCardSpec, ObjectCardSpec } from '../types';
import { generateId } from '../utils';

// --- Mock Data ---

const TRANSACTIONS_DATA = [
    { id: '1', date: '2023-09-01', merchant: 'Woolworths', amount: 120, category: 'Groceries' },
    { id: '2', date: '2023-09-05', merchant: 'Shell', amount: 65, category: 'Transport' },
    { id: '3', date: '2023-09-12', merchant: 'Uber Eats', amount: 45, category: 'Dining' },
    { id: '4', date: '2023-09-15', merchant: 'Netflix', amount: 16, category: 'Entertainment' },
    { id: '5', date: '2023-09-18', merchant: 'Woolworths', amount: 85, category: 'Groceries' },
    { id: '6', date: '2023-09-20', merchant: 'Origin Energy', amount: 240, category: 'Utilities' },
    { id: '7', date: '2023-10-02', merchant: 'Bunnings', amount: 150, category: 'Home' },
    { id: '8', date: '2023-10-05', merchant: 'Grilld', amount: 55, category: 'Dining' },
    { id: '9', date: '2023-10-10', merchant: 'Spotify', amount: 12, category: 'Entertainment' },
    { id: '10', date: '2023-10-15', merchant: 'Ampol', amount: 78, category: 'Transport' },
];

const CHART_DATA = [
    { month: 'Jan', spend: 3200, budget: 3000 },
    { month: 'Feb', spend: 2800, budget: 3000 },
    { month: 'Mar', spend: 3500, budget: 3000 },
    { month: 'Apr', spend: 3100, budget: 3000 },
    { month: 'May', spend: 2900, budget: 3000 },
    { month: 'Jun', spend: 4100, budget: 3000 },
];

// --- Generation Logic ---

export const generateInitialDashboard = async (): Promise<DashboardSpec> => {
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        id: generateId(),
        type: 'dashboard',
        title: 'Morning Brief',
        layout: 'grid',
        description: 'Context-aware summary based on recent activity.',
        components: [
            {
                id: 'init-1',
                type: 'insight_card',
                title: 'System Alert',
                summary: '3 redundant SaaS subscriptions detected. Potential savings: $120/mo.',
                confidence: 0.95,
                trend: 'down',
                value: '-$120',
                actions: ['View Subscriptions', 'Auto-Cancel']
            } as InsightCardSpec,
            {
                id: 'init-2',
                type: 'insight_card',
                title: 'Cashflow Forecast',
                summary: 'Projected surplus for October is on track to hit $2,400.',
                confidence: 0.88,
                trend: 'up',
                value: '$2.4k',
                actions: ['Move to Savings']
            } as InsightCardSpec,
        ]
    } as DashboardSpec;
};

export const generateViewFromIntent = async (intent: string): Promise<ViewSpec> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerIntent = intent.toLowerCase();

    // SCENARIO 1: Spending / Dashboard
    if (lowerIntent.includes('spend') || lowerIntent.includes('budget') || lowerIntent.includes('habits')) {
        return {
            id: generateId(),
            type: 'dashboard',
            title: 'Spending Analysis',
            layout: 'grid',
            components: [
                {
                    id: generateId(),
                    type: 'insight_card',
                    title: 'Spending Trend',
                    summary: 'Your spending is up 18% compared to the same period last year.',
                    confidence: 0.92,
                    trend: 'up',
                    value: '+18%',
                    actions: ['Analyze Breakdown', 'Set Budget']
                } as InsightCardSpec,
                {
                    id: generateId(),
                    type: 'bar_chart',
                    title: 'Monthly Spend vs Budget',
                    data_source: 'transactions',
                    x_axis: 'month',
                    y_axis: 'spend',
                    series: ['spend', 'budget'],
                    data: CHART_DATA
                } as ChartSpec,
                {
                    id: generateId(),
                    type: 'table',
                    title: 'Recent Transactions',
                    data_source: 'transactions',
                    columns: [
                        { key: 'date', label: 'Date', type: 'date' },
                        { key: 'merchant', label: 'Merchant', type: 'text' },
                        { key: 'category', label: 'Category', type: 'badge' },
                        { key: 'amount', label: 'Amount', type: 'currency' }
                    ],
                    data: TRANSACTIONS_DATA
                } as TableSpec
            ]
        } as DashboardSpec;
    }

    // SCENARIO 2: Loan / Form
    if (lowerIntent.includes('loan') || lowerIntent.includes('apply') || lowerIntent.includes('form')) {
        return {
            id: generateId(),
            type: 'dashboard',
            title: 'Loan Application Context',
            layout: 'grid',
            components: [
                {
                    id: generateId(),
                    type: 'form',
                    title: 'Home Loan Pre-Assessment',
                    description: 'AI-generated form based on your financial profile context.',
                    submitLabel: 'Check Eligibility',
                    fields: [
                        { id: 'f1', label: 'Annual Income (Pre-tax)', type: 'currency', required: true, placeholder: '$0.00' },
                        { id: 'f2', label: 'Desired Loan Amount', type: 'currency', required: true, placeholder: '$500,000' },
                        { id: 'f3', label: 'Property Type', type: 'select', required: true },
                        { id: 'f4', label: 'Purpose', type: 'textarea', required: false, placeholder: 'e.g. Investment property in Melbourne...' }
                    ]
                } as SmartFormSpec,
                {
                    id: generateId(),
                    type: 'insight_card',
                    title: 'Borrowing Power',
                    summary: 'Based on current assets, you can likely borrow up to $850k.',
                    confidence: 0.90,
                    value: '$850k',
                    trend: 'neutral'
                } as InsightCardSpec
            ]
        } as DashboardSpec;
    }

    // SCENARIO 3: Merchant / Object
    if (lowerIntent.includes('merchant') || lowerIntent.includes('woolworths') || lowerIntent.includes('uber')) {
        return {
            id: generateId(),
            type: 'dashboard', 
            layout: 'grid',
            title: 'Merchant Context',
            components: [
                {
                    id: generateId(),
                    type: 'object_card',
                    title: 'Merchant Profile',
                    entityType: 'Merchant',
                    data: {
                        name: 'Woolworths Supermarkets',
                        category: 'Groceries',
                        avgSpend: '$95.40',
                        frequency: 'Weekly',
                        lastVisit: '2 days ago',
                        riskScore: 'Low'
                    },
                    actions: ['View Receipts', 'Block Merchant', 'Report Issue']
                } as ObjectCardSpec
            ]
        } as DashboardSpec;
    }

    // DEFAULT: Simple Table
    return {
        id: generateId(),
        type: 'dashboard',
        title: 'Data View',
        layout: 'grid',
        components: [
            {
                id: generateId(),
                type: 'table',
                title: 'Data View',
                data_source: 'generic',
                columns: [
                    { key: 'item', label: 'Item', type: 'text' },
                    { key: 'value', label: 'Value', type: 'text' }
                ],
                data: [
                    { item: 'Query', value: intent },
                    { item: 'Status', value: 'Processed' },
                    { item: 'Mode', value: 'Demo' }
                ]
            } as TableSpec
        ]
    } as DashboardSpec;
};

export const updateSpecFromPrompt = async (currentSpec: ViewSpec, prompt: string): Promise<ViewSpec> => {
     // Simulate modification
     await new Promise(resolve => setTimeout(resolve, 1000));
     
     // For demo, we just clone and change title or layout, 
     // or return a totally new one if intent is strong enough.
     
     const newSpec = JSON.parse(JSON.stringify(currentSpec));
     newSpec.description = `Updated based on: "${prompt}"`;
     
     if (prompt.includes("grid")) {
         if (newSpec.type === 'dashboard') newSpec.layout = 'grid';
     } else if (prompt.includes("stack")) {
         if (newSpec.type === 'dashboard') newSpec.layout = 'stack';
     }

     return newSpec;
}
