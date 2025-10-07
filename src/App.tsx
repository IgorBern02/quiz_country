import { useEffect, useState } from "react";

type Country = {
  name: { common: string };
  flags: { png: string };
  cca3: string;
};

interface Question {
  options: Country[];
  answer: Country;
}

export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);

        // Tentativa com timeout para evitar requisições muito longas
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca3"
        );

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`Erro HTTP ${res.status}`);
        }

        const data = await res.json();

        // Garante que é array
        if (!Array.isArray(data)) {
          throw new Error("Resposta da API não é um array");
        }

        // Filtra só países válidos
        const filtered = data.filter(
          (c: any) => c.name?.common && c.flags?.png && c.cca3
        );

        if (filtered.length === 0) {
          throw new Error("Nenhum país válido encontrado");
        }

        setCountries(filtered);
        generateQuestion(filtered);
      } catch (err) {
        console.error("Erro ao carregar países:", err);

        // Fallback com países fixos mais robusto
        const fallback: Country[] = [
          {
            name: { common: "Brazil" },
            flags: { png: "https://flagcdn.com/w320/br.png" },
            cca3: "BRA",
          },
          {
            name: { common: "Japan" },
            flags: { png: "https://flagcdn.com/w320/jp.png" },
            cca3: "JPN",
          },
          {
            name: { common: "Canada" },
            flags: { png: "https://flagcdn.com/w320/ca.png" },
            cca3: "CAN",
          },
          {
            name: { common: "France" },
            flags: { png: "https://flagcdn.com/w320/fr.png" },
            cca3: "FRA",
          },
          {
            name: { common: "Germany" },
            flags: { png: "https://flagcdn.com/w320/de.png" },
            cca3: "DEU",
          },
          {
            name: { common: "Italy" },
            flags: { png: "https://flagcdn.com/w320/it.png" },
            cca3: "ITA",
          },
          {
            name: { common: "United States" },
            flags: { png: "https://flagcdn.com/w320/us.png" },
            cca3: "USA",
          },
          {
            name: { common: "United Kingdom" },
            flags: { png: "https://flagcdn.com/w320/gb.png" },
            cca3: "GBR",
          },
        ];

        setCountries(fallback);
        generateQuestion(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const generateQuestion = (data: Country[] = countries) => {
    if (!data || data.length < 4) {
      console.error("Dados insuficientes para gerar pergunta");
      return;
    }

    const options: Country[] = [];
    const usedIndices = new Set<number>();

    while (options.length < 4) {
      const randomIndex = Math.floor(Math.random() * data.length);

      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        options.push(data[randomIndex]);
      }
    }

    const answer = options[Math.floor(Math.random() * options.length)];
    setQuestion({ options, answer });
    setFeedback("");
  };

  const handleAnswer = (country: Country) => {
    if (!question) return;

    if (country.name.common === question.answer.name.common) {
      setScore((s) => s + 1);
      setFeedback("✅ Correto!");
    } else {
      setFeedback(`❌ Errado! Era ${question.answer.name.common}`);
    }

    setTimeout(() => generateQuestion(), 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl">
        Carregando bandeiras...
      </div>
    );
  }

  if (!question && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-2xl">
        <p>Erro ao carregar países.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        🌍 Jogo: Adivinhe a Bandeira
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 text-center max-w-md w-full">
        {question && (
          <>
            <img
              src={question.answer.flags.png}
              alt="bandeira"
              className="w-64 h-40 object-cover mx-auto mb-6 rounded-md shadow"
            />

            <div className="grid grid-cols-2 gap-4">
              {question.options.map((country) => (
                <button
                  key={country.cca3}
                  onClick={() => handleAnswer(country)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition"
                >
                  {country.name.common}
                </button>
              ))}
            </div>
          </>
        )}

        <p className="text-lg mt-4 font-medium">{feedback}</p>
        <p className="mt-2 text-gray-600">Pontuação: {score}</p>
      </div>

      <button
        onClick={() => generateQuestion()}
        className="mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
      >
        Próxima bandeira
      </button>
    </div>
  );
}
