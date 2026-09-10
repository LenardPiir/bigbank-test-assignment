let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
let currentTrack: Stoppable | null = null;

interface Stoppable {
  stop(): void;
}

const C3 = 130.81,
  D2 = 73.42;
const D3 = 146.83,
  E3 = 164.81,
  F3 = 174.61,
  G3 = 196.0,
  A3 = 220.0,
  Bb3 = 233.08,
  B3 = 246.94;
const C4 = 261.63,
  D4 = 293.66,
  E4 = 329.63,
  Fs4 = 369.99,
  F4 = 349.23,
  G4 = 392.0,
  A4 = 440.0;
const D5 = 587.33;

const MASTER_VOLUME = 0.8;

function destroy() {
  currentTrack?.stop();
  currentTrack = null;
  if (ctx) {
    ctx.close();
    ctx = null;
    master = null;
  }
}

window.addEventListener('pagehide', destroy);
window.addEventListener('beforeunload', destroy);

function init(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : MASTER_VOLUME;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(
  out: AudioNode,
  freq: number,
  time: number,
  dur: number,
  type: OscillatorType = 'triangle',
  vol = 0.1,
) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = type;
  osc.frequency.value = freq;
  filter.type = 'lowpass';
  filter.frequency.value = type === 'sawtooth' ? 1200 : 2000;

  const att = Math.min(0.05, dur * 0.12);
  const rel = Math.min(0.15, dur * 0.3);
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(vol, time + att);
  gain.gain.setValueAtTime(vol * 0.85, time + dur - rel);
  gain.gain.linearRampToValueAtTime(0, time + dur);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(out);
  osc.start(time);
  osc.stop(time + dur + 0.05);
}

function kick(out: AudioNode, time: number, vol: number) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.12);
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
  osc.connect(gain);
  gain.connect(out);
  osc.start(time);
  osc.stop(time + 0.35);
}

function snare(out: AudioNode, time: number, vol: number) {
  if (!ctx) return;
  const len = ctx.sampleRate * 0.12;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol * 0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
  noise.connect(hp);
  hp.connect(gain);
  gain.connect(out);
  noise.start(time);
  noise.stop(time + 0.15);

  const body = ctx.createOscillator();
  const bGain = ctx.createGain();
  body.type = 'triangle';
  body.frequency.value = 180;
  bGain.gain.setValueAtTime(vol * 0.3, time);
  bGain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
  body.connect(bGain);
  bGain.connect(out);
  body.start(time);
  body.stop(time + 0.1);
}

function createLoop(
  schedule: (out: GainNode, t: number, c: AudioContext) => void,
  barDuration: number,
  withDelay: boolean,
  fadeIn = 0.6,
): Stoppable {
  const c = init();
  let alive = true;
  let timer: number;

  const out = c.createGain();
  out.gain.setValueAtTime(0, c.currentTime);
  out.gain.linearRampToValueAtTime(1, c.currentTime + fadeIn);
  out.connect(master!);

  let cleanupDelay: (() => void) | null = null;
  if (withDelay) {
    const delay = c.createDelay(1);
    delay.delayTime.value = 0.3;
    const fb = c.createGain();
    fb.gain.value = 0.15;
    const wet = c.createGain();
    wet.gain.value = 0.25;
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(master!);
    out.connect(delay);
    cleanupDelay = () => {
      delay.disconnect();
      fb.disconnect();
      wet.disconnect();
    };
  }

  function loop() {
    if (!alive) return;
    schedule(out, c.currentTime + 0.1, c);
    timer = window.setTimeout(loop, barDuration * 920);
  }

  loop();

  return {
    stop() {
      alive = false;
      clearTimeout(timer);
      try {
        out.gain.cancelScheduledValues(c.currentTime);
        out.gain.setValueAtTime(out.gain.value, c.currentTime);
        out.gain.linearRampToValueAtTime(0, c.currentTime + 0.3);
        setTimeout(() => {
          try {
            out.disconnect();
            cleanupDelay?.();
          } catch {}
        }, 400);
      } catch {}
    },
  };
}

// --- Adventure: folk melody theme for active game ---

type MelodyNote = [number, number]; // [freq, duration in beats]

const ADVENTURE_PHRASES: MelodyNote[][] = [
  [[E4, 1], [G4, 0.5], [A4, 0.5], [B3, 1], [A4, 0.5], [G4, 0.5]],
  [[E4, 1.5], [D4, 0.5], [E4, 1], [G4, 1]],
  [[A4, 1], [G4, 0.5], [E4, 0.5], [D4, 1], [E4, 0.5], [G4, 0.5]],
  [[A4, 0.5], [B3, 0.5], [A4, 0.5], [G4, 0.5], [E4, 2]],
];
const ADVENTURE_BASS: number[] = [E3, C3, D3, E3];
const ADVENTURE_HARMONY: number[] = [B3, G3, A3, B3];
const ADVENTURE_BPM = 100;
const ADVENTURE_BEAT = 60 / ADVENTURE_BPM;

let adventureIdx = 0;
function scheduleAdventure(out: GainNode, t: number) {
  const phrase = ADVENTURE_PHRASES[adventureIdx % ADVENTURE_PHRASES.length];
  const bass = ADVENTURE_BASS[adventureIdx % ADVENTURE_BASS.length];
  const harm = ADVENTURE_HARMONY[adventureIdx % ADVENTURE_HARMONY.length];

  let offset = 0;
  for (const [freq, beats] of phrase) {
    const dur = beats * ADVENTURE_BEAT;
    if (freq > 0) {
      tone(out, freq, t + offset, dur * 0.85, 'triangle', 0.28);
      tone(out, freq * 2, t + offset, dur * 0.4, 'sine', 0.05);
    }
    offset += dur;
  }

  tone(out, bass, t, offset * 0.95, 'sine', 0.18);
  tone(out, harm, t, offset * 0.95, 'triangle', 0.07);

  kick(out, t, 0.12);
  kick(out, t + ADVENTURE_BEAT * 2, 0.08);

  adventureIdx++;
}
const ADVENTURE_BAR = 4 * ADVENTURE_BEAT;

// --- Battle: intense with drums ---

const BATTLE_ARPS = [
  [D4, F4, A4, D4, F4, A4, G4, F4],
  [E4, G4, D4, E4, G4, E4, D4, E4],
  [F4, A4, D4, F4, A4, G4, F4, E4],
  [D4, A3, D4, F4, A4, F4, D4, A3],
];
const BATTLE_BPM = 155;
const BATTLE_HALF = 30 / BATTLE_BPM;
const BATTLE_BEAT = 60 / BATTLE_BPM;
const BATTLE_BAR = BATTLE_ARPS[0].length * BATTLE_HALF;

let battleIdx = 0;
function scheduleBattle(out: GainNode, t: number) {
  const pat = BATTLE_ARPS[battleIdx % BATTLE_ARPS.length];

  for (let i = 0; i < pat.length; i++) {
    tone(out, pat[i], t + i * BATTLE_HALF, BATTLE_HALF * 0.8, 'sawtooth', 0.18);
  }

  for (let i = 0; i < 4; i++) {
    const bt = t + i * BATTLE_BEAT;
    kick(out, bt, 0.35);
    if (i === 1 || i === 3) snare(out, bt, 0.25);
  }

  tone(out, pat[0] / 2, t, BATTLE_BAR * 0.9, 'square', 0.12);
  tone(out, pat[0], t, BATTLE_BAR * 0.5, 'sawtooth', 0.06);
  battleIdx++;
}

// --- Stingers ---

function playVictory() {
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  const s = 0.14;
  tone(master, D4, t, s * 2, 'triangle', 0.35);
  tone(master, D3, t, s * 2, 'sine', 0.2);

  tone(master, Fs4, t + s, s * 2, 'triangle', 0.35);
  tone(master, A3, t + s, s * 2, 'sine', 0.15);

  tone(master, A4, t + s * 2, s * 2, 'triangle', 0.35);
  tone(master, D4, t + s * 2, s * 2, 'sine', 0.15);

  tone(master, D5, t + s * 3, 0.8, 'triangle', 0.4);
  tone(master, A4, t + s * 3, 0.8, 'triangle', 0.2);
  tone(master, Fs4, t + s * 3, 0.8, 'sine', 0.15);
  tone(master, D4, t + s * 3, 0.8, 'sine', 0.12);
}

function playDefeat() {
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  const s = 0.22;
  tone(master, D4, t, s + 0.1, 'sawtooth', 0.25);
  tone(master, D3, t, s + 0.1, 'sine', 0.15);

  tone(master, C4, t + s, s + 0.1, 'sawtooth', 0.25);
  tone(master, C3, t + s, s + 0.1, 'sine', 0.12);

  tone(master, Bb3, t + s * 2, s + 0.1, 'sawtooth', 0.2);

  tone(master, A3, t + s * 3, 0.6, 'sawtooth', 0.2);
  tone(master, A3 / 2, t + s * 3, 0.6, 'sine', 0.15);
}

function playDeath() {
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  const s = 0.4;

  tone(master, D4, t, s + 0.2, 'triangle', 0.3);
  tone(master, D3, t, s + 0.2, 'sine', 0.2);
  tone(master, A3, t, s + 0.2, 'triangle', 0.15);

  tone(master, Bb3, t + s, s + 0.2, 'triangle', 0.25);
  tone(master, F3, t + s, s + 0.2, 'sine', 0.18);

  tone(master, G3, t + s * 2, s + 0.2, 'triangle', 0.25);
  tone(master, D3, t + s * 2, s + 0.2, 'sine', 0.18);

  tone(master, D3, t + s * 3, 1.5, 'triangle', 0.3);
  tone(master, D2, t + s * 3, 1.5, 'sine', 0.25);
  tone(master, A3 / 2, t + s * 3, 1.5, 'sine', 0.12);

  for (let i = 0; i < 6; i++) {
    kick(master, t + s * 3 + i * 0.15, 0.2 - i * 0.03);
  }
}

function stopCurrent() {
  currentTrack?.stop();
  currentTrack = null;
}

export const audioEngine = {
  startAdventure() {
    stopCurrent();
    adventureIdx = 0;
    currentTrack = createLoop(scheduleAdventure, ADVENTURE_BAR, true);
  },

  startQuest() {
    stopCurrent();
    battleIdx = 0;
    currentTrack = createLoop(scheduleBattle, BATTLE_BAR, false);
  },

  playSuccess: playVictory,
  playFailure: playDefeat,
  playGameOver: playDeath,

  stopQuest() {
    stopCurrent();
  },

  resumeAdventure() {
    stopCurrent();
    adventureIdx = 0;
    currentTrack = createLoop(scheduleAdventure, ADVENTURE_BAR, true, 2.5);
  },

  stop() {
    destroy();
  },

  toggleMute(): boolean {
    muted = !muted;
    if (master && ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(muted ? 0 : MASTER_VOLUME, ctx.currentTime + 0.15);
    }
    return muted;
  },

  isMuted: () => muted,
};
