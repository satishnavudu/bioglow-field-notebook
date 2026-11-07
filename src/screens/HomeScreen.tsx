import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NOTEBOOKS, TEMPLATES } from '../templates';
import type { FieldEntry, NotebookKey, TemplateDef } from '../types';
import { COLORS, GlossyCard, SectionTitle } from '../components/ui';

/** One full glossy tile in the 2-column grid: big icon tile on top, title, tagline. */
function Tile({
  icon,
  title,
  tagline,
  gradient,
  glove,
  minHeight,
  badge,
  onPress,
}: {
  icon: string;
  title: string;
  tagline: string;
  gradient: [string, string];
  glove: boolean;
  minHeight: number;
  badge?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tileOuter, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={gradient}
        style={[styles.tile, { minHeight: glove ? minHeight + 24 : minHeight }]}
      >
        <View style={styles.highlight} />
        {badge !== undefined && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{badge}</Text>
          </View>
        )}
        <View style={[styles.iconBox, glove && styles.iconBoxBig]}>
          <Text style={[styles.iconText, glove && styles.iconTextBig]}>{icon}</Text>
        </View>
        <Text style={[styles.tileTitle, glove && styles.bigText]}>{title}</Text>
        <Text style={styles.tileSub}>{tagline}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function HomeScreen({
  entries,
  glove,
  onToggleGlove,
  onPickTemplate,
  onPickNotebook,
}: {
  entries: FieldEntry[];
  glove: boolean;
  onToggleGlove: (v: boolean) => void;
  onPickTemplate: (t: TemplateDef) => void;
  onPickNotebook: (k: NotebookKey) => void;
}) {
  const countFor = (k: NotebookKey) => entries.filter((e) => e.notebookKey === k).length;
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <LinearGradient colors={['#0b3d2e', '#14532d', '#365314']} style={styles.hero}>
        <View style={styles.highlight} />
        <Text style={styles.heroIcon}>🍄✨</Text>
        <Text style={styles.heroTitle}>BioGlow Field Notebook</Text>
        <Text style={styles.heroSub}>
          Offline notes for rainforest findings — no laptop, no soggy notebook.
        </Text>
        <Text style={styles.heroStat}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'} saved on this phone · works with no signal
        </Text>
      </LinearGradient>

      <GlossyCard style={styles.gloveCard}>
        <View style={styles.rowBetween}>
          <View style={styles.gloveIconBox}>
            <Text style={styles.gloveIconText}>🧤</Text>
          </View>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.gloveTitle}>🌧️ Rain / Glove Mode</Text>
            <Text style={styles.muted}>Bigger buttons and text for wet hands and gloves.</Text>
          </View>
          <Switch value={glove} onValueChange={onToggleGlove} trackColor={{ true: COLORS.lime }} />
        </View>
      </GlossyCard>

      <SectionTitle>Start a finding — pick a template</SectionTitle>
      <View style={styles.grid}>
        {TEMPLATES.map((t) => (
          <Tile
            key={t.key}
            icon={t.icon}
            title={t.title}
            tagline={t.tagline}
            gradient={t.gradient}
            glove={glove}
            minHeight={158}
            onPress={() => onPickTemplate(t)}
          />
        ))}
      </View>

      <SectionTitle>Your notebooks</SectionTitle>
      <View style={styles.grid}>
        {NOTEBOOKS.map((n) => (
          <Tile
            key={n.key}
            icon={n.icon}
            title={n.title}
            tagline={n.tagline}
            gradient={n.gradient}
            glove={glove}
            minHeight={140}
            badge={String(countFor(n.key))}
            onPress={() => onPickNotebook(n.key)}
          />
        ))}
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16 },
  hero: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  heroIcon: { fontSize: 40 },
  heroTitle: { color: COLORS.text, fontSize: 26, fontWeight: '900', marginTop: 6 },
  heroSub: { color: '#d9f99d', fontSize: 15, marginTop: 6, lineHeight: 21 },
  heroStat: { color: COLORS.muted, fontSize: 13, marginTop: 12 },
  gloveCard: { marginTop: 16 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gloveTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800' },
  gloveIconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(163,230,53,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gloveIconText: { fontSize: 40 },
  muted: { color: COLORS.muted, fontSize: 13, marginTop: 4, lineHeight: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  tileOuter: { width: '50%', padding: 6 },
  pressed: { opacity: 0.85 },
  tile: {
    borderRadius: 22,
    padding: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconBoxBig: { width: 64, height: 64, borderRadius: 18 },
  iconText: { fontSize: 28 },
  iconTextBig: { fontSize: 34 },
  tileTitle: { color: '#ffffff', fontSize: 16, fontWeight: '800', lineHeight: 20 },
  bigText: { fontSize: 19, lineHeight: 23 },
  tileSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12.5, marginTop: 4, lineHeight: 17 },
  countBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    zIndex: 2,
  },
  countText: { color: '#14532d', fontWeight: '900', fontSize: 15 },
});
