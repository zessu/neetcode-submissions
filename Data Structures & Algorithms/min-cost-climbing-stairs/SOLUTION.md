# Min Cost Climbing Stairs - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {number[]} cost
     * @return {number}
     */
    minCostClimbingStairs(cost: number[]): number {
        const cache = new Map<number, number>();

        const recurr = (idx: number)=> {
            if(idx >= cost.length) return 0;
            if(cache.has(idx)) return cache.get(idx);

            const left = cost[idx] + recurr(idx + 1);
            const right = cost[idx] + recurr(idx + 2);

            cache.set(idx, Math.min(left, right));
            return Math.min(left, right);
        }

        return Math.min(recurr(0), recurr(1));
    }
}
```

> `submission-1.ts` is the full submission and the code above matches it. In strict TypeScript, `cache.get(idx)` is typed `number | undefined`; the `cache.has(idx)` guard makes it safe at runtime, but a strict compiler would require `cache.get(idx)!` or a narrowing check.

## Approach

The solution is a **top-down dynamic program with memoization**, expressed as a recursive DFS over the current stair index.

1. **State**: `recurr(idx)` answers "what is the minimum additional cost to reach the top, given that I am standing on stair `idx` and have not yet paid for it?"
2. **Base case**: if `idx >= cost.length`, the top has been reached (or passed). There are no more stairs to pay for, so return `0`. This is also why the last stair does not have to be paid: jumping from `n - 2` to `n` skips it.
3. **Memo check**: if `idx` has been solved, return the cached cost. The same index is reached by many different paths — for example, index `3` can be reached from `0`, `1`, or `2` — but the remaining problem is identical, so caching is valid.
4. **Transition**: standing on `idx` forces you to pay `cost[idx]`. After paying, you may move to `idx + 1` or `idx + 2`. Therefore:
   `recurr(idx) = cost[idx] + min(recurr(idx + 1), recurr(idx + 2))`.
5. **Two starting points**: the problem allows starting at index `0` or index `1`, so the answer is `min(recurr(0), recurr(1))`.

The optimal-substructure argument: any optimal route from `idx` pays `cost[idx]` and then takes one of the two legal jumps. Whichever jump it takes, the rest of the route must itself be optimal from that next stair — otherwise replacing it with a cheaper route would improve the whole solution.

- **Time Complexity**: `O(n)` — there are at most `n` distinct indices, and each is evaluated once with constant work.
- **Space Complexity**: `O(n)` for the memo cache, plus `O(n)` for the recursion stack. The cache and stack are each linear in `n`.

## Walkthrough

### Example: `cost = [10, 15, 20]`

The top is index `3`. The recursion solves the states from the top down:

| `idx` | `cost[idx]` | `recurr(idx + 1)` | `recurr(idx + 2)` | `recurr(idx)` |
| :--- | :--- | :--- | :--- | :--- |
| `4` | — | — | — | `0` (past the top) |
| `3` | — | — | — | `0` (past the top) |
| `2` | `20` | `0` | `0` | `20` |
| `1` | `15` | `20` | `0` | `15` |
| `0` | `10` | `15` | `20` | `25` |

`Math.min(recurr(0), recurr(1)) = Math.min(25, 15) = 15`.

Tracing the winning route: start at index `1`, pay `15`, jump two steps to index `3`, which is the top. Index `2` is skipped and `cost[2] = 20` is never paid. The competing route that starts at index `0` pays `10` and then `15`, for `25`.

### Example: `cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]`

The DP values for the two-variable version are:

```
index:   0   1   2   3   4   5   6   7   8   9   top(10)
cost:    1 100   1   1   1 100   1   1 100   1
dp:      0   0   1   2   2   3   3   4   4   5   6
```

The answer is `6`, paid at indices `0, 2, 4, 6, 7, 9`. Both `100` stairs at indices `1` and `5` are avoided, and the `100` at index `8` is jumped over from index `7`.

The memoized DFS produces the same values, but in the order the recursion happens to visit them. Because every state is cached, no index is expanded twice even though many paths converge on it.

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Memoized DFS (implemented)** | `O(n)` | `O(n)` cache + `O(n)` stack | The recurrence maps directly to the rules: "pay this stair, then choose one of two jumps." Caching is easy because the state is a single index. The cost is recursion depth and a hash map. |
| **Brute-force recursion** | `O(2^n)` | `O(n)` stack | Correct but every index is recomputed along every path. On the 10-element example it still finishes, but the growth is exponential and it would time out quickly for larger `n`. |
| **Bottom-up DP with a table** | `O(n)` | `O(n)` | Iterative and easy to print for debugging. It stores every index even though only the previous two matter. |
| **Bottom-up DP with two variables** | `O(n)` | `O(1)` | Same recurrence without the cache or the stack. This is the strongest choice for production and the one most interviewers expect as a follow-up. |
| **Dijkstra / shortest path** | `O(n log n)` | `O(n)` | The graph is a forward-only DAG, so the general shortest-path machinery adds a heap without adding insight. It is a useful conceptual reframing only. |

**Why the memoized DFS is preferred for this submission**: the problem is naturally described recursively ("from this stair, pay and then pick jump 1 or jump 2"), and the single-index state makes the cache trivially correct. The two starting calls `recurr(0)` and `recurr(1)` capture the only special rule in the problem.

**When an alternative wins**:
- Use the **two-variable bottom-up DP** when stack depth matters or when you want the smallest memory footprint. It is `O(1)` space and cannot overflow.
- Use the **full table** when you need to debug or reconstruct the optimal path; the table makes the paid indices easy to recover.
- Avoid **Dijkstra** here: it is correct but strictly more complex than necessary for a DAG with unit out-degree.

## Key Insights

1. **The cost is paid on entry, not on exit.** The recurrence adds `cost[idx]` before branching. The top itself is free, which is why `idx >= cost.length` returns `0` rather than a cost.
2. **The state is just the index.** Unlike problems where the state includes a budget or a count, here the entire future depends only on where you stand. That is what makes both the cache and the two-variable DP possible.
3. **Two starting points are part of the problem.** Returning only `recurr(0)` is a common bug; Example 1 is specifically designed to catch it.
4. **Greedy fails.** Taking the cheaper immediate stair can lead into an expensive suffix. The `[10, 15, 20]` example is the smallest counterexample.
5. **The memoization is what makes it linear.** The same code without the cache is `O(2^n)`; the cache collapses the exponential number of paths into `n` distinct states.
6. **The top is one past the end.** Visualizing a virtual stair at index `n` with cost `0` makes the base case and the final `min` obvious.
