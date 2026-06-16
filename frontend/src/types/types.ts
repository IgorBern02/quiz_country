export type Country = {
  name: {
    common: string;
    common_pt?: string;
  };
  flag: {
    url_png: string;
    url_svg: string;
    emoji?: string;
  };
  cca3: string;
  region: string;
};

export type ApiCountry = {
  names: {
    common: string;
    translations?: {
      por?: {
        common: string;
      };
    };
  };
  flag: {
    url_png: string;
    url_svg: string;
    emoji: string;
  };
  codes: {
    alpha_3: string;
  };
  region: string;
  population?: number;
  classification?: {
    dependency?: boolean;
    sovereign?: boolean;
  };
};
export interface Question {
  options: Country[];
  answer: Country;
}

export interface GameStats {
  score: number;
  lives: number;
  timeLeft: number;
  isGameOver: boolean;
}

export interface Question {
  options: Country[];
  answer: Country;
}

export interface GameStats {
  score: number;
  lives: number;
  timeLeft: number;
  isGameOver: boolean;
}
