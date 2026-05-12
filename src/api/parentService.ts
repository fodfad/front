import apiClient from './apiClient';

export interface Parent {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  telephone?: string;
  dateInscription?: string;
  enfants?: any[];
}

export const parentService = {

  getAllParents: async (): Promise<Parent[]> => {
    const res = await apiClient.get<Parent[]>('/parents');
    return res.data;
  },

  getEnfantsByParent: async (parentId: number) => {
    const res = await apiClient.get(`/enfants/parent/${parentId}`);
    return res.data;
  },

  createParent: async (data: Omit<Parent, 'id'>): Promise<Parent> => {
    const res = await apiClient.post<Parent>('/parents', data);
    return res.data;
  },

  updateParent: async (id: number, data: Partial<Parent>): Promise<Parent> => {
    const res = await apiClient.put<Parent>(`/parents/${id}`, data);
    return res.data;
  },

  deleteParent: async (id: number): Promise<void> => {
    await apiClient.delete(`/parents/${id}`);
  },
};