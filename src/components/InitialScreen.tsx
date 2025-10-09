import { Link } from "react-router";

export const InitialScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 max-w-md w-full text-center flex flex-col gap-8">
        {/* Título */}
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
            placeholder="Digite seu nome"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Tabela de Pontuação */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🏆 Tabela de Pontuação
          </h2>
          <ul className="bg-white rounded-xl shadow-md divide-y divide-gray-100 overflow-hidden">
            <li className="flex justify-between items-center p-3 hover:bg-gray-50 transition">
              <span className="font-semibold text-blue-600 whitespace-nowrap">
                1º Lugar
              </span>
              <span className="font-medium text-gray-700 truncate max-w-[150px]">
                Igor
              </span>
              <span className="font-bold text-gray-800">53</span>
            </li>
          </ul>
        </div>

        {/* Botão de início */}
        <Link
          to="/quiz"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5 active:translate-y-0"
        >
          🎯 Começar o Quiz
        </Link>
      </div>
    </div>
  );
};
