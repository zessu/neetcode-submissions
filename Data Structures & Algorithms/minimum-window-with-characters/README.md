# Minimum Window Substring - LeetCode 76

> Note: submissions in this directory are written in TypeScript (`.ts`).

## Problem Description

Given two strings `s` and `t`, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window. If no such substring exists, return `""`.

The test cases are generated such that the answer is **unique**.

## Examples

### Example 1:
```
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: The minimum window substring is "BANC" which contains 'A', 'B', and 'C'.
```

### Example 2:
```
Input: s = "a", t = "a"
Output: "a"
```

### Example 3:
```
Input: s = "a", t = "aa"
Output: ""
Explanation: Both 'a's from t are required, but s contains only one 'a'.
```

## Constraints

- `1 <= s.length, t.length <= 10^5`
- `s` and `t` consist of uppercase and lowercase English letters.

## Topics

- String
- Sliding Window
- Hash Table
- Two Pointers

## Company Tags

- Facebook
- Amazon
- Google
- Microsoft
- Uber
- Bloomberg
- Apple

## Solution Approaches

### 1. Brute Force — Try Every Substring

**Intuition**: For each `(i, j)` pair in `s`, check whether `s[i..j]` contains all characters of `t` (with required multiplicities). Track the shortest valid one.

**Algorithm**:
1. For each `i`:
   - For each `j >= i`:
     - Count characters in `s[i..j]`.
     - If the counts are at least the counts of `t`, record `s[i..j]`.
2. Return the shortest recorded substring (or `""`).

**Time Complexity**: `O(n³)` in the worst case (enumeration + counting).
**Space Complexity**: `O(σ)` for the counters.

### 2. Sliding Window with Two Frequency Maps (this submission)

**Intuition**: Expand a window to the right until it contains all of `t`. Then shrink from the left as much as possible while it still contains all of `t`. Each shrink that succeeds produces a new candidate.

**Algorithm**:
1. Build `expectedMap` from `t`.
2. Initialize `left = 0`, `right = t.length - 1`, `shortest = s`.
3. While `right < s.length` and `left <= s.length - t.length`:
   - Build a fresh `evaluationMap` for the current window.
   - Compare against `expectedMap` (per-character count).
   - If window is not valid: advance `right`.
   - If window is valid: update `shortest`, advance `left`.
4. Return `shortest` if any valid window was found, else `""`.

**Time Complexity**: Worst case `O(n² · σ)` because the window's map is rebuilt every step.
**Space Complexity**: `O(σ)`.

### 3. Sliding Window with `have` / `need` Counters (Optimal)

**Intuition**: Maintain the window's frequency map incrementally. Track `have` (number of unique characters for which the window meets or exceeds `t`'s count) and `need` (number of unique characters in `t`). The window is valid when `have === need`. Shrink on success.

**Algorithm**:
1. Build `need` map from `t`; `have = 0`, `l = 0`, `resLen = Infinity`, `res = ""`.
2. For `r` from `0` to `n - 1`:
   - Decrement `need[s[r]]` (or increment the window's count).
   - If `s[r]` is a required character and the window now meets its quota: `have++`.
   - While `have === need.size`:
     - Update result if `(r - l + 1) < resLen`.
     - Increment `need[s[l]]` (window is shrinking).
     - If the shrunk window falls below quota for `s[l]`: `have--`.
     - `l++`.
3. Return `res` (or `""`).

**Time Complexity**: `O(n + σ)` — each pointer only moves forward.
**Space Complexity**: `O(σ)`.

## Visual Explanation

```
s = "ADOBECODEBANC", t = "ABC"
expected = {A:1, B:1, C:1}

Window expansion:
  ADOBEC → contains A,B,C ✓
  shrink: ADOBEC → DOBEC  (still ✓) update shortest to "DOBEC"
  shrink: DOBEC  → OBEC   (still ✓) — but B not in front, length 4
  shrink: OBEC   → OBE    (missing A)
expand: OBE → OBECODEB...   (eventually) BANC
```

```
       s
       v
A D O B E C O D E B A N C
        |_____|                ← first valid window
                |___|           ← shorter still-valid window (after shrink)
                        |___|   ← shortest valid: "BANC"
```

## Common Pitfalls

1. **Recomputing the window map each step**: This submission does that, which is `O(n²)` worst case. Use an incrementally maintained map for `O(n)`.
2. **Map equality on `Map` objects**: Two `Map`s with the same entries are *not* `===`; compare per-key (this submission uses a `for...of` loop, which is correct).
3. **Empty result on no match**: The submission tracks `this.found` and returns `""` if it never becomes `true`.
4. **Initial `right` of `t.length - 1`**: This works because any valid window must be at least `t.length` wide — but be careful to clamp when `t.length > s.length`.
5. **Case sensitivity**: `s` and `t` may include both upper and lower case letters; treat them as distinct.
