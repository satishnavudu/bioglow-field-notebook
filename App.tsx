import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { FieldEntry, NotebookKey, TabKey, TemplateDef } from './src/types';
import {
  entriesToCsv,
  loadEntries,
  loadGloveMode,
  saveEntries,
  saveGloveMode,
} from './src/storage';
import { HomeScreen } from './src/screens/HomeScreen';
import { EntryFormScreen } from './src/screens/EntryFormScreen';
import { NotebookScreen } from './src/screens/NotebookScreen';
import { EntryDetailScreen } from './src/screens/EntryDetailScreen';
import { IdeasScreen } from './src/screens/IdeasScreen';
import { COLORS } from './src/components/ui';
import { RainGloveOverlay } from './src/components/RainGloveOverlay';

type Route =
  | { name: 'tabs' }
  | { name: 'form'; template: TemplateDef }
  | { name: 'detail'; entryId: string };

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'notebook', label: 'Notebook', icon: '📓' },
  { key: 'ideas', label: 'Ideas', icon: '💡' },
];

export default function App() {
  const [entries, setEntries] = useState<FieldEntry[]>([]);
  const [glove, setGlove] = useState(false);
  const [tab, setTab] = useState<TabKey>('home');
  const [route, setRoute] = useState<Route>({ name: 'tabs' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<NotebookKey | 'all'>('all');
  const [loaded, setLoaded] = useState(false);
  const [showGloveAnim, setShowGloveAnim] = useState(false);
  const gloveAnimTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      setEntries(await loadEntries());
      setGlove(await loadGloveMode());
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) void saveEntries(entries);
  }, [entries, loaded]);

  const toggleGlove = useCallback((v: boolean) => {
    setGlove(v);
    void saveGloveMode(v);
    if (gloveAnimTimer.current) clearTimeout(gloveAnimTimer.current);
    if (v) {
      // Flashy rain + glove activation animation, then back to the app.
      setShowGloveAnim(true);
      gloveAnimTimer.current = setTimeout(() => setShowGloveAnim(false), 2150);
    } else {
      setShowGloveAnim(false);
    }
  }, []);

  const addEntry = useCallback((entry: FieldEntry) => {
    setEntries((prev) => [entry, ...prev]);
    setFilter('all');
    setSearch('');
    setTab('notebook');
    setRoute({ name: 'tabs' });
  }, []);

  const toggleStar = useCallback((entry: FieldEntry) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, starred: !e.starred } : e)),
    );
  }, []);

  const deleteEntry = useCallback((entry: FieldEntry) => {
    Alert.alert('Delete this entry?', entry.title, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setEntries((prev) => prev.filter((e) => e.id !== entry.id));
          setRoute({ name: 'tabs' });
          setTab('notebook');
        },
      },
    ]);
  }, []);

  const exportCsv = useCallback(async () => {
    if (entries.length === 0) {
      Alert.alert('Nothing to export', 'Save at least one entry first.');
      return;
    }
    const csv = entriesToCsv(entries);
    try {
      const dir = FileSystem.cacheDirectory;
      if (dir && (await Sharing.isAvailableAsync())) {
        const path = `${dir}bioglow-field-notes.csv`;
        await FileSystem.writeAsStringAsync(path, csv);
        await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Export BioGlow field notes' });
        return;
      }
      throw new Error('sharing unavailable');
    } catch {
      // Fallback: share the CSV as plain text.
      await Share.share({ title: 'BioGlow field notes (CSV)', message: csv });
    }
  }, [entries]);

  const detailEntry =
    route.name === 'detail' ? entries.find((e) => e.id === route.entryId) : undefined;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient colors={[COLORS.bgDeep, COLORS.bg, '#0a2e1f']} style={styles.fill}>
        <View style={styles.content}>
          {route.name === 'form' ? (
            <EntryFormScreen
              template={route.template}
              glove={glove}
              onSave={addEntry}
              onCancel={() => setRoute({ name: 'tabs' })}
            />
          ) : route.name === 'detail' && detailEntry ? (
            <EntryDetailScreen
              entry={detailEntry}
              glove={glove}
              onBack={() => setRoute({ name: 'tabs' })}
              onToggleStar={toggleStar}
              onDelete={deleteEntry}
            />
          ) : tab === 'home' ? (
            <HomeScreen
              entries={entries}
              glove={glove}
              onToggleGlove={toggleGlove}
              onPickTemplate={(t) => setRoute({ name: 'form', template: t })}
              onPickNotebook={(k) => {
                setFilter(k);
                setTab('notebook');
              }}
            />
          ) : tab === 'notebook' ? (
            <NotebookScreen
              entries={entries}
              glove={glove}
              search={search}
              onSearch={setSearch}
              filter={filter}
              onFilter={setFilter}
              onOpen={(e) => setRoute({ name: 'detail', entryId: e.id })}
              onToggleStar={toggleStar}
              onExport={exportCsv}
            />
          ) : (
            <IdeasScreen />
          )}
        </View>

        <RainGloveOverlay visible={showGloveAnim} />

        {route.name === 'tabs' && (
          <View style={styles.tabBar}>
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setTab(t.key)}
                  style={[styles.tab, glove && styles.tabGlove, active && styles.tabActive]}
                >
                  <Text style={[styles.tabIcon, glove && { fontSize: 26 }]}>{t.icon}</Text>
                  <Text style={[styles.tabLabel, active && styles.tabLabelActive, glove && { fontSize: 14 }]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgDeep },
  fill: { flex: 1 },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(4,21,15,0.92)',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tab: { flex: 1, alignItems: 'center', borderRadius: 14, paddingVertical: 6 },
  tabGlove: { paddingVertical: 12 },
  tabActive: { backgroundColor: 'rgba(163,230,53,0.16)' },
  tabIcon: { fontSize: 21 },
  tabLabel: { color: COLORS.muted, fontSize: 12, marginTop: 2, fontWeight: '600' },
  tabLabelActive: { color: COLORS.lime },
});
