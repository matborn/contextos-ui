
import { FinancialSnapshot, LifeScenario } from "../types";

export const fetchFinancialSnapshot = async (): Promise<FinancialSnapshot> => {
    // Simulate API
    await new Promise(r => setTimeout(r, 600));

    return {
        netWorth: 1250000,
        cashflow: 2450, // Monthly surplus
        freedomDate: 2042,
        freedomProgress: 42,
        assets: [
            { id: '1', name: 'Family Home', type: 'property', value: 850000, currency: 'AUD', growthRate: 5 },
            { id: '2', name: 'Superannuation', type: 'super', value: 320000, currency: 'AUD', growthRate: 7 },
            { id: '3', name: 'Vanguard ETFs', type: 'share', value: 150000, currency: 'AUD', growthRate: 8 },
            { id: '4', name: 'Offset Account', type: 'cash', value: 45000, currency: 'AUD', growthRate: 4 },
            { id: '5', name: 'Home Loan', type: 'loan', value: -480000, currency: 'AUD' },
        ]
    };
};

export const fetchScenarios = async (): Promise<LifeScenario[]> => {
    return [
        {
            id: 's1',
            title: 'Upsize Home',
            description: 'Sell current home and buy a $1.2M property in 2026.',
            impact: { netWorth: -150000, freedomYearDelta: 4, monthlyCashflow: -800 },
            isActive: false
        },
        {
            id: 's2',
            title: 'Sabbatical 2025',
            description: 'Take 6 months off work to travel Europe.',
            impact: { netWorth: -45000, freedomYearDelta: 1, monthlyCashflow: -5000 },
            isActive: false
        },
        {
            id: 's3',
            title: 'Semi-Retirement',
            description: 'Reduce work to 3 days/week starting age 50.',
            impact: { netWorth: -400000, freedomYearDelta: 5, monthlyCashflow: -1200 },
            isActive: false
        }
    ];
};
