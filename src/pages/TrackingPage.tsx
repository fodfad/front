import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import {
  Save, Calendar, Moon, Smile, MessageCircle, AlertCircle,
  Loader2, CheckCircle2, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/apiClient';

interface TrackingEntry {
  id?: number;
  date: string;
  sleep: number;
  behavior: number;
  communication: number;
  crises: number;
  notes?: string;
}

export default function TrackingPage() {
  // ── Formulaire
  const [sleep, setSleep] = useState(3);
  const [behavior, setBehavior] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [crises, setCrises] = useState(1);
  const [notes, setNotes] = useState('');

  // ── États UI
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [conseilsIA, setConseilsIA] = useState('');
  const [showConseils, setShowConseils] = useState(false);

  // ── Historique
  const [history, setHistory] = useState<TrackingEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // ── Enfant sélectionné
  const enfantId = parseInt(localStorage.getItem('enfantId') || '0');
  const enfantNom = localStorage.getItem('enfantPrenom') || 'votre enfant';

  // ── Chargement de l'historique depuis GET /api/suivi/enfant/{id}
  const loadHistorique = async () => {
    if (!enfantId) { setLoadingHistory(false); return; }
    try {
      const res = await apiClient.get(`/suivi/enfant/${enfantId}`);
      if (Array.isArray(res.data)) {
        const mapped: TrackingEntry[] = res.data.map((s: any) => ({
          id: s.id,
          date: s.date || '',
          sleep: s.qualiteSommeil ?? 0,
          behavior: s.niveauComportement ?? 0,
          communication: s.niveauCommunication ?? 0,
          crises: s.nombreCrises ?? 0,
          notes: s.notes || '',
        }));
        // Trier du plus récent au plus ancien
        mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setHistory(mapped);
      }
    } catch (err) {
      console.error('Erreur chargement historique:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistorique();
  }, []);

  // ── Enregistrer un suivi via POST /api/suivi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setConseilsIA('');

    if (!enfantId) {
      setError('Veuillez d\'abord sélectionner un enfant dans la page "Enfants".');
      return;
    }

    setSaving(true);
    try {
      const res = await apiClient.post('/suivi', {
        enfantId,
        sommeil: sleep,
        comportement: behavior,
        communication,
        crises,
        notes: notes.trim() || null,
      });

      // Afficher les conseils IA retournés
      if (res.data?.contenuIA) {
        setConseilsIA(res.data.contenuIA);
        setShowConseils(true);
      }

      setSuccess(true);
      setNotes('');
      await loadHistorique();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'enregistrement du suivi';
      setError(msg);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ── Données graphique (7 derniers suivis)
  const chartData = [...history].reverse().slice(-7).map((h) => ({
    date: h.date ? h.date.substring(5) : '', // MM-DD
    Sommeil: h.sleep,
    Comportement: h.behavior,
    Communication: h.communication,
    Crises: h.crises,
  }));

  // ── Label des niveaux
  const niveauLabel = (val: number) => {
    const labels = ['', 'Très mauvais', 'Mauvais', 'Moyen', 'Bon', 'Très bon'];
    return labels[val] || val;
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-foreground mb-2 text-sky-600 inline-block">
          Suivi quotidien
        </h1>
        <p className="text-muted-foreground">
          Enregistrez les observations du jour pour{' '}
          {enfantId ? (
            <span className="text-sky-600 font-medium">{enfantNom}</span>
          ) : (
            <a href="/children" className="text-sky-600 font-medium underline hover:text-sky-600">
              sélectionner un enfant →
            </a>
          )}
        </p>
        {!enfantId && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
            ⚠️ Aucun enfant sélectionné. Allez dans la page <strong>Enfants</strong> et cliquez sur un profil.
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* ── Formulaire ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Nouveau suivi</h3>

          {/* Messages */}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-emerald-600 text-sm">Suivi enregistré avec succès !</p>
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Sommeil */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-sky-600 flex items-center justify-center shadow-lg">
                    <Moon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <label className="text-foreground text-sm font-medium">Qualité du sommeil</label>
                    <p className="text-xs text-muted-foreground">{niveauLabel(sleep)}</p>
                  </div>
                </div>
                <span className="text-xl font-semibold text-sky-600">
                  {sleep}/5
                </span>
              </div>
              <input type="range" min="1" max="5" value={sleep}
                onChange={(e) => setSleep(Number(e.target.value))}
                className="w-full h-3 bg-sky-100 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Comportement */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <Smile className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <label className="text-foreground text-sm font-medium">Comportement</label>
                    <p className="text-xs text-muted-foreground">{niveauLabel(behavior)}</p>
                  </div>
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {behavior}/5
                </span>
              </div>
              <input type="range" min="1" max="5" value={behavior}
                onChange={(e) => setBehavior(Number(e.target.value))}
                className="w-full h-3 bg-emerald-100 rounded-full appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Communication */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <label className="text-foreground text-sm font-medium">Communication</label>
                    <p className="text-xs text-muted-foreground">{niveauLabel(communication)}</p>
                  </div>
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {communication}/5
                </span>
              </div>
              <input type="range" min="1" max="5" value={communication}
                onChange={(e) => setCommunication(Number(e.target.value))}
                className="w-full h-3 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Crises */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <label className="text-foreground text-sm font-medium">Nombre de crises</label>
                    <p className="text-xs text-muted-foreground">
                      {crises === 0 ? 'Aucune crise' : `${crises} crise${crises > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  {crises}
                </span>
              </div>
              <input type="range" min="0" max="10" value={crises}
                onChange={(e) => setCrises(Number(e.target.value))}
                className="w-full h-3 bg-sky-100 rounded-full appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block mb-2 text-foreground text-sm font-medium">
                Notes additionnelles <span className="text-muted-foreground font-normal">(optionnel)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observations, événements particuliers de la journée..."
                rows={3}
                className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all resize-none text-sm"
              />
            </div>

            <motion.button
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              type="submit"
              disabled={saving || !enfantId}
              className="flex items-center gap-2 bg-sky-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</>
              ) : (
                <><Save className="w-5 h-5" /> Enregistrer le suivi</>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* ── Calendrier / Info ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 flex flex-col gap-4"
        >
          <h3 className="text-foreground mb-2">Résumé</h3>
          <div className="flex items-center justify-center p-6 bg-gradient-to-br sky-50 rounded-2xl">
            <Calendar className="w-16 h-16 text-indigo-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-sky-50 rounded-2xl border border-sky-100">
              <span className="text-sm text-foreground">Total suivis</span>
              <span className="text-sky-600 font-semibold">{history.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-sm text-foreground">Dernier suivi</span>
              <span className="text-emerald-600 text-xs font-medium">
                {history[0]?.date || '—'}
              </span>
            </div>
            {history.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="text-sm text-foreground">Moy. sommeil</span>
                <span className="text-amber-600 font-semibold">
                  {(history.reduce((s, h) => s + h.sleep, 0) / history.length).toFixed(1)}/5
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Conseils IA ── */}
      <AnimatePresence>
        {conseilsIA && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-br sky-50 border border-sky-200 rounded-3xl p-6 mb-8"
          >
            <button
              onClick={() => setShowConseils(!showConseils)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-foreground">Conseils personnalisés générés par l'IA</h3>
              </div>
              {showConseils ? <ChevronUp className="w-5 h-5 text-sky-500" /> : <ChevronDown className="w-5 h-5 text-sky-500" />}
            </button>
            <AnimatePresence>
              {showConseils && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                    {conseilsIA}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Graphique ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 mb-8"
      >
        <h3 className="text-foreground mb-6">Évolution sur 7 jours</h3>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            Aucun suivi enregistré pour le moment
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748B" domain={[0, 5]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Line type="monotone" dataKey="Sommeil" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Comportement" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Communication" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Crises" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* ── Historique tableau ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-border/50 overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-foreground">Historique des suivis</h3>
          {loadingHistory && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r sky-50">
              <tr>
                <th className="text-left px-6 py-4 text-foreground text-sm">Date</th>
                <th className="text-left px-6 py-4 text-foreground text-sm">Sommeil</th>
                <th className="text-left px-6 py-4 text-foreground text-sm">Comportement</th>
                <th className="text-left px-6 py-4 text-foreground text-sm">Communication</th>
                <th className="text-left px-6 py-4 text-foreground text-sm">Crises</th>
                <th className="text-left px-6 py-4 text-foreground text-sm">Notes</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    Aucun suivi enregistré pour le moment
                  </td>
                </tr>
              ) : (
                history.map((entry, index) => (
                  <motion.tr
                    key={entry.id ?? index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className="border-b border-border hover:bg-sky-50/30 transition-all"
                  >
                    <td className="px-6 py-4 text-foreground text-sm">{entry.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-sky-600 text-white rounded-full text-xs">
                        {entry.sleep}/5
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs">
                        {entry.behavior}/5
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs">
                        {entry.communication}/5
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{entry.crises}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs max-w-xs truncate">
                      {entry.notes || '—'}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </Layout>
  );
}
