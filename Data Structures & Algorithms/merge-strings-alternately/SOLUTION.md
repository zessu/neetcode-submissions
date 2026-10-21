# Merge Strings Alternately - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {string} word1
     * @param {string} word2
     * @return {string}
     */
    mergeAlternately(word1: string, word2: string): string {
        let result = "";
        while(word1.length || word2.length) {
            if(!word1.length) {
                result += word2;
                break;
            }
            if(!word2.length) {
                result += word1;
                break;
            }
            result += word1.slice(0,1);
            result += word2.slice(0,1);

            word1 = word1.slice(1);
            word2 = word2.slice(1);
        }
        return result;
    }
}
```

## Approach

The implemented solution is a **literal simulation with shrinking strings**.

1. **Loop while either string has characters.** `while(word1.length || word2.length)` keeps the loop alive until both working copies are empty.
2. **Handle the exhausted side first.** If `word1` is empty, the entire remaining `word2` is appended in one operation and the loop breaks; symmetrically for `word2`. This is the "append the additional letters" rule from the statement, and `break` guarantees the remainder is appended exactly once.
3. **Emit one character from each.** `word1.slice(0, 1)` and `word2.slice(0, 1)` append the current front characters in the required order — `word1` first, then `word2`.
4. **Consume those characters.** `word1 = word1.slice(1)` rebinds the local parameter to the string without its first character; the same for `word2`. Because strings are immutable in JavaScript, the caller's values are never modified; only the local variables change.
5. **Return the accumulator.** At every iteration the invariant holds: `result` is the correct alternation of everything consumed so far, and the remaining work is exactly the alternation of the current `word1`/`word2` suffixes.

The loop condition is technically redundant with the two `break` branches (if either string is non-empty, one branch fires), but it keeps the structure symmetric and makes the termination condition obvious to a reader.

- **Time Complexity**: `O(L1 + L2)`, where `L1 = word1.length`, `L2 = word2.length` — each character is appended to the result exactly once. The `slice` operations are effectively constant-time on modern engines, which represent substrings as views/ropes; a naive engine that copies the remainder on every `slice(1)` would make this `O(L1^2 + L2^2)`.
- **Space Complexity**: `O(L1 + L2)` — the output plus the intermediate strings created by slicing.

## Walkthrough

### Example 1: `word1 = "abc"`, `word2 = "pqr"`

| Iteration | `word1` before | `word2` before | Appended | `result` after | `word1` after | `word2` after |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `"abc"` | `"pqr"` | `"a"`, `"p"` | `"ap"` | `"bc"` | `"qr"` |
| 2 | `"bc"` | `"qr"` | `"b"`, `"q"` | `"apbq"` | `"c"` | `"r"` |
| 3 | `"c"` | `"r"` | `"c"`, `"r"` | `"apbqcr"` | `""` | `""` |

The `while` condition is now false (both empty), so the loop exits and returns `"apbqcr"`.

### Example 2: `word1 = "ab"`, `word2 = "pqrs"`

| Iteration | `word1` before | `word2` before | Action | `result` after |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `"ab"` | `"pqrs"` | append `"a"`, `"p"`; shrink | `"ap"` |
| 2 | `"b"` | `"qrs"` | append `"b"`, `"q"`; shrink | `"apbq"` |
| 3 | `""` | `"rs"` | `word1` empty &rarr; append `"rs"`, `break` | `"apbqrs"` |

Return `"apbqrs"`. The `rs` tail is appended once, in order, and only after the alternation has stopped.

### Example 3: `word1 = "abcd"`, `word2 = "pq"`

| Iteration | `word1` before | `word2` before | Action | `result` after |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `"abcd"` | `"pq"` | append `"a"`, `"p"`; shrink | `"ap"` |
| 2 | `"bcd"` | `"q"` | append `"b"`, `"q"`; shrink | `"apbq"` |
| 3 | `"cd"` | `""` | `word2` empty &rarr; append `"cd"`, `break` | `"apbqcd"` |

Return `"apbqcd"` — the mirror image of example 2, confirming that the two `break` branches are symmetric.

## Comparison with the Alternatives

| Approach | Time | Space | Why it loses / wins |
| :--- | :--- | :--- | :--- |
| **Shrinking strings (implemented)** | `O(L1+L2)`* | `O(L1+L2)` | Wins on directness: the code reads like the English statement, and the "append the rest" rule is explicit in the two `break` branches. Loses on allocation churn — every iteration creates two new shorter strings, and the cost model depends on the engine. |
| Index two pointers | `O(L1+L2)` | `O(L1+L2)` | Guaranteed linear with no intermediate strings. Wins on predictability and on very long inputs; slightly more index bookkeeping (`i < L1`, `i < L2`). |
| Recursive merge | `O(L1+L2)`* | `O(L1+L2)` | Elegant but no faster, and it consumes call stack proportional to the input. Loses for a problem this simple; risky if lengths grow. |

\* under the assumption that slicing/concatenation is constant-time per operation. If each `slice(1)` copies the tail, the implemented and recursive versions become quadratic while the index version stays linear.

**Why the implemented approach is fine here.** The constraints cap each string at 100 characters, so at most 200 appends and 200 small slices occur — microseconds either way. The simulation is the easiest version to explain and audit: the alternation is one line, and the tail handling is impossible to miss because it is written as an explicit early `break`.

**When an alternative wins.**

- **Choose the index two-pointer version** when the strings can be large, when you want a hard `O(L1+L2)` guarantee independent of the JS engine's string representation, or when allocating many intermediates is undesirable (for example, in a tight loop over many pairs).
- **Choose recursion** only as an exercise. It maps nicely onto the problem's recursive definition (`first chars + merge(rest)`), but there is no performance or clarity benefit at this scale, and deep recursion can overflow the stack.
- **Avoid any version that concatenates `undefined`.** If you switch to index-based reads, guard `i < word1.length` and `i < word2.length`; otherwise the literal string `"undefined"` can leak into the output.

## Key Insights

1. **Alternation is just "one from each, in order".** The only special case is exhaustion, and it is best handled once, explicitly, rather than by padding strings or adding extra conditions inside the main append.
2. **The remainder is appended verbatim.** There is no interleaving left once either side is empty; copying the whole suffix preserves the required order.
3. **`break` versus `continue`.** After appending the remainder the loop must stop — with `continue` the condition would still be true (the other string is unchanged) and the same suffix would be appended forever.
4. **Strings are immutable.** Rebinding `word1`/`word2` is safe and does not affect the caller. It does, however, create garbage; the index version trades that for two integers.
5. **Bound the loop by `max(L1, L2)`, not `min`.** Any implementation that stops at the shorter length must remember a separate tail step; looping to the maximum with length guards folds both cases into one pass.
