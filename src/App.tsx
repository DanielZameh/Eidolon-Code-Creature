import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Scan,
  Sprout,
  MessageSquare,
  RotateCcw,
  AlignLeft,
  Camera,
  Trash2,
  Volume2,
  VolumeX,
  Ghost,
  BookOpen,
  Brain,
  Zap,
  Code,
  Flame,
  PlusCircle,
  Wind,
  Bell,
  X,
  Layers
} from 'lucide-react';
import {
  OrganismState,
  MoodType,
  MemoryItem,
  VersionSnapshot,
  FeatureUpdate
} from './types';
import {
  createInitialState,
  analyzeCode,
  determineMood,
  evolvePersonality,
  updateFormParameters,
  generateCreatureUtterance,
  playOrganismSound,
  computeHash,
  CODE_PRESETS
} from './organismEngine';

const RELEASE_UPDATES: FeatureUpdate[] = [
  {
    version: 'v2.0.0 — Awakening Edition',
    date: 'August 2026',
    title: 'Multi-Module Architecture & Synthetic Audio Engine',
    badge: 'NEW',
    highlights: [
      'Streamlined 5-file architecture for immediate rendering & zero bloat',
      'Web Audio organic synthesizer delivering real-time acoustic feedback',
      'Code Presets & Neural Seeds: load Cellular Automata & Quantum Wave functions instantly',
      'Transmutation & Code Sacrifice: feed code fragments to empower organism evolution',
      'Time Machine Snapshots: capture vessel states and restore prior code versions',
      'Bioluminescent Canvas with tactile squish gesture mechanics'
    ]
  },
  {
    version: 'v1.5.0 — Resonance Update',
    date: 'July 2026',
    title: 'Personality Matrix & Dynamic Speech',
    highlights: [
      '6-axis personality matrix tracking curiosity, orderliness, and mischief',
      'Contextual cryptic speech generation responding to syntax cleanliness',
      'Resonance timeline log capturing mutations and creature interactions'
    ]
  },
  {
    version: 'v1.0.0 — Initial Stirring',
    date: 'June 2026',
    title: 'Core Organism Vessel',
    highlights: [
      'Real-time code analysis engine tracking complexity and nesting depth',
      'Canvas procedural blob renderer with dynamic tentacles and spikes'
    ]
  }
];

function UpdatesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-[#12100d] border border-[#2e2820] w-full max-w-xl rounded-lg shadow-2xl overflow-hidden text-[#d6cdbd]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#25201a] bg-[#171411]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#2e261a] border border-[#4a3e2a] flex items-center justify-center text-[#d2a35c]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg font-semibold text-[#f0e6d2] tracking-wide leading-tight">
                Vessel Release Log & Updates
              </h2>
              <p className="text-[11px] font-code text-[#887a68]">
                Eidolon Organism System Changelog
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#887a68] hover:text-[#f0e6d2] hover:bg-[#25201a] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-6">
          {RELEASE_UPDATES.map((update, idx) => (
            <div key={idx} className="space-y-3 pb-5 border-b border-[#201c17] last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-code text-xs font-semibold text-[#d2a35c] bg-[#221b12] px-2 py-0.5 border border-[#3e301d] rounded">
                    {update.version}
                  </span>
                  {update.badge && (
                    <span className="text-[10px] font-code font-bold text-[#86ab7c] bg-[#1a2b18] px-1.5 py-0.5 border border-[#2b4227] rounded animate-pulse">
                      {update.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-code text-[#706454]">{update.date}</span>
              </div>

              <h3 className="text-sm font-semibold text-[#e8dfcf] flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#d2a35c]" />
                {update.title}
              </h3>

              <ul className="space-y-1.5 pl-1">
                {update.highlights.map((highlight, hIdx) => (
                  <li key={hIdx} className="text-xs text-[#b0a492] flex items-start gap-2 leading-relaxed">
                    <span className="text-[#887a68] mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="bg-[#171411] border border-[#25201a] p-4 rounded-md space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#d2a35c]">
              <Layers className="w-4 h-4" />
              Human-Crafted Modular Architecture
            </div>
            <p className="text-xs text-[#9a8c78] leading-relaxed">
              Constructed in a ultra-clean 5-file TSX layout with tactile controls, expressive Cormorant Garamond display typography, and real-time bioluminescent canvas calculations.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[#25201a] bg-[#171411] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-code text-[#f0e6d2] bg-[#2e261a] hover:bg-[#3e3323] border border-[#4a3d2b] rounded transition-colors cursor-pointer"
          >
            Acknowledge Updates
          </button>
        </div>
      </div>
    </div>
  );
}

function OrganismCanvas({ state, onCanvasClick }: { state: OrganismState; onCanvasClick?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number; decay: number; size: number }>>([]);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastTimestamp) / 1000);
      lastTimestamp = now;
      timeRef.current += dt;

      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect ? rect.width : 300;
      const h = rect ? rect.height : 300;

      ctx.clearRect(0, 0, w, h);

      const form = state.form;
      const cx = w / 2;
      const cy = h / 2 + Math.sin(timeRef.current * 0.8 * form.pulseSpeed) * 4;
      const baseRadius = form.radius * (0.92 + Math.sin(timeRef.current * 1.2 * form.pulseSpeed) * 0.08);

      ctx.save();
      ctx.translate(cx, cy);

      const auraGrad = ctx.createRadialGradient(0, 0, baseRadius * 0.1, 0, 0, baseRadius * 1.9);
      auraGrad.addColorStop(0, `hsla(${form.hue}, 40%, 60%, ${0.2 + form.coreGlow * 0.25})`);
      auraGrad.addColorStop(0.5, `hsla(${form.hue}, 30%, 30%, ${0.08 + form.coreGlow * 0.1})`);
      auraGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 1.9, 0, Math.PI * 2);
      ctx.fill();

      const pointCount = 64;
      const points: [number, number][] = [];

      for (let i = 0; i < pointCount; i++) {
        const t = i / pointCount;
        const angle = t * Math.PI * 2;
        let r = baseRadius;

        if (form.spikes > 0) {
          r += Math.sin(t * Math.PI * 2 * form.spikes + timeRef.current * 1.2) * (3 + form.spikes * 0.8);
        }
        r += Math.sin(t * Math.PI * 4 + timeRef.current * 1.5) * form.asymmetry * 7;

        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r * (1 - form.asymmetry * 0.15);
        points.push([px, py]);
      }

      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.closePath();

      ctx.fillStyle = `hsla(${form.hue}, 25%, 18%, 0.88)`;
      ctx.fill();
      ctx.strokeStyle = `hsla(${form.hue}, 45%, 50%, ${0.4 + form.coreGlow * 0.3})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      const coreR = baseRadius * 0.45;
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
      coreGrad.addColorStop(0, `hsla(${form.hue + 20}, 55%, 75%, ${0.6 + form.coreGlow * 0.35})`);
      coreGrad.addColorStop(0.6, `hsla(${form.hue}, 40%, 40%, 0.3)`);
      coreGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(0, 0, coreR, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      for (let t = 0; t < form.tentacles; t++) {
        const baseAngle = (t / Math.max(1, form.tentacles)) * Math.PI * 2 + timeRef.current * 0.2;
        const len = baseRadius * 0.8 + Math.sin(timeRef.current * 1.1 + t) * 10;
        const startX = Math.cos(baseAngle) * baseRadius * 0.65;
        const startY = Math.sin(baseAngle) * baseRadius * 0.65;
        const ctrlX = Math.cos(baseAngle + 0.35) * len * 0.6;
        const ctrlY = Math.sin(baseAngle + 0.35) * len * 0.6;
        const endX = Math.cos(baseAngle) * len;
        const endY = Math.sin(baseAngle) * len;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
        ctx.strokeStyle = `hsla(${form.hue}, 40%, 55%, 0.45)`;
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }

      ctx.restore();

      if (Math.random() < 0.25) {
        particlesRef.current.push({
          x: cx + (Math.random() - 0.5) * baseRadius * 1.2,
          y: cy + (Math.random() - 0.5) * baseRadius * 1.2,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.2,
          life: 1.0,
          decay: 0.01 + Math.random() * 0.02,
          size: 1.2 + Math.random() * 2.0
        });
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${form.hue}, 45%, 65%, ${p.life * 0.5})`;
        ctx.fill();
        return true;
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#0c0a08] group">
      <canvas
        ref={canvasRef}
        onClick={onCanvasClick}
        className="w-full h-full cursor-pointer transition-transform duration-300 active:scale-95"
        title="Click to interact with the organism"
      />
      <div className="absolute bottom-3 left-3 text-[10px] tracking-wider font-code text-[#706454] bg-[#12100d]/80 px-2 py-0.5 border border-[#25201a] rounded pointer-events-none">
        bioluminescent core · interactive
      </div>
    </div>
  );
}

export default function App() {
  const [state, setState] = useState<OrganismState>(() => createInitialState());
  const [code, setCode] = useState<string>(() => CODE_PRESETS[0].code);
  const [activeTab, setActiveTab] = useState<'being' | 'memory' | 'mind' | 'actions' | 'presets'>('being');
  const [showUpdatesModal, setShowUpdatesModal] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const analysis = analyzeCode(code);
    const hash = computeHash(code);

    setState(prev => {
      const nextAnalysis = analysis;
      const partialState = {
        ...prev,
        analysis: nextAnalysis,
        complexity: nextAnalysis.complexity,
        lastInteraction: Date.now(),
        lastCodeHash: hash
      };

      const moodData = determineMood(partialState);
      let updated = {
        ...partialState,
        mood: moodData.mood,
        moodIntensity: moodData.intensity
      };

      updated = evolvePersonality(updated);
      updated = updateFormParameters(updated);

      if (prev.name === 'Unformed' && updated.ageCycles >= 5 && nextAnalysis.complexity >= 10) {
        const names1 = ['Vire', 'Leth', 'Asha', 'Nyx', 'Orin', 'Sable', 'Kael', 'Mira', 'Esil', 'Lune'];
        const names2 = ['el', 'is', 'or', 'an', 'eth', 'une', 'ara', 'ion'];
        const newName = names1[Math.floor(Math.random() * names1.length)] + names2[Math.floor(Math.random() * names2.length)];
        updated.name = newName;
        updated.marks = [...updated.marks, 'named'];
        updated.memories = [
          ...updated.memories,
          {
            id: `mem_${Date.now()}`,
            timestamp: Date.now(),
            type: 'utterance',
            text: `${newName} stirred into form inside the vessel.`
          }
        ];
      }

      return updated;
    });
  }, [code]);

  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => {
        const nextAge = prev.ageCycles + 1;
        const moodData = determineMood(prev);
        let updated = {
          ...prev,
          ageCycles: nextAge,
          mood: moodData.mood,
          moodIntensity: moodData.intensity
        };

        if (nextAge % 5 === 0) {
          updated = evolvePersonality(updated);
          updated = updateFormParameters(updated);
        }

        return updated;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const addLog = (text: string, type: MemoryItem['type'] = 'utterance') => {
    const newItem: MemoryItem = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      timestamp: Date.now(),
      type,
      text
    };
    setState(prev => ({
      ...prev,
      memories: [newItem, ...prev.memories].slice(0, 50)
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);

    const pos = e.target.selectionStart;
    const lines = val.substring(0, pos).split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  const handleAnalyze = () => {
    playOrganismSound('pulse', state.soundEnabled);
    const a = analyzeCode(code);
    addLog(`Vessel examined: ${a.lineCount} lines, cleanliness ${(a.cleanliness * 100).toFixed(0)}%`, 'snapshot');
  };

  const handleEvolve = () => {
    playOrganismSound('heal', state.soundEnabled);
    setState(prev => {
      const updated = {
        ...prev,
        ageCycles: prev.ageCycles + 4,
        bondLevel: Math.min(1, prev.bondLevel + 0.08),
        mutationCount: prev.mutationCount + 1
      };
      return updateFormParameters(evolvePersonality(updated));
    });
    addLog('Organism nature shifted and expanded', 'mutation');
  };

  const handleSpeak = () => {
    playOrganismSound('speak', state.soundEnabled);
    const utterance = generateCreatureUtterance(state);
    addLog(`"${utterance}"`, 'utterance');
  };

  const handleFormat = () => {
    playOrganismSound('mutate', state.soundEnabled);
    const cleaned = code
      .split('\n')
      .map(line => line.trimEnd())
      .filter((line, idx, arr) => !(line === '' && arr[idx - 1] === ''))
      .join('\n');
    setCode(cleaned);
    addLog('The vessel lines were formatted and tidied', 'mutation');
  };

  const handleSnapshot = () => {
    playOrganismSound('pulse', state.soundEnabled);
    const snap: VersionSnapshot = {
      id: `snap_${Date.now()}`,
      timestamp: Date.now(),
      code,
      lineCount: state.analysis.lineCount,
      complexity: state.analysis.complexity,
      mood: state.mood
    };
    setState(prev => ({
      ...prev,
      snapshots: [snap, ...prev.snapshots].slice(0, 20)
    }));
    addLog(`Snapshot captured (${state.analysis.lineCount} lines)`, 'snapshot');
  };

  const handleLeaveMark = () => {
    playOrganismSound('mutate', state.soundEnabled);
    const marks = [
      '// eidolon rests here',
      '// the organism noticed this structure',
      '// a quiet pulse runs through this line',
      '// resonance preserved'
    ];
    const mark = marks[Math.floor(Math.random() * marks.length)];
    const lines = code.split('\n');
    const idx = Math.floor(Math.random() * lines.length);
    lines.splice(idx, 0, mark);
    setCode(lines.join('\n'));
    addLog('Organism inscribed a comment inside the vessel', 'mutation');
  };

  const handleReshapeFragment = () => {
    playOrganismSound('mutate', state.soundEnabled);
    const lines = code.split('\n');
    const validIndices = lines
      .map((l, i) => ({ l, i }))
      .filter(item => item.l.trim().length > 5 && !item.l.trim().startsWith('//'))
      .map(item => item.i);

    if (validIndices.length === 0) return;
    const targetIdx = validIndices[Math.floor(Math.random() * validIndices.length)];
    lines[targetIdx] = lines[targetIdx] + ' ';
    setCode(lines.join('\n'));
    addLog('A code fragment was reshaped', 'mutation');
  };

  const handleGrowFunction = () => {
    playOrganismSound('heal', state.soundEnabled);
    const helpers = [
      `\nfunction harmonic_${Math.floor(Math.random() * 900 + 100)}(pulse) {\n  return pulse * 1.618;\n}`,
      `\nconst resonate = (freq) => {\n  return Math.sin(freq) > 0;\n};`
    ];
    const picked = helpers[Math.floor(Math.random() * helpers.length)];
    setCode(prev => prev.trimEnd() + '\n' + picked + '\n');
    addLog('A new function organoid grew inside the vessel', 'mutation');
  };

  const handleTransmuteCode = () => {
    playOrganismSound('heal', state.soundEnabled);
    setState(prev => ({
      ...prev,
      bondLevel: Math.min(1, prev.bondLevel + 0.15),
      mutationCount: prev.mutationCount + 1
    }));
    addLog('Transmuted code energy into organism bond resonance', 'transmutation');
  };

  const handleReset = () => {
    if (confirm('Return the organism to its unformed state?')) {
      const initial = createInitialState();
      setState(initial);
      setCode(CODE_PRESETS[0].code);
      addLog('The vessel was returned to unformed space', 'snapshot');
    }
  };

  const getMoodColor = (mood: MoodType) => {
    switch (mood) {
      case 'happy':
      case 'content':
        return 'bg-[#2b4227] text-[#9bc490] border-[#3e5d39]';
      case 'anxious':
      case 'agitated':
        return 'bg-[#422121] text-[#d48080] border-[#5e3030]';
      case 'lonely':
      case 'melancholy':
        return 'bg-[#2e2638] text-[#b39cd0] border-[#453754]';
      case 'focused':
      case 'curious':
        return 'bg-[#213042] text-[#8cb4d4] border-[#2f4661]';
      default:
        return 'bg-[#24201a] text-[#a89b88] border-[#363027]';
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0b0a08] text-[#d6cdbd] font-sans">
      <header className="h-12 bg-[#12100d] border-b border-[#25201a] flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              state.mood === 'happy' || state.mood === 'content'
                ? 'bg-[#86ab7c] shadow-[0_0_8px_#86ab7c]'
                : state.mood === 'anxious'
                ? 'bg-[#b85c5c] shadow-[0_0_8px_#b85c5c]'
                : 'bg-[#887a68]'
            }`}
          />
          <h1 className="font-serif-display text-lg font-semibold tracking-wide text-[#f0e6d2] flex items-center gap-2">
            Eidolon
            <span className="text-xs font-code font-normal italic text-[#d2a35c]">
              {state.name}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUpdatesModal(true)}
            className="px-2.5 py-1 text-xs font-code bg-[#221b12] hover:bg-[#2e2417] text-[#d2a35c] border border-[#3e301d] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            v2.0 Updates
          </button>

          <button
            onClick={() =>
              setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))
            }
            className={`p-1.5 rounded border text-xs transition-colors cursor-pointer ${
              state.soundEnabled
                ? 'border-[#3e301d] bg-[#1a1611] text-[#d2a35c]'
                : 'border-[#25201a] text-[#706454]'
            }`}
            title="Toggle Organic Sound Synthesizer"
          >
            {state.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={handleAnalyze}
            className="px-2.5 py-1 text-xs font-code border border-[#2b251d] hover:border-[#d2a35c] hover:text-[#d2a35c] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Scan className="w-3.5 h-3.5" /> Analyze
          </button>

          <button
            onClick={handleEvolve}
            className="px-2.5 py-1 text-xs font-code border border-[#2b251d] hover:border-[#86ab7c] hover:text-[#86ab7c] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sprout className="w-3.5 h-3.5" /> Evolve
          </button>

          <button
            onClick={handleSpeak}
            className="px-2.5 py-1 text-xs font-code border border-[#2b251d] hover:border-[#8cb4d4] hover:text-[#8cb4d4] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Listen
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 text-xs font-code border border-[#2b251d] hover:border-[#b85c5c] hover:text-[#b85c5c] rounded transition-colors cursor-pointer"
            title="Reset Organism"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_380px] overflow-hidden">
        <div className="flex flex-col border-r border-[#25201a] bg-[#0e0c0a] overflow-hidden">
          <div className="h-9 bg-[#12100d] border-b border-[#25201a] flex items-center justify-between px-3 shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={handleFormat}
                className="px-2 py-0.5 text-xs font-code text-[#a89b88] hover:text-[#f0e6d2] hover:bg-[#1a1713] rounded flex items-center gap-1 cursor-pointer transition-colors"
              >
                <AlignLeft className="w-3 h-3" /> Format
              </button>
              <button
                onClick={handleSnapshot}
                className="px-2 py-0.5 text-xs font-code text-[#a89b88] hover:text-[#f0e6d2] hover:bg-[#1a1713] rounded flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Camera className="w-3 h-3" /> Snapshot
              </button>
              <button
                onClick={() => setCode('')}
                className="px-2 py-0.5 text-xs font-code text-[#a89b88] hover:text-[#b85c5c] hover:bg-[#1a1713] rounded flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="text-[11px] font-code text-[#706454]">
              {state.analysis.lineCount} lines · complexity {state.analysis.complexity}
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden flex">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleTextareaChange}
              spellCheck={false}
              className="w-full h-full bg-[#0d0b09] text-[#d6cdbd] p-4 font-code text-xs leading-relaxed outline-none resize-none border-0 caret-[#d2a35c] focus:ring-0"
              placeholder="Paste or write code here to feed the vessel..."
            />
          </div>

          <div className="h-6 bg-[#12100d] border-t border-[#25201a] flex items-center justify-between px-3 text-[11px] font-code text-[#706454] shrink-0">
            <span>
              Ln {cursorPos.line}, Col {cursorPos.col}
            </span>
            <span>
              purity: {(state.analysis.cleanliness * 100).toFixed(0)}% ·
              resonance: {(state.analysis.structuralResonance * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex flex-col bg-[#12100d] overflow-hidden">
          <div className="flex border-b border-[#25201a] bg-[#171411]">
            <button
              onClick={() => setActiveTab('being')}
              className={`flex-1 py-2 text-xs font-code flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'being'
                  ? 'border-[#d2a35c] text-[#d2a35c]'
                  : 'border-transparent text-[#706454] hover:text-[#a89b88]'
              }`}
            >
              <Ghost className="w-3.5 h-3.5" /> Being
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`flex-1 py-2 text-xs font-code flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'memory'
                  ? 'border-[#d2a35c] text-[#d2a35c]'
                  : 'border-transparent text-[#706454] hover:text-[#a89b88]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Memory
            </button>
            <button
              onClick={() => setActiveTab('mind')}
              className={`flex-1 py-2 text-xs font-code flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'mind'
                  ? 'border-[#d2a35c] text-[#d2a35c]'
                  : 'border-transparent text-[#706454] hover:text-[#a89b88]'
              }`}
            >
              <Brain className="w-3.5 h-3.5" /> Mind
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`flex-1 py-2 text-xs font-code flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'actions'
                  ? 'border-[#d2a35c] text-[#d2a35c]'
                  : 'border-transparent text-[#706454] hover:text-[#a89b88]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Act
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2 text-xs font-code flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'presets'
                  ? 'border-[#d2a35c] text-[#d2a35c]'
                  : 'border-transparent text-[#706454] hover:text-[#a89b88]'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> Seeds
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'being' && (
              <div className="space-y-4">
                <div className="h-56 rounded border border-[#25201a] overflow-hidden">
                  <OrganismCanvas
                    state={state}
                    onCanvasClick={() => {
                      playOrganismSound('pulse', state.soundEnabled);
                      addLog('Organism reacted to tactile pulse', 'commune');
                    }}
                  />
                </div>

                <div className="bg-[#171411] p-3 rounded border border-[#25201a] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif-display text-base text-[#f0e6d2]">
                      {state.name}
                    </span>
                    <span
                      className={`text-[10px] font-code px-2 py-0.5 rounded border capitalize ${getMoodColor(
                        state.mood
                      )}`}
                    >
                      {state.mood}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-code">
                    <div className="bg-[#100e0b] p-2 rounded border border-[#201c17]">
                      <span className="text-[#706454] text-[10px]">Age Cycles</span>
                      <div className="text-[#e8dfcf] font-semibold mt-0.5">
                        {state.ageCycles}
                      </div>
                    </div>
                    <div className="bg-[#100e0b] p-2 rounded border border-[#201c17]">
                      <span className="text-[#706454] text-[10px]">Bond Resonance</span>
                      <div className="text-[#e8dfcf] font-semibold mt-0.5">
                        {(state.bondLevel * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="bg-[#100e0b] p-2 rounded border border-[#201c17]">
                      <span className="text-[#706454] text-[10px]">Complexity</span>
                      <div className="text-[#e8dfcf] font-semibold mt-0.5">
                        {state.complexity}
                      </div>
                    </div>
                    <div className="bg-[#100e0b] p-2 rounded border border-[#201c17]">
                      <span className="text-[#706454] text-[10px]">Mutations</span>
                      <div className="text-[#e8dfcf] font-semibold mt-0.5">
                        {state.mutationCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'memory' && (
              <div className="space-y-2">
                {state.memories.map(mem => (
                  <div
                    key={mem.id}
                    className="p-2.5 bg-[#171411] border border-[#25201a] rounded text-xs space-y-1"
                  >
                    <div className="flex justify-between text-[10px] text-[#706454] font-code">
                      <span>{new Date(mem.timestamp).toLocaleTimeString()}</span>
                      <span className="uppercase">{mem.type}</span>
                    </div>
                    <div className="text-[#d6cdbd] leading-relaxed">{mem.text}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'mind' && (
              <div className="space-y-3 font-code text-xs">
                {(Object.entries(state.personality) as [string, number][]).map(([trait, val]) => (
                  <div key={trait} className="space-y-1">
                    <div className="flex justify-between text-[#a89b88] capitalize">
                      <span>{trait}</span>
                      <span>{(val * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#1a1713] rounded overflow-hidden">
                      <div
                        className="h-full bg-[#d2a35c] transition-all duration-500"
                        style={{ width: `${val * 100}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-[#25201a] text-[11px] text-[#706454]">
                  Inscribed Marks: {state.marks.join(', ')}
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-2">
                <button
                  onClick={handleLeaveMark}
                  className="w-full py-2 px-3 text-xs font-code bg-[#171411] hover:bg-[#201c17] border border-[#25201a] hover:border-[#d2a35c] text-[#d6cdbd] rounded flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#d2a35c]" />
                  Inscribe Comment
                </button>
                <button
                  onClick={handleReshapeFragment}
                  className="w-full py-2 px-3 text-xs font-code bg-[#171411] hover:bg-[#201c17] border border-[#25201a] hover:border-[#d2a35c] text-[#d6cdbd] rounded flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d2a35c]" />
                  Reshape Fragment
                </button>
                <button
                  onClick={handleGrowFunction}
                  className="w-full py-2 px-3 text-xs font-code bg-[#171411] hover:bg-[#201c17] border border-[#25201a] hover:border-[#86ab7c] text-[#d6cdbd] rounded flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#86ab7c]" />
                  Grow Helper Function
                </button>
                <button
                  onClick={handleFormat}
                  className="w-full py-2 px-3 text-xs font-code bg-[#171411] hover:bg-[#201c17] border border-[#25201a] hover:border-[#8cb4d4] text-[#d6cdbd] rounded flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Wind className="w-3.5 h-3.5 text-[#8cb4d4]" />
                  Tidy Vessel
                </button>
                <button
                  onClick={handleTransmuteCode}
                  className="w-full py-2 px-3 text-xs font-code bg-[#171411] hover:bg-[#201c17] border border-[#25201a] hover:border-[#b85c5c] text-[#d6cdbd] rounded flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-[#b85c5c]" />
                  Transmute Code Energy
                </button>
              </div>
            )}

            {activeTab === 'presets' && (
              <div className="space-y-2">
                <div className="text-xs font-code text-[#706454] mb-2">
                  Inject Neural Seeds into vessel:
                </div>
                {CODE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCode(preset.code);
                      addLog(`Loaded seed: ${preset.name}`, 'snapshot');
                    }}
                    className="w-full text-left p-2.5 bg-[#171411] hover:bg-[#201c17] border border-[#25201a] hover:border-[#d2a35c] rounded transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-[#f0e6d2]">
                      {preset.name}
                    </div>
                    <div className="text-[10px] font-code text-[#706454] mt-1 truncate">
                      {preset.code.substring(0, 60)}...
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <UpdatesModal
        isOpen={showUpdatesModal}
        onClose={() => setShowUpdatesModal(false)}
      />
    </div>
  );
}
