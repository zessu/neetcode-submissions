# Longest Subarray with Sum K - Solution

## Solution Code

```javascript
/**
 * @param {number[]} arr
 * @param {number} k
 * @returns {number}
 */
class Solution {
    longestSubarray(arr, k) {
        let prefixSum = 0;
        let maxLength = 0;
        const diffMap = new Map();
        diffMap.set(0, -1);

        for (const [idx, item] of arr.entries()) {
            prefixSum += item;
            const diff = prefixSum - k;

            if (diffMap.has(diff)) {
                maxLength = Math.max(maxLength, idx - diffMap.get(diff));
            }

            if (!diffMap.has(prefixSum)) {
                diffMap.set(prefixSum, idx);
            }
        }

        return maxLength;
    }
}
```

> `submission-0.js` contains the same implementation with the original inline comments and a compact `!diffMap.has(...) && ...` guard. The code above is behaviorally identical.

## Approach

The solution uses **prefix sums with a hash map** to find the longest subarray summing to `k` in a single pass.

1. **Prefix sum identity**: let `prefixSum` be the sum of `arr[0..idx]`. For a subarray `arr[i..idx]` to sum to `k`:

   ```
   prefixSum - P[i - 1] = k
   P[i - 1] = prefixSum - k
   ```

   where `P[i - 1]` is the prefix sum immediately before the subarray starts.

2. **Seed the map**: `diffMap.set(0, -1)` records that the empty prefix (sum `0`) occurs before index `0`. This handles subarrays that start at the first element. If the current `prefixSum - k` is `0`, the subarray runs from index `0` through `idx`, and its length is `idx - (-1) = idx + 1`.

3. **Scan once**:
   - Add the current element to `prefixSum`.
   - Compute `diff = prefixSum - k`.
   - If `diffMap` contains `diff`, a previous prefix sum equal to `prefixSum - k` exists. The elements after that prefix and up to the current index sum to `k`. The length is `idx - firstIndex`.
   - Update `maxLength` with that length.

4. **Store only the first occurrence**: if `prefixSum` is not already in the map, store the current index. If it is already present, keep the earlier index. A later duplicate prefix sum would only create a shorter subarray for the same future endpoint.

5. **Return `maxLength`**. If no valid subarray exists, it remains `0`.

The order of operations matters: the lookup happens **before** inserting the current prefix sum. This ensures the subarray is non-empty. When `k = 0`, inserting first would pair the current prefix with itself and count a zero-length subarray.

- **Time Complexity**: `O(n)` — one pass over `arr`, with average `O(1)` `Map` lookups and insertions.
- **Space Complexity**: `O(n)` — the map holds at most one entry per distinct prefix sum, and there are at most `n + 1` prefixes.

## Walkthrough

### Example 1: `arr = [10, 5, 2, 7, 1, -10]`, `k = 15`

Initial state: `prefixSum = 0`, `maxLength = 0`, `diffMap = {0: -1}`.

| `idx` | `item` | `prefixSum` | `diff = prefixSum - k` | Map hit? | Length | `maxLength` | Map after step |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | 10 | 10 | -5 | no | — | 0 | `{0:-1, 10:0}` |
| 1 | 5 | 15 | 0 | yes, index -1 | 2 | 2 | `{0:-1, 10:0, 15:1}` |
| 2 | 2 | 17 | 2 | no | — | 2 | `{0:-1, 10:0, 15:1, 17:2}` |
| 3 | 7 | 24 | 9 | no | — | 2 | `{0:-1, 10:0, 15:1, 17:2, 24:3}` |
| 4 | 1 | 25 | 10 | yes, index 0 | 4 | 4 | `{0:-1, 10:0, 15:1, 17:2, 24:3, 25:4}` |
| 5 | -10 | 15 | 0 | yes, index -1 | 6 | 6 | unchanged (`15` already stored at 1) |

At `idx 1`, the subarray is `[10, 5]` (indices `0..1`). At `idx 4`, it is `[5, 2, 7, 1]` (indices `1..4`). At `idx 5`, it is the entire array (indices `0..5`). The answer is **6**.

The final step is the important one: `prefixSum = 15` already existed at index `1`, but the map is not overwritten. Keeping `0 -> -1` for the matching `diff` is what allows the length-6 subarray to be found.

### Example 2: `arr = [-5, 8, -14, 2, 4, 12]`, `k = -5`

| `idx` | `item` | `prefixSum` | `diff` | Map hit? | Length | `maxLength` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | -5 | -5 | 0 | yes, -1 | 1 | 1 |
| 1 | 8 | 3 | 8 | no | — | 1 |
| 2 | -14 | -11 | -6 | no | — | 1 |
| 3 | 2 | -9 | -4 | no | — | 1 |
| 4 | 4 | -5 | 0 | yes, -1 | 5 | 5 |
| 5 | 12 | 7 | 12 | no | — | 5 |

At `idx 0`, `[-5]` has length 1. At `idx 4`, the prefix sum returns to `-5`, so the whole subarray `[-5, 8, -14, 2, 4]` has sum `-5` and length 5. The answer is **5**.

### Example 3: `arr = [10, -10, 20, 30]`, `k = 5`

The prefix sums are `10, 0, 20, 50`. The differences `prefixSum - 5` are `5, -5, 15, 45`, and none of them appears in the map. `maxLength` stays `0`, which is the required answer when no subarray sums to `k`.

### Example 4: `arr = [1, -1, 0]`, `k = 0`

| `idx` | `item` | `prefixSum` | `diff` | Map hit? | Length | `maxLength` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | 1 | 1 | 1 | no | — | 0 |
| 1 | -1 | 0 | 0 | yes, -1 | 2 | 2 |
| 2 | 0 | 0 | 0 | yes, -1 | 3 | 3 |

Because the first occurrence of prefix sum `0` is the seed `-1`, the length-3 whole-array subarray is measured correctly. The later prefix sum `0` at index `1` is not stored, since doing so would only shorten future matches.

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Prefix sum + hash map (implemented)** | `O(n)` | `O(n)` | Optimal for arbitrary integers. One pass, handles negative values, zeros, duplicate prefix sums, and negative `k`. The map stores first occurrences, which is exactly what maximizes length. |
| **Brute force with running sum** | `O(n^2)` | `O(1)` | Simple and memory-free, but at `n = 10^5` there are about five billion subarrays. It is only reasonable for very small inputs or as a correctness baseline. |
| **Brute force with full summation** | `O(n^3)` | `O(1)` | Adds an inner summation loop on top of the quadratic enumeration. Strictly worse than the running-sum version. |
| **Sliding window** | `O(n)` *only for non-negative arrays* | `O(1)` | Would be optimal if every element were non-negative, because the sum would be monotonic as the window grows and shrinks. With negatives, the monotonicity is gone, so the two-pointer logic can skip valid subarrays. |

**Why the implemented approach is preferred**: the problem allows negative values, which rules out sliding window. The prefix-sum identity turns the search into a single lookup per index, and storing the earliest index for each prefix sum guarantees the longest subarray for every endpoint. The result is `O(n)` time and `O(n)` space.

**When an alternative wins**: use the **running-sum brute force** when `n` is tiny or extra memory is forbidden. Use the **sliding window** only if the input is guaranteed non-negative — a common variant of this problem — where it achieves `O(n)` time with `O(1)` space. For the stated constraints, neither beats the hash-map solution on correctness and speed.

## Key Insights

1. **Subarray sum becomes a difference of prefixes**: `sum(arr[i..j]) = P[j + 1] - P[i]`. This is the transformation that makes a linear scan possible.
2. **Store indices, not counts**: unlike the "count subarrays" version of this problem, only the length matters. The first occurrence of each prefix sum is the only one that can produce a maximum-length subarray.
3. **Seed `0 -> -1`**: the empty prefix before index `0` is essential for subarrays that start at the first element.
4. **Look up before inserting**: this prevents zero-length subarrays and keeps the scan correct when `k = 0`.
5. **Negative values break sliding window**: the window sum is not monotonic, so the two-pointer approach is not a valid substitute for the hash map.
6. **The map has at most `n + 1` entries**: even though prefix sums can be as large as `10^9` in magnitude, there are only `n + 1` prefix positions.
