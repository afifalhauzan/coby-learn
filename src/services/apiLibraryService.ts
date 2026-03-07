import apiClient from '../lib/axios';
import type { Folder } from '../types/folder.types';

type FrontEndFolderData = {
  name: string;
  iconColor: string;
};

type BackEndPackagePostData = {
  title: string;
  color_icon: string;
};

type BackEndPackageGetResponse = {
  id: number;
  title: string;
  colorIcon: string;
  user_id: number;
  material_count: number;
  created_at: string;
};

export type PackageDetail = {
  id: number;
  title: string;
  iconColor: string;
  materials: {
    id: number;
    packageId: number;
    title: string;
    type: 'youtube' | 'pdf' | 'text' | 'quiz';
    sourceUrl?: string;
    summary?: string;
    createdAt: string;
  }[];
};

export type StudyMaterial = {
  id: number;
  packageId: number;
  title: string;
  type: 'youtube' | 'pdf' | 'text' | 'quiz';
  sourceUrl?: string;
  summary?: string;
  packageTitle?: string;
  createdAt: string;
};

export type MaterialDetail = {
  id: number;
  title: string;
  type: 'pdf' | 'youtube' | 'text' | 'quiz';
  source: string;
  summary: string;
  packageTitle?: string;
  createdAt: string;
  isPublic: boolean;
};

export type CreateMaterialPayload = {
  packageId: number | string;
  title: string;
  type: 'pdf' | 'youtube' | 'text';
  file?: File;
  url?: string;
  content?: string;
};

export type QuizOption = {
  key: string;
  value: string;
};

export type QuizQuestion = {
  id: number;
  pertanyaan: string;
  pilihan: QuizOption[];
  jawaban_benar: string;
};

export type GenerateQuizPayload = {
  material_id: number;
  question_count: number;
};

export type GenerateQuizResponse = {
  id: number;
  material_id: number;
  questions: QuizQuestion[];
};

export type QuizSummary = {
  id: number;
  created_at: string;
  question_count: number;
  score: number | null;
};

export type QuizAnswerItem = {
  question_id: number;
  user_answer: string;
};

export type SubmitQuizPayload = {
  answers: QuizAnswerItem[];
};

export type SubmitQuizResponse = {
  attempt_id: number;
  score: number;
  correct: number;
  wrong: number;
};

export type QuizResultQuestion = {
  id: number;
  pertanyaan: string;
  pilihan: { key: string; value: string }[];
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
};

export type QuizResultDetail = {
  id: number;
  quiz_id: number;
  score: number;
  created_at: string;
  questions: QuizResultQuestion[];
};

export type FlashcardItem = {
  front: string;
  back: string;
};

export type GenerateFlashcardPayload = {
  material_id: number;
};

export type GenerateFlashcardResponse = {
  material_id: number;
  flashcards: FlashcardItem[];
};

export type DailyQuizOptionObj = {
  key: string;
  value: string;
};

export type DailyQuizQuestion = {
  id: number;
  pertanyaan: string;
  pilihan: DailyQuizOptionObj[];
  jawaban_benar: string;
};

export type DailyQuizResponse = {
  questions: DailyQuizQuestion[];
  is_done: boolean;
};

export type DailyQuizStatus = {
  is_done: boolean;
  streak: number;
  username: string;
};


export const getFolders = async (): Promise<Folder[]> => {
  const response = await apiClient.get('/student/packages');
  const apiData = (response.data.data || []) as BackEndPackageGetResponse[];

  return apiData.map(beFolder => ({
    id: beFolder.id,
    name: beFolder.title,
    iconColor: beFolder.colorIcon,
    createdAt: beFolder.created_at,
    material_count: beFolder.material_count,
    fileCount: 0
  }));
};

export const createFolder = async (data: FrontEndFolderData): Promise<Folder> => {
  const apiData: BackEndPackagePostData = {
    title: data.name,
    color_icon: data.iconColor
  };
  const response = await apiClient.post('/student/packages', apiData);
  return response.data;
};

export const updateFolder = async (folderId: number, data: FrontEndFolderData): Promise<Folder> => {
  const apiData: BackEndPackagePostData = {
    title: data.name,
    color_icon: data.iconColor
  };
  const response = await apiClient.put(`/student/packages/${folderId}`, apiData);
  return response.data;
};

export const deleteFolder = async (folderId: number): Promise<void> => {
  await apiClient.delete(`/student/packages/${folderId}`);
};

export const getPackageDetails = async (packageId: string | number): Promise<PackageDetail> => {
  const response = await apiClient.get(`/student/packages/${packageId}`);
  const apiData = response.data.data;

  return {
    id: apiData.id,
    title: apiData.title,
    iconColor: apiData.colorIcon,
    materials: (apiData.materials || []).map((m: any) => ({
      id: m.id,
      packageId: apiData.id,
      title: m.title,
      type: m.source_type,
      sourceUrl: m.source || '',
      summary: m.summary || '',
      createdAt: m.created_at
        ? new Date(m.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : '-'
    }))
  };
};


export const createMaterial = async (data: CreateMaterialPayload): Promise<any> => {
  if (data.type === 'youtube') {
    const payload = {
      package_id: Number(data.packageId),
      title: data.title,
      url: data.url
    };
    const response = await apiClient.post('/student/materials/youtube', payload);
    return response.data.data;
  }
  else if (data.type === 'pdf') {
    const formData = new FormData();
    formData.append('package_id', data.packageId.toString());
    formData.append('title', data.title);
    if (data.file) formData.append('file', data.file);

    const response = await apiClient.post('/student/materials/pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }
  else if (data.type === 'text') {
    const payload = {
      package_id: Number(data.packageId),
      title: data.title,
      content: data.content
    };
    const response = await apiClient.post('/student/materials/text', payload);
    return response.data.data;
  }
};

export const getMaterialDetail = async (materialId: string | number): Promise<MaterialDetail> => {
  const response = await apiClient.get(`/student/materials/${materialId}`);
  const apiData = response.data.data;
  return {
    id: apiData.id,
    title: apiData.title,
    type: apiData.source_type,
    source: apiData.source,
    summary: apiData.summary,
    packageTitle: apiData.package_title,
    isPublic: apiData.is_public,
    createdAt: apiData.created_at
      ? new Date(apiData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      : '-'
  };
};

export const updateMaterial = async (materialId: number, title: string, packageId: number): Promise<any> => {
  const payload = { title, package_id: packageId };
  const response = await apiClient.put(`/student/materials/${materialId}`, payload);
  return response.data;
};

export const deleteMaterial = async (materialId: number): Promise<void> => {
  await apiClient.delete(`/student/materials/${materialId}`);
};


export const getMaterialQuizzes = async (materialId: string | number): Promise<QuizSummary[]> => {
  const response = await apiClient.get(`/student/materials/${materialId}/quizzes`);
  return response.data.data;
};

export const generateQuiz = async (data: GenerateQuizPayload): Promise<GenerateQuizResponse> => {
  const response = await apiClient.post('/student/ai/quiz', data);
  return response.data.data;
};

export const submitQuiz = async ({ quizId, data }: { quizId: string | number, data: SubmitQuizPayload }): Promise<SubmitQuizResponse> => {
  const response = await apiClient.post(`/student/quizzes/${quizId}/submit`, data);
  return response.data.data;
};

export const getQuizResultDetail = async (quizId: string | number): Promise<QuizResultDetail> => {
  // Endpoint: GET /student/quizzes/results/:id (where :id is the Quiz ID)
  console.log(`Fetching quiz result for Quiz ID: ${quizId}`);
  const response = await apiClient.get(`/student/quizzes/results/${quizId}`);
  return response.data.data;
};

export const generateFlashcards = async (data: GenerateFlashcardPayload): Promise<GenerateFlashcardResponse> => {
  const response = await apiClient.post('/student/ai/flashcards', data);
  return response.data.data;
};


export type DailyQuizPayload =
  | { mode: 'random' }
  | { mode: 'topic'; topic: string };

export const getDailyQuiz = async (payload: DailyQuizPayload): Promise<DailyQuizResponse> => {
  const response = await apiClient.post('/student/daily-quiz', payload);
  return response.data.data;
};

export const claimDailyQuiz = async (score: number): Promise<any> => {
  const response = await apiClient.post('/student/daily-quiz/claim', { score });
  return response.data;
};

export const getDailyQuizStatus = async (): Promise<DailyQuizStatus> => {
  const response = await apiClient.get('/student/daily-quiz/status');
  return response.data.data;
};