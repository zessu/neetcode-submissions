# Climbing Stairs - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {number} n
     * @return {number}
     */
    climbStairs(n: number): number {
        const cache = new Map<number, number>();

        const recurr = (val: number) => {
            if (val === 0) return 1;
            if (val < 0) return 0;
            if(cache.has(val)) return cache.get(val);

            const left = recurr(val -1);
            const right = recurr(val -2);

            cache.set(val, left + right);
            return left + right;
        }

        return recurr(n);
    }
}
```

> `submission-1.ts` is the full submission and the code above matches it. In strict TypeScript, `cache.get(val)` is typed `number | undefined`; the `cache.has(val)` guard makes it safe at runtime, but a strict compiler would ask for `cache.get(val)!` or a local-variable narrowing check.

## Approach

The solution is a **top-down dynamic program with memoization**, expressed as a recursive DFS over the number of remaining steps.

1. **State**: `recurr(val)` answers "how many distinct ways are there to climb `val` steps?" The initial call is `recurr(n)`.
2. **Base cases**:
   - `val === 0`: there is exactly one way to climb zero steps — do nothing. Return `1`.
   - `val < 0`: the last move overshot the staircase. This is not a valid way. Return `0`.
3. **Memo check**: if `val` has already been solved, return the cached count in `O(1)`.
4. **Transition**: the last move into step `val` was either a 1-step from `val - 1` or a 2-step from `val - 2`. These two cases are disjoint (they end with different moves), so the total is their sum:
   `recurr(val) = recurr(val - 1) + recurr(val - 2)`.
5. **Cache and return** `left + right`.

This is optimal substructure in its simplest form: every way to reach `val` decomposes uniquely into a way to reach `val - 1` followed by a 1-step, or a way to reach `val - 2` followed by a 2-step.

- **Time Complexity**: `O(n)` — `recurr` is called with each value from `0` to `n`, and once a value is cached every later visit is constant time. Without the cache the same recurrence is `O(2^n)`.
- **Space Complexity**: `O(n)` for the memo cache, plus `O(n)` for the recursion stack in the worst case. The cache and the stack are both linear, so the total is `O(n)`.

## Walkthrough

### Example: `n = 5`

The recursion visits states depth-first. The table lists each state the first time it is solved:

| `val` | `recurr(val - 1)` | `recurr(val - 2)` | `recurr(val)` | Cached |
| :--- | :--- | :--- | :--- | :--- |
| `0` | — | — | base case `1` | `1` |
| `-1` | — | — | base case `0` | not cached |
| `1` | `1` | `0` | `1 + 0 = 1` | `1` |
| `2` | `1` | `1` | `1 + 1 = 2` | `2` |
| `3` | `2` | `1` | `2 + 1 = 3` | `3` |
| `4` | `3` | `2` | `3 + 2 = 5` | `5` |
| `5` | `5` | `3` | `5 + 3 = 8` | `8` |

The call order is:

```
recurr(5)
└── recurr(4)
    └── recurr(3)
        └── recurr(2)
            └── recurr(1)
                ├── recurr(0) = 1
                └── recurr(-1) = 0
                => 1
            ├── recurr(0) = 1 (cached)
            => 2
        ├── recurr(1) = 1 (cached)
        => 3
    ├── recurr(2) = 2 (cached)
    => 5
└── recurr(3) = 3 (cached)
=> 8
```

Only seven states are ever evaluated: `-1, 0, 1, 2, 3, 4, 5`. In the brute-force version, `recurr(2)` alone would be recomputed on many separate branches, and the total number of calls would grow exponentially.

The answer `8` corresponds to the eight sequences:

```
1+1+1+1+1   1+1+1+2   1+1+2+1   1+2+1+1
2+1+1+1     1+2+2     2+1+2     2+2+1
```

### Example: `n = 2`

`recurr(2) = recurr(1) + recurr(0) = 1 + 1 = 2`, matching the two ways `1 + 1` and `2`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Memoized DFS (implemented)** | `O(n)` | `O(n)` cache + `O(n)` stack | Keeps the natural "what was the last move?" recurrence, and each state is solved exactly once. The cache makes it fast, but it still uses recursion and therefore a call stack. |
| **Brute-force recursion** | `O(2^n)` | `O(n)` stack | Correct and simple, but re-solves the same states exponentially many times. For `n = 45` it is completely impractical. |
| **Bottom-up DP with a table** | `O(n)` | `O(n)` | Iterative and easy to trace. It computes all `n + 1` entries even though each depends on only the previous two, which is a small waste. |
| **Bottom-up DP with two variables** | `O(n)` | `O(1)` | Strictly better space than the implemented version, no recursion, and equally simple once the recurrence is known. This is the best general choice. |
| **Matrix exponentiation** | `O(log n)` | `O(1)` | Asymptotically fastest for enormous `n`, but the constant factors and implementation complexity are unjustified for `n <= 45`. |
| **Binet's formula** | `O(1)` | `O(1)` | A closed form, but floating-point error requires rounding and it does not demonstrate the DP pattern the problem is teaching. |

**Why the memoized DFS is a reasonable submission**: it is a direct, readable encoding of the recurrence `f(n) = f(n - 1) + f(n - 2)`, it handles the base cases explicitly, and the cache reduces `O(2^n)` to `O(n)`. It is easy to explain in an interview because the state and transition are both one-liners.

**When an alternative wins**:
- Use the **two-variable bottom-up DP** when you care about stack safety or want the smallest possible footprint. For `n <= 45` either version is instant, but the iterative one generalizes to larger inputs.
- Use **matrix exponentiation** only if `n` can be very large (for example, `n` up to `10^18` in a variant problem).
- Use **Binet's formula** only in a math context where a floating-point result is acceptable.
- Avoid the **brute-force recursion** except as a teaching stepping stone; its exponential recomputation is the exact problem memoization solves.

## Key Insights

1. **The recurrence is Fibonacci shifted by one.** `climbStairs(n) = F(n + 1)` with `F(0) = 0, F(1) = 1`. This is a useful sanity check: `n = 5` gives `F(6) = 8`.
2. **The two cases are disjoint, so they add.** Ways ending in a 1-step and ways ending in a 2-step cannot overlap, which is why the sum counts each distinct sequence exactly once.
3. **`recurr(0) = 1` is essential.** It encodes "one way to do nothing" and makes `n = 1` and `n = 2` fall out of the recurrence without special cases.
4. **`recurr(negative) = 0` prunes overshoots.** Without it, `n = 1` would incorrectly count an invalid 2-step.
5. **Memoization changes the complexity class.** The same code is `O(2^n)` without the `cache` and `O(n)` with it, which is the clearest possible demonstration of overlapping subproblems.
6. **Space can be reduced to `O(1)`.** Since each state depends on only the previous two, the entire cache is unnecessary for the iterative version.
