import {type RitualSoundKind } from '../types';

let sfxCtx: AudioContext | null = null;
let omAudioContext: AudioContext | null = null;
let omOscillators: OscillatorNode[] = [];
let omMasterGain: GainNode | null = null;
let omEnabled = false;

function getAudioContextConstructor(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  return w.AudioContext || w.webkitAudioContext || null;
}

function getSfxAudio(): AudioContext | null {
  const Ctx = getAudioContextConstructor();
  if (!Ctx) return null;
  if (!sfxCtx) sfxCtx = new Ctx();
  if (sfxCtx.state === 'suspended') {
    sfxCtx.resume().catch(() => {});
  }
  return sfxCtx;
}

export function unlockAudio(): void {
  const ctx = getSfxAudio();
  if (!ctx) return;
  try {
    const buffer = ctx.createBuffer(1, 1, ctx.sampleRate || 44100);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // Ignore autoplay restriction until user gesture
  }
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

function playTone(
  freq: number,
  {
    start = 0,
    dur = 1,
    vol = 0.07,
    type = 'sine',
    glide = null,
  }: {
    start?: number;
    dur?: number;
    vol?: number;
    type?: OscillatorType;
    glide?: number | null;
  } = {}
) {
  const ctx = getSfxAudio();
  if (!ctx) return;
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (glide) osc.frequency.exponentialRampToValueAtTime(glide, t + dur);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export async function playRitualSound(kind: RitualSoundKind): Promise<void> {
  const ctx = getSfxAudio();
  if (!ctx) return;
  if (ctx.state !== 'running') {
    try {
      await ctx.resume();
    } catch {
      return;
    }
  }

  if (kind === 'bell') {
    [
      [523, 0, 0.2, 3.2],
      [1046, 0.01, 0.11, 2.4],
      [1568, 0.02, 0.06, 1.9],
      [2093, 0.03, 0.04, 1.4],
      [784, 0, 0.07, 2.8],
    ].forEach(([f, s, v, d]) => playTone(f, { start: s, dur: d, vol: v }));
    return;
  }

  if (kind === 'water') {
    const dur = 2.4;
    const t = ctx.currentTime;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 820;
    filter.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.13, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(t);
    source.stop(t + dur);
    [0.1, 0.45, 0.8, 1.15, 1.5].forEach((delay, i) =>
      playTone(440 + i * 70, {
        start: delay,
        dur: 0.18,
        vol: 0.05,
        glide: (440 + i * 70) * 1.9,
      })
    );
    return;
  }

  if (kind === 'conch') {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const low = ctx.createBiquadFilter();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(96, t);
    osc.frequency.linearRampToValueAtTime(132, t + 0.7);
    low.type = 'lowpass';
    low.frequency.value = 620;
    low.Q.value = 2;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.09, t + 0.45);
    gain.gain.setValueAtTime(0.09, t + 1.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
    osc.connect(low);
    low.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 2.7);
    playTone(264, { start: 0.1, dur: 2.2, vol: 0.035 });
    return;
  }

  [1046, 1318, 1568, 2093].forEach((f, i) =>
    playTone(f, { start: i * 0.09, dur: 1.6 - i * 0.12, vol: 0.06 })
  );
}

export async function toggleAmbientSound(): Promise<boolean> {
  if (omEnabled) {
    stopAmbientSound();
    return false;
  }

  try {
    const Ctx = getAudioContextConstructor();
    if (!Ctx) throw new Error('Web Audio is unavailable');
    if (!omAudioContext) omAudioContext = new Ctx();
    await omAudioContext.resume();
    if (omAudioContext.state !== 'running') throw new Error('Audio context is not running');

    const ctx = omAudioContext;
    omMasterGain = ctx.createGain();
    omMasterGain.gain.setValueAtTime(0, ctx.currentTime);
    omMasterGain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 1.2);
    omMasterGain.connect(ctx.destination);

    [
      { frequency: 220, volume: 0.52 },
      { frequency: 330, volume: 0.22 },
      { frequency: 440, volume: 0.14 },
      { frequency: 660, volume: 0.07 },
    ].forEach((layer) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = layer.frequency;
      gain.gain.value = layer.volume;
      osc.connect(gain);
      if (omMasterGain) gain.connect(omMasterGain);
      osc.start();
      omOscillators.push(osc);
    });

    omEnabled = true;
    return true;
  } catch {
    stopAmbientSound();
    throw new Error('Sound could not start. Check site permissions.');
  }
}

export function stopAmbientSound(): void {
  if (omAudioContext && omMasterGain) {
    const now = omAudioContext.currentTime;
    omMasterGain.gain.cancelScheduledValues(now);
    omMasterGain.gain.setTargetAtTime(0, now, 0.08);
  }
  const old = [...omOscillators];
  omOscillators = [];
  setTimeout(() => {
    old.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    if (omMasterGain) {
      try {
        omMasterGain.disconnect();
      } catch {
        // ignore
      }
      omMasterGain = null;
    }
  }, 420);
  omEnabled = false;
}
