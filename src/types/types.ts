export type Country = {
  name: { common: string };
  flags: { png: string };
  cca3: string;
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
