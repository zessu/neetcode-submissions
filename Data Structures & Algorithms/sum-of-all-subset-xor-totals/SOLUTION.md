# Sum of All Subset XOR Totals - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    subsetXORSum(nums: number[]): number {

        const recurr = (i: number, total: number) => {
            if(i === nums.length) return total;

            return recurr(i+1, total) + recurr(i+1, total ^ nums[i]);
        }


        return recurr(0, 0);
    }
}
```

> `submission-0.ts` is the full submission and the code above matches it.

## Approach

The solution is a **depth-first traversal of the subset decision tree**.

1. **State**: `(i, total)` where `i` is the next index to decide on and `total` is the XOR of the elements chosen so far.
2. **Base case**: when `i === nums.length`, every index has been decided, so the current subset is complete. Its contribution to the answer is exactly `total`. Return it.
3. **Transition**: index `i` has two mutually exclusive outcomes:
   - **Exclude** `nums[i]`: the XOR is unchanged, so recurse with `(i + 1, total)`.
   - **Include** `nums[i]`: XOR it in, so recurse with `(i + 1, total ^ nums[i])`.
4. **Combine**: the two branches lead to disjoint sets of subsets (one where `nums[i]` is absent, one where it is present), so the totals add:
   `recurr(i, total) = recurr(i + 1, total) + recurr(i + 1, total ^ nums[i])`.
5. The initial call is `recurr(0, 0)` — no elements decided and an empty XOR.

The recursion never explicitly builds a subset array. The subset exists only as the path from the root to the current node, and the running XOR carries all the information needed at the leaf.

- **Time Complexity**: `O(2^n)` — the recursion tree is a full binary tree of depth `n`. It has `2^n` leaves (one per subset) and `2^(n+1) - 1` nodes, and each node performs `O(1)` work.
- **Space Complexity**: `O(n)` — the recursion stack is at most `n + 1` frames deep. No auxiliary arrays or maps are allocated.

## Walkthrough

### Example: `nums = [1, 3]`

```
recurr(0, 0)
├── exclude 1 -> recurr(1, 0)
│   ├── exclude 3 -> recurr(2, 0) = 0    subset []
│   └── include 3 -> recurr(2, 3) = 3    subset [3]
│   => 0 + 3 = 3
└── include 1 -> recurr(1, 1)
    ├── exclude 3 -> recurr(2, 1) = 1    subset [1]
    └── include 3 -> recurr(2, 2) = 2    subset [1, 3]
    => 1 + 2 = 3

Answer: 3 + 3 = 6
```

| Path decision | Subset | XOR |
| :--- | :--- | :--- |
| exclude, exclude | `[]` | `0` |
| exclude, include | `[3]` | `3` |
| include, exclude | `[1]` | `1` |
| include, include | `[1, 3]` | `1 ^ 3 = 2` |

Sum: `0 + 3 + 1 + 2 = 6`.

Notice that the recursion computes the sum from the bottom up: each internal node returns the sum of its two children, so `recurr(0, 0)` is the final answer without any accumulator variable.

### Example: `nums = [5, 1, 6]`

There are `2^3 = 8` leaves. Their XOR values are:

| Subset | XOR |
| :--- | :--- |
| `[]` | `0` |
| `[5]` | `5` |
| `[1]` | `1` |
| `[6]` | `6` |
| `[5, 1]` | `4` |
| `[5, 6]` | `3` |
| `[1, 6]` | `7` |
| `[5, 1, 6]` | `2` |

Sum: `0 + 5 + 1 + 6 + 4 + 3 + 7 + 2 = 28`.

### Example: `nums = [3, 4, 5, 6, 7, 8]`

The DFS visits `2^6 = 64` leaves and returns `480`. The `O(n)` alternative explains the same number much more quickly: the OR of all elements is `3 | 4 | 5 | 6 | 7 | 8 = 15`, and `15 * 2^5 = 480`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **DFS include/exclude (implemented)** | `O(2^n)` | `O(n)` stack | The cleanest direct encoding of "every subset is a sequence of include/exclude decisions." No extra memory, and the code is five lines. |
| **Bitmask enumeration** | `O(n * 2^n)` | `O(1)` | Also direct and it makes the subset index explicit. It requires a nested loop to build each XOR and is slightly slower by a factor of `n`, but it is a great independent correctness check. |
| **DFS with memoization** | `O(n * 2^b)` worst case | `O(n * 2^b)` cache | Almost no states repeat for this input distribution, so the map overhead makes it slower than plain DFS. It is the right idea for many DP problems, but not for this one. |
| **Bitwise OR shortcut** | `O(n)` | `O(1)` | The mathematically optimal solution: `OR(nums) << (n - 1)`. It is dramatically faster and very short, but it relies on a combinatorial argument that is easy to get wrong under pressure. |

**Why the DFS is preferred for this submission**: it follows the definition of "all subsets" literally, it is impossible to get subtly wrong, and `n <= 12` caps the work at `4096` leaves. It also generalizes: if the operation were something other than XOR, only the combine step would change.

**When an alternative wins**:
- Use the **bitmask enumeration** when you want to inspect or store individual subsets, or when you need an iterative solution.
- Use the **OR shortcut** when `n` is large or when the problem is specifically about XOR totals. It is the answer an interviewer is usually fishing for after the brute force.
- Avoid **memoization** here unless the problem's operation creates many duplicate states; for plain XOR on small arrays it is overhead without benefit.

## Key Insights

1. **Each subset corresponds to exactly one root-to-leaf path.** The binary tree structure is the definition of the power set in disguise.
2. **The running XOR is all the state you need.** You do not need to track which elements were chosen, only their XOR.
3. **The empty subset contributes `0`.** It is included automatically by the all-exclude path, and it does not affect the sum.
4. **The branches are disjoint, so their sums add.** Every subset either contains `nums[i]` or does not; there is no double counting.
5. **`n <= 12` makes exponential feasible.** `2^12 = 4096` leaves is trivial. If the constraint were `n = 30`, the DFS would be hopeless and the OR trick would be required.
6. **The `O(n)` shortcut works bit by bit.** For each bit, if any element has it set, exactly half of all subsets have an odd number of that bit, contributing `2^(n-1)` copies of the bit's value. Summing over bits gives `OR(nums) * 2^(n-1)`.
7. **Duplicates are counted as distinct positions.** `[1, 1]` has four subsets, and the recursion correctly produces four leaves. Do not deduplicate the input.
