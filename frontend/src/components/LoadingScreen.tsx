export const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full animate-pulse">
        <div className="text-6xl mb-4 animate-bounce">🌍</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Carregando Bandeiras
        </h2>
        <p className="text-gray-600 mb-4 animate-pulse">
          Conectando com a API de países...
        </p>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

        {/* Loading dots animados */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
