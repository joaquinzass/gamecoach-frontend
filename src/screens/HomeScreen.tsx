import React, { useState } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { Text, TextInput, Button, Surface, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { analyzePlayer, Game } from '../services/api';
import { GameSelector } from '../components/GameSelector';
import { getGameConfig } from '../constants/games';

export default function HomeScreen({ navigation }: any) {
  const [game,     setGame]     = useState<Game>('lol');
  const [gameName, setGameName] = useState('');
  const [tagLine,  setTagLine]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const cfg = getGameConfig(game);

  const handleAnalyze = async () => {
    if (!gameName.trim() || !tagLine.trim()) {
      setError('Completá el nombre y el tag.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await analyzePlayer(game, gameName.trim(), tagLine.trim());
      navigation.navigate('Result', { result });
    } catch {
      setError('No se encontró el invocador. Verificá nombre y tag.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Hero */}
          <View style={s.hero}>
            <MaterialCommunityIcons name="sword-cross" size={52} color={cfg.color} />
            <Text style={s.heroTitle}>
              GAME<Text style={{ color: cfg.color }}>COACH</Text>
            </Text>
            <Text style={s.heroSub}>Analizá tus partidas con Inteligencia Artificial</Text>
          </View>

          {/* Game selector */}
          <Text style={s.sectionLabel}>SELECCIONÁ EL JUEGO</Text>
          <GameSelector selected={game} onSelect={setGame} />

          {/* Search card */}
          <Surface style={[s.card, { borderColor: cfg.color + '44' }]} elevation={2}>
            <Text style={[s.cardEyebrow, { color: cfg.color }]}>{cfg.label.toUpperCase()}</Text>
            <Text style={s.cardTitle}>¿A quién analizamos?</Text>

            <TextInput
              label="Nombre de invocador"
              value={gameName}
              onChangeText={setGameName}
              mode="outlined"
              autoCapitalize="none"
              autoCorrect={false}
              left={<TextInput.Icon icon="account" />}
              style={s.input}
              outlineColor="#1A1A2A"
              activeOutlineColor={cfg.color}
            />

            <TextInput
              label="Tag"
              value={tagLine}
              onChangeText={setTagLine}
              mode="outlined"
              autoCapitalize="none"
              autoCorrect={false}
              left={<TextInput.Icon icon="pound" />}
              placeholder="Ej: LA1"
              style={s.input}
              outlineColor="#1A1A2A"
              activeOutlineColor={cfg.color}
            />

            {error ? <Text style={s.error}>{error}</Text> : null}

            <Button
              mode="contained"
              onPress={handleAnalyze}
              disabled={loading}
              style={[s.btn, { backgroundColor: cfg.color }]}
              contentStyle={s.btnContent}
              labelStyle={s.btnLabel}
              icon="lightning-bolt"
            >
              {loading ? 'Analizando...' : 'Analizar partidas'}
            </Button>

            {loading && (
              <View style={s.loadingWrap}>
                <ActivityIndicator color={cfg.color} />
                <Text style={s.loadingText}>Consultando Riot API e IA...</Text>
              </View>
            )}
          </Surface>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#08080F' },
  flex:        { flex: 1 },
  scroll:      { flexGrow: 1, justifyContent: 'center', padding: 24 },
  hero:        { alignItems: 'center', marginBottom: 32, gap: 8 },
  heroTitle:   { fontSize: 40, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  heroSub:     { fontSize: 13, color: '#8A8A9A', textAlign: 'center', lineHeight: 20 },
  sectionLabel:{ fontSize: 10, fontWeight: '700', letterSpacing: 2, color: '#3A3A4A', marginBottom: 10 },
  card:        { backgroundColor: '#0F0F1A', borderRadius: 20, padding: 24, borderWidth: 1 },
  cardEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
  cardTitle:   { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 20 },
  input:       { backgroundColor: '#08080F', marginBottom: 12 },
  error:       { color: '#EF5350', fontSize: 12, marginBottom: 8 },
  btn:         { borderRadius: 12, marginTop: 8 },
  btnContent:  { paddingVertical: 6 },
  btnLabel:    { color: '#000', fontWeight: '800', fontSize: 15 },
  loadingWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 16 },
  loadingText: { color: '#8A8A9A', fontSize: 13 },
});