// lib/interview/browser-speech-engine.ts
//
// Vaylo AI — Optimized Browser Speech Synthesis Engine
// Zero-cost, zero-API, zero-hosting client-side speech engine with asynchronous voice loading
// and prioritized high-fidelity neural voice selection (Edge/Chrome Natural voices -> OS voices).

export interface PersonaSpeechParam {
  pitch: number;
  rate: number;
  gender: "male" | "female";
  preferredVoices: string[];
}

export const PERSONA_SPEECH_PARAMS: Record<string, PersonaSpeechParam> = {
  adam_formal: {
    pitch: 0.85,
    rate: 0.95,
    gender: "male",
    preferredVoices: [
      "Microsoft Guy Online (Natural)",
      "Microsoft Ryan Online (Natural)",
      "Google US English Male",
      "Microsoft David Desktop",
      "Microsoft David",
      "Daniel",
      "Alex",
    ],
  },
  josh_neutral: {
    pitch: 1.0,
    rate: 1.0,
    gender: "male",
    preferredVoices: [
      "Microsoft Davis Online (Natural)",
      "Microsoft Christopher Online (Natural)",
      "Google US English Male",
      "Microsoft Mark",
      "Microsoft David Desktop",
      "Fred",
    ],
  },
  rachel_warm: {
    pitch: 1.1,
    rate: 1.05,
    gender: "female",
    preferredVoices: [
      "Microsoft Jenny Online (Natural)",
      "Microsoft Michelle Online (Natural)",
      "Google US English Female",
      "Microsoft Zira Desktop",
      "Samantha",
      "Victoria",
      "Karen",
    ],
  },
  bella_neutral: {
    pitch: 1.0,
    rate: 1.0,
    gender: "female",
    preferredVoices: [
      "Microsoft Aria Online (Natural)",
      "Microsoft Sonia Online (Natural)",
      "Google US English Female",
      "Microsoft Zira Desktop",
      "Microsoft Zira",
      "Tessa",
      "Moira",
    ],
  },
};

/**
 * Asynchronously wait for browser SpeechSynthesis voices to load
 * Prevents empty voice list bug on Chromium and Safari startup
 */
export function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return resolve([]);
    }

    const immediate = window.speechSynthesis.getVoices();
    if (immediate.length > 0) {
      return resolve(immediate);
    }

    let resolved = false;
    const onVoicesChanged = () => {
      if (resolved) return;
      resolved = true;
      const loaded = window.speechSynthesis.getVoices();
      resolve(loaded);
    };

    window.speechSynthesis.onvoiceschanged = onVoicesChanged;

    // Timeout safety fallback after 1.5s
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(window.speechSynthesis.getVoices());
      }
    }, 1500);
  });
}

/**
 * Selects the best available natural/OS voice matching persona requirements
 */
export function selectBestAvailableVoice(
  voices: SpeechSynthesisVoice[],
  personaKey: string = "josh_neutral"
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const config = PERSONA_SPEECH_PARAMS[personaKey] || PERSONA_SPEECH_PARAMS.josh_neutral;

  // 1. Check exact priority list for this specific persona
  for (const preferred of config.preferredVoices) {
    const match = voices.find(
      (v) => v.name.toLowerCase().includes(preferred.toLowerCase())
    );
    if (match) return match;
  }

  // 2. Filter by English language + gender heuristic regex
  const enVoices = voices.filter((v) => v.lang.startsWith("en"));
  const candidatePool = enVoices.length > 0 ? enVoices : voices;

  const maleRegex = /male|guy|david|ryan|davis|christopher|george|alex|daniel/i;
  const femaleRegex = /female|zira|aria|jenny|samantha|victoria|karen|michelle|sonia/i;

  const targetRegex = config.gender === "male" ? maleRegex : femaleRegex;
  const matchedGenderVoice = candidatePool.find((v) => targetRegex.test(v.name));
  if (matchedGenderVoice) return matchedGenderVoice;

  // 3. Fallback to any English voice or first available
  return candidatePool[0] || voices[0] || null;
}

/**
 * Speaks text using tuned per-persona pitch, rate, and voice settings
 */
export function speakAsPersona(
  text: string,
  personaKey: string,
  voices: SpeechSynthesisVoice[],
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) {
    return null;
  }

  try {
    window.speechSynthesis.cancel(); // Clear any pending speech queue

    const config = PERSONA_SPEECH_PARAMS[personaKey] || PERSONA_SPEECH_PARAMS.josh_neutral;
    const utterance = new SpeechSynthesisUtterance(text);
    const chosenVoice = selectBestAvailableVoice(voices, personaKey);

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.pitch = config.pitch;
    utterance.rate = config.rate;

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = (e) => {
      console.warn("[SpeechSynthesis Notice]:", e);
      onError?.(e);
    };

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    console.warn("[speakAsPersona Error]:", err);
    onError?.(err);
    return null;
  }
}
