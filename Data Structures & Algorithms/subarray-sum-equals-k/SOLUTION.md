# Subarray Sum Equals K - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {number[]} nums
     * @param {number} k
     * @return {number}
     */
    subarraySum(nums: number[], k: number): number {
        let sum= 0;
        let result = 0;
        const hashMap = new Map<number, number>();
        hashMap.set(0, 1);

        for(const num of nums) {
            sum += num;
            const diff = sum - k;
            const occurence = hashMap.get(diff) || 0;
            result += occurence;
            hashMap.set(sum, (hashMap.get(sum) || 0) + 1);
        }
        return result;
    }
}
```

## Approach

The solution uses **prefix sums with a hash map** to count qualifying subarrays in a single pass.

1. **Define the running prefix sum**: after processing `nums[0..j]`, `sum` equals `P[j + 1]`, the sum of the first `j + 1` elements.
2. **Seed the map with `0 -> 1`**: the prefix sum `0` occurs once before any element is read. It represents the empty prefix, and it is what allows a subarray starting at index `0` to be counted. Without it, subarrays whose sum is exactly `k` from the start would be missed.
3. **For each element**:
   - Add it to `sum`.
   - `diff = sum - k` is the prefix sum that must have appeared earlier for the subarray between that earlier position and the current one to sum to `k`.
   - `hashMap.get(diff) || 0` gives how many earlier prefixes had that value. Each one corresponds to a distinct valid subarray ending here, so add that count to `result`.
   - Record the current prefix sum: `hashMap.set(sum, (hashMap.get(sum) || 0) + 1)`. The increment (rather than a plain set to 1) is essential because the same prefix sum can occur multiple times.
4. **Return `result`** after the loop.

The map is updated **after** the lookup. This ordering ensures we only pair the current prefix with strictly earlier prefixes, so every counted subarray is non-empty.

- **Time Complexity**: `O(n)` — one pass over `nums`, with average `O(1)` `Map` get/set operations.
- **Space Complexity**: `O(n)` — in the worst case every prefix sum is distinct, so the map holds up to `n + 1` entries.

## Walkthrough

### Example 1: `nums = [1,1,1]`, `k = 2`

Initial state: `sum = 0`, `result = 0`, `hashMap = {0: 1}`.

| Step | `num` | `sum` | `diff = sum - k` | `map[diff]` | `result` | Map after update |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | 1 | -1 | 0 | 0 | `{0:1, 1:1}` |
| 2 | 1 | 2 | 0 | 1 | 1 | `{0:1, 1:1, 2:1}` |
| 3 | 1 | 3 | 1 | 1 | 2 | `{0:1, 1:1, 2:1, 3:1}` |

- At step 2, `sum = 2` and `diff = 0`. The prefix `0` was seen once (before the array), so `nums[0..1] = [1,1]` is a valid subarray.
- At step 3, `sum = 3` and `diff = 1`. The prefix `1` was seen once (after index `0`), so `nums[1..2] = [1,1]` is valid.

**Result:** `2`.

### Example 2: `nums = [1,2,3]`, `k = 3`

| Step | `num` | `sum` | `diff` | `map[diff]` | `result` | Map after update |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | 1 | -2 | 0 | 0 | `{0:1, 1:1}` |
| 2 | 2 | 3 | 0 | 1 | 1 | `{0:1, 1:1, 3:1}` |
| 3 | 3 | 6 | 3 | 1 | 2 | `{0:1, 1:1, 3:1, 6:1}` |

- Step 2: prefix `0` exists, so `[1,2]` counts.
- Step 3: prefix `3` exists (after index `1`), so `[3]` counts.

**Result:** `2`.

### Example 3: `nums = [1,-1,0]`, `k = 0`

| Step | `num` | `sum` | `diff` | `map[diff]` | `result` | Map after update |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | 1 | 1 | 0 | 0 | `{0:1, 1:1}` |
| 2 | -1 | 0 | 0 | 1 | 1 | `{0:2, 1:1}` |
| 3 | 0 | 0 | 0 | 2 | 3 | `{0:3, 1:1}` |

Step 2 counts `[1,-1]`. Step 3 sees prefix `0` twice: once from the empty prefix (giving `[1,-1,0]`) and once from the prefix ending at index `1` (giving `[0]`). This is exactly why the map stores **counts**, not just presence.

**Result:** `3`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Prefix Sum + Hash Map (implemented)** | `O(n)` | `O(n)` | Optimal time. One pass, handles negative numbers, duplicates, and zeroes. The map's counts correctly handle repeated prefix sums. |
| Brute Force + Running Sum | `O(n^2)` | `O(1)` | No extra memory and very simple, but about `2 * 10^8` subarrays at the maximum input size. Too slow in JavaScript. |
| Brute Force (recompute sums) | `O(n^3)` | `O(1)` | Only useful as a baseline; the triple loop is hopeless for `n = 2 * 10^4`. |
| Prefix Sum Array | `O(n^2)` | `O(n)` | The pair-checking loop is still quadratic, but it exposes the identity `P[j] - P[i] = k` that motivates the hash map. |
| Sliding Window | Not correct | `O(1)` | With negatives, growing or shrinking the window does not move the sum monotonically, so the pointer logic can skip valid subarrays. |

**Why the implemented approach is preferred:** it is the only approach that reaches `O(n)` time while remaining correct for arbitrary integers. It exploits the fact that the condition `P[j] - P[i] = k` is equivalent to a lookup of `P[j] - k` in a history of prefix sums. The `Map` gives average `O(1)` lookup, so the whole scan is linear.

**When an alternative wins:**
- **Running-sum brute force** wins when `n` is small (a few hundred) or when the environment forbids extra memory. It is also easier to explain in a first pass.
- **Prefix sum array** wins when you also need to answer range-sum queries later, or when you want to avoid hashing overhead. The `O(n)` array can be reused.
- **Sliding window** would win if all values were guaranteed non-negative, because the sum would be monotonic in the window size. That guarantee is absent here, which is the trap in this problem.

## Key Insights

1. **Subarray sum becomes a difference of prefixes**: `sum(nums[i..j]) = P[j + 1] - P[i]`. This is the single transformation that makes the problem tractable.
2. **Counts, not just membership**: the same prefix sum can occur many times, and each occurrence is a different valid starting point. Storing frequencies is what makes duplicate and zero-containing inputs work.
3. **The `0 -> 1` seed is not a hack**: it represents the empty prefix before index `0`. It is the only way to count subarrays that begin at the first element.
4. **Order matters**: look up `diff` first, then insert the current `sum`. Reversing the order would allow zero-length subarrays and overcount when `k = 0`.
5. **Negative numbers are the reason this is not a sliding-window problem**: the running sum is not monotonic, so a window that is too large cannot be repaired by moving the left pointer alone.
6. **The map size is bounded by `n + 1`**: even though sums can range up to `2 * 10^7`, there are only `n + 1` prefix positions, so the map never stores more than that many distinct keys.
