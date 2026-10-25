# Longest Palindromic Substring - Solution

## Solution Code

```typescript
class Solution {
    originalString: string = "";
    longestLength = 0;
    coordinates: number[] = [0, 0];

    longestPalindrome(s) {
        this.originalString = s;
        for (let i = 0; i < s.length; i++) {
            this.workout(i, i);
            this.workout(i, i + 1);
        }
        const [a, b] = this.coordinates;
        return this.originalString.substring(a, b + 1);
    }

    workout(left, right) {
        while (left >= 0 && right < this.originalString.length && this.originalString[left] === this.originalString[right]) {
            const length = (right + 1) - left;
            if (length > this.longestLength) {
                this.longestLength = length;
                this.coordinates = [left, right];
            }
            left--;
            right++;
        }
    }
}
```

> `submission-7.ts` is the latest submission and the code shown above. `submission-3.ts` and `submission-4.ts` are byte-for-byte identical to each other and use the same expand-around-center idea with a stored `answer` string; submissions 5 and 6 are intermediate refactors that store a length and coordinates. The latest version keeps the coordinates and slices the original string once at the end.

## Approach

The solution uses **expand around center**, which treats every possible palindrome center as the starting point and grows outward while the characters match.

1. **Try every odd center**: `workout(i, i)` starts with the single character `s[i]` and expands to `(i - 1, i + 1)`, `(i - 2, i + 2)`, and so on.
2. **Try every even center**: `workout(i, i + 1)` starts with the gap between `s[i]` and `s[i + 1]`. It handles palindromes such as `"bb"` and `"abba"`.
3. **Expand while valid**: the loop condition checks both boundaries and character equality:
   - `left >= 0` and `right < n` keep the indices inside the string.
   - `s[left] === s[right]` confirms the next pair matches.
4. **Record the best range**: inside the loop, `length = (right + 1) - left` is the inclusive length. If it beats `longestLength`, update both the length and the inclusive `[left, right]` coordinates.
5. **Advance**: decrement `left` and increment `right`. When the characters stop matching (or a boundary is hit), the expansion for this center is finished.
6. **Return the slice**: after all centers are processed, `s.substring(a, b + 1)` converts the inclusive coordinates back to a substring. JavaScript's `substring` end index is exclusive, hence the `+ 1`.

Every palindrome has exactly one center: either a character (odd length) or a gap between two characters (even length). Expanding from that center visits every matching pair, so the longest palindrome centered there is found. Taking the maximum over all `2n - 1` centers therefore finds the global longest palindromic substring.

- **Time Complexity**: `O(n^2)`. There are `2n - 1` centers, and a center can expand over at most `n / 2` pairs, so the total work is `O(n^2)`. For `n = 1000`, this is at most a few million character comparisons.
- **Space Complexity**: `O(1)` extra space. The algorithm stores only the input reference, a best length, and two indices. The returned substring itself is `O(n)`.

## Walkthrough

### Example 1: `s = "babad"`

The loop runs `i = 0 .. 4` and performs both an odd and an even expansion at each index.

| `i` | Center | Expansion | Length | Best after step |
| :--- | :--- | :--- | :--- | :--- |
| 0 | `(0,0)` odd | `"b"`; left becomes -1 | 1 | `"b"` [0,0] |
| 0 | `(0,1)` even | `'b'` vs `'a'` mismatch | 0 | `"b"` [0,0] |
| 1 | `(1,1)` odd | `"a"` -> `"bab"`; next pair is outside | 3 | `"bab"` [0,2] |
| 1 | `(1,2)` even | `'a'` vs `'b'` mismatch | 0 | `"bab"` [0,2] |
| 2 | `(2,2)` odd | `"b"` -> `"aba"`; length 3 is not greater | 3 | `"bab"` [0,2] |
| 2 | `(2,3)` even | `'b'` vs `'a'` mismatch | 0 | `"bab"` [0,2] |
| 3 | `(3,3)` odd | `"a"`; next pair `(2,4)` is `'b'` vs `'d'` | 1 | `"bab"` [0,2] |
| 3 | `(3,4)` even | `'a'` vs `'d'` mismatch | 0 | `"bab"` [0,2] |
| 4 | `(4,4)` odd | `"d"` | 1 | `"bab"` [0,2] |
| 4 | `(4,5)` even | `right` is out of bounds | 0 | `"bab"` [0,2] |

At the end, `coordinates = [0, 2]`, so the method returns `"babad".substring(0, 3)`, which is `"bab"`. The `"aba"` found at center 2 has the same length, so it is not recorded; either answer would be accepted.

### Example 2: `s = "cbbd"`

The key step is the even expansion at `i = 1`:

```
workout(1, 2):
  s[1] = 'b', s[2] = 'b'  -> match, length = (2 + 1) - 1 = 2
  coordinates = [1, 2]
  left = 0, right = 3
  s[0] = 'c', s[3] = 'd'  -> mismatch, stop
```

No odd center can beat length 2, so the answer is `s.substring(1, 3) = "bb"`.

### Example 3: `s = "a"`

Only `workout(0, 0)` finds a match, recording length 1. `workout(0, 1)` immediately fails the `right < n` check. The method returns `"a"`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Expand around center (implemented)** | `O(n^2)` | `O(1)` | Simple to derive and constant-space. It inspects only matching pairs and stops immediately on a mismatch. For `n <= 1000`, the quadratic bound is comfortably small. |
| **Brute force** | `O(n^3)` | `O(1)` | Easiest to state, but each substring is rechecked from scratch. At `n = 1000` the worst case is roughly `10^9` comparisons. |
| **Interval DP** | `O(n^2)` | `O(n^2)` | Same asymptotic time as center expansion and makes the recurrence explicit, but it allocates a million-entry table at the maximum input size and fills intervals even when they cannot be palindromes. |
| **Manacher** | `O(n)` | `O(n)` | Asymptotically optimal and linear, but the separator/mirror bookkeeping is complex. The extra complexity is unnecessary for `n <= 1000`, and a subtle off-by-one is more likely than a performance problem. |

**Why center expansion is preferred for this submission**: it is the shortest implementation that avoids both the cubic brute force and the quadratic table. It uses `O(1)` extra memory, handles odd and even palindromes with the same helper, and its `O(n^2)` runtime is far below the limits for `n = 1000`.

**When an alternative wins**: use **Manacher's algorithm** if the constraint grows to `n = 10^6`, where quadratic time is too slow. Use the **interval DP** if the problem asks follow-up questions such as "how many palindromic substrings are there?" because the boolean table answers every interval query at once. Use **brute force** only as a correctness baseline or in an interview where the input is tiny and clarity is more important than the quadratic factor.

## Key Insights

1. **A palindrome is defined by its center**, not by its endpoints. Expanding from the center avoids checking every substring independently.
2. **There are two center types**. Odd centers are characters; even centers are gaps. Both must be tried.
3. **The expansion stops at the first mismatch**. Once `s[left] !== s[right]`, extending farther can never restore the palindrome.
4. **Ties do not matter**. The problem accepts any longest palindrome, so using strict `>` when updating the best is sufficient.
5. **Reset per-instance state if reusing the object**. The implementation stores `longestLength` and `coordinates` on the class. A new instance starts with the correct defaults, but a reused instance must reset those fields before processing a new string:

```typescript
longestPalindrome(s) {
    this.originalString = s;
    this.longestLength = 0;
    this.coordinates = [0, 0];
    // ...the same center loop...
}
```
