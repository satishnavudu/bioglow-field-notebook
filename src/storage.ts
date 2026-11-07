import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FieldEntry } from './types';
import { notebookByKey, templateByKey } from './templates';

const STORAGE_KEY = 'bioglow.fieldEntries.v1';
const GLOVE_KEY = 'bioglow.gloveMode.v1';

export async function loadEntries(): Promise<FieldEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FieldEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveEntries(entries: FieldEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Offline-first: if the device storage write fails there is nowhere
    // else to send the data in the field. The caller keeps the in-memory
    // copy, so nothing is lost until the app is closed.
  }
}

export async function loadGloveMode(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(GLOVE_KEY)) === '1';
  } catch {
    return false;
  }
}

export async function saveGloveMode(on: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(GLOVE_KEY, on ? '1' : '0');
  } catch {
    // Non-critical preference.
  }
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** Build a CSV export of all entries. Pure string work — unit-testable. */
export function entriesToCsv(entries: FieldEntry[]): string {
  const header = [
    'Date',
    'Title',
    'Template',
    'Notebook',
    'Starred',
    'Latitude',
    'Longitude',
    'Location',
    'Details',
    'Notes',
    'Photo URI',
    'Voice note URI',
  ];
  const rows = entries.map((e) => {
    const template = templateByKey(e.templateKey);
    const details = template.fields
      .map((f) => {
        const v = e.values[f.key];
        return v ? `${f.label}: ${v}` : '';
      })
      .filter(Boolean)
      .join('; ');
    return [
      e.createdAt,
      e.title,
      template.title,
      notebookByKey(e.notebookKey).title,
      e.starred ? 'yes' : 'no',
      e.latitude != null ? String(e.latitude) : '',
      e.longitude != null ? String(e.longitude) : '',
      e.locationLabel,
      details,
      e.notes,
      e.photoUri ?? '',
      e.voiceUri ?? '',
    ]
      .map(csvCell)
      .join(',');
  });
  return [header.map(csvCell).join(','), ...rows].join('\n');
}
