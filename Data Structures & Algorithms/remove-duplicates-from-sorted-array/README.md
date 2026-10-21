# Remove Duplicates from Sorted Array - LeetCode 26

## Problem Description

Given an integer array `nums` sorted in **non-decreasing order**, remove the duplicates **in place** such that each unique element appears only once. The relative order of the elements should be kept the same.

Return the number of unique elements in `nums`, call it `k`.

To be accepted, you must:

1. Change the array `nums` so that the **first `k` elements** contain the unique values **in the order they appeared** in `nums`.
2. Leave the remaining elements of `nums` in any state — they are ignored, and the final length of the array does not matter.
3. Return `k`.

The judge checks that your returned `k` matches the number of unique values, then verifies `nums[0..k-1]` against the expected values. Everything after index `k - 1` is irrelevant, so it is fine to leave stale duplicates there.

## Examples

### Example 1:

```
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
```

**Explanation:** `k = 2`, and the first two elements are the unique values `1` and `2` in their original relative order. The underscore represents whatever value is left at index 2; it is not checked.

### Example 2:

```
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
```

**Explanation:** There are five distinct values, so `k = 5`. The first five cells hold `0, 1, 2, 3, 4` in sorted order; the last five cells are ignored.

### Example 3:

```
Input: nums = [1]
Output: 1, nums = [1]
```

**Explanation:** A single element is already unique. `k = 1` and nothing changes.

### Example 4:

```
Input: nums = [1,1,1]
Output: 1, nums = [1,_,_]
```

**Explanation:** Every element is equal, so only one unique value remains and `k = 1`.

## Constraints

- `1 <= nums.length <= 3 * 10^4`
- `-100 <= nums[i] <= 100`
- `nums` is sorted in **non-decreasing** order.

## Topics

- Array
- Two Pointers

## Company Tags

- Amazon
- Microsoft
- Meta
- Apple

## Solution Approaches

### 1. Set, Sort, Copy Back (Implemented)

**Intuition**: Deduplicate with a `Set`, then overwrite the front of `nums` with the unique values. The sort is there to guarantee the required non-decreasing order before writing back.

**Algorithm**:
1. Build `myset = [...new Set(nums)]` — a `Set` keeps the first occurrence of each value, so insertion order matches the original order.
2. Sort `myset` with the numeric comparator `(a, b) => a - b`.
3. Copy `myset[count]` into `nums[count]` for every unique value.
4. Return `myset.length` as `k`.

**Time Complexity**: `O(n log n)` — the set build is `O(n)`, the sort dominates.
**Space Complexity**: `O(n)` — the set and the array built from it.

*Note:* because the input is already sorted, `[...new Set(nums)]` is already in non-decreasing order, so the `.sort()` call is redundant. Removing it would make this approach `O(n)` time.

### 2. Two Pointers: Read and Write (Optimal)

**Intuition**: The array is sorted, so duplicates are adjacent. Keep a `write` index pointing at the last unique value placed, and a `read` index scanning forward. Whenever `nums[read]` differs from the last unique value, copy it to `nums[write]` and advance `write`.

**Algorithm**:
1. If the array is empty, return `0`.
2. Set `write = 1` (index 0 is always the first unique value).
3. For `read = 1 .. n - 1`:
   - If `nums[read] !== nums[write - 1]`, then `nums[write] = nums[read]` and `write++`.
4. Return `write`.

**Time Complexity**: `O(n)` — one pass.
**Space Complexity**: `O(1)` — two indices, no allocation.

### 3. Repeated `splice` While Scanning

**Intuition**: Delete each adjacent duplicate in place. This works, but every `splice` shifts the entire tail left, and deleting during a forward loop also shifts the elements you have not examined yet.

**Algorithm**:
1. Set `i = 1`.
2. While `i < nums.length`:
   - If `nums[i] === nums[i - 1]`, call `nums.splice(i, 1)` and **do not** increment `i` (the next element has slid into position `i`).
   - Otherwise increment `i`.
3. Return `nums.length`.

**Time Complexity**: `O(n^2)` — up to `n` deletions, each shifting `O(n)` elements.
**Space Complexity**: `O(1)`.

### 4. Build a New Array, Then Copy

**Intuition**: Collect uniques in a fresh array in one pass, then copy them back into `nums`. This preserves order without any sorting and is easy to reason about.

**Algorithm**:
1. Walk `nums` once; push a value into `unique` whenever it differs from the previous value.
2. Copy `unique` back into `nums[0..unique.length-1]`.
3. Return `unique.length`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(n)` — the extra array.

## Comparison of Approaches

| Approach | Time | Space | In place? | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Set + sort + copy (implemented)** | `O(n log n)` | `O(n)` | Yes (writes back) | Simple, but sorts already-sorted data |
| Two pointers (read/write) | `O(n)` | `O(1)` | Yes | Optimal; the expected interview answer |
| Repeated `splice` | `O(n^2)` | `O(1)` | Yes | Simple idea, quadratic shifting |
| New array + copy back | `O(n)` | `O(n)` | Yes (writes back) | Clear, but allocates |

## Visual Explanation

```
nums = [0,0,1,1,1,2,2,3,3,4]

read scans every cell; write marks where the next unique value goes.

index:   0  1  2  3  4  5  6  7  8  9
nums:    0  0  1  1  1  2  2  3  3  4
         w
         r

r=1: nums[1]=0 == nums[0]=0  -> duplicate, skip
r=2: nums[2]=1 != nums[0]=0  -> nums[1]=1, w=2
r=3: 1 == 1                  -> skip
r=4: 1 == 1                  -> skip
r=5: 2 != nums[1]=1          -> nums[2]=2, w=3
r=6: 2 == 2                  -> skip
r=7: 3 != nums[2]=2          -> nums[3]=3, w=4
r=8: 3 == 3                  -> skip
r=9: 4 != nums[3]=3          -> nums[4]=4, w=5

nums[0..4] = [0,1,2,3,4], k = 5
```

The implemented approach reaches the same state differently:

```
[0,0,1,1,1,2,2,3,3,4]
        |
     new Set(...)          -> {0, 1, 2, 3, 4}  (insertion order preserved)
        |
     spread + sort         -> [0, 1, 2, 3, 4]
        |
     write back first 5    -> [0, 1, 2, 3, 4, 2, 2, 3, 3, 4]
                                      ^ stale tail, ignored by the judge
```

## Common Pitfalls

1. **Returning the array instead of `k`.** The method must return a number; the judge reads the mutation from `nums` itself.
2. **Not writing back into `nums`.** Returning a deduplicated copy without copying it into the original array fails the in-place check.
3. **Clearing the tail.** You do not need to zero or truncate the remaining cells. Only `nums[0..k-1]` is validated; overwriting the tail is wasted work.
4. **Default `sort` is lexicographic.** If you do sort, `nums.sort()` converts to strings, so `[1, 2, 10]` becomes `[1, 10, 2]` and negatives misorder. Use `(a, b) => a - b`.
5. **`splice` inside a forward loop.** Deleting at index `i` shifts the next element into `i`; incrementing unconditionally skips it. Also, each `splice` is `O(n)`, making the loop quadratic.
6. **Off-by-one with the write pointer.** Start `write = 1` (the first element is always kept). Comparing against `nums[write - 1]` — the last value written — is equivalent to comparing with `nums[read - 1]` in a sorted array.
7. **Assuming the input is unsorted.** The two-pointer shortcut relies on the non-decreasing order. For unsorted input you would need a set or a sort first.
8. **Assuming the length can change.** JavaScript arrays keep their length; `k` is a logical prefix length, not a new array size.
9. **Empty input.** The constraints say `n >= 1`, but a guard for `n === 0` costs nothing and avoids `nums[0]` accesses.
