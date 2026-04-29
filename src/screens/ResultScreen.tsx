import React from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Text, Surface, Chip, Divider, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnalysisResult, MatchStat, Game } from '../services/api';
import { MatchCard } from '../components/MatchCard';
import { getGameConfig } from '../constants/games';

// ── Métrica individual del resumen ──
function MetricRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={s.metricRow}>
      <Text style={s.metricLabel}>{label}</Text>
      <Text style={[s.metricValue, color ? { color } : {}]}>{value}</Text>
    </View>
  );
}

// ── Anillo de winrate ──
function WinrateRing({ wins, total, color }: { wins: number; total: number; color: string }) {
  const pct = Math.round((wins / total) * 100);
  const ringColor = pct >= 50 ? '#4CAF50' : '#EF5350';
  return (
    <View style={[s.ring, { borderColor: ringColor }]}>
      <Text style={[s.ringPct,   { color: ringColor }]}>{pct}%</Text>
      <Text style={s.ringLabel}>WINRATE</Text>
      <Text style={[s.ringRatio, { color: ringColor }]}>{wins}W/{total - wins}L</Text>
    </View>
  );
}

// ── Card de resumen ──
function SummaryCard({ stats, game }: { stats: MatchStat[]; game: Game }) {
  const cfg      = getGameConfig(game);
  const wins     = stats.filter(s => s.win).length;
  const avgKills = (stats.reduce((a, s) => a + s.kills,  0) / stats.length).toFixed(1);
  const avgDeath = (stats.reduce((a, s) => a + s.deaths, 0) / stats.length).toFixed(1);
  const avgDmg   = Math.round(stats.reduce((a, s) => a + s.totalDamage, 0) / stats.length);

  return (
    <Surface style={s.summaryCard} elevation={2}>
      <WinrateRing wins={wins} total={stats.length} color={cfg.color} />
      <View style={s.summaryMetrics}>
        <MetricRow label="Kills prom."  value={avgKills} />
        <Divider style={s.metricDivider} />
        <MetricRow label="Deaths prom." value={avgDeath} color="#EF5350" />
        <Divider style={s.metricDivider} />
        <MetricRow label="Daño prom."   value={`${(avgDmg / 1000).toFixed(1)}k`} color={cfg.color} />
      </View>
    </Surface>
  );
}

// ── Pantalla principal ──
export default function ResultScreen({ route, navigation }: any) {
  const { result }: { result: AnalysisResult } = route.params;
  const cfg = getGameConfig(result.game);
  const { height } = useWindowDimensions();

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { minHeight: height }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            textColor={cfg.color}
            icon="arrow-left"
            style={s.backBtn}
          >
            Volver
          </Button>

          <View style={s.playerRow}>
            <MaterialCommunityIcons name={cfg.icon as any} size={28} color={cfg.color} />
            <View style={{ marginLeft: 12 }}>
              <Text style={s.playerName}>{result.player}</Text>
              <Text style={s.playerSub}>{cfg.label} · {result.matchesAnalyzed} partidas</Text>
            </View>
          </View>
        </View>

        {/* Resumen */}
        <SummaryCard stats={result.stats} game={result.game} />

        {/* Partidas */}
        <Text style={s.sectionLabel}>ÚLTIMAS PARTIDAS</Text>
        {result.stats.map((match, i) => (
          <MatchCard key={i} match={match} index={i} game={result.game} />
        ))}

        {/* Análisis IA — se adapta al contenido */}
        <Text style={s.sectionLabel}>ANÁLISIS IA</Text>
        <Surface style={[s.analysisCard, { borderColor: cfg.color + '33' }]} elevation={2}>
          <View style={s.analysisHeader}>
            <View style={[s.analysisIconWrap, { backgroundColor: cfg.colorBg, borderColor: cfg.color + '44' }]}>
              <MaterialCommunityIcons name="brain" size={22} color={cfg.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.analysisTitle}>GameCoach dice</Text>
              <Text style={s.analysisSub}>Basado en {result.matchesAnalyzed} partidas reales de {cfg.label}</Text>
            </View>
          </View>
          <Divider style={[s.analysisDivider, { backgroundColor: cfg.color + '22' }]} />
          {/* El texto se expande solo — sin altura fija */}
          <Text style={s.analysisText}>{result.analysis}</Text>
        </Surface>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#08080F' },
  scroll:  { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },

  // Header
  header:     { marginBottom: 20 },
  backBtn:    { alignSelf: 'flex-start', marginLeft: -8, marginBottom: 8 },
  playerRow:  { flexDirection: 'row', alignItems: 'center' },
  playerName: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  playerSub:  { fontSize: 12, color: '#8A8A9A', marginTop: 3 },

  // Summary
  summaryCard: {
    backgroundColor: '#0F0F1A', borderRadius: 18, padding: 20,
    borderWidth: 1, borderColor: '#1A1A2A',
    flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 24,
  },
  ring:       { width: 88, height: 88, borderRadius: 44, borderWidth: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#08080F' },
  ringPct:    { fontSize: 20, fontWeight: '800' },
  ringLabel:  { fontSize: 9, color: '#555', fontWeight: '700', letterSpacing: 1 },
  ringRatio:  { fontSize: 10, fontWeight: '600', marginTop: 2 },
  summaryMetrics: { flex: 1 },
  metricRow:  { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  metricLabel:{ fontSize: 12, color: '#8A8A9A' },
  metricValue:{ fontSize: 12, color: '#fff', fontWeight: '700' },
  metricDivider: { backgroundColor: '#1A1A2A' },

  // Section
  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: '#3A3A4A', marginBottom: 10, marginTop: 4 },

  // Analysis — sin altura fija, se adapta
  analysisCard: { backgroundColor: '#0F0F1A', borderRadius: 16, borderWidth: 1, padding: 18, marginBottom: 8 },
  analysisHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  analysisIconWrap: { width: 44, height: 44, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  analysisTitle:  { fontSize: 15, fontWeight: '700', color: '#fff' },
  analysisSub:    { fontSize: 11, color: '#8A8A9A', marginTop: 2 },
  analysisDivider:{ marginBottom: 14 },
  analysisText:   { fontSize: 14, color: '#8A8A9A', lineHeight: 24 },
});