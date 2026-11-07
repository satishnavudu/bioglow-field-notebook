import type { NotebookDef, TemplateDef } from './types';

export const NOTEBOOKS: NotebookDef[] = [
  {
    key: 'species',
    title: 'Species Notebook',
    icon: '🌿',
    tagline: 'Plants, animals & reptiles',
    gradient: ['#14532d', '#22c55e'],
  },
  {
    key: 'bioglow',
    title: 'BioGlow Notebook',
    icon: '✨',
    tagline: 'Glowing fungi & organisms',
    gradient: ['#134e4a', '#2dd4bf'],
  },
  {
    key: 'carbon',
    title: 'Carbon Notebook',
    icon: '♻️',
    tagline: 'Carbon cycle observations',
    gradient: ['#3b2f0b', '#eab308'],
  },
  {
    key: 'journal',
    title: 'Daily Field Journal',
    icon: '📓',
    tagline: 'Everything else, day by day',
    gradient: ['#1e3a5f', '#60a5fa'],
  },
];

export const GLOW_COLOURS = [
  { name: 'Green', hex: '#4ade80' },
  { name: 'Teal', hex: '#2dd4bf' },
  { name: 'Blue', hex: '#60a5fa' },
  { name: 'Yellow', hex: '#facc15' },
  { name: 'Purple', hex: '#c084fc' },
  { name: 'Orange', hex: '#fb923c' },
  { name: 'White', hex: '#f8fafc' },
];

export const TEMPLATES: TemplateDef[] = [
  {
    key: 'plant',
    title: 'New Plant Species',
    icon: '🌿',
    tagline: 'Leaf, flower, size & habitat',
    defaultNotebook: 'species',
    gradient: ['#14532d', '#4ade80'],
    fields: [
      { key: 'leaf', label: 'Leaf shape / size', type: 'text', placeholder: 'e.g. broad, glossy, ~20 cm' },
      { key: 'flower', label: 'Flower / fruit', type: 'text', placeholder: 'Colour, shape, smell' },
      { key: 'height', label: 'Plant height', type: 'text', placeholder: 'e.g. about 1 metre' },
      {
        key: 'habitat',
        label: 'Habitat',
        type: 'chips',
        options: ['Forest floor', 'Tree trunk', 'River bank', 'Canopy', 'Fallen log', 'Clearing'],
      },
      { key: 'glow', label: 'Does any part glow?', type: 'chips', options: ['No', 'Yes — roots', 'Yes — leaves', 'Yes — fungi on it', 'Not sure'] },
    ],
  },
  {
    key: 'animal',
    title: 'Animal / Reptile Sighting',
    icon: '🦎',
    tagline: 'What you saw, behaviour & tracks',
    defaultNotebook: 'species',
    gradient: ['#713f12', '#f59e0b'],
    fields: [
      { key: 'speciesGuess', label: 'Species guess', type: 'text', placeholder: 'e.g. small green frog' },
      { key: 'size', label: 'Size', type: 'text', placeholder: 'e.g. about 5 cm, longer than my hand' },
      {
        key: 'behaviour',
        label: 'Behaviour',
        type: 'chips',
        options: ['Feeding', 'Moving', 'Resting', 'Calling / sound', 'Hiding', 'Swimming'],
      },
      { key: 'tracks', label: 'Tracks / signs', type: 'text', placeholder: 'Footprints, droppings, shed skin…' },
      { key: 'glow', label: 'Any glow?', type: 'chips', options: ['No', 'Yes', 'Not sure'] },
    ],
  },
  {
    key: 'bioglow',
    title: 'BioGlow Finding',
    icon: '✨',
    tagline: 'Glowing fungi & organisms — the core FLL template',
    defaultNotebook: 'bioglow',
    gradient: ['#134e4a', '#a3e635'],
    fields: [
      {
        key: 'organism',
        label: 'What is glowing?',
        type: 'chips',
        options: ['Fungi', 'Moss', 'Insect', 'Frog / animal', 'Water', 'Unknown'],
      },
      { key: 'glowColour', label: 'Glow colour', type: 'glowColour' },
      { key: 'brightness', label: 'Brightness (1 = faint, 5 = very bright)', type: 'brightness' },
      {
        key: 'habitat',
        label: 'Habitat',
        type: 'chips',
        options: ['Fallen log', 'Leaf litter', 'Tree bark', 'Soil', 'Stream', 'Cave / dark hollow'],
      },
      {
        key: 'weather',
        label: 'Weather',
        type: 'chips',
        options: ['Dry', 'Light rain', 'Heavy rain', 'Humid / misty', 'After rain'],
      },
      { key: 'when', label: 'When does it glow?', type: 'text', placeholder: 'e.g. only fully dark, after rain' },
    ],
  },
  {
    key: 'carbon',
    title: 'Carbon Cycle Observation',
    icon: '♻️',
    tagline: 'Decay, soil, trees & water',
    defaultNotebook: 'carbon',
    gradient: ['#3b2f0b', '#84cc16'],
    fields: [
      {
        key: 'stage',
        label: 'What did you observe?',
        type: 'chips',
        options: ['Fallen tree', 'Rotting log', 'Leaf litter', 'Soil', 'New growth', 'Stream / water', 'Fungi decomposing'],
      },
      { key: 'decay', label: 'Decay stage', type: 'chips', options: ['Fresh', 'Starting to soften', 'Well rotted', 'Almost soil'] },
      { key: 'smell', label: 'Smell / feel of soil', type: 'text', placeholder: 'e.g. rich, earthy, damp' },
      { key: 'signs', label: 'Signs of life returning carbon', type: 'multiline', placeholder: 'Fungi, insects, seedlings growing from it…' },
    ],
  },
  {
    key: 'quick',
    title: 'Quick Photo + Voice Capture',
    icon: '📸',
    tagline: 'Photo + voice note now, details later at camp',
    defaultNotebook: 'journal',
    gradient: ['#581c87', '#e879f9'],
    fields: [
      { key: 'what', label: 'One-line reminder', type: 'text', placeholder: 'e.g. glowing log by the stream — check tonight' },
    ],
  },
  {
    key: 'general',
    title: 'General Field Note',
    icon: '📝',
    tagline: 'Anything that does not fit a template',
    defaultNotebook: 'journal',
    gradient: ['#1e3a5f', '#38bdf8'],
    fields: [
      { key: 'category', label: 'Category', type: 'chips', options: ['Observation', 'Question', 'Idea', 'Reminder', 'Team note'] },
      { key: 'detail', label: 'Details', type: 'multiline', placeholder: 'Write what you noticed…' },
    ],
  },
];

export function templateByKey(key: string): TemplateDef {
  return TEMPLATES.find((t) => t.key === key) ?? TEMPLATES[TEMPLATES.length - 1];
}

export function notebookByKey(key: string): NotebookDef {
  return NOTEBOOKS.find((n) => n.key === key) ?? NOTEBOOKS[NOTEBOOKS.length - 1];
}
