# Coin Change - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {number[]} coins
     * @param {number} amount
     * @return {number}
     */
    coinChange(coins: number[], amount: number): number {
        const cache = new Map<number, number>();

        const splitChange = (amt: number): number => {
            if (amt < 0) return Infinity;
            if (amt === 0) return 0;
            if (cache.has(amt)) return cache.get(amt)!;

            let res = Infinity;
            for (const num of coins) {
                const sub = splitChange(amt - num);
                if (sub !== Infinity) res = Math.min(res, 1 + sub);
            }

            cache.set(amt, res);
            return res;
        };

        const ans = splitChange(amount);
        return ans === Infinity ? -1 : ans;
    }
}
```

> `submission-1.ts`, `submission-2.ts`, and `submission-4.ts` are **byte-for-byte identical** (same checksum, same `coinChange(coins, amount)` signature). The latest is `submission-4.ts`; the code above is that implementation.

## Approach

The solution is a **top-down dynamic program with memoization**, expressed as a recursive DFS over the remaining amount.

1. **State**: `splitChange(amt)` answers "what is the fewest number of coins needed to make exactly `amt`?" The initial call is `splitChange(amount)`.
2. **Base cases**:
   - `amt < 0`: this branch overshot, so it is impossible — return `Infinity`.
   - `amt === 0`: zero coins are needed — return `0`.
3. **Memo check**: if `amt` was solved before, return the cached answer. The cache is a `Map<number, number>` keyed by the remaining amount.
4. **Transition**: try every coin denomination. For each coin, solve `amt - num` recursively and, if that subproblem is reachable, consider `1 + sub`. Keep the minimum over all coins. Using one coin plus the optimal solution for the smaller amount is optimal by the standard "optimal substructure" argument: any optimal solution for `amt` must end with some coin `num`, and removing it leaves an optimal solution for `amt - num`.
5. **Cache the result** — including `Infinity` for unreachable amounts. Caching failures is what keeps impossible amounts from being recomputed exponentially often.
6. **Return**: convert `Infinity` to `-1`, as the problem requires.

- **Time Complexity**: `O(A · C)` where `A = amount` and `C = coins.length`. There are at most `A + 1` distinct states (`0 .. amount`), and each state loops over all `C` coins once. Negative amounts are rejected in `O(1)` and never cached.
- **Space Complexity**: `O(A)` for the memo cache, plus `O(A / m)` recursion depth where `m = min(coins)` (the deepest chain subtracts the smallest coin each time). The cache is `O(A)` because only amounts `0..A` are stored.

## Walkthrough

Using Example 1: `coins = [1, 2, 5]`, `amount = 11`.

The recursion solves smaller amounts on demand. Values computed (and cached) along the way:

| `amt` | Candidates `1 + splitChange(amt - coin)` | Best |
| :--- | :--- | :--- |
| `0` | base case | `0` |
| `1` | `1 + dp[0] = 1` | `1` |
| `2` | `1 + dp[1] = 2`, `1 + dp[0] = 1` | `1` |
| `3` | `1 + dp[2] = 2`, `1 + dp[1] = 2` | `2` |
| `4` | `1 + dp[3] = 3`, `1 + dp[2] = 2` | `2` |
| `5` | `1 + dp[4] = 3`, `1 + dp[3] = 3`, `1 + dp[0] = 1` | `1` |
| `6` | `1 + dp[5] = 2`, `1 + dp[4] = 3`, `1 + dp[1] = 2` | `2` |
| `7` | `1 + dp[6] = 3`, `1 + dp[5] = 2`, `1 + dp[2] = 2` | `2` |
| `8` | `1 + dp[7] = 3`, `1 + dp[6] = 3`, `1 + dp[3] = 3` | `3` |
| `9` | `1 + dp[8] = 4`, `1 + dp[7] = 3`, `1 + dp[4] = 3` | `3` |
| `10` | `1 + dp[9] = 4`, `1 + dp[8] = 4`, `1 + dp[5] = 2` | `2` |
| `11` | `1 + dp[10] = 3`, `1 + dp[9] = 4`, `1 + dp[6] = 3` | `3` |

The top-level decision at `11`:

```
splitChange(11):
  coin 1 -> splitChange(10) -> 2  => candidate 3
  coin 2 -> splitChange(9)  -> 3  => candidate 4
  coin 5 -> splitChange(6)  -> 2  => candidate 3   (minimum)

return 3
```

Tracing the winning branch reconstructs `11 → 6 → 1 → 0`, i.e. coins `5 + 5 + 1`. Note that the first coin tried is `1`, but the minimum is found through coin `5`; DFS order does not affect correctness because every coin is considered at every state.

Example 2 (`coins = [2]`, `amount = 3`) shows the unreachable case:

```
splitChange(3):
  coin 2 -> splitChange(1)
              coin 2 -> splitChange(-1) = Infinity
              res = Infinity, cached at amt = 1
            candidate = 1 + Infinity = Infinity
  res = Infinity, cached at amt = 3
return Infinity -> -1
```

Example 3 (`amount = 0`) hits the base case immediately and returns `0`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Memoized DFS (implemented)** | `O(A · C)` | `O(A)` + `O(A/m)` stack | The recurrence is written exactly as stated ("try each coin, add one"), so it is easy to derive and reads naturally. Only states actually reachable from `amount` are computed, which can be fewer than all `A + 1`. The cost is recursion depth: with a coin of 1 and `amount = 10^4`, it can exceed Node's default call stack. |
| **Brute-force recursion** | exponential | `O(A/m)` | Same code without the cache. Correct but re-solves overlapping states; unusable for `amount = 10^4`. |
| **Bottom-up DP** | `O(A · C)` | `O(A)` | Iterative, no stack risk, and every amount `0..A` is filled in a predictable order. Slightly more code up front, but the safest choice for worst-case inputs. It also makes rolling-array/space optimizations natural. |
| **BFS over amounts** | `O(A · C)` | `O(A)` | Directly models "minimum number of coins = shortest path", and can stop as soon as the target is generated. Less intuitive to reconstruct the coin combination, and it still visits each amount once. |

**Why the memoized DFS is preferred for this submission**: it is the shortest correct implementation that still meets the `O(A · C)` bound, and it follows the recursive definition without an explicit table. It also skips amounts that are unreachable from the target (bottom-up computes all of `0..A` regardless). For `amount <= 10^4` and `coins.length <= 12`, the state space is small enough that the difference in constants is negligible.

**When an alternative wins**: for the maximum `amount` with a `1`-valued coin, the **bottom-up DP** is safer — depth `10^4` is enough to overflow a typical JS stack. Its iterative form is what you would ship in production:

```typescript
coinChange(coins: number[], amount: number): number {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let a = 1; a <= amount; a++) {
        for (const coin of coins) {
            if (coin <= a && dp[a - coin] + 1 < dp[a]) {
                dp[a] = dp[a - coin] + 1;
            }
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
}
```

If the target is small but the coin count is large, BFS can finish earlier than either DP. If only the *number* of coins mattered and denominations were canonical (e.g. US currency), greedy would be `O(C log C)` — but greedy is wrong in general, so it cannot replace DP here.
