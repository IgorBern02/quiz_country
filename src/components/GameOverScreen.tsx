interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export const GameOverScreen = ({ score, onRestart }: GameOverScreenProps) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 text-center max-w-md w-full animate-fade-in">
        {/* Ícone animado */}
        <div className="text-8xl mb-6 animate-bounce">🎮</div>

        <h2 className="text-4xl font-bold text-red-600 mb-4 animate-pulse">
          Fim de Jogo!
        </h2>

        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-6 text-white animate-scale-in">
          <p className="text-2xl font-semibold mb-2">Sua Pontuação Final</p>
          <p className="text-5xl font-bold animate-count-up">{score}</p>
          <p className="text-sm opacity-90 mt-2">
            {score >= 10
              ? "🏆 Excelente!"
              : score >= 5
              ? "👍 Bom trabalho!"
              : "💪 Continue praticando!"}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            🔄 Jogar Novamente
          </button>

          <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
            <p>💡 Dica: Tente ser mais rápido nas próximas!</p>
            <p>🎯 Objetivo: Bata seu recorde de {score} pontos!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
