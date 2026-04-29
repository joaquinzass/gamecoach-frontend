// ─────────────────────────────────────────────
// MatchCard — tarjeta de partida adaptable por juego
// Muestra u oculta "Visión" según el juego
// ─────────────────────────────────────────────
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MatchStat, Game } from '../services/api';
import { getGameConfig } from '../constants/games';

interface Props {
  match: MatchStat;
  index: number;
  game:  Game;
}

function StatItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={s.statItem}>
      <Text style={[s.statValue, color ? { color } : {}]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

export function MatchCard({ match, index, game }: Props) {
  const cfg     = getGameConfig(game);
  const kda     = ((match.kills + match.assists) / Math.max(match.deaths, 1)).toFixed(1);
  const kdaNum  = parseFloat(kda);
  const kdaColor= kdaNum >= 3 ? '#4CAF50' : kdaNum >= 2 ? cfg.color : '#EF5350';

  return (
    <Surface style={[s.card, match.win ? s.win : s.loss]} elevation={1}>
      {/* Barra lateral de color */}
      <View style={[s.accent, { backgroundColor: match.win ? '#4CAF50' : '#EF5350' }]} />

      <View style={s.body}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <MaterialCommunityIcons
              name={match.win ? 'trophy' : 'skull'}
              size={14}
              color={match.win ? '#4CAF50' : '#EF5350'}
              style={{ marginRight: 6 }}
            />
            <View>
              <Text style={s.champion}>{match.champion}</Text>
              <Text style={s.matchNum}>{cfg.agentLabel} · Partida {index + 1}</Text>
            </View>
          </View>
          <Chip
            mode="flat"
            textStyle={{ color: match.win ? '#4CAF50' : '#EF5350', fontSize: 11, fontWeight: '700' }}
            style={{ backgroundColor: match.win ? '#0A1F0A' : '#1F0A0A' }}
          >
            {match.win ? 'Victoria' : 'Derrota'}
          </Chip>
        </View>

        {/* Divider */}
        <View style={s.divider} />

        {/* Stats */}
        <View style={s.statsRow}>
          <StatItem label="K/D/A" value={`${match.kills}/${match.deaths}/${match.assists}`} />
          <View style={s.statDivider} />
          <StatItem label="KDA" value={kda} color={kdaColor} />
          <View style={s.statDivider} />
          <StatItem label="DAÑO" value={`${(match.totalDamage / 1000).toFixed(1)}k`} />
          {cfg.hasVision && (
            <>
              <View style={s.statDivider} />
              <StatItem
                label="VISIÓN"
                value={String(match.visionScore)}
                color={match.visionScore >= 40 ? cfg.color : undefined}
              />
            </>
          )}
        </View>
      </View>
    </Surface>
  );
}

const s = StyleSheet.create({
  card:        { flexDirection: 'row', borderRadius: 14, marginBottom: 10, overflow: 'hidden', borderWidth: 1 },
  win:         { backgroundColor: '#0b170b', borderColor: '#1a3a1a' },
  loss:        { backgroundColor: '#170b0b', borderColor: '#3a1a1a' },
  accent:      { width: 4 },
  body:        { flex: 1, padding: 14 },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft:  { flexDirection: 'row', alignItems: 'center' },
  champion:    { fontSize: 15, fontWeight: '700', color: '#fff' },
  matchNum:    { fontSize: 10, color: '#555', marginTop: 2 },
  divider:     { height: 1, backgroundColor: '#1A1A2A', marginVertical: 12 },
  statsRow:    { flexDirection: 'row', alignItems: 'center' },
  statItem:    { flex: 1, alignItems: 'center' },
  statValue:   { fontSize: 13, fontWeight: '700', color: '#fff' },
  statLabel:   { fontSize: 9, color: '#555', marginTop: 3, fontWeight: '700', letterSpacing: 1 },
  statDivider: { width: 1, height: 28, backgroundColor: '#1A1A2A' },
});