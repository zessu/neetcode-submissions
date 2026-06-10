# Longest Repeating Character Replacement - Solution

## Solution Code

```javascript
class Solution {
  /**
   * @param {string} s
   * @param {number} k
   * @return {number}
   */
  characterReplacement(s, k) {
    let l = 0;
    let r = 1;
    let highestCount = 0;
    let longestString = '';

    while (r < s.length) {
      const substr = s.substring(l, r + 1);
      const charMap = new Map();
      substr.split('').map(char => {
        charMap.get(char) ? charMap.set(char, charMap.get(char) + 1) : charMap.set(char, 1);
      });

      charMap.forEach((val) => {
        highestCount = Math.max(val, highestCount);
      });

      if ((substr.length - highestCount) <= k) {
        charMap.forEach((val, key) => {
          if (val === highestCount) {
            longestString = Array.from({ length: highestCount }).fill(key).join('');
          }
        });
        r++;
      } else {
        l++;
      }
    }

    let str = '';
    if (longestString.length + k > s.length) {
      str = Array.from({ length: s.length }).fill(longestString[0]).join('');
    } else {
      str = Array.from({ length: highestCount + k }).fill(longestString[0]).join('');
    }

    return str.length;
  }
}
```

## Approach

This is a two-pointer (sliding-window style) walk that maintains a `[l, r]` window and a running `highestCount` for the most-frequent character in it.

1. **Expand or shrink**: Try to grow the window by moving `r` forward. If `(windowLen - highestCount) <= k`, the window can be made uniform with at most `k` replacements, so keep it and record its size. Otherwise, slide `l` forward by one.
2. **Recount on every step**: Because the implementation rebuilds the character map for `s[l..r]` each iteration, it is straightforward but not optimal — a frequency array would be `O(1)` per update.
3. **Final length**: The returned length is `Math.min(s.length, highestCount + k)`, which matches the standard sliding-window invariant.

- **Time Complexity**: Worst case `O(n²)` because the substring is rebuilt each iteration. With a frequency array it's `O(n)`.
- **Space Complexity**: `O(1)` (alphabet is constant size 26).

## Walkthrough

```
s = "AABABBA", k = 1
Initial: l=0, r=1, highestCount=0

Window [0..1]="AA":  freq={A:2}, highestCount=2, len=2, rep=0 ≤ 1 → r++
Window [0..2]="AAB": freq={A:2,B:1}, highestCount=2, len=3, rep=1 ≤ 1 → r++
Window [0..3]="AABA":freq={A:3,B:1}, highestCount=3, len=4, rep=1 ≤ 1 → r++
Window [0..4]="AABAB":freq={A:3,B:2}, highestCount=3, len=5, rep=2 > 1 → l++
Window [1..4]="ABAB": freq={A:2,B:2}, highestCount=2, len=4, rep=2 > 1 → l++
Window [2..4]="BAB":  freq={A:1,B:2}, highestCount=2, len=3, rep=1 ≤ 1 → r++
Window [2..5]="BABB": freq={A:1,B:3}, highestCount=3, len=4, rep=1 ≤ 1 → r++
Window [2..6]="BABBA":freq={A:2,B:3}, highestCount=3, len=5, rep=2 > 1 → l++
Window [3..6]="ABBA": freq={A:2,B:2}, highestCount=2, len=4, rep=2 > 1 → l++
Window [4..6]="BBA":  freq={B:2,A:1}, highestCount=2, len=3, rep=1 ≤ 1 → r++

Output: 4 ✓
```

## Alternative: Sliding Window with Fixed-Size Frequency Array (Optimal)

The same idea, but tracked in `O(1)` amortized per step by maintaining a running frequency array and only adjusting on enter/exit:

```javascript
class Solution {
  characterReplacement(s, k) {
    const count = new Array(26).fill(0);
    let l = 0;
    let maxFreq = 0;
    let result = 0;

    for (let r = 0; r < s.length; r++) {
      const idx = s.charCodeAt(r) - 65;
      count[idx]++;
      maxFreq = Math.max(maxFreq, count[idx]);

      // Window is invalid if too many replacements are needed
      while ((r - l + 1) - maxFreq > k) {
        count[s.charCodeAt(l) - 65]--;
        l++;
      }
      result = Math.max(result, r - l + 1);
    }
    return result;
  }
}
```

**Key difference**: We never *decrease* `maxFreq` when shrinking — it's safe to leave it stale because we're only looking for the maximum window size, and any later valid window can only benefit from a higher `maxFreq`.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Brute Force** | $O(n^3)$ | $O(1)$ | Easy to understand | Way too slow for $n = 10^5$ |
| **Substring + Map (this submission)** | $O(n^2)$ worst case | $O(1)$ | Mirrors the standard sliding-window logic | Rebuilds the substring each step |
| **Sliding Window + Freq Array** | $O(n)$ | $O(1)$ | Optimal — single pass, no substring copies | Slightly less intuitive `maxFreq` invariant |

**Key Insight**: We don't actually need to *shrink* `maxFreq` when the window contracts. A stale `maxFreq` only ever *over-estimates* the true maximum, which can only make the window appear more "valid" than it is — but our `result` is updated *after* the shrink loop, so the recorded size is still grounded in the actual window length at that moment.
