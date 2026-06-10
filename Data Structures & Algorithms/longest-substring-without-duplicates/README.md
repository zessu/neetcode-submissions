# Longest Substring Without Repeating Characters - LeetCode 3

## Problem Description

Given a string `s`, find the length of the **longest substring** without repeating characters.

A substring is a contiguous non-empty sequence of characters within the string.

## Examples

### Example 1:
```
Input: s = "abcabcbb"
Output: 3
Explanation: The longest substring is "abc", with length 3.
```

### Example 2:
```
Input: s = "bbbbb"
Output: 1
Explanation: The longest substring is "b", with length 1.
```

### Example 3:
```
Input: s = "pwwkew"
Output: 3
Explanation: The longest substring is "wke", with length 3.
```

### Example 4:
```
Input: s = ""
Output: 0
```

## Constraints

- `0 <= s.length <= 5 * 10^4`
- `s` consists of English letters, digits, symbols, and spaces.

## Topics

- String
- Sliding Window
- Hash Table
- Two Pointers

## Company Tags

- Amazon
- Facebook
- Microsoft
- Google
- Bloomberg
- Apple
- Adobe

## Solution Approaches

### 1. Brute Force — Check Every Substring

**Intuition**: For every starting index `i` and ending index `j`, check whether `s[i..j]` has any duplicate characters. Track the maximum valid length.

**Algorithm**:
1. For each `i`:
   - Initialize an empty `Set`.
   - For each `j >= i`:
     - If `s[j]` is already in the set, break.
     - Add `s[j]`. Update answer.
2. Return answer.

**Time Complexity**: `O(n²)` in the worst case (each substring is checked).
**Space Complexity**: `O(min(n, σ))` where `σ` is the alphabet size (set never exceeds that).

### 2. Sliding Window with Set (Optimal — this submission)

**Intuition**: Maintain a window `[leftPtr, rightPtr]` and a set of characters currently inside it. Expand the right end; if the new character is already in the set, shrink from the left until it isn't.

**Algorithm**:
1. Initialize `charSet = new Set()`, `leftPtr = 0`, `result = 0`.
2. For `rightPtr` from `0` to `n - 1`:
   - While `charSet.has(s[rightPtr])`: remove `s[leftPtr]` from set, advance `leftPtr`.
   - Add `s[rightPtr]`.
   - Update `result = max(result, rightPtr - leftPtr + 1)`.
3. Return `result`.

**Time Complexity**: `O(n)` — each character enters and leaves the set at most once.
**Space Complexity**: `O(min(n, σ))`.

### 3. Sliding Window with Last-Seen Index (Optimal)

**Intuition**: Instead of removing characters one at a time from the left, jump `leftPtr` directly to one past the previous occurrence of `s[rightPtr]`. Achieves the same `O(n)` time with a smaller constant.

**Algorithm**:
1. Initialize `lastSeen = new Map()`, `leftPtr = 0`, `result = 0`.
2. For `rightPtr` from `0` to `n - 1`:
   - If `s[rightPtr]` was seen at index `i` and `i >= leftPtr`: set `leftPtr = i + 1`.
   - Record `lastSeen[s[rightPtr]] = rightPtr`.
   - Update `result = max(result, rightPtr - leftPtr + 1)`.
3. Return `result`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(min(n, σ))`.

## Visual Explanation

```
s = "abcabcbb"

Set approach (this submission):
r=0 'a': set empty → add 'a' → window="a", res=1
r=1 'b': not in set → add 'b' → window="ab", res=2
r=2 'c': not in set → add 'c' → window="abc", res=3
r=3 'a': in set → drop s[0]='a', l=1 → drop s[1]='b', l=2
         drop s[2]='c', l=3 → set={} → add 'a' → window="a", res=3
r=4 'b': not in set → add 'b' → window="ab", res=3
r=5 'c': not in set → add 'c' → window="abc", res=3
r=6 'b': in set → drop s[3]='a', l=4 → add 'b' → window="bcb", res=3
r=7 'b': in set → drop s[4]='b', l=5 → drop s[5]='c', l=6
         add 'b' → window="b", res=3

Output: 3 ✓
```

## Common Pitfalls

1. **Off-by-one on `leftPtr` advance**: After removing `s[leftPtr]`, the next valid window starts at `leftPtr + 1`, not `leftPtr`.
2. **Set vs Map confusion**: A `Set` works because we only need "have I seen it in the window?", not "where did I last see it?". If you need last-seen indices, use a `Map`.
3. **Empty string**: Return `0` — the for-loop handles this naturally because it never executes.
4. **Unicode / surrogate pairs**: JavaScript's `Set`/`Map` keys are strings, which iterate by UTF-16 code units — fine for ASCII, surprising for emoji.
5. **Confusing substring vs subsequence**: This problem is **substring** (contiguous), not subsequence. A common interview follow-up.
