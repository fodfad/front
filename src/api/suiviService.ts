import apiClient from './apiClient';

export interface SuiviRequest {
  enfantId: number;
  score: number;
  sommeil: number;
  comportement: number;
  communication: number;
  crises: number;
  notes?: string;
}

export interface SuiviJournalier {
  id: number;
  date: string;
  qualiteSommeil: number;
  niveauComportement: number;
  niveauCommunication: number;
  nombreCrises: number;
  notes: string;
}

export const suiviService = {

  enregistrer: async (data: SuiviRequest) => {
    const res = await apiClient.post('/parent/suivi', data);
    return res.data;
  },

  getHistorique: async (enfantId: number): Promise<SuiviJournalier[]> => {
    const res = await apiClient.get<SuiviJournalier[]>(
      `/parent/suivi/enfant/${enfantId}`
    );
    return res.data;
  },
};