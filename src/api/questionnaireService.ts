import apiClient from './apiClient';

export interface Questionnaire {
  id?: number;
  titre: string;
  ageMin: number;
  ageMax: number;
  dateCreation?: string;
}

export interface AIResponse {
  niveau: string;
  score: string;
  contenuIA: string;
  statut: string;
}

export const questionnaireService = {

  getAll: async (): Promise<Questionnaire[]> => {
    const res = await apiClient.get<Questionnaire[]>('/questionnaire');
    return res.data;
  },

  getByAge: async (age: number): Promise<Questionnaire[]> => {
    const res = await apiClient.get<Questionnaire[]>(`/questionnaire/age/${age}`);
    return res.data;
  },

  create: async (data: Questionnaire): Promise<Questionnaire> => {
    const res = await apiClient.post<Questionnaire>('/questionnaire', data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/questionnaire/${id}`);
  },

  // IA — توليد أسئلة
  genererQuestionsIA: async (age: number): Promise<AIResponse> => {
    const res = await apiClient.get<AIResponse>(`/admin/ai/questions/${age}`);
    return res.data;
  },

  // حساب Score + Plan IA
  calculerResultat: async (data: {
    enfantId: number;
    questions: string[];
    reponses: boolean[];
  }): Promise<AIResponse> => {
    const res = await apiClient.post<AIResponse>('/resultat/calculer', data);
    return res.data;
  },

  getResultatsByEnfant: async (enfantId: number) => {
    const res = await apiClient.get(`/resultat/enfant/${enfantId}`);
    return res.data;
  },
};