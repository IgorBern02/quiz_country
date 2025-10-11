interface ErrorScreenProps {
  onRetry: () => void;
  message?: string;
}

export const ErrorScreen = ({ onRetry, message }: ErrorScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full">
        <div className="text-6xl mb-4">🌍</div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Erro ao Carregar
        </h2>
        <p className="text-gray-700 mb-2 text-lg">
          {message || "Não foi possível conectar com a API de países."}
        </p>
        <p className="text-gray-500 mb-6 text-sm">
          Verifique sua conexão com a internet e tente novamente.
        </p>
        <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors w-full"
        >
          🔄 Tentar Novamente
        </button>
      </div>
    </div>
  );
};
