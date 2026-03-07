import apiClient from '../lib/axios';

export type RegisterData = {
  role: 'siswa' | 'pembimbing';
  username: string;
  email: string;
  password: string;
  password_confirm: string;
};

type RegisterResponse = {
  userId: string;
  email: string;
  message: string;
};

export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export type LoginData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  userId: string;
  email: string;
  token: string;
};


export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', data);

  return response.data.data;
};

export const logoutUser = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};



export const forgotPassword = async (email: string): Promise<any> => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

export type ResetPasswordData = {
  token: string;
  password: string;
  password_confirm: string;
};

export const resetPassword = async (data: ResetPasswordData): Promise<any> => {
  const response = await apiClient.post('/auth/reset-password', data);
  return response.data;
};

export const resendVerification = async (email: string): Promise<any> => {
  const response = await apiClient.post('/auth/resend-verification', { email });
  return response.data;
};
