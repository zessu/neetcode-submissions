# Summing Squares - Structy #79

## Problem Description

Given a non-negative integer `n`, return the **fewest number of perfect squares** whose sum is exactly `n`.

A perfect square is an integer of the form `k * k` (for example, `1, 4, 9, 16, 25, ...`). You may reuse the same square as many times as you need.

This problem is Structy's **Summing Squares** and is equivalent to LeetCode 279, *Perfect Squares*.

## Examples

### Example 1:

```
Input: n = 12
Output: 3
```

**Explanation:** `12 = 4 + 4 + 4`, which uses 3 squares. No combination of one or two squares reaches 12, so 3 is minimal.

### Example 2:

```
Input: n = 13
Output: 2
```

**Explanation:** `13 = 9 + 4`, which uses 2 squares. `13` is not a perfect square, so the answer cannot be 1.

### Example 3:

```
Input: n = 7
Output: 4
```

**Explanation:** `7 = 4 + 1 + 1 + 1`, which uses 4 squares. Taking `4` first is optimal here; two squares cannot sum to 7.

### Example 4:

```
Input: n = 1000
Output: 2
```

**Explanation:** `1000 = 900 + 100 = 30^2 + 10^2`, so two squares are enough. This is the value printed by the demo at the bottom of `submission-0.ts`.

### Example 5:

```
Input: n = 0
Output: 0
```

**Explanation:** Zero squares are needed to reach zero. This is the base case that stops the recursion.

## Constraints

- `0 <= n <= 10^4` for the recursive and dynamic-programming approaches in this repository.
- Structy's version accepts non-negative targets; LeetCode 279 uses `1 <= n <= 10^4`.
- The answer is always defined because `1 = 1^2` and every integer can be written as a sum of ones.

## Topics

- Dynamic Programming
- Recursion
- Memoization
- Breadth-First Search
- Math

## Solution Approaches

### 1. Brute-Force Recursion

**Intuition**: At every step, subtract one perfect square from the remaining target. Try every square no larger than the remainder, and keep the branch that reaches zero using the fewest subtractions.

**Algorithm**:
1. `sumSquares(remain)`:
   - If `remain < 0`, the branch overshot — return `Infinity`.
   - If `remain === 0`, the target was reached — return `0`.
   - For every `i` with `i * i <= remain`, compute `1 + sumSquares(remain - i * i)` and keep the minimum.
2. Return the minimum, or `Infinity` if no branch reaches zero.

**Time Complexity**: Exponential. A loose bound is `O(sqrt(n)^n)` because the recursion can subtract `1` at every level, giving depth `n` and up to `sqrt(n)` choices per level.
**Space Complexity**: `O(n)` recursion stack in the worst case.

The same remainder is solved over and over. For example, `12 - 4 - 4` and `12 - 9 - 1` both reach remainder `1`, which is recomputed from scratch each time.

### 2. Memoized DFS / Top-Down DP (Implemented)

**Intuition**: The brute-force recursion has overlapping subproblems because many different sequences of squares leave the same remainder. Cache the answer for each remainder the first time it is solved.

**Algorithm**:
1. Compute `range = floor(sqrt(n))`, the largest square root that can possibly be subtracted.
2. Create `cache = new Map<number, number>()`.
3. `recurr(remain)`:
   - `remain < 0` → `Infinity` (do not cache negative values).
   - `remain === 0` → `0`.
   - If `cache` has `remain`, return the cached value.
   - Otherwise try every `i` from `1` to `range`: if `recurr(remain - i * i)` is finite, consider `1 + that result`.
   - Cache the minimum — including `Infinity` for impossible remainders — and return it.
4. The top-level call is `recurr(n)`.

The fixed `range` is safe: for a smaller remainder, subtracting a square larger than the remainder produces a negative value, which immediately returns `Infinity`. Those branches are discarded by the `if (res !== Infinity)` check.

**Time Complexity**: `O(n * sqrt(n))` — there are at most `n + 1` distinct remainders, and each one loops over at most `sqrt(n)` squares once.
**Space Complexity**: `O(n)` for the cache plus `O(n)` recursion stack in the worst case (a chain of `1`-subtractions).

### 3. Bottom-Up DP / Tabulation

**Intuition**: Solve every target from `0` upward. `dp[t]` is the minimum number of squares that sum to `t`, and it only depends on smaller targets `t - i * i`, which are already known.

**Algorithm**:
1. `dp = Array(n + 1).fill(Infinity)`; `dp[0] = 0`.
2. For `t` from `1` to `n`:
   - For every `i` with `i * i <= t`: `dp[t] = min(dp[t], dp[t - i * i] + 1)`.
3. Return `dp[n]`.

**Time Complexity**: `O(n * sqrt(n))`.
**Space Complexity**: `O(n)` for the table, with no recursion stack.

This is the safest implementation for large `n` because it cannot overflow the call stack.

### 4. BFS over Remainders

**Intuition**: Treat every remainder as a graph node. From remainder `r`, subtracting a square `i * i` is an edge to `r - i * i` with weight 1. The minimum number of squares is the shortest path from `n` to `0`.

**Algorithm**:
1. Start a queue with `n` at distance `0`; mark `n` visited.
2. Process the queue level by level. For each remainder, subtract every square no larger than it.
3. If a new remainder is `0`, return the current distance `+ 1`.
4. Otherwise enqueue it if it has not been visited.
5. If the queue empties, return `-1` (unreachable). This cannot happen while `1` is available.

**Time Complexity**: `O(n * sqrt(n))` — each remainder is expanded once.
**Space Complexity**: `O(n)` for the queue and visited set.

BFS stops as soon as it reaches `0`, so it can finish earlier than DP on some inputs. It explores by number of squares rather than by target value.

### 5. Lagrange's Four-Square Theorem (Math)

**Intuition**: Every non-negative integer can be written as the sum of at most four perfect squares. The answer is therefore always in `{0, 1, 2, 3, 4}`. Legendre's three-square theorem tells us exactly when four squares are necessary.

**Algorithm**:
1. `n === 0` → `0`.
2. If `n` is a perfect square → `1`.
3. Remove factors of `4` from `n`. If the reduced value is of the form `8b + 7` → `4`.
4. If `n` can be written as `a^2 + b^2` for some integers `a, b` → `2`.
5. Otherwise → `3`.

**Time Complexity**: `O(sqrt(n))` for the perfect-square and two-square checks.
**Space Complexity**: `O(1)`.

This is the fastest approach, but it relies on a number-theory theorem rather than the dynamic-programming pattern the exercise is teaching. It is included as an alternative, not as the implemented solution.

## Visual Explanation

```
n = 12, squares available: 1, 4, 9

Try subtracting 9:
  12 -> 3 -> 2 -> 1 -> 0      9 + 1 + 1 + 1 = 4 squares

Try subtracting 4:
  12 -> 8 -> 4 -> 0           4 + 4 + 4 = 3 squares  <-- best

Try subtracting 1:
  12 -> 11 -> ...             never better than 3

Minimum: 3
```

The memoized version solves `recurr(12)` by asking for `recurr(11)`, `recurr(8)`, and `recurr(3)`. Once `recurr(8)` is cached as `2`, every other branch that needs `8` reuses that answer instead of expanding it again.

## Common Pitfalls

1. **Forgetting the zero base case**: `recurr(0)` must return `0`, otherwise subtraction never terminates.
2. **Caching `Infinity` incorrectly**: impossible remainders should be cached too; otherwise the same dead end is recomputed repeatedly.
3. **Using a greedy largest-square strategy**: `12` is the classic counterexample. Greedy picks `9 + 1 + 1 + 1` for 4 squares, while `4 + 4 + 4` uses 3.
4. **Loop bound**: only subtract squares up to the current remainder. The implementation's fixed `range` still works because oversized subtractions become negative and are rejected, but a dynamic bound avoids wasted calls.
5. **Recursion depth**: with only `1`s available, the recursion can be `n` levels deep. For `n = 10^4`, a top-down solution may exceed a small call stack; the bottom-up DP is safer.
6. **Map typing**: use `Map<number, number>` and check `cache.has()` before reading, so a cached `0` is not mistaken for a missing value.
