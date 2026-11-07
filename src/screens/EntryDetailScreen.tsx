import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { notebookByKey, templateByKey } from '../templates';
import type { FieldEntry } from '../types';
import { BigButton, COLORS, GlossyCard } from '../components/ui';

export function EntryDetailScreen({
  entry,
  glove,
  onBack,
  onToggleStar,
  onDelete,
}: {
  entry: FieldEntry;
  glove: boolean;
  onBack: () => void;
  onToggleStar: (e: FieldEntry) => void;
  onDelete: (e: FieldEntry) => void;
}) {
  const template = templateByKey(entry.templateKey);
  const notebook = notebookByKey(entry.notebookKey);
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.heading}>
        {template.icon} {entry.title}
      </Text>
      <Text style={styles.sub}>
        {template.title} · {notebook.title}
        {'\n'}
        {new Date(entry.createdAt).toLocaleString()}
      </Text>

      {entry.photoUri ? <Image source={{ uri: entry.photoUri }} style={styles.photo} /> : null}

      <GlossyCard style={{ marginTop: 16 }}>
        {template.fields.map((f) => {
          const v = entry.values[f.key];
          if (!v) return null;
          return (
            <View key={f.key} style={styles.row}>
              <Text style={styles.label}>{f.label}</Text>
              <Text style={styles.value}>{v}</Text>
            </View>
          );
        })}
        {entry.locationLabel ? (
          <View style={styles.row}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>{entry.locationLabel}</Text>
          </View>
        ) : null}
        {entry.latitude != null && entry.longitude != null ? (
          <View style={styles.row}>
            <Text style={styles.label}>GPS</Text>
            <Text style={styles.value}>
              {entry.latitude.toFixed(5)}, {entry.longitude.toFixed(5)}
            </Text>
          </View>
        ) : null}
        {entry.voiceUri ? (
          <View style={styles.row}>
            <Text style={styles.label}>Voice note</Text>
            <Text style={styles.value}>Recorded — stored on this phone ({entry.voiceUri.split('/').pop()})</Text>
          </View>
        ) : null}
        {entry.notes ? (
          <View style={styles.row}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{entry.notes}</Text>
          </View>
        ) : null}
      </GlossyCard>

      <View style={{ height: 16 }} />
      <BigButton
        title={entry.starred ? '★ Starred — tap to unstar' : '☆ Star this entry'}
        glove={glove}
        variant="ghost"
        onPress={() => onToggleStar(entry)}
      />
      <View style={{ height: 10 }} />
      <BigButton title="← Back to Notebook" glove={glove} onPress={onBack} />
      <View style={{ height: 10 }} />
      <BigButton title="🗑️ Delete this entry" glove={glove} variant="danger" onPress={() => onDelete(entry)} />
      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16 },
  heading: { color: COLORS.text, fontSize: 24, fontWeight: '900' },
  sub: { color: COLORS.muted, fontSize: 13, marginTop: 6, lineHeight: 19 },
  photo: { width: '100%', height: 240, borderRadius: 16, marginTop: 16 },
  row: { marginBottom: 12 },
  label: { color: COLORS.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  value: { color: COLORS.text, fontSize: 16, marginTop: 3, lineHeight: 22 },
});
