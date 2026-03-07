import apiClient from '../lib/axios';

export type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
};

type SendChatResponse = {
  id: number;
  reply: string;
  created_at: string;
};


export const getChatHistory = async (materialId: number): Promise<ChatMessage[]> => {
  const response = await apiClient.get('/student/ai/chat', {
    params: { material_id: materialId }
  });
  return response.data.data;
};

export const sendChatMessage = async (materialId: number, message: string): Promise<ChatMessage> => {
  const response = await apiClient.post('/student/ai/chat', {
    material_id: materialId,
    message: message
  });

  const data = response.data.data as SendChatResponse;
  
  return {
    id: data.id,
    role: 'assistant', 
    message: data.reply,
    created_at: data.created_at
  };
};