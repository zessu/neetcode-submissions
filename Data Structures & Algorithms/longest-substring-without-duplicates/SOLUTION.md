# Longest Substring Without Repeating Characters - Solution

## Solution Code

```javascript
class Solution {
    /**
     * @param {string} s
     * @return {number}
     */
    lengthOfLongestSubstring(s) {
        const charSet = new Set();
        let leftPtr = 0;
        let res = 0;

        for (let rightPtr = 0; rightPtr < s.length; rightPtr++) {
            while (charSet.has(s[rightPtr])) {
                charSet.delete(s[leftPtr]);
                leftPtr++;
            }
            charSet.add(s[rightPtr]);
            res = Math.max(res, rightPtr - leftPtr + 1);
        }

        return res;
    }
}
```

## Approach

The solution uses the classic **sliding window** pattern with a `Set` to track characters currently in the window.

1. **Expand the window**: For each new `rightPtr`, attempt to add `s[rightPtr]` to the set.
2. **Shrink on collision**: If `s[rightPtr]` is already in the set, keep removing `s[leftPtr]` and advancing `leftPtr` until the collision is gone.
3. **Update result**: After the window is valid, record `rightPtr - leftPtr + 1` as a candidate answer.
4. **Single pass**: Each character is added to and removed from the set at most once, so total work is linear.

- **Time Complexity**: `O(n)` — amortized.
- **Space Complexity**: `O(min(n, σ))` — the set never holds more than the alphabet size.

## Walkthrough

```
s = "abcabcbb"

l=0, r=0 'a': set={} → add 'a' → set={a}, res=1
l=0, r=1 'b': add 'b' → set={a,b}, res=2
l=0, r=2 'c': add 'c' → set={a,b,c}, res=3
l=0, r=3 'a': 'a' in set
  drop s[0]='a', l=1 → set={b,c}
  'a' not in set → add 'a' → set={a,b,c}, res=3
l=1, r=4 'b': 'b' in set
  drop s[1]='b', l=2 → set={a,c}
  add 'b' → set={a,b,c}, res=3
l=2, r=5 'c': 'c' in set
  drop s[2]='c', l=3 → set={a,b}
  add 'c' → set={a,b,c}, res=3
l=3, r=6 'b': 'b' in set
  drop s[3]='a', l=4 → set={b,c}
  add 'b' → set={b,c}, res=3
l=4, r=7 'b': 'b' in set
  drop s[4]='b', l=5 → set={c}
  'b' not in set → add 'b' → set={b,c}, res=3

Output: 3 ✓
```

## Alternative: Last-Seen Index Map

Same `O(n)` time, smaller constant — useful when you don't want the inner `while` loop:

```javascript
class Solution {
    lengthOfLongestSubstring(s) {
        const lastSeen = new Map();
        let leftPtr = 0;
        let res = 0;

        for (let rightPtr = 0; rightPtr < s.length; rightPtr++) {
            const c = s[rightPtr];
            if (lastSeen.has(c) && lastSeen.get(c) >= leftPtr) {
                leftPtr = lastSeen.get(c) + 1;
            }
            lastSeen.set(c, rightPtr);
            res = Math.max(res, rightPtr - leftPtr + 1);
        }

        return res;
    }
}
```

The `>= leftPtr` check is essential: a previous occurrence of `c` that is *outside* the current window must not move the left pointer backwards.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Brute Force** | $O(n^2)$ | $O(\min(n, \sigma))$ | Easiest to write | Slow for $n = 5 \times 10^4$ |
| **Sliding Window + Set** | $O(n)$ | $O(\min(n, \sigma))$ | Single pass, mirrors the standard pattern | Inner `while` loop can iterate many times in a row |
| **Sliding Window + Last-Seen Map** | $O(n)$ | $O(\min(n, \sigma))$ | No inner `while` — strictly linear scans | Slightly more bookkeeping |

**Key Insight**: The "right pointer always moves forward" invariant is what makes the sliding window linear. Each character causes at most one insert and one delete from the set, regardless of how long the inner `while` loop runs in any single iteration.
