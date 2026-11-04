# Climbing Stairs - LeetCode 70

## Problem Description

You are climbing a staircase with `n` steps. Each time you can climb either **1 step** or **2 steps**.

Return the number of **distinct ways** you can climb to the top.

The order of the steps matters: climbing `1 + 2` is different from `2 + 1`, even though both reach the top in three steps.

## Examples

### Example 1:

```
Input: n = 2
Output: 2
```

**Explanation:** There are two ways to reach the top:
1. `1 + 1`
2. `2`

### Example 2:

```
Input: n = 3
Output: 3
```

**Explanation:** There are three ways:
1. `1 + 1 + 1`
2. `1 + 2`
3. `2 + 1`

### Example 3:

```
Input: n = 5
Output: 8
```

**Explanation:** The sequence of answers for `n = 1, 2, 3, 4, 5` is `1, 2, 3, 5, 8`, which is the Fibonacci sequence shifted by one index.

## Constraints

- `1 <= n <= 45`
- The answer fits in a 32-bit signed integer for the full constraint range (`climbStairs(45) = 1,836,311,903`).

## Topics

- Dynamic Programming
- Recursion
- Memoization
- Math
- Fibonacci Sequence

## Solution Approaches

### 1. Brute-Force Recursion

**Intuition**: To reach step `n`, the final move was either a 1-step from `n - 1` or a 2-step from `n - 2`. Recurse on both and add the results.

**Algorithm**:
1. `ways(0) = 1` — there is exactly one way to stand at the bottom: do nothing.
2. `ways(negative) = 0` — overshooting is invalid.
3. Otherwise return `ways(n - 1) + ways(n - 2)`.

**Time Complexity**: `O(2^n)` — every call branches twice, and the recursion tree has roughly `2^n` nodes.
**Space Complexity**: `O(n)` for the recursion stack.

The same subproblems are recomputed constantly. For `n = 5`, `ways(3)` is evaluated from both `ways(4)` and `ways(2)`.

### 2. Memoized DFS / Top-Down DP (Implemented)

**Intuition**: The brute-force recursion has **overlapping subproblems**: `ways(k)` is the same question no matter which path reached `k`. Cache each answer the first time it is computed.

**Algorithm**:
1. Create `cache = new Map<number, number>()`.
2. `recurr(val)`:
   - `val === 0` → return `1`.
   - `val < 0` → return `0`.
   - If `cache` has `val`, return it immediately.
   - Otherwise compute `left = recurr(val - 1)` and `right = recurr(val - 2)`, store `left + right`, and return it.
3. The answer is `recurr(n)`.

**Time Complexity**: `O(n)` — each of the values `0..n` is solved at most once, and each solve does constant work.
**Space Complexity**: `O(n)` for the cache plus `O(n)` recursion depth.

This is the approach in `submission-1.ts`. It keeps the natural "from the top, decide the last step" way of thinking while eliminating the exponential blow-up.

### 3. Bottom-Up DP / Tabulation

**Intuition**: Build the answer from the bottom of the staircase upward. `dp[i]` is the number of ways to reach step `i`, and it depends only on `dp[i - 1]` and `dp[i - 2]`.

**Algorithm**:
1. `dp = Array(n + 1).fill(0)`; `dp[0] = 1`.
2. For `i` from `1` to `n`: `dp[i] = (dp[i - 1] ?? 0) + (dp[i - 2] ?? 0)`.
3. Return `dp[n]`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(n)` for the table, with no recursion stack.

### 4. Bottom-Up DP with Two Variables

**Intuition**: Only the previous two values are ever needed, so the full table can be replaced by two counters.

**Algorithm**:
1. `prev = 0` (ways to reach the step below the bottom) and `curr = 1` (ways to reach step 0).
2. Repeat `n` times: `[prev, curr] = [curr, prev + curr]`.
3. Return `curr`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(1)`.

This is the version most often written in interviews because it is short, iterative, and stack-safe. It is the standard production choice.

### 5. Matrix Exponentiation

**Intuition**: The recurrence `[ways(i), ways(i - 1)] = M * [ways(i - 1), ways(i - 2)]` with `M = [[1, 1], [1, 0]]` is linear, so `M^n` gives the answer. Exponentiation by squaring computes `M^n` in logarithmic time.

**Algorithm**:
1. Write a `2x2` matrix multiply.
2. Raise `M` to the `n`-th power with binary exponentiation.
3. Return the top-left entry of the result.

**Time Complexity**: `O(log n)`.
**Space Complexity**: `O(1)`.

This matters only when `n` is astronomically large; for `n <= 45` it is overkill. It is included to show that the recurrence has a closed algebraic form.

### 6. Binet's Formula (Closed Form)

**Intuition**: Since the answer is `F(n + 1)` of the Fibonacci sequence, Binet's formula computes it directly:
`F(k) = (phi^k - psi^k) / sqrt(5)`, where `phi = (1 + sqrt(5)) / 2` and `psi = (1 - sqrt(5)) / 2`.

**Time Complexity**: `O(1)` with `Math.pow`.
**Space Complexity**: `O(1)`.

Floating-point rounding makes this risky for large `n`; `Math.round` is required, and it is not the recommended interview answer.

## Visual Explanation

```
n = 5

Reach step 5:
  from step 4 (take a 1-step)  ->  ways(4) = 5
  from step 3 (take a 2-step)  ->  ways(3) = 3
                                  total = 8

Recursion tree (memoized values in parentheses):

                      ways(5)
                    /          \
              ways(4)          ways(3)
             /      \          /      \
        ways(3)   ways(2)  ways(2)  ways(1)
        /    \     /   \    /   \     /   \
     (3)     (2) (2)  (1) (2)  (1)  (1)  (0)=1

The second visit to ways(3) and ways(2) is an O(1) cache lookup,
so each state is solved exactly once.
```

The bottom-up table fills in one pass:

```
i:      0   1   2   3   4   5
dp[i]:  1   1   2   3   5   8
```

## Common Pitfalls

1. **Base case confusion**: `ways(0) = 1`, not `0`. Reaching the bottom "without moving" counts as one valid way, and it is required for `n = 1` and `n = 2` to work out.
2. **Off-by-one Fibonacci index**: The answer is `F(n + 1)`, not `F(n)`. For `n = 2` the answer is `2`, which is `F(3)`.
3. **Forgetting the negative check**: `recurr(-1)` must return `0`, otherwise `n = 1` would recurse into invalid states.
4. **Truthiness checks on the cache**: use `cache.has(val)` rather than `if (cache.get(val))`. A solved state can legitimately be `0` in related problems (Min Cost Climbing Stairs caches `0` for free stairs), and a truthiness check would recompute it. In this problem the base value `1` at step `0` is not cached, but the `has` guard is still the correct pattern.
5. **Recursion depth**: `n <= 45` is safe for the memoized version, but the two-variable DP avoids the stack entirely and scales further.
6. **Integer overflow**: In languages with fixed-width integers the answer can overflow for large `n`; JavaScript numbers are safe up to `n = 45` and beyond.
7. **TypeScript strictness**: `Map.get` returns `number | undefined`. The submission relies on the `cache.has()` guard and the NeetCode runner's configuration; strict TypeScript would need `cache.get(val)!` or a local variable plus a `typeof` check.
