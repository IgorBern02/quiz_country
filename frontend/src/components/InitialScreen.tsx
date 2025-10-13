import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

export const InitialScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [scores, setScores] = useState<{ name: string; score: number }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch(`${API_URL}/api/scores`);
        const data = await res.json();
        setScores(data);
      } catch (err) {
        console.error("Erro ao carregar ranking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const handleStart = () => {
    if (!name.trim()) {
      setWarning("⚠️ Digite seu nome antes de começar!");
      setTimeout(() => setWarning(""), 3000); // limpa depois de 3 segundos
      return;
    }
    setShowModal(true);
  };

  const confirmStart = () => {
    localStorage.setItem("currentPlayer", name);
    setShowModal(false);
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      {/* --- MODAL DE CONFIRMAÇÃO --- */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Pronto para começar?
              </h2>
              <p className="text-gray-600 mb-6">
                Você vai jogar como{" "}
                <span className="font-semibold text-blue-600">{name}</span>
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 cursor-pointer text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmStart}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold shadow-md transition"
                >
                  Começar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 max-w-md w-full text-center flex flex-col gap-8"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Bem-vindo ao{" "}
            <span className="text-blue-600">Quiz de Bandeiras!</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Teste seus conhecimentos sobre bandeiras do mundo 🌎
          </p>
        </div>

        {/* Campo de nome */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Tabela de Pontuação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🏆 Tabela de Pontuação
          </h2>
          {loading ? (
            <p className="text-gray-500">Carregando...</p>
          ) : (
            <ul className="bg-white rounded-xl shadow-md divide-y divide-gray-100 overflow-hidden">
              {scores.length === 0 ? (
                <li className="p-3 text-gray-500">
                  Nenhuma pontuação ainda 😅
                </li>
              ) : (
                scores
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 3) // pega apenas o top 3
                  .map((player, index) => {
                    let color = "";
                    let medal = "";

                    if (index === 0) {
                      color = "text-yellow-500";
                      medal = "🥇";
                    } else if (index === 1) {
                      color = "text-gray-400";
                      medal = "🥈";
                    } else if (index === 2) {
                      color = "text-orange-600";
                      medal = "🥉";
                    }

                    return (
                      <li
                        key={index}
                        className={`flex justify-between items-center p-3 hover:bg-gray-50 transition ${color}`}
                      >
                        <span className="font-semibold whitespace-nowrap">
                          {medal} {index + 1}º Lugar
                        </span>
                        <span className="font-medium truncate max-w-[150px]">
                          {player.name}
                        </span>
                        <span className="font-bold">{player.score}</span>
                      </li>
                    );
                  })
              )}
            </ul>
          )}
        </motion.div>

        {/* Mensagem de aviso */}
        <AnimatePresence>
          {warning && (
            <motion.p
              key="warning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-red-500 font-medium text-sm"
            >
              {warning}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Botão de início */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <button
            onClick={handleStart}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-2 cursor-pointer rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5 active:translate-y-0"
          >
            🎯 Começar o Quiz
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
