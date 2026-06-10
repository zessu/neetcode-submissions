# Longest Repeating Character Replacement - LeetCode 424

## Problem Description

You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.

## Examples

### Example 1:
```
Input: s = "ABAB", k = 2
Output: 4
Explanation: Replace the two 'A's with 'B's to get "BBBB" (length 4).
```

### Example 2:
```
Input: s = "AABABBA", k = 1
Output: 4
Explanation: Replace the one 'B' in the middle with 'A' to get "AAAAB" (length 4).
```

### Example 3:
```
Input: s = "AABAABBA", k = 1
Output: 4
```

## Constraints

- `1 <= s.length <= 10^5`
- `s` consists of only uppercase English letters.
- `0 <= k <= s.length`

## Topics

- String
- Sliding Window
- Hash Table

## Company Tags

- Google
- Facebook
- Amazon
- Microsoft
- Bloomberg

## Solution Approaches

### 1. Brute Force — Try Every Substring

**Intuition**: For each `(i, j)` pair, count the most frequent character in `s[i..j]`. If `(j - i + 1) - maxFreq <= k`, the substring is achievable.

**Algorithm**:
1. For each `i`:
   - For each `j >= i`:
     - Count frequencies in `s[i..j]`.
     - Compute `replacementsNeeded = (j - i + 1) - maxFreq`.
     - If `replacementsNeeded <= k`, update answer.
2. Return best length found.

**Time Complexity**: `O(n³)` — outer pair loop `O(n²)`, plus `O(n)` counting.
**Space Complexity**: `O(1)` (26 uppercase letters).

### 2. Sliding Window with Frequency Counter (Optimal)

**Intuition**: Maintain a window `[l, r]` and a frequency map of characters inside it. Let `maxFreq` be the count of the most common character in the window. The number of replacements needed to make the window uniform is `windowLen - maxFreq`. If that exceeds `k`, shrink from the left.

**Algorithm**:
1. Initialize `l = 0`, `count = {}`, `result = 0`.
2. For `r` from `0` to `n - 1`:
   - Increment `count[s[r]]`.
   - Update `windowLen = r - l + 1`, compute `replacements = windowLen - max(count.values())`.
   - While `replacements > k`:
     - Decrement `count[s[l]]`, advance `l`, recompute `windowLen`.
   - Update `result = max(result, r - l + 1)`.
3. Return `result`.

**Time Complexity**: `O(n)` — each character enters and leaves the window at most once.
**Space Complexity**: `O(1)` (alphabet is constant size 26).

## Visual Explanation

```
s = "AABABBA", k = 1

Step by step (window = [l, r]):
r=0 'A': count={A:1}, max=1, len=1, rep=0 → result=1
r=1 'A': count={A:2}, max=2, len=2, rep=0 → result=2
r=2 'B': count={A:2,B:1}, max=2, len=3, rep=1 → result=3
r=3 'A': count={A:3,B:1}, max=3, len=4, rep=1 → result=4
r=4 'B': count={A:3,B:2}, max=3, len=5, rep=2 > k=1
         shrink: l=0 'A' out → count={A:2,B:2}, len=4, rep=2 > k
         shrink: l=1 'A' out → count={A:1,B:2}, len=3, rep=1 → result=4
r=5 'B': count={A:1,B:3}, max=3, len=4, rep=1 → result=4
r=6 'A': count={A:2,B:3}, max=3, len=5, rep=2 > k
         shrink: l=2 'B' out → count={A:2,B:2}, len=4, rep=2 > k
         shrink: l=3 'A' out → count={A:1,B:2}, len=3, rep=1

Final: 4
```

```
s = "A A B A B B A"
    0 1 2 3 4 5 6
    └─── window ───┘  with k=1
        [A A B A]     replace 1 B → AAAA
```

## Common Pitfalls

1. **Recomputing `maxFreq` from scratch**: When shrinking the window, don't reduce `maxFreq` aggressively — leaving it at its historical high is safe (and necessary) because we only ever expand `result`.
2. **Off-by-one on shrink loop**: Use `while (replacements > k)`, not `if`, because a single shrink may not be enough.
3. **Counting all 26 letters**: If you keep a full `[26]` array, you don't need a `Map` lookup at all — it's faster.
4. **Empty string**: `s.length === 0` should return `0`.
5. **Edge case `k = 0`**: The window can never need replacements, so the answer is the length of the longest existing run of identical letters.
