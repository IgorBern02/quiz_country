import type { Question, Country } from "../types/types";
import { OptionButton } from "./OptionButton";

interface QuizCardProps {
  question: Question;
  onAnswer: (country: Country) => void;
  feedback: string;
  score: number;
  isChanging: boolean;
  timeLeft: number;
  disabled?: boolean;
}

export const QuizCard = ({
  question,
  onAnswer,
  feedback,
  isChanging,
  timeLeft,
  disabled,
}: QuizCardProps) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 text-center max-w-md w-full">
      {/* Container da bandeira com animação */}
      <div className="relative w-64 h-40 mx-auto mb-6">
        <img
          src={question.answer.flags.png}
          alt="bandeira"
          className={`
            w-full h-full object-cover rounded-md shadow
            transition-all duration-500 ease-in-out
            ${
              isChanging
                ? "opacity-0 scale-95 rotate-2"
                : "opacity-100 scale-100 rotate-0"
            }
          `}
        />

        {/* Indicador de tempo crítico */}
        {timeLeft <= 5 && !isChanging && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center animate-ping">
            <span className="text-xs font-bold">{timeLeft}</span>
          </div>
        )}

        {/* Efeito de loading durante a transição */}
        {isChanging && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Opções com animação escalonada */}
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((country, index) => (
          <div
            key={country.cca3}
            className={`
              transition-all duration-500 ease-out
              ${
                isChanging
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
              }
            `}
            style={{
              transitionDelay: isChanging ? "0ms" : `${index * 100}ms`,
            }}
          >
            <OptionButton
              country={country}
              onClick={onAnswer}
              disabled={isChanging || disabled}
            />
          </div>
        ))}
      </div>

      {/* Feedback com animação */}
      <p
        className={`
        text-lg mt-4 font-medium min-h-[2rem]
        transition-all duration-300 ease-in-out
        ${feedback ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
      >
        {feedback}
      </p>
    </div>
  );
};
