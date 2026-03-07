import apiClient from '../lib/axios';

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    role: string;
    current_streak: number;
    created_at: string;
}

export type UpdateProfileData = {
    username?: string;
    email?: string;
};

export const getProfile = async (): Promise<UserProfile> => {
    const response = await apiClient.get('/users/me');
    return response.data.data;
};

export const updateProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
    const response = await apiClient.put('/users/me', data);
    return response.data.data;
};
