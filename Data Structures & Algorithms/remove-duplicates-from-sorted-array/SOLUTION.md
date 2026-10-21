# Remove Duplicates from Sorted Array - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    removeDuplicates(nums: number[]): number {
        const myset = [...new Set(nums)].sort((a,b) => a - b);
        for(let count=0; count < myset.length; count++) {
            nums[count] = myset[count];
        }

        return myset.length;
    }
}
```

## Approach

The implemented solution is **"deduplicate with a `Set`, sort, copy the prefix back"**.

1. **Build a `Set` from the array.** `new Set(nums)` keeps one copy of each value. JavaScript sets preserve **insertion order**, so the set's iteration order is the order in which each distinct value first appeared in `nums`.
2. **Spread into an array.** `[...new Set(nums)]` materializes those unique values as a normal array.
3. **Sort numerically.** `.sort((a, b) => a - b)` guarantees non-decreasing order with the required comparator. Because the input is already sorted, the spread was already ordered — the sort is a redundant safety net here, not a correctness requirement. Removing it would make the approach `O(n)`.
4. **Write the prefix back into `nums`.** The loop copies every unique value into `nums[0..k-1]`. Elements after `k - 1` are left as they were; the judge ignores them.
5. **Return `myset.length`.** That is exactly the number of unique values, i.e. `k`.

Correctness: the first `k` cells receive precisely the distinct values of `nums`, in non-decreasing order. That matches what the judge compares against. The original array is mutated in place, satisfying the in-place requirement, even though extra memory is used temporarily.

- **Time Complexity**: `O(n log n)` as written — building the set is `O(n)` average, the sort dominates. Without the redundant sort it is `O(n)`.
- **Space Complexity**: `O(n)` — the set plus the spread array each hold up to `n` values.

## Walkthrough

### Example 2: `nums = [0,0,1,1,1,2,2,3,3,4]`

**Step 1 — `new Set(nums)`**

| Value read | Set contents (insertion order) |
| :--- | :--- |
| `0` | `{0}` |
| `0` | `{0}` (already present) |
| `1` | `{0, 1}` |
| `1`, `1` | `{0, 1}` |
| `2` | `{0, 1, 2}` |
| `2` | `{0, 1, 2}` |
| `3` | `{0, 1, 2, 3}` |
| `3` | `{0, 1, 2, 3}` |
| `4` | `{0, 1, 2, 3, 4}` |

**Step 2 — spread and sort**: `[0, 1, 2, 3, 4]` (already sorted; the numeric sort is a no-op).

**Step 3 — copy back**

| `count` | `nums[count] = myset[count]` | `nums` after the write |
| :--- | :--- | :--- |
| 0 | `nums[0] = 0` | `[0,0,1,1,1,2,2,3,3,4]` |
| 1 | `nums[1] = 1` | `[0,1,1,1,1,2,2,3,3,4]` |
| 2 | `nums[2] = 2` | `[0,1,2,1,1,2,2,3,3,4]` |
| 3 | `nums[3] = 3` | `[0,1,2,3,1,2,2,3,3,4]` |
| 4 | `nums[4] = 4` | `[0,1,2,3,4,2,2,3,3,4]` |

**Return `5`**. The judge checks `nums[0..4] === [0,1,2,3,4]`, which passes. The stale `2,2,3,3,4` in the tail is never examined.

### Example 1: `nums = [1,1,2]`

`Set` = `{1, 2}` (first `1` inserted, second ignored, then `2`), spread → `[1,2]`, sort is a no-op, write-back gives `[1,2,2]`. Return `2`.

### Example 3: `nums = [1,1,1]`

`Set` = `{1}`, spread → `[1]`, write `nums[0] = 1`, return `1`. The array is unchanged and the tail is ignored.

## Comparison with the Alternatives

| Approach | Time | Space | Why it loses / wins |
| :--- | :--- | :--- | :--- |
| **Set + sort + copy (implemented)** | `O(n log n)` | `O(n)` | Wins on brevity and on not relying on the sorted-input property for deduplication. Loses on memory and on the unnecessary sort; also allocates two intermediate structures. |
| Two pointers (read/write) | `O(n)` | `O(1)` | Strictly better: one pass, no allocation, and it exploits the one guarantee the problem gives — the input is sorted. Slightly more index reasoning. |
| Repeated `splice` | `O(n^2)` | `O(1)` | No allocation, but each deletion shifts the tail; quadratic and easy to get wrong while iterating. |
| New array + copy back | `O(n)` | `O(n)` | Same idea as the implementation without the sort; still allocates, so it loses to two pointers on space. |

**Why the implemented approach is acceptable.** At `n <= 3 * 10^4`, `n log n` is roughly 450,000 comparisons — trivial. The code is short, obviously correct, and does not depend on subtle pointer arithmetic. It also handles a hypothetically unsorted input correctly (thanks to the sort), which the two-pointer version would not.

**When an alternative wins.**

- **Choose two pointers** in an interview or for large inputs. It achieves the theoretical optimum `O(n)` time and `O(1)` space and uses the sortedness that the problem guarantees. It is the answer the problem is designed to elicit.
- **Choose the new-array variant** when allocation is cheap but sorting is not, or when you want an explicitly order-preserving one-pass dedupe.
- **Avoid repeated `splice`** unless the array is tiny; the quadratic shifting is a trap, and the index bookkeeping around deletions is error-prone.
- **Never sort without a comparator** if you keep the sort: the default string order breaks multi-digit and negative values, both of which are allowed by the constraints (`-100 .. 100`).

## Key Insights

1. **The input is sorted, so duplicates are adjacent.** That single fact enables the `O(1)`-space two-pointer solution, and it also means a `Set`'s insertion order is already sorted.
2. **`Set` preserves insertion order.** `[...new Set(nums)]` is not arbitrary — it keeps the first occurrence order. Because the input is non-decreasing, the result is already in the required order, which is why the `.sort()` is redundant.
3. **`k` is a logical length, not an array length.** JavaScript arrays cannot shrink without `length = k` or `splice`; the contract only cares about the first `k` cells, so leaving stale values is correct and cheaper.
4. **Sorting cannot fix a missing write-back.** The in-place requirement is about where the answer lives (`nums`), not about whether you sorted.
5. **The comparator is load-bearing.** `(a, b) => a - b` is correct for the full range `-100..100`; the default comparator is a string comparison and would misorder e.g. `-1` and `-2`.
