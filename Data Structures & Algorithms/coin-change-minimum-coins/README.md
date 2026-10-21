# Coin Change (Minimum Coins) - GeeksforGeeks

## Problem Description

Given an array `coins[]`, where each element represents a coin of a different denomination, and a target value `sum`. You have an **unlimited supply** of each coin type.

Find the **minimum number of coins** needed to obtain the target sum. If it is not possible to form the sum using the given coins, return `-1`.

## Examples

### Example 1:
```
Input: coins[] = [25, 10, 5], sum = 30
Output: 2
```
**Explanation:** `25 + 5 = 30`, which uses 2 coins. Using three `10`s also works but needs 3 coins.

### Example 2:
```
Input: coins[] = [9, 6, 5, 1], sum = 19
Output: 3
```
**Explanation:** `19 = 9 + 9 + 1` uses 3 coins. `9 + 5 + 5` also uses 3 coins, and no 2-coin combination exists.

### Example 3:
```
Input: coins[] = [5, 1], sum = 0
Output: 0
```
**Explanation:** For a sum of 0 we do not need any coin.

### Example 4:
```
Input: coins[] = [4, 6, 2], sum = 5
Output: -1
```
**Explanation:** Every coin is even, so no combination can produce the odd sum 5.

## Constraints

- `0 <= sum <= 10^4`
- `1 <= coins.size() <= 10^3`
- `1 <= coins[i] <= 10^4`
- Unlimited supply of every coin denomination

## Topics

- Dynamic Programming
- Recursion
- Memoization
- Breadth-First Search
- Unbounded Knapsack

## Company Tags

- Paytm
- Morgan Stanley
- Accolite
- Amazon
- Microsoft
- Samsung
- Snapdeal
- Oracle
- Visa
- Google
- Synopsys

## Solution Approaches

### 1. Brute Force Recursion

**Intuition**: To make `sum`, choose one coin `c` and then make `sum - c`. Try every coin and take the smallest result. If the amount goes below zero, that branch is impossible.

**Algorithm**:
1. If `sum === 0`, return `0`.
2. If `sum < 0`, return `Infinity` (dead end).
3. For every coin, recursively solve for `sum - coin` and keep the minimum plus one.
4. Return `-1` if every branch is a dead end.

**Time Complexity**: `O(n^sum)` — the recursion branches `n` ways at every level.
**Space Complexity**: `O(sum)` recursion stack.

This explores the same subproblems over and over (for `[1, 2]`, amount `3` is reached along many paths) and is far too slow for `sum = 10^4`.

### 2. Top-Down Memoization (Implemented — `submission-0.js`)

**Intuition**: The brute-force tree has overlapping subproblems: the answer for a remaining amount never changes. Cache the answer for each amount the first time it is computed, so every amount is solved only once.

**Algorithm**:
1. Keep a `Map` from remaining amount to the minimum coins needed.
2. `breakDown(num)`:
   - `num === 0` → `0` coins.
   - `num < 0` → `Infinity` (this path overshot).
   - If `cache` has `num`, return the cached value.
   - Otherwise try every coin, keep the smallest valid `breakDown(num - coin) + 1`, cache it, and return it.
3. Convert `Infinity` to `-1` at the end.

**Time Complexity**: `O(sum * n)` — each of the `sum + 1` amounts is computed once and scans all `n` coins.
**Space Complexity**: `O(sum)` for the cache and recursion stack.

> **Caveat:** recursion depth grows with `sum`. With a `1` coin and `sum = 10^4`, this implementation exceeds the JavaScript call stack (`RangeError: Maximum call stack size exceeded` between roughly depth 3,000 and 5,000 on Node 22/26). It is correct but not safe for the largest constraint.

### 3. Bottom-Up Dynamic Programming (Implemented — `submission-1.js`, Optimal)

**Intuition**: Build the answers from amount `0` upward. When computing `dp[amount]`, every smaller amount is already solved, so `dp[amount] = min(dp[amount - coin] + 1)` over all usable coins.

**Algorithm**:
1. Create `dp` of length `sum + 1`, filled with `Infinity`; set `dp[0] = 0`.
2. For `amount` from `1` to `sum`:
   - For each `coin <= amount`, relax `dp[amount] = min(dp[amount], dp[amount - coin] + 1)`.
3. Return `dp[sum]`, or `-1` when it is still `Infinity`.

**Time Complexity**: `O(sum * n)`.
**Space Complexity**: `O(sum)` — one array, no recursion.

This is the preferred submission: same asymptotics as memoization, constant stack usage, and no `RangeError` risk.

### 4. BFS over Amounts

**Intuition**: Treat each amount as a node in an unweighted graph, with an edge from `x` to `x - coin`. The fewest coins is the shortest path from `sum` to `0`, which BFS finds by expanding amounts level by level.

**Algorithm**:
1. Enqueue `[sum, 0]` and mark `sum` visited.
2. Dequeue `[amount, steps]`; if `amount === 0`, return `steps`.
3. Enqueue every unvisited `amount - coin >= 0`, with `steps + 1`.
4. If the queue empties, return `-1`.

**Time Complexity**: `O(sum * n)`.
**Space Complexity**: `O(sum)` for the queue and visited set.

Correct and iterative, but it does extra work for amounts that are not on a shortest path and needs a queue; DP is simpler.

### 5. Greedy (Incorrect)

**Intuition**: Repeatedly take the largest coin that fits.

**Why it fails**: Greedy is only correct for *canonical* coin systems (like US coins). For `coins = [9, 6, 5, 1]`, `sum = 11`, greedy takes `9 + 1 + 1 = 3` coins, but the optimum is `6 + 5 = 2`. With `coins = [4, 6, 2]`, `sum = 5`, greedy reports impossible even though no solution exists — but for other inputs it silently returns suboptimal answers.

**Time Complexity**: `O(n log n)` after sorting, but it solves the wrong problem.

## Comparison

| Approach | Time | Space | Correct? | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Brute Force Recursion | `O(n^sum)` | `O(sum)` | Yes | Exponential, revisits subproblems |
| Top-Down Memoization | `O(sum * n)` | `O(sum)` | Yes | Submission-0; can stack overflow at `sum = 10^4` |
| **Bottom-Up DP** | **`O(sum * n)`** | **`O(sum)`** | **Yes** | **Submission-1; optimal and stack-safe** |
| BFS over Amounts | `O(sum * n)` | `O(sum)` | Yes | Same complexity, extra queue machinery |
| Greedy | `O(n log n)` | `O(1)` | **No** | Fails on non-canonical coin systems |

## Visual Explanation

```
coins = [9, 6, 5, 1], sum = 19

Memoized recursion (top-down):
  breakDown(19)
    ├── 19-9 = 10  →  breakDown(10) = 2 (9+1)  → 3 coins
    ├── 19-6 = 13  →  breakDown(13) = 3        → 4 coins
    ├── 19-5 = 14  →  breakDown(14) = 2 (9+5)  → 3 coins
    └── 19-1 = 18  →  breakDown(18) = 2 (9+9)  → 3 coins
  minimum = 3

Bottom-up DP (selected amounts):
  dp[0]  = 0
  dp[5]  = 1
  dp[9]  = 1
  dp[10] = 2   (9+1 or 5+5)
  dp[11] = 2   (6+5)
  dp[14] = 2   (9+5)
  dp[15] = 2   (9+6)
  dp[18] = 2   (9+9)
  dp[19] = 3   (9+9+1)
```

## Common Pitfalls

1. **Greedy is not safe**: Larger coins first can miss the optimal combination (`[9, 6, 5, 1]`, sum `11`). Only canonical coin systems (e.g. `[1, 5, 10, 25]`) make greedy valid, and the problem does not promise that.
2. **Recursion depth**: `sum` can be `10^4`, and a recursive solution can overflow the stack even with memoization. Prefer the iterative `dp` table for the largest tests.
3. **`Infinity` arithmetic**: `Infinity + 1` is still `Infinity`, so unchecked additions do not accidentally produce a finite answer — but always test with `=== Infinity` / `Number.isFinite` instead of loose comparisons.
4. **Sum 0**: The answer is `0`, not `-1`. Initialize `dp[0] = 0`.
5. **Unreachable sums**: Leave `dp[amount]` as `Infinity` internally, and convert to `-1` only at the return.
6. **Unbounded supply**: The implemented loop computes amounts in increasing order and reads the already-updated `dp[amount - coin]`, which is what allows reusing a coin. If you restructure it as a coin-major loop (`for coin`, then `for amount`), iterate amounts **upward**; iterating downward treats each coin as usable only once (0/1 knapsack).
7. **Duplicate denominations** do not change the answer, but they do add redundant work.
8. **Return value type**: `minCoins` must return a number (`-1` on failure), not `Infinity` or a string.
