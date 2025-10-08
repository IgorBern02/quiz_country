import { useState, useCallback, useEffect, useRef } from "react";
import type { Country, Question, GameStats } from "../types/types";
import { useCountries } from "../hooks/useCountries";
import { LoadingScreen } from "./LoadingScreen";
import { ErrorScreen } from "./ErrorScreen";
import { QuizCard } from "./QuizCard";
import { GameOverScreen } from "./GameOverScreen";

const INITIAL_STATS: GameStats = {
  score: 0,
  lives: 3,
  timeLeft: 15,
  isGameOver: false,
};

export const CountryFlagQuiz = () => {
  const { countries, loading, error } = useCountries();
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [gameStats, setGameStats] = useState<GameStats>(INITIAL_STATS);

  const timerRef = useRef<number | null>(null);

  // Efeito do temporizador
  useEffect(() => {
    if (gameStats.isGameOver || !question || isChanging) return;

    timerRef.current = window.setInterval(() => {
      setGameStats((prev) => {
        if (prev.timeLeft <= 1) {
          // Tempo esgotado - perde uma vida
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
          }
          handleTimeOut();
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [question, gameStats.isGameOver, isChanging]);

  const handleTimeOut = () => {
    setFeedback("⏰ Tempo esgotado!");
    loseLife();
  };

  const loseLife = useCallback(() => {
    setGameStats((prev) => {
      const newLives = prev.lives - 1;
      const isGameOver = newLives <= 0;

      if (isGameOver) {
        setTimeout(() => {
          setGameStats((prev) => ({ ...prev, isGameOver: true }));
        }, 1000);
      }

      return { ...prev, lives: newLives };
    });

    setTimeout(() => {
      if (gameStats.lives > 1) {
        generateQuestion();
      }
    }, 1500);
  }, [gameStats.lives]);

  const generateQuestion = useCallback(
    (data: Country[] = countries) => {
      if (!data || data.length < 4 || gameStats.isGameOver) return;

      setIsChanging(true);

      // Resetar temporizador para nova pergunta
      setGameStats((prev) => ({ ...prev, timeLeft: 15 }));

      setTimeout(() => {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        const options = shuffled.slice(0, 4);
        const answer = options[Math.floor(Math.random() * options.length)];

        setQuestion({ options, answer });
        setFeedback("");

        setTimeout(() => setIsChanging(false), 100);
      }, 300);
    },
    [countries, gameStats.isGameOver]
  );

  const handleAnswer = (country: Country) => {
    if (!question || isChanging || gameStats.isGameOver) return;

    // Parar temporizador
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    const isCorrect = country.name.common === question.answer.name.common;

    if (isCorrect) {
      setGameStats((prev) => ({ ...prev, score: prev.score + 1 }));
      setFeedback("✅ Correto! +1 ponto");
    } else {
      setFeedback(`❌ Errado! Era ${question.answer.name.common}`);
      loseLife();
    }

    // Nova questão após delay (se ainda tiver vidas)
    setTimeout(() => {
      if (!gameStats.isGameOver && (isCorrect || gameStats.lives > 1)) {
        generateQuestion();
      }
    }, 1000);
  };

  const restartGame = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    setGameStats(INITIAL_STATS);
    setFeedback("");
    setIsChanging(false);

    if (countries.length >= 4) {
      generateQuestion(countries);
    }
  };

  // Gerar questão quando os países carregarem
  useEffect(() => {
    if (countries.length >= 4 && !question && !gameStats.isGameOver) {
      generateQuestion(countries);
    }
  }, [countries, question, gameStats.isGameOver, generateQuestion]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || countries.length < 4) {
    return (
      <ErrorScreen
        onRetry={handleRetry}
        message={error || "Não foi possível carregar países suficientes da API"}
      />
    );
  }

  if (gameStats.isGameOver) {
    return <GameOverScreen score={gameStats.score} onRestart={restartGame} />;
  }

  if (!question) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
      {/* Header com stats do jogo */}
      <div className="w-full max-w-md mb-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          🌍 Adivinhe a Bandeira
        </h1>

        {/* Barra de status */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            {/* Vidas */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-700">
                Vidas:
              </span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-full transition-all duration-300 ${
                      index < gameStats.lives
                        ? "bg-red-500 animate-pulse"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Pontuação */}
            <div className="text-lg font-semibold text-gray-700">
              Pontos: <span className="text-blue-600">{gameStats.score}</span>
            </div>
          </div>

          {/* Barra de tempo */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                gameStats.timeLeft > 7
                  ? "bg-green-500"
                  : gameStats.timeLeft > 3
                  ? "bg-yellow-500"
                  : "bg-red-500 animate-pulse"
              }`}
              style={{ width: `${(gameStats.timeLeft / 15) * 100}%` }}
            />
          </div>
          <div className="text-center mt-1 text-sm font-medium text-gray-600">
            ⏰ {gameStats.timeLeft}s
          </div>
        </div>
      </div>

      <QuizCard
        question={question}
        onAnswer={handleAnswer}
        feedback={feedback}
        score={gameStats.score}
        isChanging={isChanging}
        timeLeft={gameStats.timeLeft}
      />

      <button
        onClick={() => generateQuestion()}
        disabled={isChanging || gameStats.isGameOver}
        className={`
          mt-6 bg-green-500 hover:bg-green-600 text-white py-3 px-6 
          rounded-lg font-semibold transition-all duration-300
          transform hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-green-300
          ${
            isChanging || gameStats.isGameOver
              ? "opacity-50 cursor-not-allowed"
              : "opacity-100"
          }
        `}
      >
        {isChanging ? "⏳ Carregando..." : "🔄 Pular Bandeira"}
      </button>
    </div>
  );
};
