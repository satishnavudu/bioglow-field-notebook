import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, GlossyCard, SectionTitle } from '../components/ui';

const ROADMAP: { version: string; title: string; points: string[]; gradient: [string, string] }[] = [
  {
    version: 'V1 — Built now',
    title: 'Offline field notebook',
    gradient: ['#14532d', '#22c55e'],
    points: [
      '6 guided templates (plant, animal/reptile, BioGlow, carbon, quick capture, general)',
      '4 notebooks with counts, search and filters',
      'Photo, GPS, real voice-note recording — all stored offline on the phone',
      'Rain / Glove Mode, CSV export from the Notebook tab',
    ],
  },
  {
    version: 'V2 — Smarter in the field',
    title: 'Less typing, faster capture',
    gradient: ['#134e4a', '#2dd4bf'],
    points: [
      'On-device speech-to-text for voice notes (needs a native speech module — not in V1)',
      'Offline species / fungi picture guide to compare against',
      'Trail map: entries plotted from their GPS tags',
      'Reminder to re-check a BioGlow site after dark / after rain',
    ],
  },
  {
    version: 'V3 — Team ready',
    title: 'One shared expedition notebook',
    gradient: ['#1e3a5f', '#60a5fa'],
    points: [
      'At camp, phones sync into one shared notebook over Wi-Fi',
      'Export a full expedition report (PDF + CSV) for researchers',
      'Smartwatch quick-tap companion for sightings',
      'Optional cloud backup — only when the team chooses it',
    ],
  },
];

const ALTERNATIVES: { title: string; pro: string; con: string }[] = [
  {
    title: '🎙️ Voice-only recorder pendant',
    pro: 'Even lighter than a phone, hands-free.',
    con: 'No photo, no GPS, and you cannot check or organise notes in the field.',
  },
  {
    title: '📖 Waterproof e-ink tablet',
    pro: 'Great battery and readable in sunlight.',
    con: 'One more heavy device to carry, slow to type, no camera or GPS.',
  },
  {
    title: '🏷️ QR-coded waterproof tags',
    pro: 'Leave a tag at a finding and scan it later to add notes.',
    con: 'Tags can be lost or moved by animals/weather; still needs a phone app to read them.',
  },
  {
    title: '⌚ Smartwatch app',
    pro: 'Fastest tap-to-record on the wrist.',
    con: 'Screen too small for full templates — best as a companion to the phone app (see V3).',
  },
];

export function IdeasScreen() {
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.heading}>💡 Ideas & Roadmap</Text>
      <Text style={styles.sub}>
        For FLL judges: what we built, what we would improve, and the other ideas we compared it against.
      </Text>

      <SectionTitle>Improved versions</SectionTitle>
      {ROADMAP.map((r) => (
        <GlossyCard key={r.version} gradient={r.gradient} style={styles.gap}>
          <Text style={styles.cardVersion}>{r.version}</Text>
          <Text style={styles.cardTitle}>{r.title}</Text>
          {r.points.map((p) => (
            <Text key={p} style={styles.point}>•  {p}</Text>
          ))}
        </GlossyCard>
      ))}

      <SectionTitle>Alternate ideas we considered</SectionTitle>
      {ALTERNATIVES.map((a) => (
        <GlossyCard key={a.title} style={styles.gap}>
          <Text style={styles.altTitle}>{a.title}</Text>
          <Text style={styles.point}>✅ {a.pro}</Text>
          <Text style={styles.point}>⚠️ {a.con}</Text>
        </GlossyCard>
      ))}

      <GlossyCard style={styles.gap}>
        <Text style={styles.altTitle}>Why the phone app wins</Text>
        <Text style={styles.point}>
          Ecologists already carry a phone. It has the camera, GPS and microphone in one light
          device, works fully offline, and — unlike a paper notebook — rain cannot destroy the
          notes once they are saved.
        </Text>
      </GlossyCard>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16 },
  heading: { color: COLORS.text, fontSize: 24, fontWeight: '900' },
  sub: { color: COLORS.muted, fontSize: 13, marginTop: 6, lineHeight: 19 },
  gap: { marginBottom: 12 },
  cardVersion: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 3, marginBottom: 8 },
  point: { color: 'rgba(255,255,255,0.92)', fontSize: 14, lineHeight: 20, marginTop: 4 },
  altTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800', marginBottom: 6 },
});
