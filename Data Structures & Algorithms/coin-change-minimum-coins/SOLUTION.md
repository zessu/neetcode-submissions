# Coin Change (Minimum Coins) - Solution

## Solution Code

### Submission 0 — Top-Down Memoization (JavaScript)

```javascript
class Solution {
    minCoins(coins, sum) {
        // code here
        const cache = new Map();

        const breakDown = (num) => {
            if(num === 0) return 0;
            if(num < 0) return Infinity;
            if(cache.has(num)) return cache.get(num);

            let smallest = Infinity;
            for(const coin of coins) {
                const ret = breakDown(num-coin);
                if(ret != Infinity) {
                    smallest = Math.min(smallest, ret + 1);
                }
            }
            cache.set(num, smallest);
            return smallest;
        }


        const ans = breakDown(sum);
        return ans === Infinity ? -1 : ans;

    }
}
```

### Submission 1 — Bottom-Up DP (JavaScript, stack-safe)

```javascript
class Solution {
    minCoins(coins, sum) {
        // dp[amount] = fewest coins needed to make exactly `amount`
        const dp = new Array(sum + 1).fill(Infinity);
        dp[0] = 0;

        for (let amount = 1; amount <= sum; amount++) {
            for (const coin of coins) {
                if (coin <= amount && dp[amount - coin] + 1 < dp[amount]) {
                    dp[amount] = dp[amount - coin] + 1;
                }
            }
        }

        return dp[sum] === Infinity ? -1 : dp[sum];
    }
}
```

## Approach

This is the **unbounded coin change** problem: coins may be reused, and we want the fewest coins for an exact sum.

Both submissions use the same recurrence:

```
minCoins(0)  = 0
minCoins(x)  = 1 + min(minCoins(x - coin))   for every coin <= x
minCoins(x)  = Infinity                      if no coin fits
```

The only difference is the *direction* in which the state space is explored.

### Submission 0: top-down memoization

1. `breakDown(num)` solves the subproblem for the remaining amount.
2. Base cases: `0` coins for amount `0`, `Infinity` for a negative amount (that branch overshot the target).
3. Before recursing, check `cache`. After computing, store the result keyed by the remaining amount. Because coins are unlimited, the amount alone is a sufficient key — no index is needed.
4. For each coin, recursively solve `num - coin`; keep the smallest finite result and add one for the coin just used.
5. `Infinity` propagates naturally (`Infinity + 1 === Infinity`), so impossible branches never win the `Math.min`.
6. Convert the final `Infinity` to `-1`.

The cache is what turns the `O(n^sum)` brute-force tree into `O(sum * n)`: every amount is expanded exactly once.

### Submission 1: bottom-up tabulation

1. Allocate `dp` with `sum + 1` slots, all `Infinity`, and set `dp[0] = 0`.
2. Sweep `amount` from `1` to `sum`. At that point every `dp[amount - coin]` is already final.
3. Relax `dp[amount]` with `dp[amount - coin] + 1` for each coin that fits.
4. Return `dp[sum]`, or `-1` if it is still unreachable.

Since the loop visits amounts in increasing order and reads smaller indices, each coin can be reused any number of times — exactly the unbounded behavior required.

## Complexity Analysis

| Submission | Time | Space | Recursion depth |
| :--- | :--- | :--- | :--- |
| `submission-0.js` (memoized DFS) | `O(sum * n)` | `O(sum)` cache + `O(sum)` call stack | `O(sum)` |
| `submission-1.js` (bottom-up DP) | `O(sum * n)` | `O(sum)` table | none |

Here `n = coins.length` and `sum <= 10^4`, so the worst case is about `10^7` operations — comfortably fast. The memoized version additionally allocates a `Map` entry per reachable amount and uses one stack frame per unit of recursion depth.

## Walkthrough

### Example: `coins = [9, 6, 5, 1]`, `sum = 19`

**Top-down.** Start at `breakDown(19)`:

```
breakDown(19)
├── 19 - 9 = 10 → breakDown(10)
│                 ├── 10 - 9 = 1 → breakDown(1) = 1   → 2
│                 └── 10 - 5 = 5 → breakDown(5) = 1   → 2   ✅ best for 10
│                 ⇒ breakDown(10) = 2   (9+1 or 5+5)
├── 19 - 6 = 13 → breakDown(13) = 3   (6+6+1)         → 4
├── 19 - 5 = 14 → breakDown(14) = 2   (9+5)           → 3
└── 19 - 1 = 18 → breakDown(18) = 2   (9+9)           → 3
⇒ breakDown(19) = 3   ← 9 + 9 + 1
```

The second time an amount such as `10` or `14` is requested, the `Map` returns the cached value instead of rebuilding the whole subtree.

**Bottom-up.** Fill the table from left to right:

| amount | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `dp` | 0 | 1 | 2 | 3 | 4 | 1 | 1 | 2 | 3 | 1 | 2 | 2 | 2 | 3 | 2 | 2 | 3 | 3 | 2 | **3** |

Selected relaxations:

- `dp[10] = min(dp[1] + 1, dp[5] + 1) = 2` (either `9+1` or `5+5`)
- `dp[11] = min(dp[2] + 1, dp[6] + 1, dp[10] + 1) = 2` from `6+5`
- `dp[18] = dp[9] + 1 = 2` (`9+9`)
- `dp[19] = min(dp[10] + 1, dp[13] + 1, dp[14] + 1, dp[18] + 1) = 3` (`9+9+1`)

Because `dp[19]` is finite, return `3`.

### Example: `coins = [4, 6, 2]`, `sum = 5`

No coin is `<= 1`, so `dp[1]` stays `Infinity` and every odd amount remains unreachable. `dp[5] === Infinity` → return `-1`. Even amounts are reachable (`dp[4] = 1`, `dp[6] = 1`, `dp[5]` is not), which is why the check must happen per amount rather than per coin.

### Example: `coins = [5, 1]`, `sum = 0`

`dp[0] = 0` and the loop never runs, so the answer is `0`.

## Comparison with the Alternatives

- **Brute-force recursion.** Same recurrence without a cache. For `sum = 19` and four coins it builds a huge tree of duplicate states; at `sum = 10^4` it is hopeless. Memoization is strictly better for the same `O(sum)` stack cost, and bottom-up removes even that cost.
- **Memoized DFS vs. bottom-up DP.** Both are `O(sum * n)` time and `O(sum)` memory. Memoization only visits amounts reachable from `sum`, which can be fewer than `sum` for sparse coin systems. However, its recursion depth is `O(sum)`, and `sum = 10^4` with a `1` coin exceeds the JavaScript call stack — Node throws `RangeError: Maximum call stack size exceeded` (verified: `[1]`, `sum = 5000` and `10000` both fail). **Bottom-up DP is therefore the safer final answer** and is included as `submission-1.js`; it passes `[1], 10000` in milliseconds.
- **BFS over amounts.** Also `O(sum * n)` and iterative. It finds the shortest path from `sum` to `0`, but needs a queue plus a visited set and explores amounts level by level. DP fills the same states with simpler code and better constants.
- **Greedy.** Tempting because "use the biggest coin" works for US currency, but coin systems are not guaranteed to be canonical. Counterexample: `[9, 6, 5, 1]`, sum `11` — greedy gives `9 + 1 + 1 = 3`, while `6 + 5 = 2` is optimal. Greedy is faster only because it solves the wrong problem.

## Key Insights

1. **State = remaining amount.** With unlimited coins there is no "index" dimension, so `O(sum)` states suffice.
2. **`Infinity` is a safe sentinel.** It propagates through `+ 1` and loses every `Math.min`, then becomes `-1` only at the boundary.
3. **Forward iteration = reuse.** In the bottom-up loop, `dp[amount - coin]` may itself have used `coin`, which is exactly the unbounded rule.
4. **Order of the loops is interchangeable here.** For each amount over all coins, or for each coin over all amounts (a 1-D "coin-major" sweep), both produce the correct unbounded result; the 2-D 0/1-knapsack variant would require iterating amounts backwards.
5. **Mind the stack.** A correct recurrence can still fail the constraints if the depth is `O(sum)` and `sum = 10^4`.
