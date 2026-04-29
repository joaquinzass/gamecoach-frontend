const BASE_URL = 'http://localhost:8080/api';

export type Game = 'lol' | 'valorant';

export interface MatchStat {
  champion:    string;
  kills:       number;
  deaths:      number;
  assists:     number;
  win:         boolean;
  visionScore: number;
  totalDamage: number;
}

export interface AnalysisResult {
  player:          string;
  game:            Game;
  matchesAnalyzed: number;
  stats:           MatchStat[];
  analysis:        string;
}

export const analyzePlayer = async (
  game: Game,
  gameName: string,
  tagLine: string
): Promise<AnalysisResult> => {
  const response = await fetch(`${BASE_URL}/analyze/${game}/${gameName}/${tagLine}`);
  if (!response.ok) throw new Error('Error al obtener datos');
  return response.json();
};