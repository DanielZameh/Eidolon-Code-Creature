export type MoodType =
  | 'dormant'
  | 'curious'
  | 'content'
  | 'happy'
  | 'anxious'
  | 'lonely'
  | 'agitated'
  | 'focused'
  | 'playful'
  | 'melancholy';

export interface PersonalityTraits {
  curiosity: number;
  attachment: number;
  mischief: number;
  orderliness: number;
  melancholy: number;
  playfulness: number;
}

export interface CodeAnalysis {
  lineCount: number;
  functionCount: number;
  classCount: number;
  commentCount: number;
  loopCount: number;
  conditionalCount: number;
  nestingDepth: number;
  cleanliness: number;
  structuralResonance: number;
  complexity: number;
}

export interface OrganismForm {
  radius: number;
  spikes: number;
  pulseSpeed: number;
  hue: number;
  asymmetry: number;
  tentacles: number;
  coreGlow: number;
}

export interface MemoryItem {
  id: string;
  timestamp: number;
  type: 'snapshot' | 'utterance' | 'mutation' | 'commune' | 'transmutation';
  text: string;
}

export interface VersionSnapshot {
  id: string;
  timestamp: number;
  code: string;
  lineCount: number;
  complexity: number;
  mood: MoodType;
}

export interface OrganismState {
  name: string;
  mood: MoodType;
  moodIntensity: number;
  ageCycles: number;
  bondLevel: number;
  complexity: number;
  mutationCount: number;
  lastInteraction: number;
  lastCodeHash: string;
  personality: PersonalityTraits;
  marks: string[];
  memories: MemoryItem[];
  snapshots: VersionSnapshot[];
  form: OrganismForm;
  analysis: CodeAnalysis;
  awakened: boolean;
  soundEnabled: boolean;
}

export interface FeatureUpdate {
  version: string;
  date: string;
  title: string;
  highlights: string[];
  badge?: string;
}
