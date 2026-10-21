# Majority Element - LeetCode 169

## Problem Description

Given an array `nums` of size `n`, return the **majority element**.

The majority element is the element that appears **more than** `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.

## Examples

### Example 1:
```
Input: nums = [3,2,3]
Output: 3
```
**Explanation:** `n = 3`, so the majority threshold is `⌊3/2⌋ = 1`. The value `3` appears twice, which is more than `1`; `2` appears once.

### Example 2:
```
Input: nums = [2,2,1,1,1,2,2]
Output: 2
```
**Explanation:** `n = 7`, so an element must appear more than `⌊7/2⌋ = 3` times, i.e. at least `4` times. `2` appears four times, while `1` appears three times.

### Example 3:
```
Input: nums = [1]
Output: 1
```
**Explanation:** With one element, that element is trivially the majority (`1 > ⌊1/2⌋ = 0`).

## Constraints

- `n == nums.length`
- `1 <= n <= 5 * 10^4`
- `-10^9 <= nums[i] <= 10^9`
- The input is generated such that a majority element will exist in the array.

## Topics

- Array
- Hash Table
- Divide and Conquer
- Sorting
- Counting

## Company Tags

- Amazon
- Google
- Microsoft
- Apple
- Adobe

## Solution Approaches

### 1. Brute Force (Count Every Candidate)

**Intuition**: For each element, scan the whole array and count how many times it occurs. If any count exceeds `⌊n / 2⌋`, that value is the answer.

**Algorithm**:
1. For each index `i` from `0` to `n - 1`:
   - Set `count = 0`.
   - For each index `j` from `0` to `n - 1`, increment `count` when `nums[j] === nums[i]`.
   - If `count > Math.floor(n / 2)`, return `nums[i]`.
2. The guaranteed majority ensures a return happens.

**Time Complexity**: `O(n^2)` — `n` candidates, each requiring an `O(n)` scan.
**Space Complexity**: `O(1)` — only a counter.

### 2. Hash Map Counting (Implemented)

**Intuition**: Count occurrences in a single pass with a hash map. The moment a value's count exceeds half the array, it must be the majority and can be returned immediately. A second distinct value cannot also exceed half, and no later value can overtake it.

**Algorithm**:
1. Compute `mid = Math.floor(n / 2)`.
2. Create an empty `Map`.
3. For each `num` in `nums`:
   - Read its previous count (`0` if unseen).
   - Store `previous + 1`.
   - If the previous count is already `>= mid`, then the new count is at least `mid + 1`, so return `num`.
4. The guaranteed majority ensures a return happens.

**Time Complexity**: `O(n)` expected — one pass with `O(1)` expected map operations.
**Space Complexity**: `O(n)` — up to `n` distinct values in the map.

### 3. Sorting

**Intuition**: If an element occurs more than half the time, it must occupy the **middle index** after sorting. Any value that fills more than half the positions cannot avoid the median position.

**Algorithm**:
1. Sort `nums` in non-decreasing order.
2. Return `nums[Math.floor(n / 2)]`.

**Time Complexity**: `O(n log n)` — dominated by sorting.
**Space Complexity**: `O(1)` auxiliary for an in-place sort, up to `O(n)` if the engine's sort allocates a temporary array (V8's TimSort does for large inputs).

### 4. Boyer-Moore Voting

**Intuition**: Treat each value as a vote. Keep a `candidate` and a `count`. When the count is `0`, adopt the current value as the candidate. If the next value equals the candidate, increment; otherwise decrement (the two values cancel each other). Because the majority appears more than all other values **combined**, it can never be fully cancelled and is the final candidate.

**Algorithm**:
1. Set `candidate = null` and `count = 0`.
2. For each `num` in `nums`:
   - If `count === 0`, set `candidate = num`.
   - If `num === candidate`, increment `count`; otherwise decrement `count`.
3. Return `candidate`.

**Time Complexity**: `O(n)` — one pass.
**Space Complexity**: `O(1)` — two variables.

## Visual Explanation

Boyer-Moore on `nums = [2,2,1,1,1,2,2]`:

```
num   candidate   count   action
2     -           0       count 0 -> candidate = 2, count = 1
2     2           1       same -> count = 2
1     2           2       different -> count = 1
1     2           1       different -> count = 0
1     2           0       count 0 -> candidate = 1, count = 1
2     1           1       different -> count = 0
2     1           0       count 0 -> candidate = 2, count = 1

answer = 2
```

The majority `2` survives every cancellation; the final candidate is `2`.

Hash-map counts for the same input:

```
2 -> 1, 2, 3, 4   (return 2 once the count reaches 4 > 7/2)
1 -> 1, 2, 3
```

## Common Pitfalls

1. **Strictly greater than half.** An element appearing exactly `n / 2` times is **not** a majority. The threshold is `> ⌊n / 2⌋`, not `>= n / 2` for even `n`.
2. **Early-return off-by-one.** In the implemented code, `occurences` is the count **before** adding the current element. Checking `occurences >= mid` is equivalent to the new count being `>= mid + 1`, i.e. strictly greater than `⌊n / 2⌋`.
3. **Boyer-Moore assumes a majority exists.** Without the guarantee, the final candidate must be verified with a second pass. Here the constraint makes the verification unnecessary.
4. **Resetting the candidate too early.** In Boyer-Moore, adopt a new candidate only when `count === 0`, before processing the current element.
5. **Using the wrong middle index after sorting.** The 0-indexed median is `nums[Math.floor(n / 2)]`; for `n = 7` that is index `3`, and for `n = 6` it is index `3`.
6. **Object keys vs values.** JavaScript object keys are strings, so `-1` and `"-1"` can collide. `Map` preserves numeric keys and is the safer choice.
7. **Assuming values are positive or small.** The constraints allow `-10^9` to `10^9`; a counting array indexed by value is not feasible. Use a hash map instead.

## Approach Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Brute Force** | `O(n^2)` | `O(1)` | No extra data structures; obvious correctness | Too slow for `n = 5 * 10^4` |
| **Hash Map** | `O(n)` expected | `O(n)` | One pass; early exit; easy to extend to top-k counts | Uses linear extra memory |
| **Sorting** | `O(n log n)` | `O(1)`–`O(n)` (engine-dependent) | Extremely short; no hashing | Reorders input; slower asymptotically |
| **Boyer-Moore Voting** | `O(n)` | `O(1)` | Optimal time and space; single pass | Requires the majority guarantee; less obvious why it works |
