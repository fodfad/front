import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Save, Calendar, Moon, Smile, MessageCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const chartData = [
  { date: '01/05', sleep: 9, behavior: 7, communication: 6, crises: 2 },
  { date: '02/05', sleep: 8, behavior: 8, communication: 7, crises: 1 },
  { date: '03/05', sleep: 10, behavior: 9, communication: 8, crises: 0 },
  { date: '04/05', sleep: 9, behavior: 8, communication: 8, crises: 1 },
];

interface TrackingEntry {
  date: string;
  sleep: number;
  behavior: number;
  communication: number;
  crises: number;
}

export default function TrackingPage() {
  const [sleep, setSleep] = useState(9);
  const [behavior, setBehavior] = useState(7);
  const [communication, setCommunication] = useState(6);
  const [crises, setCrises] = useState(1);
  const [notes, setNotes] = useState('');

  const [history] = useState<TrackingEntry[]>([
    { date: '2026-05-03', sleep: 10, behavior: 9, communication: 8, crises: 0 },
    { date: '2026-05-02', sleep: 8, behavior: 8, communication: 7, crises: 1 },
    { date: '2026-05-01', sleep: 9, behavior: 7, communication: 6, crises: 2 },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Suivi enregistré avec succès !');
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-foreground mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block">
          Suivi quotidien
        </h1>
        <p className="text-muted-foreground">Enregistrez les observations quotidiennes de votre enfant</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Nouveau suivi</h3>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Moon className="w-6 h-6 text-white" />
                    </div>
                    <label className="text-foreground">Heures de sommeil</label>
                  </div>
                  <span className="text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {sleep}h
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={sleep}
                  onChange={(e) => setSleep(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-indigo-500 [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <Smile className="w-6 h-6 text-white" />
                    </div>
                    <label className="text-foreground">Comportement</label>
                  </div>
                  <span className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {behavior}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={behavior}
                  onChange={(e) => setBehavior(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-emerald-500 [&::-webkit-slider-thumb]:to-teal-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <label className="text-foreground">Communication</label>
                  </div>
                  <span className="text-2xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {communication}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={communication}
                  onChange={(e) => setCommunication(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-amber-500 [&::-webkit-slider-thumb]:to-orange-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <label className="text-foreground">Nombre de crises</label>
                  </div>
                  <span className="text-2xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    {crises}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={crises}
                  onChange={(e) => setCrises(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-rose-500 [&::-webkit-slider-thumb]:to-pink-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block mb-3 text-foreground">
                Notes additionnelles
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observations, événements particuliers..."
                rows={4}
                className="w-full px-5 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            >
              <Save className="w-5 h-5" />
              Enregistrer le suivi
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Calendrier</h3>
          <div className="flex items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl mb-6">
            <Calendar className="w-20 h-20 text-indigo-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <span className="text-sm text-foreground">Aujourd'hui</span>
              <span className="text-xs bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">04 Mai</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <span className="text-sm text-foreground">Suivi complété</span>
              <span className="text-xs bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">3 jours</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 mb-8"
      >
        <h3 className="text-foreground mb-6">Graphiques de progression</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="date" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: 'none',
                borderRadius: '1rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="sleep" stroke="#4F46E5" strokeWidth={3} name="Sommeil" dot={{ fill: '#4F46E5', r: 5 }} />
            <Line type="monotone" dataKey="behavior" stroke="#10B981" strokeWidth={3} name="Comportement" dot={{ fill: '#10B981', r: 5 }} />
            <Line type="monotone" dataKey="communication" stroke="#F59E0B" strokeWidth={3} name="Communication" dot={{ fill: '#F59E0B', r: 5 }} />
            <Line type="monotone" dataKey="crises" stroke="#EF4444" strokeWidth={3} name="Crises" dot={{ fill: '#EF4444', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-border/50 overflow-hidden"
      >
        <div className="p-8 border-b border-border">
          <h3 className="text-foreground">Historique des suivis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                <th className="text-left px-8 py-5 text-foreground">Date</th>
                <th className="text-left px-8 py-5 text-foreground">Sommeil</th>
                <th className="text-left px-8 py-5 text-foreground">Comportement</th>
                <th className="text-left px-8 py-5 text-foreground">Communication</th>
                <th className="text-left px-8 py-5 text-foreground">Crises</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="border-b border-border hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all"
                >
                  <td className="px-8 py-5 text-foreground">{entry.date}</td>
                  <td className="px-8 py-5 text-muted-foreground">{entry.sleep}h</td>
                  <td className="px-8 py-5">
                    <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm shadow-lg">
                      {entry.behavior}/10
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm shadow-lg">
                      {entry.communication}/10
                    </span>
                  </td>
                  <td className="px-8 py-5 text-muted-foreground">{entry.crises}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </Layout>
  );
}
