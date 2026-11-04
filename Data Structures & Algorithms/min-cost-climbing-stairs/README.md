# Min Cost Climbing Stairs - LeetCode 746

## Problem Description

You are given an integer array `cost` where `cost[i]` is the cost of stepping on the `i-th` stair. Once you pay the cost, you may climb either **one step** or **two steps**.

You may start at either index `0` or index `1`. Return the **minimum cost** to reach the top of the floor. The top is defined as the position **just past the last index** of the array, so the last stair does not have to be paid for if you can jump over it.

## Examples

### Example 1:

```
Input: cost = [10, 15, 20]
Output: 15
```

**Explanation:** Start at index 1, pay `15`, and take two steps to reach the top. Starting at index 0 would cost `10 + 15 = 25` (or `10 + 20 = 30`), so `15` is minimal.

### Example 2:

```
Input: cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]
Output: 6
```

**Explanation:** The cheapest route pays indices `0, 2, 4, 6, 7, 9` for `1 + 1 + 1 + 1 + 1 + 1 = 6`. The two `100` steps at indices `1` and `5` are skipped entirely.

### Example 3:

```
Input: cost = [0, 0, 0]
Output: 0
```

**Explanation:** Every stair is free, so the cost is `0` regardless of the path.

## Constraints

- `2 <= cost.length <= 1000`
- `0 <= cost[i] <= 999`
- The top is at index `cost.length` (one past the final element).

## Topics

- Dynamic Programming
- Recursion
- Memoization
- Array

## Solution Approaches

### 1. Brute-Force Recursion

**Intuition**: From index `i`, you must pay `cost[i]` and then choose between jumping to `i + 1` or `i + 2`. Try both and keep the cheaper result.

**Algorithm**:
1. `costToTop(i)`:
   - If `i >= cost.length`, you have already passed the top — return `0`.
   - Otherwise return `cost[i] + min(costToTop(i + 1), costToTop(i + 2))`.
2. The answer is `min(costToTop(0), costToTop(1))` because either starting stair is legal.

**Time Complexity**: `O(2^n)` — each index branches into two calls, and many states are recomputed.
**Space Complexity**: `O(n)` for the recursion stack.

### 2. Memoized DFS / Top-Down DP (Implemented)

**Intuition**: `costToTop(i)` depends only on `i`. Every path that reaches index `i` faces exactly the same remaining cost, so cache the answer per index.

**Algorithm**:
1. Create `cache = new Map<number, number>()`.
2. `recurr(idx)`:
   - If `idx >= cost.length`, return `0` (the top is reached without paying anything).
   - If `cache` has `idx`, return the cached value.
   - Compute `left = cost[idx] + recurr(idx + 1)` and `right = cost[idx] + recurr(idx + 2)`.
   - Store and return `Math.min(left, right)`.
3. Return `Math.min(recurr(0), recurr(1))`.

**Time Complexity**: `O(n)` — there are `n` indices, and each is solved once with constant work.
**Space Complexity**: `O(n)` for the cache plus `O(n)` recursion depth.

This is the approach in `submission-1.ts`. The two top-level calls model the two legal starting positions, and the `idx >= cost.length` base case models stepping past the final stair.

### 3. Bottom-Up DP / Tabulation

**Intuition**: Define `dp[i]` as the minimum cost to **reach position** `i`, where position `n` is the top. Reaching `i` means your last move came from `i - 1` or `i - 2`, so you paid `cost[i - 1]` or `cost[i - 2]` on the way out.

**Algorithm**:
1. `dp[0] = 0` and `dp[1] = 0` — either starting stair is free, since you do not pay to begin there.
2. For `i` from `2` to `n`: `dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])`.
3. Return `dp[n]`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(n)` for the table, with no recursion stack.

This formulation is convenient because the top is just index `n`; there is no special-case `min` over the last two entries.

### 4. Bottom-Up DP with Two Rolling Variables (Optimal Space)

**Intuition**: `dp[i]` uses only `dp[i - 1]` and `dp[i - 2]`, so the table collapses into two rolling values.

**Algorithm**:
1. `prev = 0` (represents `dp[0]`), `curr = 0` (represents `dp[1]`).
2. For `i` from `2` to `n`:
   - `next = Math.min(curr + cost[i - 1], prev + cost[i - 2])`.
   - `prev = curr`, `curr = next`.
3. Return `curr`, which is `dp[n]`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(1)`.

This is the standard interview answer: linear time, constant extra space, no recursion.

### 5. Dijkstra / Shortest Path (Conceptual)

**Intuition**: Model each index as a node. An edge from `i` to `i + 1` and `i + 2` has weight `cost[i]`, and the top is a sink node. The answer is the shortest path from a virtual start node (connected to `0` and `1` with weight 0) to the top.

**Time Complexity**: `O(n log n)` with a binary heap.
**Space Complexity**: `O(n)`.

This works but is strictly worse than the DP here because the graph is a DAG with a fixed forward direction. It is a useful reframing, not a practical choice.

## Visual Explanation

```
cost = [10, 15, 20], top = index 3

Start at 0:                    Start at 1:
  pay 10                         pay 15
  -> 1: pay 15  (total 25)       -> 2: pay 20 (total 35)
  -> 2: pay 20  (total 30)       -> 3: top    (total 15)  <-- best
  -> 2 -> 3          30
  -> 1 -> 3          25

Minimum = 15
```

The memoized recursion fills these states:

| `idx` | `cost[idx]` | `min(recurr(idx+1), recurr(idx+2))` | `recurr(idx)` |
| :--- | :--- | :--- | :--- |
| `3` | — | past the top | `0` |
| `2` | `20` | `min(0, 0) = 0` | `20` |
| `1` | `15` | `min(20, 0) = 0` | `15` |
| `0` | `10` | `min(15, 20) = 15` | `25` |

`Math.min(recurr(0), recurr(1)) = Math.min(25, 15) = 15`.

For the long example `[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]`, the DP values at the end are `dp[8] = 4`, `dp[9] = 5`, and the answer is `min(5 + 1, 4 + 100) = 6`.

## Common Pitfalls

1. **Paying for the top**: The top is **past** the last index. Do not add `cost[n - 1]` unless you actually step on it.
2. **Forgetting the second start**: The answer is `min(recurr(0), recurr(1))`, not just `recurr(0)`. Example 1 returns `15` precisely because starting at index `1` is cheaper.
3. **Greedy is wrong**: Always taking the locally cheaper next stair fails. In `[10, 15, 20]`, a greedy start at `10` costs more than starting at `15`. The choice must account for the whole remaining suffix.
4. **Base case placement**: `idx >= cost.length` must be checked before indexing `cost[idx]`; otherwise the last jump reads `undefined` and produces `NaN`.
5. **Cache and `undefined`**: `Map.get` returns `number | undefined`. Use `cache.has(idx)` before reading, or strict TypeScript will complain. Note that a cached value of `0` is falsy, so `if (cache.get(idx))` is a bug.
6. **Off-by-one in the bottom-up version**: The top is position `n`, not `n - 1`. With the reach-position formulation, loop through `i <= cost.length` and return `dp[cost.length]`. If you instead use the stand-on-stair formulation, return `min(dp[n - 1], dp[n - 2])`; returning a single entry there is wrong.
7. **Mutating the input**: None of these approaches modify `cost`, but a careless in-place DP would. Prefer a separate table unless the problem allows mutation.
