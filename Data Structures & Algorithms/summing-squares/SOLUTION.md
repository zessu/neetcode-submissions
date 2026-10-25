# Summing Squares - Solution

## Solution Code

```typescript
const summingSquares = (n: number) => {
  const range = Math.floor(Math.sqrt(n));
  const cache = new Map<number, number>();

  const recurr = (remain: number): number => {
    if (remain < 0) return Infinity;
    if (remain === 0) return 0;
    if (cache.has(remain)) return cache.get(remain)!;

    let result = Infinity;
    for (let i = 1; i <= range; i++) {
      const res = recurr(remain - i * i);
      if (res !== Infinity) {
        result = Math.min(result, res + 1);
      }
    }

    cache.set(remain, result);
    return result;
  };

  return recurr(n);
};

const ans = summingSquares(1000);
console.log(`shortest factor length is ${ans}`);
```

> `submission-0.ts` is the full submission, including the `summingSquares(1000)` demo. The code above is the same logic with a typed `Map<number, number>`, a non-null assertion on the cache read, and the inner parameter renamed from the shadowed `n` to `remain` for readability; the demo is preserved.

## Approach

The solution is a **top-down dynamic program with memoization**, expressed as a recursive DFS over the remaining target.

1. **State**: `recurr(remain)` answers "what is the fewest perfect squares that sum to `remain`?" The initial call is `recurr(n)`.
2. **Base cases**:
   - `remain < 0`: the current square overshot the target, so this branch is invalid — return `Infinity`.
   - `remain === 0`: the target was reached exactly — return `0`.
3. **Memo check**: if `remain` has been solved, return the cached value. `cache.has()` is used instead of a truthiness check so that a cached `0` is handled correctly.
4. **Transition**: try every perfect square `i * i` for `i` from `1` to `floor(sqrt(n))`. For each one, solve `remain - i * i` recursively. If that subproblem is reachable (`!== Infinity`), using one more square gives `1 + sub`; keep the minimum over all choices.
   - This is optimal by the standard optimal-substructure argument: any optimal representation of `remain` ends with some square `i * i`, and removing it leaves an optimal representation of `remain - i * i`.
5. **Cache the result** — including `Infinity` for remainders that cannot be reached from the fixed set of squares. Caching failures prevents the same dead ends from being recomputed.
6. **Return** `recurr(n)`. The answer is always finite because `1 = 1^2` can be used repeatedly.

The loop uses a fixed `range = floor(sqrt(n))` computed from the original input. This is safe for smaller recursive remainders: if `i * i > remain`, then `remain - i * i` is negative, and the next call immediately returns `Infinity`. Such candidates are discarded by the `res !== Infinity` guard.

- **Time Complexity**: `O(n * sqrt(n))` — there are at most `n + 1` distinct remainders (`0` through `n`), and each state tries at most `sqrt(n)` squares once.
- **Space Complexity**: `O(n)` for the memo cache, plus `O(n)` recursion depth in the worst case (when the recursion repeatedly subtracts `1`). The cache dominates at `O(n)`.

## Walkthrough

### Example: `n = 12`

Squares at most `12` are `1, 4, 9`, so `range = 3`.

The first call tries squares from smallest to largest. The important states are:

| `remain` | Candidates `1 + recurr(remain - i*i)` | Best | Cached |
| :--- | :--- | :--- | :--- |
| `0` | base case | `0` | `0` |
| `1` | `1 + recurr(0) = 1` | `1` | `1` |
| `2` | `1 + recurr(1) = 2` | `2` | `2` |
| `3` | `1 + recurr(2) = 3` | `3` | `3` |
| `4` | `1 + recurr(3) = 4`, `1 + recurr(0) = 1` | `1` | `1` |
| `8` | `1 + recurr(7) = 5`, `1 + recurr(4) = 2` | `2` | `2` |
| `12` | `1 + recurr(11)`, `1 + recurr(8) = 3`, `1 + recurr(3) = 4` | `3` | `3` |

The winning branch is `12 → 8 → 4 → 0`, which corresponds to `4 + 4 + 4`. The branch `12 → 3 → 2 → 1 → 0` is valid but costs `4` squares, so it loses the minimum.

Note that `recurr(8)` is solved once and cached. It is reached both from `12 - 4` and from other branches, and every later visit is an `O(1)` map lookup.

### Example: `n = 1000`

`range = floor(sqrt(1000)) = 31`. The optimal path is:

```
1000 - 30^2 = 100
100  - 10^2 = 0
```

That is `900 + 100`, so `recurr(1000)` returns `2`. The demo at the bottom of the submission prints:

```
shortest factor length is 2
```

Reaching that conclusion does not require exploring every representation of `1000`: the memoized DFS computes each remainder at most once, and the loop considers at most 31 squares per remainder.

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Memoized DFS (implemented)** | `O(n * sqrt(n))` | `O(n)` cache + `O(n)` stack | The recurrence matches the problem statement directly: "subtract a square, then solve the rest." Only remainders actually reachable from `n` are computed. It is concise and easy to verify, but recursion depth can reach `n` when `1` is the only useful square. |
| **Brute-force recursion** | exponential | `O(n)` stack | Correct but re-solves overlapping remainders. For `n = 1000` it is unusable without the cache. |
| **Bottom-up DP** | `O(n * sqrt(n))` | `O(n)` | Iterative, no stack-overflow risk, and it computes every target in a predictable order. It does slightly more work when many targets are unreachable from a particular branch, but that is irrelevant here because every target is reachable using `1`s. This is the safest production choice. |
| **BFS over remainders** | `O(n * sqrt(n))` | `O(n)` | Models the problem as a shortest path and stops as soon as `0` is generated, which can be faster in practice for small answers. It needs a queue and visited set, and reconstructing the actual squares takes extra bookkeeping. |
| **Four-square theorem** | `O(sqrt(n))` | `O(1)` | Dramatically faster, but it is a mathematical shortcut rather than a general DP technique. It is useful to know that the answer is always `1`, `2`, `3`, or `4`, but it does not generalize to arbitrary coin/square sets. |

**Why the memoized DFS is preferred for this submission**: it follows the recursive definition directly, handles unreachable branches with `Infinity`, and caches every state exactly once. For `n <= 10^4` it is comfortably fast, and the implementation is short enough to reason about without an auxiliary table.

**When an alternative wins**: use the **bottom-up DP** when `n` is large enough that a recursion depth of `n` is a concern, or when the runtime environment has a small call stack. Use **BFS** when the answer is known to be small and you want early termination. Use the **four-square theorem** only when the problem is specifically about perfect squares; it does not apply to arbitrary denominations such as the coin-change problem.

## Key Insights

1. **The state is the remaining target**, not the current square. That keeps the cache key to a single number.
2. **`Infinity` is a useful sentinel** for invalid branches, but it must not leak into the final answer. Here the top-level answer is always finite because `1` is a valid square.
3. **Caching failures matters.** Without caching `Infinity`, a dead-end remainder can be revisited exponentially many times.
4. **Greedy is not correct.** For `12`, taking the largest square first gives `9 + 1 + 1 + 1` (4 squares), while the optimal answer is `4 + 4 + 4` (3 squares).
5. **The answer is bounded by four.** Lagrange's theorem guarantees that no input needs more than four squares, which is a useful sanity check for any implementation.
