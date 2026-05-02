export interface CheckResult {
  correct: boolean;
  expected: string;
  got: string;
}

export type Checker = (input: string, expected: string) => CheckResult;

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

export const strictChecker: Checker = (input, expected) => ({
  correct: normalize(input) === normalize(expected),
  expected,
  got: input,
});

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export const fuzzyChecker: Checker = (input, expected) => {
  const a = normalize(input);
  const b = normalize(expected);
  const distance = levenshtein(a, b);
  const tolerance = b.length <= 4 ? 0 : 1;
  return { correct: distance <= tolerance, expected, got: input };
};

export const checkers = {
  strict: strictChecker,
  fuzzy: fuzzyChecker,
} as const;

export type CheckerName = keyof typeof checkers;
