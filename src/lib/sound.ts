// Adapted from SPEC-01 registry/hardware/lib/sound.ts by Shu Ding.
// https://github.com/shuding/spec-01/tree/b8f91b6646d9280d9de8e0f5b2c6453cb4f237cb
// MIT License
//
// Copyright (c) 2026 Shu Ding
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export type InteractionSound = "press" | "toggle" | "snap" | "typing";

let context: AudioContext | undefined;
let output: BiquadFilterNode | undefined;
let noise: AudioBuffer | undefined;
let lastPlayed = -Infinity;

const vary = (amount: number) => 1 + (Math.random() * 2 - 1) * amount;

// Reuse SPEC-01's filtered noise and falling sine tone, with muted envelopes.
export async function playSound(voice: InteractionSound, volume: number) {
  if (
    typeof window === "undefined" ||
    document.visibilityState === "hidden" ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
    volume <= 0
  )
    return;

  // Never create or resume audio outside an active user gesture.
  if (
    context?.state !== "running" &&
    navigator.userActivation &&
    !navigator.userActivation.isActive
  )
    return;
  if (performance.now() - lastPlayed < 35) return;

  try {
    if (!context || context.state === "closed") {
      const Context =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Context) return;
      const next = new Context({ latencyHint: "interactive" });
      const filter = next.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1400;
      filter.Q.value = 0.5;
      filter.connect(next.destination);
      const buffer = next.createBuffer(1, next.sampleRate / 2, next.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      context = next;
      output = filter;
      noise = buffer;
    }
    const c = context;
    // Drop delayed or blocked sounds rather than replaying them on a later gesture.
    if (c.state !== "running") {
      const requestedAt = performance.now();
      await c.resume();
      if (performance.now() - requestedAt > 100 || document.hidden) return;
    }
    if (performance.now() - lastPlayed < 35) return;
    lastPlayed = performance.now();
    const at = c.currentTime + 0.002;
    const snap = voice === "snap";
    const typing = voice === "typing";
    // Vary the body, contact and envelope while keeping each voice recognizable.
    const frequency =
      (typing ? 180 : snap ? 230 : voice === "toggle" ? 170 : 150) * vary(0.12);
    const decay = (typing ? 0.025 : snap ? 0.032 : 0.045) * vary(0.18);
    const attack = 0.005 * vary(0.2);
    const level = Math.min(1, volume) * (snap ? 0.07 : 0.1) * vary(0.1);

    const source = c.createBufferSource();
    source.buffer = noise!;
    source.playbackRate.value = vary(0.1);
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = (typing ? 750 : snap ? 1100 : 850) * vary(0.18);
    filter.Q.value = 0.5;
    const noiseGain = c.createGain();
    noiseGain.gain.setValueAtTime(0, at);
    noiseGain.gain.linearRampToValueAtTime(
      level * 0.5 * vary(0.2),
      at + attack * 0.8,
    );
    noiseGain.gain.exponentialRampToValueAtTime(0.00001, at + decay);
    noiseGain.gain.linearRampToValueAtTime(0, at + decay + 0.01);
    source.connect(filter).connect(noiseGain).connect(output!);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      noiseGain.disconnect();
    };
    source.start(at, Math.random() * 0.4);
    source.stop(at + decay + 0.015);

    const oscillator = c.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, at);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 0.65 * vary(0.08),
      at + decay,
    );
    const gain = c.createGain();
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(level * 0.65, at + attack);
    gain.gain.exponentialRampToValueAtTime(0.00001, at + decay);
    gain.gain.linearRampToValueAtTime(0, at + decay + 0.01);
    oscillator.connect(gain).connect(output!);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(at);
    oscillator.stop(at + decay + 0.015);
  } catch {
    // Audio support and autoplay policy must never interrupt the interaction.
  }
}
