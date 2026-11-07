export type NotebookKey = 'species' | 'bioglow' | 'carbon' | 'journal';

export type TemplateKey =
  | 'plant'
  | 'animal'
  | 'bioglow'
  | 'carbon'
  | 'quick'
  | 'general';

export type FieldType =
  | 'text'
  | 'multiline'
  | 'chips'
  | 'glowColour'
  | 'brightness';

export interface TemplateField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
}

export interface TemplateDef {
  key: TemplateKey;
  title: string;
  icon: string;
  tagline: string;
  defaultNotebook: NotebookKey;
  gradient: [string, string];
  fields: TemplateField[];
}

export interface NotebookDef {
  key: NotebookKey;
  title: string;
  icon: string;
  tagline: string;
  gradient: [string, string];
}

export interface FieldEntry {
  id: string;
  templateKey: TemplateKey;
  notebookKey: NotebookKey;
  title: string;
  /** Guided template answers, keyed by TemplateField.key */
  values: Record<string, string>;
  notes: string;
  latitude: number | null;
  longitude: number | null;
  locationLabel: string;
  photoUri: string | null;
  /** Local file URI of a recorded voice note (expo-av), or null */
  voiceUri: string | null;
  starred: boolean;
  createdAt: string; // ISO string
}

export type TabKey = 'home' | 'notebook' | 'ideas';
