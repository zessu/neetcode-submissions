# Permutation in String - LeetCode 567

## Problem Description

Given two strings `s1` and `s2`, return `true` if `s2` contains a **permutation** of `s1`. In other words, return `true` if one of `s1`'s permutations is a **substring** of `s2`.

## Examples

### Example 1:
```
Input: s1 = "ab", s2 = "eidbaooo"
Output: true
Explanation: s2 contains "ba", which is a permutation of "ab".
```

### Example 2:
```
Input: s1 = "ab", s2 = "eidboaoo"
Output: false
```

### Example 3:
```
Input: s1 = "adc", s2 = "dcda"
Output: true
Explanation: s2 contains "dca", "cda", "dac", "dca", "acd", "cda" — all permutations of "adc". The substring "dca" matches.
```

## Constraints

- `1 <= s1.length, s2.length <= 10^4`
- `s1` and `s2` consist of lowercase English letters.

## Topics

- String
- Sliding Window
- Hash Table
- Two Pointers

## Company Tags

- Microsoft
- Amazon
- Facebook
- Google
- Bloomberg

## Solution Approaches

### 1. Brute Force — Generate All Permutations

**Intuition**: Generate every permutation of `s1` and check whether any is a substring of `s2`. Skip for `n!` reasons.

**Algorithm**:
1. Generate all `|s1|!` permutations of `s1`.
2. For each, check if it's a substring of `s2`.
3. Return `true` on the first hit.

**Time Complexity**: `O(|s1|! · |s2|)` — unusable for non-trivial inputs.
**Space Complexity**: `O(|s1| · |s1|!)`.

### 2. Sliding Window with Frequency Counters (this submission)

**Intuition**: Two strings are permutations of each other iff their sorted forms are equal iff their character frequency counts are equal. Slide a window of length `|s1|` across `s2`, recompute the count for the current window, and compare against `s1`'s count.

**Algorithm**:
1. Build the count array for `s1` (size 26).
2. Slide a window of size `|s1|` across `s2`:
   - At each step, build a fresh count array for `s2[start..start+|s1|]`.
   - Compare the two arrays element-wise.
   - If equal, return `true`.
3. Return `false` if no window matches.

**Time Complexity**: `O(|s2| · |s1|)` because each window rebuilds its count from scratch.
**Space Complexity**: `O(1)` (fixed 26-element arrays).

### 3. Sliding Window with Rolling Updates (Optimal)

**Intuition**: Maintain the window's count incrementally. On each step, decrement the count of the character leaving the window and increment the count of the character entering. Compare against the target. Track a `matches` counter: it equals 26 when the two arrays are equal.

**Algorithm**:
1. Build `target` count for `s1`.
2. Initialize `window` count to zeros; populate the first `|s1|` characters.
3. Count positions where `window[i] === target[i]`; call this `matches`.
4. If `matches === 26`, return `true`.
5. Slide the window one step at a time across `s2`:
   - Update `window` for the entering and leaving characters.
   - Update `matches` based on which positions changed.
6. Return `false` if no match found.

**Time Complexity**: `O(|s2|)` — each slide is `O(1)`.
**Space Complexity**: `O(1)`.

## Visual Explanation

```
s1 = "ab", s2 = "eidbaooo"
target count = {a:1, b:1}

Windows of length 2 across s2:
e i  → {e:1, i:1}     no
i d  → {i:1, d:1}     no
d b  → {d:1, b:1}     no
b a  → {b:1, a:1}     ✓ matches target → return true
```

```
s2 =  e  i  d  b  a  o  o  o
        [i  d]  b  a  o  o  o
                 [d  b]  a  o  o
                      [b  a]  o  o
                           [a  o]  o
                                …
```

## Common Pitfalls

1. **Rebuilding the count every slide**: The submission does this, which costs `O(|s1|)` per slide. Rolling updates cut it to `O(1)` per slide.
2. **Index arithmetic**: Window index = `s2[start + count]` — easy to off-by-one. Keep `start` as the leftmost index.
3. **Array equality in JavaScript**: `[1,2] === [1,2]` is `false`. Use `.length` and `.every((v, i) => v === arr2[i])` (as this submission does) or stringify.
4. **Length precondition**: If `|s1| > |s2|`, no permutation can fit. Return `false` early.
5. **Unicode / non-lowercase input**: The size-26 array assumes lowercase English. Generalize to `Map` for arbitrary alphabets.
