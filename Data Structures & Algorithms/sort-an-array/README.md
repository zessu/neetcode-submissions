# Sort an Array - LeetCode 912

## Problem Description

Given an array of integers `nums`, sort the array in **ascending order** and return it.

You must solve the problem **without using any built-in sort function**, in `O(n log n)` time, and using the smallest space complexity possible.

> **Note:** The constraints below allow values in a bounded range, which makes counting sort a legitimate linear-time alternative. A general-purpose comparison sort such as merge sort or heap sort is the safer choice when the value range is unknown.

## Examples

### Example 1:
```
Input: nums = [5,2,3,1]
Output: [1,2,3,5]
```
**Explanation:** After sorting, the positions of some numbers are unchanged (for example, `2` and `3`), while others move: `5` moves to the end and `1` moves to the beginning.

### Example 2:
```
Input: nums = [5,1,1,2,0,0]
Output: [0,0,1,1,2,5]
```
**Explanation:** The values are not necessarily distinct. Both `1`s stay together and both `0`s stay together, followed by `2` and `5`.

### Example 3:
```
Input: nums = [1]
Output: [1]
```
**Explanation:** A single element is already sorted.

### Example 4:
```
Input: nums = [-4,0,-1,3,2]
Output: [-4,-1,0,2,3]
```
**Explanation:** Negative values sort before non-negative ones; the relative order of `-4` and `-1` follows numeric comparison.

## Constraints

- `1 <= nums.length <= 5 * 10^4`
- `-5 * 10^4 <= nums[i] <= 5 * 10^4`

## Topics

- Array
- Divide and Conquer
- Sorting
- Heap (Priority Queue)
- Merge Sort
- Bucket Sort
- Radix Sort
- Counting Sort

## Company Tags

- Amazon
- Google
- Microsoft
- Meta
- Apple

## Solution Approaches

### 1. Insertion Sort (Brute Force)

**Intuition**: Grow a sorted prefix one element at a time. Take the next element and shift it left past every larger element until it lands in its correct position.

**Algorithm**:
1. Start with the first element as a sorted prefix of length 1.
2. For `i` from `1` to `n - 1`, store `key = nums[i]`.
3. Shift every element greater than `key` one position to the right.
4. Insert `key` into the gap.
5. Return `nums` once the prefix covers the whole array.

**Time Complexity**: `O(n^2)` worst case (reverse-sorted input); `O(n)` best case (already sorted).
**Space Complexity**: `O(1)`.

Insertion sort is simple and stable, but `n = 5 * 10^4` means up to about 1.25 billion comparisons, which is too slow.

### 2. Merge Sort (Implemented)

**Intuition**: Split the array in half, recursively sort each half, then merge the two sorted halves. Merging is easy because the smallest remaining element of the combined array must be at the front of one of the two halves.

**Algorithm**:
1. If the array has fewer than 2 elements, it is already sorted &mdash; return it.
2. Find the midpoint `mid = floor(n / 2)`.
3. Recursively sort `nums.slice(0, mid)` and `nums.slice(mid)`.
4. Merge the two sorted halves:
   - Repeatedly compare the fronts of both halves and append the smaller one to `temp`.
   - When one half is exhausted, append the remainder of the other half.
5. Return the merged array.

**Time Complexity**: `O(n log n)` **comparisons** &mdash; `log n` levels, each merging `n` elements.
**Space Complexity**: `O(n)` auxiliary for the slices and merged arrays.

> **Implementation caveat:** the submitted merge uses `Array.prototype.shift()` to remove the front of each half. `shift()` is `O(length)` in the worst case because it re-indexes the remaining elements. With `n` removals per merge, this implementation's element-movement cost is `O(n^2)` overall. It is fast enough for the given limits in V8, but replacing `shift()` with index pointers restores true `O(n log n)` behavior. See `SOLUTION.md` for the comparison.

### 3. Quick Sort

**Intuition**: Choose a pivot, partition the array so that smaller elements are on its left and larger elements on its right, then recursively sort both sides. The pivot is then in its final position.

**Algorithm**:
1. If the subarray has 0 or 1 elements, return.
2. Choose a pivot (first, last, middle, or random element).
3. Partition the subarray around the pivot using two pointers.
4. Recursively sort the left and right partitions.

**Time Complexity**: `O(n log n)` average; `O(n^2)` worst case (already sorted input with a first/last pivot, or many duplicates).
**Space Complexity**: `O(log n)` average recursion stack; `O(n)` worst case. In-place partitioning itself is `O(1)`.

### 4. Heap Sort

**Intuition**: Build a max-heap, then repeatedly swap the heap's maximum (the root) with the last unsorted element and shrink the heap. This places the largest remaining value at the end each time.

**Algorithm**:
1. Build a max-heap from `nums` in `O(n)`.
2. For `end` from `n - 1` down to `1`:
   - Swap `nums[0]` with `nums[end]`.
   - Sift the new root down within the heap of size `end`.
3. Return `nums`, now sorted ascending.

**Time Complexity**: `O(n log n)` in all cases.
**Space Complexity**: `O(1)` (iterative sift-down).

### 5. Counting Sort

**Intuition**: Values lie in the bounded range `[-5 * 10^4, 5 * 10^4]`. Count how many times each value occurs, then write the values back in increasing order. No comparisons are needed.

**Algorithm**:
1. Create a frequency array of size `100001` (one slot per possible value).
2. For each `x` in `nums`, increment `count[x + 50000]`.
3. Walk the frequency array from smallest value to largest, writing each value `count[v]` times back into `nums`.
4. Return `nums`.

**Time Complexity**: `O(n + R)`, where `R = 100001` is the value range.
**Space Complexity**: `O(R)` for the frequency array.

Counting sort is linear here, but it depends on the constraint that values are bounded. If the range were `10^9`, the frequency array would be impractical.

## Visual Explanation

```
Merge sort on [5, 2, 3, 1]

SPLIT
                [5, 2, 3, 1]
                /          \
           [5, 2]          [3, 1]
           /    \          /    \
         [5]    [2]      [3]    [1]

MERGE
         [5] + [2] -> [2, 5]      [3] + [1] -> [1, 3]
                    \              /
                     [2, 5] + [1, 3]
                            |
                      [1, 2, 3, 5]

Merging [2,5] and [1,3]:
  compare 2 vs 1 -> take 1   temp = [1]
  compare 2 vs 3 -> take 2   temp = [1,2]
  compare 5 vs 3 -> take 3   temp = [1,2,3]
  right half empty, append 5 -> [1,2,3,5]
```

## Approach Comparison

| Approach | Time | Space | Stable? | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Insertion Sort | `O(n^2)` worst, `O(n)` best | `O(1)` | Yes | Good for tiny or nearly sorted arrays; too slow here |
| **Merge Sort (implemented)** | `O(n log n)` comparisons; `O(n^2)` element moves worst case due to `shift()` | `O(n)` | No (ties take the right half because of `<`) | Predictable divide-and-conquer; fix `shift()` for true `O(n log n)` |
| Quick Sort | `O(n log n)` average, `O(n^2)` worst | `O(log n)` avg stack | No (typical) | Fast in practice, in-place, but worst-case sensitive |
| Heap Sort | `O(n log n)` all cases | `O(1)` | No | Strong worst-case guarantee with constant extra space |
| Counting Sort | `O(n + R)` | `O(R)` | Yes (with stable placement) | Fastest here, but only because the value range is bounded |

## Common Pitfalls

1. **Using `Array.prototype.sort`**: The problem explicitly forbids built-in sorting. Even `nums.sort((a, b) => a - b)` fails the requirement, regardless of the comparator.
2. **Sorting lexicographically**: JavaScript's default `sort()` converts numbers to strings, so `[10, 2].sort()` gives `[10, 2]`. This is another reason to implement the algorithm yourself.
3. **`shift()` costs**: `shift()` removes the first element in `O(n)` time by re-indexing the rest. Use index pointers (`i`, `j`) when merging for guaranteed `O(n log n)`.
4. **Forgetting the base case**: `if (nums.length < 2) return nums;` prevents infinite recursion on empty and single-element slices.
5. **Incorrect midpoint**: Use `Math.floor(nums.length / 2)`. A fractional index breaks `slice`.
6. **Losing the remainder**: After the main merge loop, one half is exhausted. Append the remaining elements of the other half; forgetting this drops values.
7. **Assuming stability**: Standard merge sort is stable, but this implementation compares with `<`, so equal elements are taken from the right half first and the relative order of ties can change. Use `<=` if stability matters. Quick sort and heap sort are generally not stable either.
8. **Negative values**: With counting sort, offset indices by `+50000`; otherwise negative values index outside the array.
9. **Mutating vs returning**: This implementation builds and returns new arrays rather than sorting `nums` in place. That is allowed here because the return value is graded, but it uses `O(n)` auxiliary space. An in-place merge is possible but much more complex.
