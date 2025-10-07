import type { Country } from "../types/types";

interface OptionButtonProps {
  country: Country;
  onClick: (country: Country) => void;
  disabled?: boolean;
}

export const OptionButton = ({
  country,
  onClick,
  disabled,
}: OptionButtonProps) => {
  return (
    <button
      onClick={() => onClick(country)}
      disabled={disabled}
      className={`
        bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg  w-4/5 mx-auto
        font-semibold transition-all duration-300 ease-in-out
        transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50
        ${
          disabled
            ? "opacity-50 cursor-not-allowed hover:scale-100"
            : "opacity-100 cursor-pointer"
        }
      `}
    >
      {country.name.common}
    </button>
  );
};
