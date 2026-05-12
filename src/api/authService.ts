import apiClient from './apiClient';

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'PARENT' | 'ADMIN';
}

export const authService = {

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  register: async (data: {
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    telephone: string;
  }): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  },
};