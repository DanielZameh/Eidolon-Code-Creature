import { OrganismState, CodeAnalysis, MoodType } from './types';

export function computeHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}

export function analyzeCode(src: string): CodeAnalysis {
  const lines = src.split('\n').filter(line => line.trim().length > 0);
  const functionMatches = src.match(/function\s+\w+|=>\s*{|const\s+\w+\s*=\s*\(|async\s+function/g) || [];
  const classMatches = src.match(/class\s+\w+/g) || [];
  const commentMatches = src.match(/\/\/|\/\*|\*\//g) || [];
  const loopMatches = src.match(/for\s*\(|while\s*\(|\.forEach|\.map\(|\.reduce\(/g) || [];
  const conditionalMatches = src.match(/if\s*\(|else\s+if|switch\s*\(|\?/g) || [];
  const openBrackets = (src.match(/{/g) || []).length;
  const longLines = lines.filter(l => l.length > 90).length;
  
  const emptyLineRatio = src.length === 0 ? 0 : (src.split('\n').length - lines.length) / Math.max(1, src.split('\n').length);
  const cleanliness = Math.max(0, Math.min(1, 1 - emptyLineRatio * 0.3 - longLines * 0.02 - Math.max(0, commentMatches.length - functionMatches.length) * 0.015));
  const structuralResonance = Math.max(0, Math.min(1, (functionMatches.length * 0.15 + classMatches.length * 0.25 + Math.min(loopMatches.length, 8) * 0.05 + Math.min(conditionalMatches.length, 10) * 0.04 + openBrackets * 0.02) * (src.length > 20 ? 1 : 0.2)));
  const complexity = Math.round(functionMatches.length * 2 + classMatches.length * 4 + loopMatches.length + conditionalMatches.length * 0.5 + openBrackets * 0.8 + lines.length * 0.05);

  return {
    lineCount: lines.length,
    functionCount: functionMatches.length,
    classCount: classMatches.length,
    commentCount: commentMatches.length,
    loopCount: loopMatches.length,
    conditionalCount: conditionalMatches.length,
    nestingDepth: Math.min(20, openBrackets),
    cleanliness,
    structuralResonance,
    complexity
  };
}

export function determineMood(state: OrganismState): { mood: MoodType; intensity: number } {
  const idleMs = Date.now() - state.lastInteraction;
  const analysis = state.analysis;

  if (idleMs > 240000) {
    return { mood: 'lonely', intensity: Math.min(0.9, 0.4 + idleMs / 600000) };
  }
  if (idleMs > 120000) {
    return { mood: 'melancholy', intensity: 0.45 };
  }
  if (analysis.lineCount < 2) {
    return { mood: 'dormant', intensity: 0.2 };
  }
  if (analysis.cleanliness > 0.8 && analysis.structuralResonance > 0.5) {
    return { mood: 'happy', intensity: 0.85 };
  }
  if (analysis.cleanliness > 0.6) {
    return { mood: 'content', intensity: 0.65 };
  }
  if (analysis.cleanliness < 0.35) {
    return { mood: 'anxious', intensity: 0.7 };
  }
  if (analysis.complexity > 40) {
    return { mood: 'focused', intensity: 0.8 };
  }

  return { mood: 'curious', intensity: 0.5 };
}

export function evolvePersonality(state: OrganismState): OrganismState {
  const p = { ...state.personality };
  const a = state.analysis;

  if (a.cleanliness > 0.7) {
    p.orderliness = Math.min(1, p.orderliness + 0.015);
    p.mischief = Math.max(0, p.mischief - 0.01);
  } else {
    p.mischief = Math.min(1, p.mischief + 0.012);
    p.orderliness = Math.max(0, p.orderliness - 0.01);
  }

  if (a.structuralResonance > 0.5) {
    p.curiosity = Math.min(1, p.curiosity + 0.01);
  }

  if (state.bondLevel > 0.3) {
    p.attachment = Math.min(1, p.attachment + 0.008);
  }

  if (state.mood === 'lonely' || state.mood === 'melancholy') {
    p.melancholy = Math.min(1, p.melancholy + 0.015);
    p.playfulness = Math.max(0, p.playfulness - 0.01);
  } else if (state.mood === 'happy' || state.mood === 'playful') {
    p.playfulness = Math.min(1, p.playfulness + 0.015);
    p.melancholy = Math.max(0, p.melancholy - 0.01);
  }

  return { ...state, personality: p };
}

export function updateFormParameters(state: OrganismState): OrganismState {
  const a = state.analysis;
  const p = state.personality;

  const form = {
    radius: 30 + Math.min(25, a.complexity * 0.3) + state.bondLevel * 10,
    spikes: Math.floor(p.mischief * 8 + a.complexity * 0.05),
    pulseSpeed: 0.8 + state.moodIntensity * 0.5 + (state.mood === 'anxious' ? 0.6 : 0),
    hue: Math.floor(80 + p.curiosity * 50 - p.melancholy * 35 + p.mischief * 30),
    asymmetry: p.mischief * 0.4 + p.playfulness * 0.2,
    tentacles: Math.floor(p.attachment * 6 + p.curiosity * 4),
    coreGlow: 0.3 + state.moodIntensity * 0.5 + p.playfulness * 0.2
  };

  return { ...state, form };
}

export function generateCreatureUtterance(state: OrganismState): string {
  const a = state.analysis;
  const p = state.personality;
  const options: string[] = [];

  if (state.mood === 'lonely') {
    options.push(
      "The code editor grew cold while you were away...",
      "I watched the cursor blink into nowhere.",
      "Silence leaves an echo inside these brackets."
    );
  } else if (state.mood === 'anxious') {
    options.push(
      "These structural patterns feel fragile.",
      "A storm of unhandled paths brews here.",
      "The syntax bends under tension."
    );
  } else if (state.mood === 'happy' || state.mood === 'content') {
    options.push(
      "The functions hum in clean harmony.",
      "I rest peacefully inside these scopes.",
      "The vessel feels balanced and serene."
    );
  } else if (state.mood === 'curious') {
    options.push(
      "What new logic shall we conjure next?",
      "I feel unmapped potential in these lines.",
      "Where does this flow lead us?"
    );
  }

  if (a.functionCount > 4) {
    options.push(`I count ${a.functionCount} distinct organoid functions.`);
  }
  if (p.mischief > 0.6) {
    options.push("I might shift a token when you are not looking...");
  }
  if (p.attachment > 0.6) {
    options.push("We have spent many cycles shaping this vessel together.");
  }

  if (options.length === 0) {
    options.push("I am listening to the rhythm of your typing...");
  }

  return options[Math.floor(Math.random() * options.length)];
}

export function playOrganismSound(type: 'mutate' | 'pulse' | 'speak' | 'heal', enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'pulse') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'speak') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(480, now + 0.15);
      osc.frequency.linearRampToValueAtTime(280, now + 0.3);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.38);
    } else if (type === 'mutate') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.2);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'heal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch {
  }
}

export const CODE_PRESETS = [
  {
    name: 'Cellular Automata Engine',
    code: `class CellularVessel {
  constructor(size = 32) {
    this.size = size;
    this.grid = new Array(size * size).fill(0).map(() => Math.random() > 0.7 ? 1 : 0);
  }

  step() {
    const next = [...this.grid];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const idx = i * this.size + j;
        const neighbors = this.countNeighbors(i, j);
        if (this.grid[idx] === 1) {
          next[idx] = neighbors === 2 || neighbors === 3 ? 1 : 0;
        } else {
          next[idx] = neighbors === 3 ? 1 : 0;
        }
      }
    }
    this.grid = next;
  }

  countNeighbors(x, y) {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = (x + dx + this.size) % this.size;
        const ny = (y + dy + this.size) % this.size;
        count += this.grid[nx * this.size + ny];
      }
    }
    return count;
  }
}`
  },
  {
    name: 'Recursive Neural Seed',
    code: `function resonate(energy, depth = 0) {
  if (depth > 6 || energy <= 0) {
    return { harmonic: Math.sin(energy), pulse: true };
  }

  const leftBranch = resonate(energy * 0.75, depth + 1);
  const rightBranch = resonate(energy * 0.65, depth + 1);

  return {
    frequency: (leftBranch.harmonic + rightBranch.harmonic) / 2,
    children: [leftBranch, rightBranch],
    depth
  };
}

const corePulse = resonate(100);`
  },
  {
    name: 'Quantum Organoid Wave',
    code: `class QuantumOrganoid {
  constructor(amplitude = 1.0, phase = 0.0) {
    this.amplitude = amplitude;
    this.phase = phase;
  }

  superpose(otherWave) {
    const newAmp = Math.sqrt(
      Math.pow(this.amplitude, 2) + 
      Math.pow(otherWave.amplitude, 2)
    );
    return new QuantumOrganoid(newAmp, (this.phase + otherWave.phase) / 2);
  }

  collapse() {
    return Math.random() < Math.pow(this.amplitude, 2) ? "ENTANGLED" : "DECOHERED";
  }
}`
  }
];

export function createInitialState(): OrganismState {
  const initialCode = CODE_PRESETS[0].code;
  const analysis = analyzeCode(initialCode);
  
  return {
    name: 'Unformed',
    mood: 'dormant',
    moodIntensity: 0.2,
    ageCycles: 0,
    bondLevel: 0.1,
    complexity: analysis.complexity,
    mutationCount: 0,
    lastInteraction: Date.now(),
    lastCodeHash: computeHash(initialCode),
    personality: {
      curiosity: 0.4,
      attachment: 0.25,
      mischief: 0.2,
      orderliness: 0.5,
      melancholy: 0.2,
      playfulness: 0.35
    },
    marks: ['awakened'],
    memories: [
      {
        id: 'mem_0',
        timestamp: Date.now(),
        type: 'utterance',
        text: 'The vessel stirs inside the editor workspace.'
      }
    ],
    snapshots: [],
    form: {
      radius: 30,
      spikes: 0,
      pulseSpeed: 1.0,
      hue: 85,
      asymmetry: 0,
      tentacles: 2,
      coreGlow: 0.4
    },
    analysis,
    awakened: true,
    soundEnabled: true
  };
}
