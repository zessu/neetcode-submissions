# Merge Sorted Array - LeetCode 88

## Problem Description

You are given two integer arrays `nums1` and `nums2`, sorted in **non-decreasing order**, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.

**Merge** `nums1` and `nums2` into a single array sorted in **non-decreasing order**.

The final sorted array should not be returned by the function, but instead be stored **inside the array `nums1`**. To accommodate this, `nums1` has a length of `m + n`, where the first `m` elements denote the elements that should be merged, and the last `n` elements are set to `0` and should be ignored. `nums2` has a length of `n`.

## Examples

### Example 1:

```
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
```

**Explanation:** The arrays being merged are `[1,2,3]` and `[2,5,6]`. The result is stored in `nums1`, whose last three cells were placeholders.

### Example 2:

```
Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]
```

**Explanation:** There is nothing to merge from `nums2`; `nums1` already contains the single sorted element.

### Example 3:

```
Input: nums1 = [0], m = 0, nums2 = [1], n = 1
Output: [1]
```

**Explanation:** Because `m = 0`, there are no real elements in `nums1`. The single `0` is only a placeholder so the merged result fits. The answer is simply `nums2`.

## Constraints

- `nums1.length == m + n`
- `nums2.length == n`
- `0 <= m, n <= 200`
- `1 <= m + n <= 200`
- `-10^9 <= nums1[i], nums2[j] <= 10^9`

**Follow-up:** Can you come up with an algorithm that runs in `O(m + n)` time?

## Topics

- Array
- Two Pointers
- Sorting

## Company Tags

- Amazon
- Microsoft
- Meta
- Bloomberg

## Solution Approaches

### 1. Concatenate and Sort (Implemented)

**Intuition**: The problem is "merge two sorted lists". The simplest correct way is to put every element into one array and let a general-purpose sort handle the ordering. Since `nums1` already has `n` spare cells at the end, `nums2` can be copied directly into those slots with no allocation.

**Algorithm**:
1. For each index `count` in `nums2`, write `nums2[count]` into `nums1[nums1.length - (count + 1)]` — that is, fill the placeholder cells from the back.
2. Sort `nums1` in place with the numeric comparator `(a, b) => a - b`.
3. Return nothing; `nums1` now holds the merged result.

**Time Complexity**: `O((m + n) log(m + n))` — dominated by the sort.
**Space Complexity**: `O(1)` extra (the sort is in place; engines may use `O(log n)` stack space for large arrays).

### 2. Three Pointers from the End (Optimal)

**Intuition**: Both inputs are already sorted, so we only need a linear merge. The danger of merging forward into `nums1` is overwriting elements that have not been read yet. But `nums1` has exactly `n` free cells at the **end**, so filling from the back is safe: the largest remaining value always belongs in the last unfilled cell, and writing there can only clobber a placeholder or an element that has already been consumed.

**Algorithm**:
1. Set `i = m - 1` (last real element of `nums1`), `j = n - 1` (last element of `nums2`), `k = m + n - 1` (last cell of `nums1`).
2. While `j >= 0`:
   - If `i >= 0` and `nums1[i] > nums2[j]`, copy `nums1[i]` to `nums1[k]` and decrement `i`.
   - Otherwise copy `nums2[j]` to `nums1[k]` and decrement `j`.
   - Decrement `k`.
3. If `nums2` is exhausted, the remaining prefix of `nums1` is already in place, so stop. (If `nums1` is exhausted, the loop still copies the rest of `nums2`.)

**Time Complexity**: `O(m + n)` — each element is written at most once.
**Space Complexity**: `O(1)` — three indices.

### 3. Merge into an Extra Buffer

**Intuition**: The textbook merge uses a third array: walk both inputs from the front, always taking the smaller head, then copy the buffer back into `nums1`. It is easy to reason about because there is no aliasing between reads and writes.

**Algorithm**:
1. Create `merged = []` with capacity `m + n`.
2. Two pointers `i = 0`, `j = 0`; while both are in range, push the smaller of `nums1[i]`, `nums2[j]` and advance that pointer.
3. Append the leftover tail of whichever array still has elements.
4. Copy `merged` back into `nums1[0 .. m+n-1]`.

**Time Complexity**: `O(m + n)`.
**Space Complexity**: `O(m + n)` — the buffer.

## Comparison of Approaches

| Approach | Time | Space | Stable? | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Concatenate + sort (implemented)** | `O((m+n) log(m+n))` | `O(1)` extra | No (sort-dependent) | Shortest code; ignores the fact that both inputs are already sorted |
| Three pointers from the end | `O(m+n)` | `O(1)` | Yes | Optimal; meets the follow-up; no allocation |
| Extra buffer merge | `O(m+n)` | `O(m+n)` | Yes | Easiest to get right, but allocates and then copies back |

## Visual Explanation

```
nums1 = [1, 2, 3, 0, 0, 0]   m = 3
nums2 = [2, 5, 6]            n = 3

Implemented approach
--------------------
Step 1: copy nums2 into the tail of nums1 (back to front)
        [1, 2, 3, 2, 5, 6]
                  ^  ^  ^
                  copied slots

Step 2: numeric sort
        [1, 2, 2, 3, 5, 6]   <-- nums1 now holds the answer


Optimal three-pointer approach
------------------------------
i = 2 (3)          j = 2 (6)          k = 5
nums1: [1, 2, 3, 0, 0, 0]
nums2: [2, 5, 6]

6 > 3  -> nums1[5] = 6, j--, k--      [1, 2, 3, 0, 0, 6]
5 > 3  -> nums1[4] = 5, j--, k--      [1, 2, 3, 0, 5, 6]
3 > 2  -> nums1[3] = 3, i--, k--      [1, 2, 3, 3, 5, 6]
2 >= 2 -> nums1[2] = 2, j--, k--      [1, 2, 2, 3, 5, 6]
j < 0  -> nums2 exhausted, prefix [1, 2] already correct
```

## Common Pitfalls

1. **Merging forward overwrites data.** If you write into `nums1` from index `0` while still reading from it, you clobber unread values. Either merge from the back or use a buffer.
2. **Forgetting the numeric comparator.** `nums1.sort()` sorts **lexicographically**: `[10, 9, 100]` becomes `[10, 100, 9]`, and even negative numbers misorder (`-1` sorts before `-2`). Always pass `(a, b) => a - b`.
3. **Treating the placeholder zeros as real values.** The last `n` cells are not part of the input. Copying `nums2` over them is what makes the implemented approach work; a forward merge that compares them would be wrong.
4. **Ignoring `m`.** The implemented code relies on the constraint `nums1.length == m + n` and writes to the last `nums2.length` cells. That is exactly correct here, but it would break on an array that is longer than `m + n`.
5. **`n = 0`.** There is nothing to copy or merge; `nums1` is already the answer. The copy loop simply never runs.
6. **`m = 0`.** Do not loop over `nums1`'s single placeholder; the whole answer comes from `nums2`. The three-pointer version handles this because it only requires `j >= 0`.
7. **Returning a new array.** LeetCode checks the mutated `nums1`; the method's return type is `void`. All copying must happen into the provided array.
8. **Wrong write direction with duplicates.** Using `>` instead of `>=` is fine for correctness, but be consistent: always decrement exactly the pointer you copied from, and always decrement `k`.
