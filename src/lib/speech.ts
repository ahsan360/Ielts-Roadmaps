export const ACCENTS = {
  UK: "en-GB",
  US: "en-US",
  AU: "en-AU",
} as const;

export type Accent = keyof typeof ACCENTS;

export interface SpeakOptions {
  accent?: Accent;
  rate?: number;
}

export function isSpeechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, opts: SpeakOptions = {}): void {
  if (!isSpeechAvailable()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const lang = ACCENTS[opts.accent ?? "UK"];
  const voices = window.speechSynthesis.getVoices();
  const voice =
    voices.find((v) => v.lang === lang) ??
    voices.find((v) => v.lang.startsWith(lang.split("-")[0])) ??
    null;
  if (voice) u.voice = voice;
  u.lang = lang;
  u.rate = opts.rate ?? 1;
  window.speechSynthesis.speak(u);
}

export function preloadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechAvailable()) return resolve([]);
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) return resolve(existing);
    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = null;
      resolve(v);
    };
    window.speechSynthesis.onvoiceschanged = handler;
  });
}
