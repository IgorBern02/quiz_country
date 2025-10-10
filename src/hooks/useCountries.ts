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

        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca3,region,independent",
          { headers: { Accept: "application/json" } }
        );

        if (!res.ok) {
          throw new Error(`Erro HTTP ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();

        // Lista de nomes a excluir (territórios, ilhas, microestados, etc)
        const excludedNames = [
          "Bermuda",
          "Greenland",
          "Guam",
          "Cayman Islands",
          "Isle of Man",
          "Puerto Rico",
          "Falkland Islands",
          "Hong Kong",
          "Macau",
          "Jersey",
          "Guernsey",
          "Cook Islands",
          "Aruba",
          "Curacao",
          "Montserrat",
          "Saint Martin",
          "Sint Maarten",
          "Faroe Islands",
          "American Samoa",
          "Gibraltar",
          "Turks and Caicos Islands",
          "Virgin Islands (U.S.)",
          "Virgin Islands (British)",
          "French Polynesia",
          "New Caledonia",
          "Reunion",
          "Martinique",
          "Guadeloupe",
          "Mayotte",
          "Curaçao",
          "Åland Islands",
          "Saint Pierre and Miquelon",
          "Tokelau",
          "Wallis and Futuna",
          "Saint Barthélemy",
          "Saint Helena, Ascension and Tristan da Cunha",
          "Pitcairn Islands",
          "Niue",
          "Vatican City",
          "San Marino",
          "Liechtenstein",
          "Monaco",
          "Andorra",
          "Belize",
          "Bhutan",
          "Brunei",
          "Comoros",
          "Djibouti",
          "Eswatini",
          "Ethiopia",
          "Fiji",
          "Gabon",
          "Guyana",
          "Samoa",
          "Suriname",
          "Tonga",
          "Tuvalu",
          "Eritrea",
          "Vanuatu",
          "Malta",
          "Barbados",
          "Chad",
        ];

        // Filtro principal
        const filtered = data
          .filter((c: any) => {
            const name = c.name?.common;
            return (
              name &&
              !excludedNames.includes(name) &&
              c.flags?.png &&
              c.cca3 &&
              c.independent !== false &&
              ["Europe", "Asia", "Africa", "Americas", "Oceania"].includes(
                c.region
              )
            );
          })
          .map((c: any) => ({
            ...c,
            name: {
              common: c.name.common,
              commomn:
                c.translations?.por?.common ||
                c.translations?.pt?.common ||
                c.name.common,
            },
          }));

        if (filtered.length < 4) {
          throw new Error(
            `Apenas ${filtered.length} países válidos encontrados (mínimo: 4)`
          );
        }

        console.log(`✅ ${filtered.length} países carregados após filtragem`);
        setCountries(filtered);
      } catch (err: any) {
        console.error("Erro detalhado:", err);
        setError(err.message || "Erro ao carregar países");
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};
