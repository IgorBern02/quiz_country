import { useState, useEffect } from "react";
import type { Country, ApiCountry } from "../types/types";

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

        console.log("API KEY:", import.meta.env.VITE_REST_COUNTRIES_API_KEY);

        const res = await fetch(
          "https://api.restcountries.com/countries/v5?limit=100&response_fields=names.common,names.translations,region,population,classification,flag.url_png,flag.url_svg,flag.emoji,codes.alpha_3",
          {
            headers: {
              Authorization: import.meta.env.VITE_REST_COUNTRIES_API_KEY,
            },
          },
        );

        if (!res.ok) {
          throw new Error(`Erro HTTP ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();

        console.log(
          data.data.objects
            .filter((c: ApiCountry) => c.codes?.alpha_3)
            .slice(0, 10),
        );

        // Filtro principal
        const filtered = data.data.objects
          .filter((country: ApiCountry) => {
            const name = country.names?.common;
            const code = country.codes?.alpha_3;

            return (
              name &&
              code &&
              country.classification?.dependency === false &&
              country.classification?.sovereign === true &&
              country.population &&
              country.population >= 1000000 &&
              country.region &&
              ["Europe", "Asia", "Africa", "Americas", "Oceania"].includes(
                country.region,
              )
            );
          })
          .map(
            (country: ApiCountry): Country => ({
              name: {
                common: country.names.common,
                common_pt:
                  country.names.translations?.por?.common ??
                  country.names.common,
              },
              flag: {
                url_png: country.flag?.url_png ?? "",
                url_svg: country.flag?.url_svg ?? "",
                emoji: country.flag?.emoji ?? "",
              },
              cca3: country.codes.alpha_3,
              region: country.region,
            }),
          );

        if (filtered.length < 4) {
          throw new Error(
            `Apenas ${filtered.length} países válidos encontrados (mínimo: 4)`,
          );
        }

        console.log(`✅ ${filtered.length} países carregados após filtragem`);
        setCountries(filtered);
      } catch (err: unknown) {
        console.log(import.meta.env.VITE_REST_COUNTRIES_API_KEY);
        console.error("Erro detalhado:", err);
        setError("Erro ao carregar países");
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};
