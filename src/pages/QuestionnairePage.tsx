import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Check, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  'Votre enfant répond-il lorsque vous l\'appelez par son nom ?',
  'Votre enfant établit-il un contact visuel avec vous ?',
  'Votre enfant pointe-t-il du doigt pour montrer quelque chose qui l\'intéresse ?',
  'Votre enfant imite-t-il vos actions (comme applaudir) ?',
  'Votre enfant joue-t-il à faire semblant (comme nourrir une poupée) ?',
  'Votre enfant s\'intéresse-t-il aux autres enfants ?',
  'Votre enfant montre-t-il des objets pour les partager avec vous ?',
  'Votre enfant répond-il aux émotions des autres ?',
  'Votre enfant suit-il des instructions simples ?',
  'Votre enfant réagit-il aux sons inhabituels ?',
];

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);

    setTimeout(() => {
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        navigate('/results');
      }
    }, 600);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Questionnaire M-CHAT</span>
          </div>
          <h1 className="text-foreground mb-2">Évaluation du développement</h1>
          <p className="text-muted-foreground">
            Répondez aux questions suivantes concernant le comportement de votre enfant
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

          {/* Progress */}
          <div className="mb-10 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} sur {questions.length}
              </span>
              <span className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="mb-10"
            >
              <h2 className="text-foreground text-2xl leading-relaxed">
                {questions[currentQuestion]}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Answer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <AnimatePresence mode="wait">
              <motion.button
                key={`yes-${currentQuestion}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(true)}
                className={`p-8 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${
                  selectedAnswer === true
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-500 to-teal-500 shadow-2xl'
                    : 'border-border bg-white hover:border-emerald-400 hover:shadow-xl'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity ${selectedAnswer === true ? 'opacity-100' : ''}`}></div>

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${
                    selectedAnswer === true
                      ? 'bg-white shadow-lg'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg'
                  }`}>
                    <Check className={`w-8 h-8 ${selectedAnswer === true ? 'text-emerald-500' : 'text-white'}`} />
                  </div>
                  <div className={`text-2xl mb-2 transition-colors ${selectedAnswer === true ? 'text-white' : 'text-foreground'}`}>
                    Oui
                  </div>
                  <div className={`text-sm transition-colors ${selectedAnswer === true ? 'text-white/90' : 'text-muted-foreground'}`}>
                    Ce comportement est présent
                  </div>
                </div>
              </motion.button>

              <motion.button
                key={`no-${currentQuestion}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(false)}
                className={`p-8 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${
                  selectedAnswer === false
                    ? 'border-rose-500 bg-gradient-to-br from-rose-500 to-pink-500 shadow-2xl'
                    : 'border-border bg-white hover:border-rose-400 hover:shadow-xl'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity ${selectedAnswer === false ? 'opacity-100' : ''}`}></div>

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${
                    selectedAnswer === false
                      ? 'bg-white shadow-lg'
                      : 'bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg'
                  }`}>
                    <X className={`w-8 h-8 ${selectedAnswer === false ? 'text-rose-500' : 'text-white'}`} />
                  </div>
                  <div className={`text-2xl mb-2 transition-colors ${selectedAnswer === false ? 'text-white' : 'text-foreground'}`}>
                    Non
                  </div>
                  <div className={`text-sm transition-colors ${selectedAnswer === false ? 'text-white/90' : 'text-muted-foreground'}`}>
                    Ce comportement est absent ou rare
                  </div>
                </div>
              </motion.button>
            </AnimatePresence>
          </div>

          {/* Stepper */}
          <div className="flex gap-2">
            {questions.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex-1"
              >
                <div
                  className={`h-2 rounded-full transition-all ${
                    index < currentQuestion
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg'
                      : index === currentQuestion
                      ? 'bg-gradient-to-r from-indigo-400 to-purple-500'
                      : 'bg-indigo-100'
                  }`}
                ></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
