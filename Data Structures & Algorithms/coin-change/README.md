# Coin Change - LeetCode 322

## Problem Description

You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.

Return the **fewest number of coins** needed to make up that amount. If that amount cannot be made up by any combination of the coins, return `-1`.

You may assume that you have an **infinite number** of each kind of coin.

The method signature used in this repository is `coinChange(coins, amount)`.

## Examples

### Example 1:

```
Input: coins = [1,2,5], amount = 11
Output: 3
```

**Explanation:** `11 = 5 + 5 + 1`, which uses 3 coins. No combination of one or two coins reaches 11 (`5+5=10`, `5+2=7`, `2+2=4`, ...), so 3 is minimal.

### Example 2:

```
Input: coins = [2], amount = 3
Output: -1
```

**Explanation:** Every reachable sum is even, so the odd amount 3 is impossible. The answer is `-1`, not 0 and not infinity.

### Example 3:

```
Input: coins = [1], amount = 0
Output: 0
```

**Explanation:** Zero coins are needed to make the amount 0. This is the base case of every approach below.

### Example 4:

```
Input: coins = [1,3,4], amount = 6
Output: 2
```

**Explanation:** The optimal answer is `3 + 3`. A greedy strategy that repeatedly takes the largest coin would choose `4 + 1 + 1` for 3 coins — a useful reminder that greedy is **not** correct for arbitrary denominations.

## Constraints

- `1 <= coins.length <= 12`
- `1 <= coins[i] <= 2^31 - 1`
- `0 <= amount <= 10^4`

## Topics

- Array
- Dynamic Programming
- Breadth-First Search
- Memoization

## Company Tags

- Amazon
- Google
- Microsoft
- Bloomberg
- Apple
- Uber

## Solution Approaches

### 1. Brute-Force Recursion

**Intuition**: Try every coin at every step. The remaining amount shrinks, and the answer for a state is `1 +` the best answer for the state after using one coin. Enumerate all combinations and take the minimum.

**Algorithm**:
1. `dfs(remaining)`:
   - If `remaining === 0`, return `0`.
   - If `remaining < 0`, return `Infinity` (invalid branch).
   - For each coin, compute `1 + dfs(remaining - coin)` and keep the minimum.
2. Return the minimum, or `-1` if it is still `Infinity`.

**Time Complexity**: Exponential — `O(C^(A/m))` as a loose upper bound, where `C = coins.length`, `A = amount`, and `m = min(coins)` is the maximum recursion depth.
**Space Complexity**: `O(A/m)` recursion stack.

The same subproblem (e.g. "make 6") is recomputed from many different branches, which is exactly what memoization removes.

### 2. Memoized DFS / Top-Down DP (Implemented)

**Intuition**: The brute-force recursion has overlapping subproblems: `dfs(6)` is reached from `dfs(7)` using coin 1, from `dfs(8)` using coin 2, and so on. Cache each `remaining` value the first time it is solved and reuse it.

**Algorithm**:
1. Create `cache = new Map<number, number>()`.
2. `splitChange(amt)`:
   - `amt < 0` &rarr; `Infinity` (do not cache negatives).
   - `amt === 0` &rarr; `0`.
   - If `cache` has `amt`, return the cached value.
   - Otherwise try every coin: `sub = splitChange(amt - coin)`; if `sub` is finite, `res = min(res, 1 + sub)`.
   - Store `res` (including `Infinity`) in the cache and return it.
3. Return `-1` when the final result is `Infinity`.

**Time Complexity**: `O(A · C)` — there are at most `A + 1` distinct amounts, and each state tries `C` coins once.
**Space Complexity**: `O(A)` for the cache plus `O(A/m)` for the recursion stack.

### 3. Bottom-Up DP / Tabulation

**Intuition**: Solve every amount from `0` upward. `dp[a]` is the minimum coins for amount `a`; it depends only on smaller amounts `a - coin`, which are already computed.

**Algorithm**:
1. `dp = Array(amount + 1).fill(Infinity)`; `dp[0] = 0`.
2. For `a` from `1` to `amount`:
   - For each `coin <= a`: `dp[a] = min(dp[a], dp[a - coin] + 1)`.
3. Return `dp[amount]` if finite, else `-1`.

**Time Complexity**: `O(A · C)`.
**Space Complexity**: `O(A)` for the table, with no recursion stack.

This is the safest implementation for the maximum input size: it cannot overflow the call stack.

### 4. BFS over Amounts

**Intuition**: Treat each amount as a node and each coin as an edge of weight 1. The minimum number of coins is the shortest path from `0` to `amount`, so breadth-first search finds it level by level.

**Algorithm**:
1. Start a queue with amount `0` at distance `0`; mark `0` visited.
2. For each level, expand every reachable amount by adding each coin.
3. If a new amount equals `amount`, return the current distance `+ 1`.
4. Mark new amounts `< amount` visited and enqueue them.
5. If the queue empties, return `-1`.

**Time Complexity**: `O(A · C)` — each of the `A + 1` amounts is expanded once.
**Space Complexity**: `O(A)` for the queue/visited set.

BFS is correct and often stops early, but it explores by coin count rather than by amount, so it may touch many states before reaching a large target.

## Visual Explanation

```
coins = [1, 2, 5], amount = 11

dp[a] = fewest coins to make a

a:      0   1   2   3   4   5   6   7   8   9   10  11
dp[a]:  0   1   1   2   2   1   2   2   3   3   2   3

dp[11] = min( dp[10] + 1,   dp[9] + 1,   dp[6] + 1 )
        = min( 2 + 1,       3 + 1,       2 + 1 )
        = 3                     ^ via coin 5: 5 + (5 + 1)

Reconstruction: 11 -> 6 (coin 5) -> 1 (coin 5) -> 0 (coin 1) => 5 + 5 + 1
```

Memoized DFS explores the same recurrence top-down and fills the same values on demand:

```
splitChange(11)
├─ coin 1 -> splitChange(10) = 2  -> 3
├─ coin 2 -> splitChange(9)  = 3  -> 4
└─ coin 5 -> splitChange(6)  = 2  -> 3   ← best

splitChange(6)
├─ coin 1 -> splitChange(5) = 1 -> 2     ← best
├─ coin 2 -> splitChange(4) = 2 -> 3
└─ coin 5 -> splitChange(1) = 1 -> 2     (tie)
```

Each amount is solved once; later calls hit the cache instead of re-exploring the subtree.

## Comparison of Approaches

| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| **Brute-force recursion** | exponential | `O(A/m)` stack | Recomputes overlapping subproblems; only for tiny amounts |
| **Memoized DFS (implemented)** | `O(A · C)` | `O(A)` + stack | Natural recurrence; recursion depth can reach `A/m` |
| **Bottom-up DP** | `O(A · C)` | `O(A)` | No recursion risk; easiest to reason about and to optimize to `O(A)` |
| **BFS over amounts** | `O(A · C)` | `O(A)` | Finds the shortest coin-count path; can stop early |

## Common Pitfalls

1. **Using greedy**: taking the largest coin first fails for `coins = [1,3,4], amount = 6` (greedy 3 coins, optimal 2). Dynamic programming is required.
2. **Forgetting the `amount === 0` base case**: the correct answer is `0`, not `-1`.
3. **Returning `Infinity` instead of `-1`**: LeetCode expects `-1` for impossible amounts. Check with `=== Infinity` before returning.
4. **Not caching failures**: if unreachable amounts are not cached, they are recomputed exponentially often. The implemented code caches `Infinity` too.
5. **Caching negative amounts**: `amt < 0` is a branch failure, not a state; returning early (before the cache) avoids polluting it.
6. **`dp` initialization**: `fill(Infinity)` is required; `fill(0)` or `fill(-1)` makes every amount look reachable.
7. **Off-by-one in the DP loop**: `dp[a - coin]` is valid only when `coin <= a`; guard the index or you will read `undefined`.
8. **Recursion depth**: with a coin of value 1 and `amount = 10^4`, the top-down version recurses up to 10,000 frames deep. Node's default stack can overflow (roughly 4–5k frames in common configurations), so a bottom-up table is safer for worst-case inputs.
