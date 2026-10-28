# Longest Subarray with Sum K - GeeksforGeeks

## Problem Description

Given an array `arr[]` of integers (which may be positive, negative, or zero) and an integer `k`, find the **length of the longest contiguous subarray** whose elements sum to exactly `k`.

If no such subarray exists, return `0`.

The method signature used in this repository is `longestSubarray(arr, k)`.

## Examples

### Example 1:

```
Input: arr[] = [10, 5, 2, 7, 1, -10], k = 15
Output: 6
```

**Explanation:** The subarrays that sum to `15` are:

- `[5, 2, 7, 1]` — length 4
- `[10, 5]` — length 2
- `[10, 5, 2, 7, 1, -10]` — length 6

The whole array is the longest, so the answer is `6`.

### Example 2:

```
Input: arr[] = [-5, 8, -14, 2, 4, 12], k = -5
Output: 5
```

**Explanation:** The valid subarrays are `[-5]` (length 1) and `[-5, 8, -14, 2, 4]` (length 5). Negative values mean a longer subarray can have a smaller sum.

### Example 3:

```
Input: arr[] = [10, -10, 20, 30], k = 5
Output: 0
```

**Explanation:** No contiguous subarray sums to `5`, so the answer is `0`.

### Example 4:

```
Input: arr[] = [1, -1, 0], k = 0
Output: 3
```

**Explanation:** The whole array sums to `0`. The subarrays `[1, -1]`, `[0]`, and `[1, -1, 0]` also sum to `0`, but the whole array is longest.

## Constraints

- `1 <= arr.size() <= 10^5`
- `-10^4 <= arr[i] <= 10^4`
- `-10^9 <= k <= 10^9`

The prefix sums fit comfortably in JavaScript's safe integer range: at most `10^5 * 10^4 = 10^9`.

## Topics

- Array
- Hash Table
- Prefix Sum

## Company Tags

- Amazon

## Solution Approaches

### 1. Brute Force with Running Sum

**Intuition**: Fix the start of a subarray and extend its end one element at a time, maintaining the running sum. Whenever the sum equals `k`, record the length.

**Algorithm**:
1. For every start index `i` from `0` to `n - 1`:
   - Set `sum = 0`.
   - For every end index `j` from `i` to `n - 1`:
     - `sum += arr[j]`.
     - If `sum === k`, update `maxLength = max(maxLength, j - i + 1)`.
2. Return `maxLength`.

**Time Complexity**: `O(n^2)` — there are `n(n + 1) / 2` subarrays.
**Space Complexity**: `O(1)`.

At `n = 10^5`, that is about five billion subarrays, so this approach is far too slow for the maximum input.

### 2. Prefix Sum + Hash Map (Implemented)

**Intuition**: Let `P[i]` be the sum of the first `i` elements, with `P[0] = 0`. The sum of the subarray from index `i` to index `j` is:

```
P[j + 1] - P[i] = k
```

Rearranging gives:

```
P[i] = P[j + 1] - k
```

While scanning the array, maintain the **first index** at which each prefix sum was seen. At the current index, if `prefixSum - k` has been seen before, the elements between that earlier position and the current position sum to `k`. The earliest occurrence gives the longest such subarray ending here.

**Algorithm**:
1. Create `diffMap` and seed it with `0 -> -1`. The prefix sum `0` is considered to occur just before index `0`; storing `-1` makes the length formula work for subarrays that start at index `0`.
2. Set `prefixSum = 0` and `maxLength = 0`.
3. For each `(idx, item)` in `arr`:
   - `prefixSum += item`.
   - `diff = prefixSum - k`.
   - If `diffMap` contains `diff`, the subarray between `diffMap.get(diff) + 1` and `idx` sums to `k`. Update `maxLength` with `idx - diffMap.get(diff)`.
   - If `prefixSum` has **not** been seen before, store `prefixSum -> idx`. If it has been seen, keep the earlier index, because the earlier index produces a longer subarray.
4. Return `maxLength`.

**Time Complexity**: `O(n)` — one pass with average `O(1)` hash-map operations.
**Space Complexity**: `O(n)` — the map stores at most one entry per distinct prefix sum.

This is the approach used in `submission-0.js`.

### 3. Sliding Window (Only for Non-Negative Arrays)

**Intuition**: If every element were non-negative, the window sum would grow when the right pointer moves and shrink when the left pointer moves. That monotonicity allows a two-pointer window to find the longest window summing to `k`.

**Algorithm**:
1. Start with `left = 0`, `sum = 0`.
2. Move `right` from `0` to `n - 1`, adding `arr[right]` to `sum`.
3. While `sum > k`, subtract `arr[left]` and increment `left`.
4. If `sum === k`, update the best length.
5. Return the best length.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(1)`.

**This approach is not correct for the given constraints.** With negative numbers, increasing the window can decrease the sum, so the algorithm cannot know whether to move `left` or keep extending `right`. For example, with `arr = [10, 5, 2, 7, 1, -10]` and `k = 15`, a sliding window shrinks after the sum exceeds `15` and moves `left` past index `0`. It can still find `[5, 2, 7, 1]` (length 4), but it can never recover the length-6 whole array. Sliding window is included only as a contrast for the special case where all values are non-negative.

## Visual Explanation

```
arr = [10, 5, 2, 7, 1, -10], k = 15

Prefix sums (P[0] = 0 before index 0):
  index:        -1   0    1    2    3    4     5
  value:         -   10   5    2    7    1    -10
  prefixSum:     0   10   15   17   24   25    15

At idx 1: prefixSum = 15, diff = 0
  diffMap has 0 -> -1
  length = 1 - (-1) = 2
  subarray [0..1] = [10, 5]

At idx 4: prefixSum = 25, diff = 10
  diffMap has 10 -> 0
  length = 4 - 0 = 4
  subarray [1..4] = [5, 2, 7, 1]

At idx 5: prefixSum = 15, diff = 0
  diffMap has 0 -> -1
  length = 5 - (-1) = 6
  subarray [0..5] = [10, 5, 2, 7, 1, -10]

Answer: 6
```

The key detail is that `diffMap` stores the **first** index for each prefix sum. At `idx 5`, the prefix sum `15` was already stored at index `1`, but overwriting it would produce length `5 - 1 = 4` instead of the correct `6`.

## Common Pitfalls

1. **Forgetting the `0 -> -1` seed**: without it, subarrays that begin at index `0` are never measured. For example, `[10, 5]` with `k = 15` would return `0` instead of `2`.
2. **Overwriting an existing prefix sum**: always keep the earliest index. A later duplicate prefix sum can only produce a shorter subarray.
3. **Checking the map after inserting the current prefix**: look up `diff` before storing `prefixSum`, otherwise a zero-length subarray could be considered when `k = 0`.
4. **Using a sliding window with negative numbers**: the sum is not monotonic, so the two-pointer logic can skip valid subarrays.
5. **Using the wrong length formula**: with the seed `-1`, the length is `idx - firstIndex`, not `idx - firstIndex + 1`.
6. **Assuming `k` is positive**: `k` can be negative. The prefix-sum difference works for any integer, but code that initializes or compares against `0` incorrectly will fail.
7. **Returning the subarray instead of its length**: the problem asks for the length only, so no reconstruction is required.
8. **Treating `0` as "not found"**: use `Map.has()` before `Map.get()`; a stored index of `0` is a valid result and is falsy in JavaScript.
