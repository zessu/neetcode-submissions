# Sum of All Subset XOR Totals - LeetCode 1863

## Problem Description

The **XOR total** of an array is defined as the bitwise XOR of all of its elements, or `0` if the array is empty.

Given an integer array `nums`, return the **sum of all XOR totals** over every subset of `nums`.

A subset is any selection of elements at positions `0..n-1`, where each position is either included or excluded. There are `2^n` subsets, including the empty subset and the full array.

## Examples

### Example 1:

```
Input: nums = [1, 3]
Output: 6
```

**Explanation:** The four subsets are:
- `[]` → XOR `0`
- `[1]` → `1`
- `[3]` → `3`
- `[1, 3]` → `1 ^ 3 = 2`

Sum: `0 + 1 + 3 + 2 = 6`.

### Example 2:

```
Input: nums = [5, 1, 6]
Output: 28
```

**Explanation:** The eight subset XORs are `0, 5, 1, 6, 4, 3, 7, 2`, which sum to `28`.

### Example 3:

```
Input: nums = [3, 4, 5, 6, 7, 8]
Output: 480
```

**Explanation:** The bitwise OR of all elements is `15`, and `15 * 2^(6 - 1) = 15 * 32 = 480`. This is the shortcut described in Approach 4.

## Constraints

- `1 <= nums.length <= 12`
- `1 <= nums[i] <= 20`
- The answer fits in a 32-bit signed integer for the given constraints.

## Topics

- Array
- Math
- Backtracking
- Bit Manipulation
- Recursion
- Combinatorics

## Solution Approaches

### 1. Enumerate Subsets with a Bitmask

**Intuition**: With `n <= 12` there are at most `2^12 = 4096` subsets. Represent each subset by an `n`-bit number: bit `j` set means `nums[j]` is included.

**Algorithm**:
1. `total = 0`.
2. For `mask` from `0` to `2^n - 1`:
   - `xor = 0`.
   - For each bit `j` from `0` to `n - 1`: if `mask & (1 << j)`, then `xor ^= nums[j]`.
   - `total += xor`.
3. Return `total`.

**Time Complexity**: `O(n * 2^n)` — `2^n` subsets, each taking `O(n)` to build.
**Space Complexity**: `O(1)` extra.

This is the most direct translation of the definition and a good correctness check for the other approaches.

### 2. DFS Include/Exclude Recursion (Implemented)

**Intuition**: Walk the array once. At each index you make a binary decision: leave the element out, or include it by XOR-ing it into a running total. Every root-to-leaf path is one subset.

**Algorithm**:
1. `recurr(i, total)`:
   - If `i === nums.length`, the subset is complete — return `total`.
   - Otherwise return the sum of both branches:
     - exclude: `recurr(i + 1, total)`
     - include: `recurr(i + 1, total ^ nums[i])`
2. Return `recurr(0, 0)`.

**Time Complexity**: `O(2^n)` — the recursion tree has `2^n` leaves and `2^(n+1) - 1` nodes. Each node does `O(1)` work.
**Space Complexity**: `O(n)` recursion depth; no extra data structure.

This is the approach in `submission-0.ts`. It enumerates subsets implicitly, so no bitmasks or arrays are needed, and the running XOR is passed down the call stack.

### 3. DFS + Memoization

**Intuition**: The state is `(i, total)`. Different include/exclude paths can arrive at the same index with the same running XOR, so those states could be cached.

**Algorithm**:
1. Use a `Map` keyed by `` `${i}:${total}` ``.
2. Apply the same two-branch recurrence, returning the cached result when the key exists.

**Time Complexity**: `O(n * 2^b)` in the worst case, where `b` is the number of distinct bit patterns reachable — still exponential in `n`.
**Space Complexity**: `O(n * 2^b)` for the cache plus `O(n)` stack.

In practice this is **slower** than plain DFS for this problem: the number of distinct `total` values grows with the subset count, so few states repeat, and the map overhead dominates. It is included because it is the natural next idea, and it is worth recognizing that memoization does not help every exponential recursion.

### 4. Bitwise OR Shortcut (Optimal)

**Intuition**: Look at one bit position `b` independently. If **no** element has bit `b` set, then no subset XOR can have bit `b` set. If **at least one** element has bit `b` set, then exactly **half** of all `2^n` subsets produce an XOR with bit `b` set.

Why half? Fix all other elements arbitrarily (`2^(n-1)` choices). The XOR of those fixed choices has some bit `b` value. Flipping the inclusion of the special element flips bit `b`, so the two choices pair up — one gives `0`, the other gives `1`. Exactly half of the subsets therefore contribute `2^b`.

**Algorithm**:
1. Compute `orAll = nums[0] | nums[1] | ... | nums[n - 1]`.
2. Return `orAll * 2^(n - 1)`, equivalently `orAll << (n - 1)`.

**Time Complexity**: `O(n)` — one pass to compute the OR.
**Space Complexity**: `O(1)`.

For `nums = [1, 3]`: `orAll = 3`, `n - 1 = 1`, so the answer is `3 * 2 = 6`. For `[5, 1, 6]`: `orAll = 7`, `n - 1 = 2`, so the answer is `7 * 4 = 28`.

## Visual Explanation

```
nums = [1, 3]

Subset tree (left = exclude, right = include):

                       recurr(0, 0)
                      /            \
              recurr(1, 0)      recurr(1, 1)
               /       \          /       \
        (2, 0)       (2, 3)   (2, 1)    (2, 2)
          |            |         |         |
          0            3         1         2

Sum of leaves: 0 + 3 + 1 + 2 = 6
```

Each leaf corresponds to one subset, and the second argument is that subset's XOR. The order of leaves differs from the bitmask enumeration but the multiset of XOR values is identical.

The bit-level view for the `O(n)` shortcut:

```
nums = [5, 1, 6] = [101, 001, 110]

OR of all elements = 111 = 7
                 bit 2   bit 1   bit 0
any element set?   yes     yes     yes
contribution     4 * 2^(n-1)  2 * 2^(n-1)  1 * 2^(n-1)
                 = 4*4       = 2*4       = 1*4
                 = 16        = 8         = 4

Total = 16 + 8 + 4 = 28
```

Bit `1` is set in `6` only, yet it still appears in exactly half of the eight subset XORs, which is why the "any element has the bit" test is enough.

## Common Pitfalls

1. **Counting only non-empty subsets**: The empty subset is a valid subset and contributes XOR `0`. Including it does not change the sum, which is why both the DFS and the shortcut work.
2. **Confusing XOR with OR**: XOR cancels repeated bits; OR does not. They happen to agree for `[1, 3]` on the full subset, but not in general. The shortcut uses OR only to detect which bit positions appear at all.
3. **Wrong leftover duplicates**: `nums` may contain duplicates. The problem counts subsets by **index**, not by value, so `[1, 1]` has four subsets, not three. Do not sort and deduplicate.
4. **Using `**` with large exponents**: `orAll * 2 ** (n - 1)` is fine for `n <= 12`, but prefer `orAll << (n - 1)` for the intended bit-level meaning. Beware that `<<` operates on 32-bit signed integers, which is safe here because the answer fits in 32 bits.
5. **Forgetting to carry the running XOR into both branches**: The include branch must pass `total ^ nums[i]`; the exclude branch must pass `total` unchanged.
6. **Trying to memoize unnecessarily**: The `(i, total)` state space is not meaningfully smaller than the recursion tree for `n <= 12`, and map overhead makes the memoized version slower in practice.
7. **Stack depth with `n = 12`**: Trivially safe, but the same recursion pattern on a much larger array would need an explicit stack.
