import { User } from "../types";

// Mock database
const MOCK_USER: User = {
    id: 'u-123456',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: undefined, // Will default to initials
    role: 'admin',
    joinedAt: new Date('2023-11-15'),
    preferences: {
        theme: 'system',
        notifications: true
    }
};

export const login = async (email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, validation would happen here
    if (email === 'fail@test.com') {
        throw new Error('Invalid credentials');
    }
    
    return MOCK_USER;
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        ...MOCK_USER,
        name,
        email,
        joinedAt: new Date()
    };
};

export const logout = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Clear tokens/session
};

export const updateProfile = async (updates: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...MOCK_USER, ...updates };
};

export const requestPasswordReset = async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate sending email
};