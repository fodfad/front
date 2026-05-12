import apiClient from './apiClient';
import type { Parent } from './parentService';

export interface Enfant {
  id?: number;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  parent?: Parent;
}

export const enfantService = {

  getAllEnfants: async (): Promise<Enfant[]> => {
    const res = await apiClient.get<Enfant[]>('/enfants/all');
    return res.data;
  },

  getEnfantsByParent: async (parentId: number): Promise<Enfant[]> => {
    const res = await apiClient.get<Enfant[]>(`/enfants/parent/${parentId}`);
    return res.data;
  },

  createEnfant: async (data: {
    prenom: string;
    dateNaissance: string;
    sexe: string;
    parentId: number;
  }): Promise<Enfant> => {
    const res = await apiClient.post<Enfant>('/enfants', data);
    return res.data;
  },

  deleteEnfant: async (id: number): Promise<void> => {
    await apiClient.delete(`/enfants/${id}`);
  },
};