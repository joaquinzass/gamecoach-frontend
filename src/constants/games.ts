// ─────────────────────────────────────────────
// Configuración visual y de texto por juego
// Agregar un juego nuevo = agregar una entrada acá
// ─────────────────────────────────────────────
import { Game } from '../services/api';

export interface GameConfig {
  id:          Game;
  label:       string;
  icon:        string;   
  color:       string;
  colorBg:     string;
  agentLabel:  string;   // "Campeón" en LoL, "Agente" en Valorant
  hasVision:   boolean;
}

export const GAMES: GameConfig[] = [
  {
    id:         'lol',
    label:      'League of Legends',
    icon:       'sword-cross',
    color:      '#C89B3C',
    colorBg:    '#C89B3C18',
    agentLabel: 'Campeón',
    hasVision:  true,
  },
  {
    id:         'valorant',
    label:      'Valorant',
    icon:       'shield-sword',
    color:      '#FF4655',
    colorBg:    '#FF465518',
    agentLabel: 'Agente',
    hasVision:  false,
  },
];

export const getGameConfig = (id: Game): GameConfig =>
  GAMES.find(g => g.id === id) ?? GAMES[0];