# Permutation in String - Solution

## Solution Code

```javascript
class Solution {
    /**
     * @param {string} s1
     * @param {string} s2
     * @return {boolean}
     */
    checkInclusion(s1, s2) {
        const l1 = s1.length;
        const l2 = s2.length;
        const arr1 = Array.from({ length: 26 }).fill(0);

        if (l1 > l2) return false;

        for (let count = 0; count < l1; count++) {
            const char = s1[count];
            const idx = char.charCodeAt(0) - 97;
            arr1[idx] = arr1[idx] ? arr1[idx] + 1 : 1;
        }

        let start = 0;
        let end = start + l1;

        while (end <= l2) {
            const arr2 = Array.from({ length: 26 }).fill(0);
            for (let count = 0; count < l1; count++) {
                const char = s2[start + count];
                const idx = char.charCodeAt(0) - 97;
                arr2[idx] = arr2[idx] ? arr2[idx] + 1 : 1;
            }

            const isEqual = arr1.length === arr2.length && arr1.every((item, idx) => item === arr2[idx]);

            if (isEqual) return true;

            start++;
            end = start + l1;
        }

        return false;
    }
}
```

## Approach

The submission slides a fixed-size window of length `|s1|` across `s2`, and at each position rebuilds a 26-element frequency count for the window.

1. **Build the target count** for `s1` once.
2. **For each window** `s2[start..start+l1]`:
   - Build a fresh 26-element count.
   - Compare it element-wise to `arr1`.
3. **Return** `true` on the first match, `false` otherwise.

- **Time Complexity**: `O(|s2| · |s1|)` — each window is recounted in `O(|s1|)`.
- **Space Complexity**: `O(1)` — fixed 26-element arrays.

## Walkthrough

```
s1 = "ab", s2 = "eidbaooo"
arr1 = {a:1, b:1}

start=0, end=2: window="ei" → arr2={e:1, i:1}   no match
start=1, end=3: window="id" → arr2={i:1, d:1}   no match
start=2, end=4: window="db" → arr2={d:1, b:1}   no match
start=3, end=5: window="ba" → arr2={b:1, a:1}   ✓ match
return true
```

## Alternative: Sliding Window with Rolling Updates (Optimal)

Same idea, but the window's count is updated incrementally — `O(1)` per slide, so the total is `O(|s2|)`:

```javascript
class Solution {
    checkInclusion(s1, s2) {
        if (s1.length > s2.length) return false;

        const target = new Array(26).fill(0);
        const window = new Array(26).fill(0);
        for (let i = 0; i < s1.length; i++) {
            target[s1.charCodeAt(i) - 97]++;
            window[s2.charCodeAt(i) - 97]++;
        }

        let matches = 0;
        for (let i = 0; i < 26; i++) {
            if (target[i] === window[i]) matches++;
        }

        if (matches === 26) return true;

        for (let i = s1.length; i < s2.length; i++) {
            const inIdx = s2.charCodeAt(i) - 97;
            const outIdx = s2.charCodeAt(i - s1.length) - 97;

            // Character entering
            window[inIdx]++;
            if (window[inIdx] === target[inIdx]) matches++;
            else if (window[inIdx] === target[inIdx] + 1) matches--;

            // Character leaving
            window[outIdx]--;
            if (window[outIdx] === target[outIdx]) matches++;
            else if (window[outIdx] === target[outIdx] - 1) matches--;

            if (matches === 26) return true;
        }

        return false;
    }
}
```

**Key difference**: We only touch the two indices that change each step, and we maintain a running `matches` count so we don't need to scan all 26 buckets per slide.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Brute Force (permutations)** | $O(\|s1\|! \cdot \|s2\|)$ | $O(\|s1\| \cdot \|s1\|!)$ | Easiest to *describe* | Unusable for $\|s1\| \ge 8$ |
| **Sliding Window + Rebuild (this submission)** | $O(\|s1\| \cdot \|s2\|)$ | $O(1)$ | Clear, easy to follow | Repeated work per slide |
| **Sliding Window + Rolling Updates** | $O(\|s1\| + \|s2\|)$ | $O(1)$ | Strictly linear, no wasted work | More bookkeeping for `matches` |

**Key Insight**: Two strings are permutations iff their sorted forms are equal iff their letter-frequency arrays are equal. The sliding window doesn't need to *find* the permutation — it just needs to *verify* that the window's letter counts match `s1`'s letter counts. The rolling-update trick is what makes the verification constant-time per slide.
