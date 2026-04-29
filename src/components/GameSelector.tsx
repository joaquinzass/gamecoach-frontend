// ─────────────────────────────────────────────
// GameSelector — selector visual de juego
// Muestra tarjetas tocables para LoL y Valorant
// ─────────────────────────────────────────────
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Game } from '../services/api';
import { GAMES, GameConfig } from '../constants/games';

interface Props {
  selected: Game;
  onSelect: (game: Game) => void;
}

export function GameSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      {GAMES.map((g: GameConfig) => {
        const isActive = selected === g.id;
        return (
          <TouchableOpacity
            key={g.id}
            style={styles.touch}
            onPress={() => onSelect(g.id)}
            activeOpacity={0.8}
          >
            <Surface
              style={[
                styles.card,
                { borderColor: isActive ? g.color : '#1A1A2A' },
                isActive && { backgroundColor: g.colorBg },
              ]}
              elevation={isActive ? 2 : 0}
            >
              <MaterialCommunityIcons
                name={g.icon as any}
                size={28}
                color={isActive ? g.color : '#3A3A4A'}
              />
              <Text style={[styles.label, { color: isActive ? g.color : '#3A3A4A' }]}>
                {g.label}
              </Text>
              {isActive && (
                <View style={[styles.dot, { backgroundColor: g.color }]} />
              )}
            </Surface>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:   { flexDirection: 'row', gap: 10, marginBottom: 20 },
  touch:  { flex: 1 },
  card: {
    backgroundColor: '#0F0F1A',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  label:  { fontSize: 11, fontWeight: '700', textAlign: 'center', letterSpacing: 0.3 },
  dot: {
    position: 'absolute', top: 8, right: 8,
    width: 7, height: 7, borderRadius: 4,
  },
});