# Minimum Window Substring - Solution

## Solution Code

```typescript
class Solution {
    expectedMap: Map<string, number> = new Map();
    evaluationMap: Map<string, number> = new Map();
    found = false;

    minWindow(s: string, t: string) {
        this.expectedMap = this.createExpectedMapping(t);
        let left = 0;
        let right = t.length - 1;
        let shortestSubstring = s;

        while (right < s.length && left <= s.length - t.length) {
            this.evaluationMap = this.createEmptyMapping(t);
            const substr = s.substring(left, right + 1);
            substr.split('').map(char => {
                if (this.expectedMap.get(char)) {
                    this.evaluationMap.set(char, (this.evaluationMap.get(char) || 0) + 1);
                }
            });
            const mapsEqual = this.compareMaps();
            if (!mapsEqual) {
                right = right += 1;
            } else {
                const substr = s.substring(left, right + 1);
                shortestSubstring = shortestSubstring.length < substr.length ? shortestSubstring : substr;
                left = left += 1;
                this.found = true;
            }
        }

        return this.found ? shortestSubstring : "";
    }

    private createExpectedMapping(t: string): Map<string, number> {
        return t.split('').reduce(
            (acc: Map<string, number>, char: string) => acc.set(char, (acc.get(char) || 0) + 1),
            new Map()
        );
    }

    private createEmptyMapping(t: string): Map<string, number> {
        return t.split('').reduce(
            (acc: Map<string, number>, _char: string) => acc.set(_char, 0),
            new Map()
        );
    }

    private compareMaps(): boolean {
        if (this.expectedMap.size !== this.evaluationMap.size) return false;
        for (const [key, val] of this.evaluationMap) {
            if (!(this.expectedMap.get(key)! <= val)) return false;
        }
        return true;
    }
}
```

## Approach

The submission uses a **sliding window** with two frequency maps: one for `t`'s required character counts (`expectedMap`) and a per-window evaluation map (`evaluationMap`).

1. **Build expected counts** from `t`.
2. **Expand the window** (advance `right`) until it satisfies all required character counts.
3. **Shrink the window** (advance `left`) as long as it still satisfies `t`, recording the shortest seen.
4. **Helper maps**: `createEmptyMapping` seeds an evaluation map with all of `t`'s keys set to `0` so `compareMaps` can compare them uniformly.

- **Time Complexity**: Worst case `O(n² · |t|)` because the substring is rebuilt and recounted on every step. With an incremental counter this is `O(n)`.
- **Space Complexity**: `O(|t|)` for the maps (alphabet is constant size 26 in practice).

## Walkthrough

```
s = "ADOBECODEBANC", t = "ABC"
expected = {A:1, B:1, C:1}

l=0, r=2 "ADO":    eval={A:1}, B missing  → r=3
l=0, r=3 "ADOB":   eval={A:1,B:1}, C miss → r=4
l=0, r=4 "ADOBE":  eval={A:1,B:1}, C miss → r=5
l=0, r=5 "ADOBEC": eval={A:1,B:1,C:1} ✓   shortest="ADOBEC", l=1
l=1, r=5 "DOBEC":  eval={B:1,C:1} miss A → r=6
l=1, r=6 "DOBECO": eval={B:1,C:1,O:1} A miss → r=7
l=1, r=7 "DOBECOD": … A miss → r=8
l=1, r=8 "DOBECODE": … A miss → r=9
l=1, r=9 "DOBECODEB": eval={B:2,C:1} A miss → r=10
l=1, r=10 "DOBECODEBA": eval={A:1,B:2,C:1} ✓ shortest="DOBECODEBA" (longer), l=2
… continues, eventually yielding "BANC" as shortest
```

## Alternative: `have` / `need` Counters (Optimal)

The same idea, but the window's frequency is updated incrementally so the algorithm runs in linear time:

```typescript
class Solution {
    minWindow(s: string, t: string): string {
        const need = new Map<string, number>();
        for (const c of t) need.set(c, (need.get(c) || 0) + 1);

        const window = new Map<string, number>();
        let have = 0;
        const needSize = need.size;
        let l = 0;
        let resLen = Infinity;
        let res = "";

        for (let r = 0; r < s.length; r++) {
            const c = s[r];
            window.set(c, (window.get(c) || 0) + 1);
            if (need.has(c) && window.get(c) === need.get(c)) have++;

            while (have === needSize) {
                if (r - l + 1 < resLen) {
                    resLen = r - l + 1;
                    res = s.substring(l, r + 1);
                }
                const lc = s[l];
                window.set(lc, window.get(lc)! - 1);
                if (need.has(lc) && window.get(lc)! < need.get(lc)!) have--;
                l++;
            }
        }
        return res;
    }
}
```

**Key difference**: Only the `have` count is recomputed per step, and each character enters and leaves the window exactly once.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Brute Force** | $O(n^3)$ | $O(\sigma)$ | Simple to write | Impractical for $n = 10^5$ |
| **Sliding Window + Rebuild Maps (this submission)** | $O(n^2 \cdot \sigma)$ worst case | $O(\sigma)$ | Mirrors the textbook two-map idea | Rebuilds the substring each step |
| **Sliding Window + `have`/`need`** | $O(n + \sigma)$ | $O(\sigma)$ | Single pass, true optimal | More bookkeeping for the `have` count |

**Key Insight**: Once you maintain the window's frequency map incrementally (rather than rebuilding it from `s.substring(l, r+1)`), the algorithm becomes strictly linear — each pointer only moves forward, and the inner `while` loop amortizes to a constant number of iterations per character overall.
