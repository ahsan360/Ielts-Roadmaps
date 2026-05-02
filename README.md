# IELTS Vocabulary Drill

A Next.js 14 app for drilling 896 common IELTS Listening vocabulary words. Built to be extended.

Created by Ahsan Habib, Software Engineer at Appify Lab. Connect on LinkedIn: https://www.linkedin.com/in/ahsan-habib-u/

## Run it

```bash
cd D:\Projects\ielts-vocab
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel (free)

The fastest way to share it with anyone, on any device:

**Option A — GitHub (recommended):**
1. Push this folder to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new) → Import the repo
3. Vercel auto-detects Next.js — just click Deploy
4. You get a free URL like `ielts-vocab.vercel.app`

**Option B — CLI:**
```bash
npm i -g vercel
cd D:\Projects\ielts-vocab
vercel
```

Free tier handles thousands of users and is more than enough for this app.

## Mobile support

The app is mobile-first. On phones/tablets:

- ✅ Responsive layout (stacks on small screens)
- ✅ "Add to Home Screen" — installs as a PWA via the included `manifest.json`. On iPhone this also dodges the 7-day Safari storage clear.
- ✅ iOS Safari speech unlock — `/test` shows a "Tap to start" gate because iOS blocks audio without a user gesture
- ✅ Auto-zoom prevented on input focus (input font-size ≥ 16px)
- ✅ Stats auto-clear every 7 days so you get a fresh weekly cycle

## What's in the box

Three modes out of the box:

| Mode | Route | What it does |
| ---- | ----- | ------------ |
| **Type Practice** | `/practice` | Word is shown, you type it. Builds spelling muscle memory. |
| **Listen & Type** | `/test` | Word is spoken (UK / US / AU accent, adjustable speed), you type it. IELTS-style. |
| **Review Missed** | `/review` | Drills only the words you've previously gotten wrong (tracked in `localStorage`). |

Speech uses the browser's built-in **Web Speech API** — no audio files, no API keys.

## Architecture (and how to extend)

```
src/
├── app/                          ← Next.js App Router pages
│   ├── page.tsx                  ← Landing + mode picker + category filter
│   ├── practice/page.tsx
│   ├── test/page.tsx
│   └── review/page.tsx
├── components/                   ← Presentational React components
│   ├── SessionRunner.tsx         ← The generic mode runner (★ key file)
│   ├── AnswerInput.tsx
│   ├── FeedbackBanner.tsx
│   ├── Stats.tsx
│   ├── Results.tsx
│   ├── CategoryPicker.tsx
│   └── ModeCard.tsx
├── hooks/
│   ├── useSession.ts             ← Tracks index, score, submits answers
│   ├── useSpeech.ts              ← Wraps speak() with persisted accent/rate
│   └── useStats.ts               ← Reads aggregate stats from storage
├── lib/
│   ├── words.ts                  ← Loads + filters + shuffles words
│   ├── checker.ts                ← strict + fuzzy answer matchers (swappable)
│   ├── speech.ts                 ← Web Speech API wrapper
│   ├── storage.ts                ← localStorage adapter (swap for an API)
│   └── modes/
│       ├── types.ts              ← `ModeDefinition` interface
│       ├── practice.tsx
│       ├── test.tsx
│       └── registry.ts           ← ★ list of all modes ★
└── data/words.json               ← The vocabulary list, by category
```

### Extension points

Each one is isolated — change one file, the rest doesn't notice.

**1. Add a new mode** (e.g. multiple-choice, sentence fill-in-blank, synonym match)

A "mode" is just an object that knows how to render a prompt. The session/scoring logic is shared.

```tsx
// src/lib/modes/multipleChoice.tsx
import type { ModeDefinition, PromptProps } from "./types";

function MCPrompt({ word }: PromptProps) {
  return <div>What does "{word.text}" mean?</div>;
  // …show options, etc.
}

export const multipleChoiceMode: ModeDefinition = {
  id: "mc",
  name: "Multiple Choice",
  description: "Pick the right meaning",
  href: "/mc",
  emoji: "🅰️",
  Prompt: MCPrompt,
};
```

Then:
1. Add it to `src/lib/modes/registry.ts`:
   ```ts
   export const modes = [practiceMode, testMode, reviewMode, multipleChoiceMode];
   ```
2. Create `src/app/mc/page.tsx` (copy `practice/page.tsx`, swap the import).

That's it. The card appears on the landing page, the URL works, scoring + storage already wired up.

**2. Swap the answer checker** (e.g. allow typos, accept synonyms)

`src/lib/checker.ts` already exports `strictChecker` and `fuzzyChecker`. To use fuzzy by default:

```ts
// src/hooks/useSession.ts
import { fuzzyChecker } from "@/lib/checker";
export function useSession(words, checker = fuzzyChecker) { … }
```

Or pass a checker per-mode (add `checker?: Checker` to `ModeDefinition` and read it in `SessionRunner`).

**3. Replace localStorage with a backend** (e.g. for accounts / cross-device sync)

Only `src/lib/storage.ts` touches storage. Replace its bodies with `fetch()` calls — no UI changes.

**4. Use real audio recordings instead of TTS**

Add `audio?: string` to the word shape, and in `lib/speech.ts` check for it before falling back to TTS. The word JSON can mix:

```json
{
  "id": "days",
  "words": ["Monday", { "text": "Tuesday", "audio": "/audio/tuesday.mp3" }]
}
```

(Loader in `lib/words.ts` would need to handle the object form — small change.)

**5. Add spaced repetition**

`useSession` decides what word comes next. Replace its `index`-based queue with a queue produced by an SRS algorithm reading from `storage.ts`.

**6. Add new vocabulary**

Edit `src/data/words.json`. Each category needs an `id`, `name`, and `words` array.

## Notes for IELTS

- The default checker is **strict** — IELTS marks a word wrong if a single letter is off, so we mirror that. Switch to fuzzy if you want forgiveness.
- Speech accent defaults to **UK**. Real IELTS uses all of UK / US / AU — practice all three.
- Default speed is normal; "Fast" mimics real IELTS audio pace.
- Stats persist across sessions in `localStorage` under `ielts-vocab-v1`.
"# Ielts-Roadmaps" 
