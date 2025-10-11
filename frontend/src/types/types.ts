export type Country = {
  name: {
    common: string;
  };
  flags: {
    png: string;
    svg?: string;
    alt?: string;
  };
  cca3: string;
  region?: string;
  independent?: boolean;
  population?: number;
  translations?: {
    por?: { official: string; common: string };
    pt?: { official: string; common: string };
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
