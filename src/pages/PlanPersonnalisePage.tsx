import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import {
    Sparkles, ArrowLeft, Baby, BookOpen, GraduationCap,
    Target, Lightbulb, Calendar, Heart, AlertCircle,
    Download, Loader2, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../api/apiClient';

/** Retourne les infos de la tranche d'âge */
const getTranche = (code: string) => {
    switch (code) {
        case '0-3': return {
            label: 'Nourrisson — 0-3 ans',
            icon: Baby,
            gradient: 'from-blue-500 to-cyan-500',
            bg: 'from-blue-50 to-cyan-50',
            border: 'border-blue-200',
        };
        case '3-7': return {
            label: 'Préscolaire — 3-7 ans',
            icon: BookOpen,
            gradient: 'from-green-500 to-teal-500',
            bg: 'from-green-50 to-teal-50',
            border: 'border-green-200',
        };
        default: return {
            label: 'Scolaire — 7-12 ans',
            icon: GraduationCap,
            gradient: 'from-orange-500 to-amber-500',
            bg: 'from-orange-50 to-amber-50',
            border: 'border-orange-200',
        };
    }
};

/** Couleur du badge niveau de risque */
const getNiveauStyle = (niveau: string) => {
    switch (niveau) {
        case 'FAIBLE': return { color: 'from-emerald-500 to-teal-500', label: 'Risque Faible', icon: CheckCircle };
        case 'MOYEN': return { color: 'from-orange-500 to-amber-500', label: 'Risque Moyen', icon: AlertCircle };
        default: return { color: 'from-red-500 to-rose-500', label: 'Risque Élevé', icon: AlertCircle };
    }
};

/**
 * Découpe le plan IA en sections selon les emojis/titres.
 * Retourne un tableau de { titre, contenu }.
 */
const parsePlan = (plan: string): { titre: string; contenu: string; icon: any }[] => {
    if (!plan) return [];

    // Icônes associées aux mots-clés
    const iconMap: { keywords: string[]; icon: any }[] = [
        { keywords: ['analyse', 'résultat', 'bilan'], icon: Target },
        { keywords: ['objectif', 'priorité'], icon: Target },
        { keywords: ['conseil', 'pratique', 'quotidien'], icon: Lightbulb },
        { keywords: ['activité', 'jeu', 'exercice'], icon: Heart },
        { keywords: ['plan', 'semaine', 'hebdomadaire'], icon: Calendar },
        { keywords: ['spécialiste', 'consulter', 'médecin'], icon: AlertCircle },
    ];

    const getIcon = (text: string) => {
        const lower = text.toLowerCase();
        for (const { keywords, icon } of iconMap) {
            if (keywords.some(k => lower.includes(k))) return icon;
        }
        return Sparkles;
    };

    // Découper par lignes commençant par un chiffre, emoji ou titre majuscule
    const lignes = plan.split('\n');
    const sections: { titre: string; contenu: string; icon: any }[] = [];
    let currentTitre = '';
    let currentContenu: string[] = [];

    for (const ligne of lignes) {
        const trimmed = ligne.trim();
        if (!trimmed) continue;

        // Détecter une ligne de titre (commence par chiffre+point, emoji, ou tout en majuscules)
        const isTitre =
            /^[0-9]+[\.\)]\s/.test(trimmed) ||
            /^[📋🎯💡🌙📅⚠️✅💪🔵🟢🟠🏠🏫]/u.test(trimmed) ||
            (trimmed.length < 60 && trimmed === trimmed.toUpperCase() && trimmed.length > 3);

        if (isTitre && currentContenu.length > 0) {
            sections.push({
                titre: currentTitre,
                contenu: currentContenu.join('\n'),
                icon: getIcon(currentTitre),
            });
            currentContenu = [];
        }

        if (isTitre) {
            currentTitre = trimmed;
        } else {
            currentContenu.push(trimmed);
        }
    }

    // Dernière section
    if (currentContenu.length > 0) {
        sections.push({
            titre: currentTitre,
            contenu: currentContenu.join('\n'),
            icon: getIcon(currentTitre),
        });
    }

    // Si pas de sections détectées → afficher tout en une seule section
    if (sections.length === 0) {
        return [{ titre: 'Plan personnalisé', contenu: plan, icon: Sparkles }];
    }

    return sections;
};

export default function PlanPersonnalisePage() {
    const navigate = useNavigate();

    // Récupérer les données depuis localStorage
    const resultatSaved = localStorage.getItem('resultat');
    const resultat = resultatSaved ? JSON.parse(resultatSaved) : null;

    const planIA = resultat?.contenuIA || '';
    const score = resultat ? parseInt(resultat.score) : 0;
    const niveau = resultat?.niveau || 'FAIBLE';
    const trancheCode = localStorage.getItem('enfantTranche') || resultat?.tranche || '3-7';
    const enfantPrenom = localStorage.getItem('enfantPrenom') || '';
    const enfantAge = localStorage.getItem('enfantAge') || '?';

    // Charger le plan depuis l'API si non disponible en localStorage
    const [planCharge, setPlanCharge] = useState(planIA);
    const [loading, setLoading] = useState(!planIA);

    useEffect(() => {
        if (planIA) {
            setPlanCharge(planIA);
            setLoading(false);
            return;
        }

        // Essayer de charger depuis l'API
        const enfantId = localStorage.getItem('enfantId');
        if (!enfantId) { setLoading(false); return; }

        apiClient.get(`/resultat/enfant/${enfantId}`)
            .then(async (res) => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    const dernierResultat = res.data[0];
                    try {
                        const planRes = await apiClient.get(`/resultat/${dernierResultat.id}/plan`);
                        setPlanCharge(planRes.data?.description || '');
                    } catch { }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const tranche = getTranche(trancheCode);
    const niveauStyle = getNiveauStyle(niveau);
    const TrancheIcon = tranche.icon;
    const NiveauIcon = niveauStyle.icon;
    const sections = parsePlan(planCharge);

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Chargement du plan personnalisé...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* ── En-tête ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                {/* Bouton retour */}
                <button
                    onClick={() => navigate('/results')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-sky-600 transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Retour aux résultats</span>
                </button>

                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-foreground mb-2 text-sky-600 inline-block">
                            Plan personnalisé IA
                        </h1>
                        <p className="text-muted-foreground">
                            {enfantPrenom && <span className="font-medium text-sky-600">{enfantPrenom} — </span>}
                            {enfantAge} ans · {tranche.label}
                        </p>
                    </div>

                    {/* Bouton imprimer */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-sky-600 text-white px-5 py-3 rounded-2xl shadow-lg text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Imprimer / PDF
                    </motion.button>
                </div>
            </motion.div>

            {/* ── Carte résumé ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`bg-gradient-to-br ${tranche.bg} border ${tranche.border} rounded-3xl p-6 mb-8 flex flex-wrap gap-6 items-center`}
            >
                {/* Tranche d'âge */}
                <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tranche.gradient} flex items-center justify-center shadow-lg`}>
                        <TrancheIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Tranche d'âge</p>
                        <p className="font-semibold text-foreground">{tranche.label}</p>
                    </div>
                </div>

                <div className="w-px h-10 bg-border hidden sm:block" />

                {/* Score */}
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-sky-600 flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl font-bold">{score}</span>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Score TSA</p>
                        <p className="font-semibold text-foreground">{score} points de risque</p>
                    </div>
                </div>

                <div className="w-px h-10 bg-border hidden sm:block" />

                {/* Niveau */}
                <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${niveauStyle.color} flex items-center justify-center shadow-lg`}>
                        <NiveauIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Niveau de risque</p>
                        <p className={`font-semibold bg-gradient-to-r ${niveauStyle.color} bg-clip-text text-transparent`}>
                            {niveauStyle.label}
                        </p>
                    </div>
                </div>

                <div className="ml-auto">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/60 px-3 py-2 rounded-xl">
                        <Sparkles className="w-3 h-3 text-sky-500" />
                        Généré par IA · Adapté à la tranche d'âge
                    </div>
                </div>
            </motion.div>

            {/* ── Contenu du plan ── */}
            {planCharge ? (
                <div className="space-y-6">
                    {sections.map((section, index) => {
                        const SectionIcon = section.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 + index * 0.08 }}
                                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-border/50 overflow-hidden"
                            >
                                {/* En-tête de section */}
                                {section.titre && (
                                    <div className={`bg-gradient-to-r ${tranche.bg} border-b ${tranche.border} px-6 py-4 flex items-center gap-3`}>
                                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tranche.gradient} flex items-center justify-center shadow-md`}>
                                            <SectionIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <h3 className="text-foreground font-semibold">{section.titre}</h3>
                                    </div>
                                )}

                                {/* Contenu de la section */}
                                <div className="p-6">
                                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                                        {section.contenu}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                /* Aucun plan disponible */
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-border/50 p-16 text-center"
                >
                    <div className="w-20 h-20 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-indigo-300" />
                    </div>
                    <p className="text-foreground font-medium mb-2">Aucun plan disponible</p>
                    <p className="text-muted-foreground text-sm mb-6">
                        Passez d'abord le questionnaire pour générer un plan personnalisé.
                    </p>
                    <button
                        onClick={() => navigate('/children')}
                        className="px-6 py-3 bg-sky-600 text-white rounded-2xl text-sm shadow-lg"
                    >
                        Commencer le questionnaire
                    </button>
                </motion.div>
            )}

            {/* ── Avertissement médical ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-4"
            >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h4 className="text-foreground font-medium mb-1">Avertissement important</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Ce plan est généré automatiquement par l'IA à titre indicatif.
                        Il ne constitue pas un diagnostic médical officiel.
                        Consultez un professionnel de santé spécialisé pour un accompagnement adapté.
                    </p>
                </div>
            </motion.div>
        </Layout>
    );
}
