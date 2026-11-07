import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NOTEBOOKS, templateByKey } from '../templates';
import type { FieldEntry, NotebookKey } from '../types';
import { BigButton, COLORS, Chip, GlossyCard } from '../components/ui';

export function NotebookScreen({
  entries,
  glove,
  search,
  onSearch,
  filter,
  onFilter,
  onOpen,
  onToggleStar,
  onExport,
}: {
  entries: FieldEntry[];
  glove: boolean;
  search: string;
  onSearch: (v: string) => void;
  filter: NotebookKey | 'all';
  onFilter: (k: NotebookKey | 'all') => void;
  onOpen: (e: FieldEntry) => void;
  onToggleStar: (e: FieldEntry) => void;
  onExport: () => void;
}) {
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries
      .filter((e) => filter === 'all' || e.notebookKey === filter)
      .filter(
        (e) =>
          !q ||
          e.title.toLowerCase().includes(q) ||
          e.notes.toLowerCase().includes(q) ||
          Object.values(e.values).join(' ').toLowerCase().includes(q),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [entries, filter, search]);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.heading}>📓 Notebook</Text>
      <Text style={styles.sub}>
        {entries.length} saved offline · tap an entry to see details
      </Text>

      <TextInput
        style={[styles.search, { fontSize: glove ? 18 : 15 }]}
        placeholder="Search findings…"
        placeholderTextColor={COLORS.muted}
        value={search}
        onChangeText={onSearch}
      />

      <View style={styles.chipRow}>
        <Chip label={`All (${entries.length})`} glove={glove} selected={filter === 'all'} onPress={() => onFilter('all')} />
        {NOTEBOOKS.map((n) => (
          <Chip
            key={n.key}
            label={`${n.title.replace(' Notebook', '').replace('Daily Field ', '')} (${entries.filter((e) => e.notebookKey === n.key).length})`}
            glove={glove}
            selected={filter === n.key}
            onPress={() => onFilter(n.key)}
          />
        ))}
      </View>

      <BigButton title="⬆️ Export all as CSV" glove={glove} variant="ghost" onPress={onExport} />
      <View style={{ height: 14 }} />

      {visible.length === 0 ? (
        <GlossyCard>
          <Text style={styles.emptyTitle}>No entries yet</Text>
          <Text style={styles.emptySub}>
            {entries.length === 0
              ? 'Go to Home and tap a template to record your first finding.'
              : 'Nothing matches this search / filter. Try clearing it.'}
          </Text>
        </GlossyCard>
      ) : (
        visible.map((e) => {
          const t = templateByKey(e.templateKey);
          return (
            <GlossyCard key={e.id} gradient={t.gradient} style={styles.cardGap} onPress={() => onOpen(e)}>
              <View style={styles.rowBetween}>
                <Text style={[styles.cardTitle, glove && { fontSize: 20 }]}>
                  {t.icon} {e.title}
                </Text>
                <Text
                  style={styles.star}
                  onPress={() => onToggleStar(e)}
                >
                  {e.starred ? '★' : '☆'}
                </Text>
              </View>
              <Text style={styles.cardSub}>
                {t.title} · {new Date(e.createdAt).toLocaleDateString()}{' '}
                {new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {e.locationLabel ? ` · ${e.locationLabel}` : ''}
              </Text>
              {e.photoUri ? <Text style={styles.cardSub}>📷 Photo attached</Text> : null}
              {e.voiceUri ? <Text style={styles.cardSub}>🎙️ Voice note attached</Text> : null}
            </GlossyCard>
          );
        })
      )}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16 },
  heading: { color: COLORS.text, fontSize: 24, fontWeight: '900' },
  sub: { color: COLORS.muted, fontSize: 13, marginTop: 6, marginBottom: 12 },
  search: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 999,
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  cardGap: { marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1, paddingRight: 8 },
  star: { color: '#fde047', fontSize: 26, paddingHorizontal: 6 },
  cardSub: { color: 'rgba(255,255,255,0.88)', fontSize: 13, marginTop: 4 },
  emptyTitle: { color: COLORS.text, fontSize: 17, fontWeight: '800' },
  emptySub: { color: COLORS.muted, fontSize: 14, marginTop: 6, lineHeight: 20 },
});
