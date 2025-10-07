import { useState, useEffect } from "react";
import type { Country } from "../types/types";

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError("");
        setCountries([]);

        console.log("Buscando países da API...");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          throw new Error("Timeout - API não respondeu a tempo");
        }, 8000);

        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca3",
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          }
        );

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`Erro HTTP ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Resposta da API não é um array válido");
        }

        const filtered = data.filter(
          (c: any) => c.name?.common && c.flags?.png && c.cca3
        );

        if (filtered.length < 4) {
          throw new Error(
            `Apenas ${filtered.length} países válidos encontrados (mínimo: 4)`
          );
        }

        console.log(`✅ ${filtered.length} países carregados com sucesso`);
        setCountries(filtered);
      } catch (err: any) {
        console.error("Erro detalhado:", err);
        const errorMessage =
          err.name === "AbortError"
            ? "A requisição demorou muito tempo. Verifique sua conexão."
            : err.message || "Erro desconhecido ao carregar países";

        setError(errorMessage);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};
