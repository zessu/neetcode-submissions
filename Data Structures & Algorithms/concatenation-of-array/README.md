# Concatenation of Array - LeetCode 1929

## Problem Description

Given an integer array `nums` of length `n`, create an array `ans` of length `2n` where:

- `ans[i] == nums[i]` for `0 <= i < n`, and
- `ans[i + n] == nums[i]` for `0 <= i < n`.

In other words, `ans` is `nums` concatenated with itself.

Return the array `ans`.

## Examples

### Example 1:
```
Input: nums = [1,2,1]
Output: [1,2,1,1,2,1]
```
**Explanation:** The result is built as `[nums[0], nums[1], nums[2], nums[0], nums[1], nums[2]]`, which is `[1,2,1] + [1,2,1]`.

### Example 2:
```
Input: nums = [1,3,2,1]
Output: [1,3,2,1,1,3,2,1]
```
**Explanation:** The result is `[1,3,2,1] + [1,3,2,1]`. The first copy occupies indices `0..3` and the second copy occupies indices `4..7`.

### Example 3:
```
Input: nums = [5]
Output: [5,5]
```
**Explanation:** A single-element array is simply repeated twice, producing an array of length `2`.

## Constraints

- `n == nums.length`
- `1 <= n <= 1000`
- `1 <= nums[i] <= 1000`

## Topics

- Array
- Simulation

## Company Tags

- Amazon
- Google
- Meta

## Solution Approaches

### 1. Spread / Concatenation (Implemented)

**Intuition**: The result is literally two copies of `nums` placed back to back. JavaScript's spread syntax copies the elements of each operand into a new array, so spreading `nums` twice produces exactly `ans`.

**Algorithm**:
1. Return `[...nums, ...nums]`.
2. The first spread writes indices `0..n-1`; the second writes indices `n..2n-1`.

**Time Complexity**: `O(n)` — each of the `2n` elements is copied once.
**Space Complexity**: `O(n)` — the output array has `2n` elements (counted as `O(n)`).

### 2. Preallocate and Fill Both Positions

**Intuition**: Allocate the final `2n` array up front, then place each input value at both of its required positions in a single pass. Element `i` belongs at index `i` and at index `i + n`.

**Algorithm**:
1. Create `ans = new Array(2 * n)`.
2. For each index `i` from `0` to `n - 1`:
   - `ans[i] = nums[i]`.
   - `ans[i + n] = nums[i]`.
3. Return `ans`.

**Time Complexity**: `O(n)` — one pass, two writes per element.
**Space Complexity**: `O(n)` — the preallocated output array.

### 3. Two-Pass Append

**Intuition**: Build the result by iterating over `nums` twice, appending each value on both passes. This mirrors the definition directly and avoids index arithmetic.

**Algorithm**:
1. Create an empty `ans` array.
2. Loop from `0` to `n - 1`, pushing `nums[i]`.
3. Loop from `0` to `n - 1` again, pushing `nums[i]`.
4. Return `ans`.

**Time Complexity**: `O(n)` — `2n` pushes.
**Space Complexity**: `O(n)` — the output array.

### 4. Modulo Mapping (Earlier Submission)

**Intuition**: Create an array of length `2n` and fill position `i` with `nums[i % n]`. The modulo wraps the second half back to the start of the input.

**Algorithm**:
1. Create a result array of length `2n` (for example with `Array.from({ length: 2 * n })`).
2. For each index `i` from `0` to `2n - 1`, set `ans[i] = nums[i % n]`.
3. Return `ans`.

**Time Complexity**: `O(n)` — `2n` assignments, each with an `O(1)` modulo.
**Space Complexity**: `O(n)` — the output array.

> **Evolution in this directory**: `submission-0.ts` preallocated an array and used `map` with `idx % nums.length`; `submission-1.ts` removed the intermediate variable; `submission-2.ts` (the latest) replaced the whole approach with `[...nums, ...nums]`.

## Visual Explanation

```
nums = [1, 2, 1], n = 3

index:   0   1   2 | 3   4   5
value:   1   2   1 | 1   2   1
source:  0   1   2 | 0   1   2

First copy:  indices 0..n-1
Second copy: indices n..2n-1

General rule:
  ans[i]     = nums[i]      for 0 <= i < n
  ans[i + n] = nums[i]      for 0 <= i < n

Result: [1, 2, 1, 1, 2, 1]
```

## Common Pitfalls

1. **Creating nested arrays.** `[nums, nums]` produces `[[1,2,1],[1,2,1]]`, not `[1,2,1,1,2,1]`. The inner arrays must be spread: `[...nums, ...nums]`.
2. **Allocating the wrong length.** The result has length `2n`, not `n`. Writing to `ans[i + n]` on a preallocated `n`-length plain array silently grows it beyond the intended size (or throws with a fixed-size/typed buffer), so the final length is wrong or the write fails.
3. **Losing the second copy.** A loop that runs only once (`i < n`) fills just the first half.
4. **Mutating the input.** `nums.push(...nums)` changes the caller's array and can loop incorrectly if the length is re-evaluated. Build a new array instead.
5. **Sparse preallocation.** `new Array(2 * n)` creates holes; if you use `map` on it, the callback is skipped for empty slots. Use `Array.from` or an explicit loop.
6. **Off-by-one in modulo.** For `n` elements, the divisor is `nums.length`, not `2 * nums.length`; otherwise the second copy uses the wrong indices.

## Approach Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Spread / Concatenation** | `O(n)` | `O(n)` | Shortest and most readable; no index math | Allocates via spread; less explicit about positions |
| **Preallocate + Fill** | `O(n)` | `O(n)` | One pass; exact control of indices | Requires manual `2n` allocation |
| **Two-Pass Append** | `O(n)` | `O(n)` | Mirrors the definition; no modulo | Two loops; dynamic growth |
| **Modulo Mapping** | `O(n)` | `O(n)` | Single formula for both halves | Modulo per element; easy to mis-size the array |
