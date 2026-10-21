# Baseball Game - LeetCode 682

## Problem Description

You are keeping score for a baseball game with strange rules. The game consists of several rounds, where the scores of past rounds may affect future rounds' scores.

At the beginning of the game, you start with an empty record. You are given a list of strings `operations`, where `operations[i]` is the `i-th` operation you must apply to the record and is one of the following:

- **An integer `x`** — Record a new score of `x`.
- **`"+"`** — Record a new score that is the sum of the previous two scores. It is guaranteed there will always be two previous scores.
- **`"D"`** — Record a new score that is double the previous score. It is guaranteed there will always be a previous score.
- **`"C"`** — Invalidate the previous score, removing it from the record. It is guaranteed there will always be a previous score.

Return the **sum** of all the scores on the record after applying all the operations.

## Examples

### Example 1:
```
Input: operations = ["5","2","C","D","+"]
Output: 30
```
**Explanation:**
- `"5"` — Add `5` to the record. Record: `[5]`
- `"2"` — Add `2`. Record: `[5, 2]`
- `"C"` — Invalidate the previous score `2` and remove it. Record: `[5]`
- `"D"` — Double the previous score `5` and add `10`. Record: `[5, 10]`
- `"+"` — Add the sum of the previous two scores `5 + 10 = 15`. Record: `[5, 10, 15]`
- Sum: `5 + 10 + 15 = 30`

### Example 2:
```
Input: operations = ["5","-2","4","C","D","9","+","+"]
Output: 27
```
**Explanation:**
- `"5"` → `[5]`
- `"-2"` → `[5, -2]`
- `"4"` → `[5, -2, 4]`
- `"C"` → removes `4` → `[5, -2]`
- `"D"` → doubles `-2` → `[5, -2, -4]`
- `"9"` → `[5, -2, -4, 9]`
- `"+"` → `9 + (-4) = 5` → `[5, -2, -4, 9, 5]`
- `"+"` → `5 + 9 = 14` → `[5, -2, -4, 9, 5, 14]`
- Sum: `5 + (-2) + (-4) + 9 + 5 + 14 = 27`

### Example 3:
```
Input: operations = ["1","C"]
Output: 0
```
**Explanation:** `"1"` adds `1`, then `"C"` removes it. The record is empty, so the sum is `0`.

## Constraints

- `1 <= operations.length <= 1000`
- `operations[i]` is `"C"`, `"D"`, `"+"`, or a string representing an integer in the range `[-3 * 10^4, 3 * 10^4]`.
- For operation `"+"`, there will always be at least two previous scores on the record.
- For operations `"C"` and `"D"`, there will always be at least one previous score on the record.

## Topics

- Array
- Stack
- Simulation

## Company Tags

- Amazon
- Google
- Microsoft

## Solution Approaches

### 1. Stack Simulation (Implemented)

**Intuition**: Every operation only touches the **most recent** scores, and `"C"` is literally an **undo** of the last score. That is exactly a stack: push a score for a number, inspect the top one or two for `"D"` and `"+"`, and pop for `"C"`. Because the last score is always the one affected, no searching or shifting is ever needed.

**Algorithm**:
1. Create an empty array `record` to act as the stack.
2. For each operation `op`:
   - If `op` parses as an integer, push it.
   - If `op === "+"`, push `record[top] + record[top - 1]`.
   - If `op === "D"`, push `record[top] * 2`.
   - If `op === "C"`, pop the top score.
3. After all operations, sum the remaining scores and return the total.

**Time Complexity**: `O(n)` — each operation performs a constant amount of work, and the final sum is another `O(n)` pass.
**Space Complexity**: `O(n)` — the record can hold up to `n` scores.

### 2. Array with Explicit Top Pointer

**Intuition**: A stack does not need a dynamic array. Because the maximum number of scores is bounded by `operations.length`, we can preallocate a fixed array and maintain an integer `top` that points at the last valid slot. Pushing writes at `top + 1`; popping simply decrements `top`, leaving the stale value in place.

**Algorithm**:
1. Allocate `scores` with capacity `operations.length` and set `top = -1`.
2. For each operation:
   - Integer `x`: increment `top`, then set `scores[top] = x`.
   - `"+"`: read `a = scores[top]` and `b = scores[top - 1]`, increment `top`, then set `scores[top] = a + b`.
   - `"D"`: read `a = scores[top]`, increment `top`, then set `scores[top] = a * 2`.
   - `"C"`: decrement `top` (the old value becomes stale).
3. Sum `scores[0..top]` and return it.

**Time Complexity**: `O(n)` — one constant-time update per operation.
**Space Complexity**: `O(n)` — preallocated capacity for all operations.

### 3. Brute Force (Replay From Scratch)

**Intuition**: The most direct, non-incremental way to be sure of the record after step `i` is to replay operations `0..i` from an empty record. This throws away all previous work each round, but it makes the state definition obvious and is useful as a correctness baseline.

**Algorithm**:
1. For each index `i` from `0` to `n - 1`:
   - Start a fresh empty list.
   - Replay `operations[0..i]` using the same push/pop rules.
   - Keep the resulting list as the current record.
2. Sum the final record and return it.

**Time Complexity**: `O(n^2)` — replaying the prefix at every step costs `1 + 2 + ... + n` operations.
**Space Complexity**: `O(n)` — one record of up to `n` scores (rebuilt each round).

> **Note on the implemented file**: `submission-3.ts` is the latest submission and is identical to `submission-2.ts` except that a debug `console.log(record)` was removed. The logic is unchanged.

## Visual Explanation

```
operations = ["5", "2", "C", "D", "+"]

op      action                    record (bottom -> top)      sum
----    ----------------------    ------------------------    ----
"5"     push 5                    [5]                          5
"2"     push 2                    [5, 2]                       7
"C"     pop 2                     [5]                          5
"D"     push 5 * 2 = 10           [5, 10]                     15
"+"     push 5 + 10 = 15          [5, 10, 15]                 30

Answer: 30
```

## Common Pitfalls

1. **Scores can be negative.** Parse with `parseInt`/`Number` rather than checking `op >= "0"`, and never use a digits-only test such as `/^\d+$/`, which rejects `"-2"`.
2. **`"C"` removes only the last valid score.** It is a single `pop`, not a reset. It can remove a score that `"D"` or `"+"` used to compute a later score; that later score is not retroactively changed.
3. **`"+"` must not consume its operands.** Read the top two scores and push their sum; do not pop them.
4. **`"D"` doubles the previous *valid* score**, i.e. the current top after any earlier `"C"` operations.
5. **Sum at the end, not on the fly.** A later `"C"` can remove a score that was already added to a running total, so an incremental total would need to subtract on pop.
6. **Operator detection order.** Since `parseInt("D")`, `parseInt("C")`, and `parseInt("+")` are all `NaN`, checking for a numeric value first is safe. For canonical inputs, `Number(op)` is an equally good discriminator.

## Approach Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Stack Simulation** | `O(n)` | `O(n)` | Direct model of the rules; simple and optimal | Needs dynamic growth (amortized `O(1)` per push) |
| **Array + Top Pointer** | `O(n)` | `O(n)` | No resizing; explicit stack mechanics | Fixed capacity; index bookkeeping is easier to get wrong |
| **Brute-Force Replay** | `O(n^2)` | `O(n)` | Very easy to reason about correctness | Redundant work; unusable for large inputs |
