import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NOTEBOOKS, TEMPLATES } from '../templates';
import type { FieldEntry, NotebookKey, TemplateDef } from '../types';
import { COLORS, GlossyCard, SectionTitle } from '../components/ui';

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
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.gloveTitle}>🌧️ Rain / Glove Mode</Text>
            <Text style={styles.muted}>Bigger buttons and text for wet hands and gloves.</Text>
          </View>
          <Switch value={glove} onValueChange={onToggleGlove} trackColor={{ true: COLORS.lime }} />
        </View>
      </GlossyCard>

      <SectionTitle>Start a finding — pick a template</SectionTitle>
      {TEMPLATES.map((t) => (
        <GlossyCard key={t.key} gradient={t.gradient} style={styles.cardGap} onPress={() => onPickTemplate(t)}>
          <Text style={[styles.cardTitle, glove && styles.bigText]}>
            {t.icon}  {t.title}
          </Text>
          <Text style={styles.cardSub}>{t.tagline}</Text>
        </GlossyCard>
      ))}

      <SectionTitle>Your notebooks</SectionTitle>
      {NOTEBOOKS.map((n) => (
        <GlossyCard key={n.key} gradient={n.gradient} style={styles.cardGap} onPress={() => onPickNotebook(n.key)}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={[styles.cardTitle, glove && styles.bigText]}>
                {n.icon}  {n.title}
              </Text>
              <Text style={styles.cardSub}>{n.tagline}</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{countFor(n.key)}</Text>
            </View>
          </View>
        </GlossyCard>
      ))}
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
  muted: { color: COLORS.muted, fontSize: 13, marginTop: 4, lineHeight: 18 },
  cardGap: { marginBottom: 12 },
  cardTitle: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
  bigText: { fontSize: 20 },
  cardSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  countBadge: {
    minWidth: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countText: { color: '#14532d', fontWeight: '900', fontSize: 16 },
});
