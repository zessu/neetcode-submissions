# Subarray Sum Equals K - LeetCode 560

## Problem Description

Given an array of integers `nums` and an integer `k`, return the **total number of subarrays** whose sum equals `k`.

A **subarray** is a contiguous, non-empty sequence of elements within an array.

The array may contain **negative numbers, zero, and duplicates**, so the running sum is not monotonic. This rules out a simple sliding window.

## Examples

### Example 1:
```
Input: nums = [1,1,1], k = 2
Output: 2
```
**Explanation:** The subarrays that sum to `2` are `[1,1]` at indices `[0,1]` and `[1,1]` at indices `[1,2]`. The whole array sums to `3`, so it does not count.

### Example 2:
```
Input: nums = [1,2,3], k = 3
Output: 2
```
**Explanation:** The valid subarrays are `[1,2]` (sum `3`) and `[3]` (sum `3`). Note that `[1,2,3]` sums to `6`.

### Example 3:
```
Input: nums = [1,-1,0], k = 0
Output: 3
```
**Explanation:** The subarrays summing to `0` are `[1,-1]`, `[0]`, and `[1,-1,0]`. Negative values mean a longer subarray can have a smaller sum than a shorter one.

### Example 4:
```
Input: nums = [1], k = 0
Output: 0
```
**Explanation:** The only subarray is `[1]`, whose sum is `1`, so no subarray sums to `0`.

## Constraints

- `1 <= nums.length <= 2 * 10^4`
- `-1000 <= nums[i] <= 1000`
- `-10^7 <= k <= 10^7`

## Topics

- Array
- Hash Table
- Prefix Sum

## Company Tags

- Google
- Amazon
- Meta
- Microsoft
- Bloomberg

## Solution Approaches

### 1. Brute Force (Recompute Each Subarray Sum)

**Intuition**: Enumerate every possible start and end index, add up the elements in between, and count the subarrays whose sum equals `k`.

**Algorithm**:
1. For `start` from `0` to `n - 1`:
   - For `end` from `start` to `n - 1`:
     - Compute `sum` by looping from `start` to `end`.
     - If `sum === k`, increment the answer.
2. Return the count.

**Time Complexity**: `O(n^3)` — `O(n^2)` subarrays, each summed in `O(n)`.
**Space Complexity**: `O(1)`.

### 2. Brute Force with Running Sum

**Intuition**: Fix the start index and extend the end index one step at a time, adding the new element to a running sum. This removes the innermost summation loop.

**Algorithm**:
1. For `start` from `0` to `n - 1`:
   - Set `sum = 0`.
   - For `end` from `start` to `n - 1`:
     - `sum += nums[end]`.
     - If `sum === k`, increment the answer.
2. Return the count.

**Time Complexity**: `O(n^2)` — there are `n(n + 1) / 2` subarrays.
**Space Complexity**: `O(1)`.

At `n = 2 * 10^4`, that is about 200 million subarrays — too slow in JavaScript.

### 3. Prefix Sum Array

**Intuition**: Let `P[i]` be the sum of the first `i` elements, with `P[0] = 0`. The sum of the subarray `nums[i..j-1]` is `P[j] - P[i]`. We need pairs `(i, j)` with `i < j` and `P[j] - P[i] = k`.

**Algorithm**:
1. Build `P` of length `n + 1` with `P[0] = 0` and `P[i + 1] = P[i] + nums[i]`.
2. For every `i` from `0` to `n - 1`:
   - For every `j` from `i + 1` to `n`:
     - If `P[j] - P[i] === k`, increment the answer.
3. Return the count.

**Time Complexity**: `O(n^2)` — all pairs of prefix indices.
**Space Complexity**: `O(n)` for the prefix array.

This is the bridge to the optimal solution: the hash-map approach replaces the inner loop with a lookup.

### 4. Prefix Sum + Hash Map (Implemented)

**Intuition**: Rewrite the condition `P[j] - P[i] = k` as `P[i] = P[j] - k`. While scanning once, keep a hash map from each prefix sum seen so far to how many times it occurred. At index `j`, every earlier prefix sum equal to `P[j] - k` marks a subarray ending at `j` with sum `k`. Add the map's count for that value.

**Algorithm**:
1. Create a map `prefixCount` and seed it with `0 -> 1`. The zero prefix represents the empty prefix before index `0`; it lets subarrays beginning at index `0` be counted.
2. Set `sum = 0` and `result = 0`.
3. For each `num` in `nums`:
   - `sum += num` — this is `P[j]` for the current position.
   - `diff = sum - k` — the prefix value we need to have seen.
   - `result += prefixCount.get(diff) || 0`.
   - Increment the count for `sum` in the map: `prefixCount.set(sum, (prefixCount.get(sum) || 0) + 1)`.
4. Return `result`.

**Time Complexity**: `O(n)` — one pass, with average `O(1)` hash-map operations.
**Space Complexity**: `O(n)` — the map stores at most `n + 1` distinct prefix sums.

## Visual Explanation

```
nums = [1, 1, 1], k = 2

Prefix sums:
  P[0] = 0
  P[1] = 1
  P[2] = 2
  P[3] = 3

We need P[j] - P[i] = 2:
  j=2, i=0 -> 2 - 0 = 2  ✓  subarray [0..1] = [1,1]
  j=3, i=1 -> 3 - 1 = 2  ✓  subarray [1..2] = [1,1]
  answer = 2
```

```
One-pass hash map:

start: map = {0: 1}, sum = 0, result = 0

num=1: sum=1, diff=-1 -> map has 0   -> result=0
       map = {0:1, 1:1}

num=1: sum=2, diff= 0 -> map has 1   -> result=1
       map = {0:1, 1:1, 2:1}

num=1: sum=3, diff= 1 -> map has 1   -> result=2
       map = {0:1, 1:1, 2:1, 3:1}

return 2
```

## Approach Comparison

| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Brute Force (recompute sums) | `O(n^3)` | `O(1)` | Clear but far too slow |
| Brute Force + Running Sum | `O(n^2)` | `O(1)` | Removes the innermost loop; still too slow at `n = 2 * 10^4` |
| Prefix Sum Array | `O(n^2)` | `O(n)` | Same time as running sum, but shows the key identity |
| **Prefix Sum + Hash Map (implemented)** | `O(n)` | `O(n)` | **Optimal**; one pass and average constant-time lookups |
| Sliding Window | `O(n)` *if it applied* | `O(1)` | **Incorrect here** — negative numbers break the monotonicity it relies on |

## Common Pitfalls

1. **Forgetting `map.set(0, 1)`**: Without the zero prefix, subarrays that start at index `0` are never counted. For `[1,1,1]` with `k = 2`, the answer would drop from `2` to `1`.
2. **Counting before updating the map**: The current prefix sum must be inserted **after** adding `diff`'s count. Otherwise a subarray of length `0` (when `k = 0`) could be counted, and the current element could be paired with itself.
3. **Using a Set instead of a map**: Prefix sums can repeat (for example, `[1,-1,1,-1]`), and each occurrence represents a different starting index. A set would undercount.
4. **Trying a sliding window**: With negative numbers, extending the window can decrease the sum, so you cannot decide when to move the left pointer. Use prefix sums instead.
5. **Confusing `k` with a target index**: `k` is a sum, not a position. The difference is `sum - k`, not `sum + k`.
6. **Returning the subarrays instead of the count**: The problem asks for the **number** of subarrays, not the subarrays themselves.
7. **Overflow concerns**: Values are small enough that JavaScript's safe integer range is never at risk (`2 * 10^4 * 1000 = 2 * 10^7`).
