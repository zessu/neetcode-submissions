# Sort Colors - LeetCode 75

## Problem Description

Given an array `nums` with `n` objects colored red, white, or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order **red, white, and blue**.

The integers `0`, `1`, and `2` represent red, white, and blue respectively.

You must solve this problem **without using the library's sort function**.

**Follow-up:** Could you come up with a one-pass algorithm using only constant extra space?

## Examples

### Example 1:
```
Input: nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
```
**Explanation:** Both `0`s move to the front, both `1`s stay in the middle, and both `2`s move to the end. The output is grouped as red, white, blue.

### Example 2:
```
Input: nums = [2,0,1]
Output: [0,1,2]
```
**Explanation:** One of each color. The `0` moves to index 0, the `1` stays in the middle, and the `2` moves to index 2.

### Example 3:
```
Input: nums = [0]
Output: [0]
```
**Explanation:** A single element is already sorted.

### Example 4:
```
Input: nums = [2,2,0,1]
Output: [0,1,2,2]
```
**Explanation:** The two `2`s end up adjacent at the end, after the `0` and the `1`.

## Constraints

- `n == nums.length`
- `1 <= n <= 300`
- `nums[i]` is either `0`, `1`, or `2`.

## Topics

- Array
- Two Pointers
- Sorting

## Company Tags

- Amazon
- Microsoft
- Google
- Meta
- Adobe

## Solution Approaches

### 1. Counting Sort (Implemented)

**Intuition**: There are only three possible values. Count how many of each exist, then overwrite the array with that many `0`s, then `1`s, then `2`s. Grouping is automatic because the values are written in order.

**Algorithm**:
1. Create `counts = [0, 0, 0]`.
2. **First pass**: for each `x` in `nums`, increment `counts[x]`.
3. **Second pass**: set `index = 0`. For `value` from `0` to `2`, write `value` into `nums[index]` exactly `counts[value]` times, incrementing `index` each time.
4. The array is now sorted in place.

**Time Complexity**: `O(n)` — two linear passes over `nums` plus a constant 3 iterations.
**Space Complexity**: `O(1)` — the counter array has exactly 3 entries, independent of `n`.

This is a valid and simple `O(n)` solution. It uses two passes, so it does not satisfy the follow-up's "one-pass" challenge, but it does use constant extra space.

### 2. Dutch National Flag / Three-Way Partition (One-Pass Optimal)

**Intuition**: Maintain three regions while scanning once:
- `[0, low)` contains only `0`s.
- `[low, mid)` contains only `1`s.
- `(high, n - 1]` contains only `2`s.
- `[mid, high]` is the unprocessed region.

Inspect `nums[mid]` and place it into the correct region with a single swap.

**Algorithm**:
1. Set `low = 0`, `mid = 0`, `high = n - 1`.
2. While `mid <= high`:
   - If `nums[mid] === 0`: swap `nums[low]` and `nums[mid]`; increment both `low` and `mid`.
   - If `nums[mid] === 1`: increment `mid` (it is already in the middle region).
   - If `nums[mid] === 2`: swap `nums[mid]` and `nums[high]`; decrement `high` **without** incrementing `mid`, because the newly swapped-in value has not been examined yet.
3. Stop when `mid > high`.

**Time Complexity**: `O(n)` — each iteration either advances `mid` or shrinks the unknown region from the right, so there are at most `n` iterations.
**Space Complexity**: `O(1)` — three indices.

This is the optimal answer to the follow-up: one pass, constant space, in place.

### 3. Comparison Sort

**Intuition**: Treat the values as ordinary integers and sort them with any comparison-based algorithm (merge sort, quick sort, or the built-in sort).

**Algorithm**:
1. Sort `nums` with a numeric comparator, e.g. `nums.sort((a, b) => a - b)`.
2. Because the only values are `0`, `1`, and `2`, the sorted order is the required grouping.

**Time Complexity**: `O(n log n)` for an optimal comparison sort.
**Space Complexity**: `O(log n)` for a typical sort's stack, or `O(n)` for merge sort.

The library sort is **explicitly forbidden** by the problem. Even a hand-written comparison sort does more work than necessary: it ignores the fact that there are only three distinct keys.

### 4. Bubble Sort (Brute Force)

**Intuition**: Repeatedly compare adjacent elements and swap them if they are out of order. After each pass, the largest remaining value bubbles to its final position.

**Algorithm**:
1. For `end` from `n - 1` down to `1`:
   - For `i` from `0` to `end - 1`, if `nums[i] > nums[i + 1]`, swap them.
2. Stop early if a pass performs no swaps.

**Time Complexity**: `O(n^2)` worst and average; `O(n)` best (already sorted, with early exit).
**Space Complexity**: `O(1)`.

Bubble sort is correct but far slower than necessary. With `n <= 300` it passes, but it is not an acceptable answer when linear solutions exist.

## Visual Explanation

```
Counting sort on [2,0,2,1,1,0]

First pass (count):
  value 0: ||        -> 2
  value 1: ||        -> 2
  value 2: ||        -> 2

Second pass (overwrite in value order):
  write 0 twice -> [0,0,_,_,_,_]
  write 1 twice -> [0,0,1,1,_,_]
  write 2 twice -> [0,0,1,1,2,2]
```

```
Dutch National Flag on [2,0,2,1,1,0]

invariant: [0,low) = 0s | [low,mid) = 1s | [mid,high] unknown | (high,n) = 2s

start: low=0, mid=0, high=5
  nums[0]=2 -> swap with high       [0,0,2,1,1,2]  high=4
  nums[0]=0 -> low=1, mid=1         [0,0,2,1,1,2]
  nums[1]=0 -> low=2, mid=2         [0,0,2,1,1,2]
  nums[2]=2 -> swap with high       [0,0,1,1,2,2]  high=3
  nums[2]=1 -> mid=3                [0,0,1,1,2,2]
  nums[3]=1 -> mid=4                [0,0,1,1,2,2]
  mid=4 > high=3 -> stop
```

## Approach Comparison

| Approach | Time | Space | Passes | In-Place? | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Counting Sort (implemented)** | `O(n)` | `O(1)` | 2 | Yes | Simple and fast; does not meet the one-pass follow-up |
| **Dutch National Flag** | `O(n)` | `O(1)` | 1 | Yes | **Optimal**; satisfies the follow-up |
| Comparison Sort | `O(n log n)` | `O(log n)` stack | 1 (internally) | Usually | Ignores the three-value structure; built-in sort is forbidden |
| Bubble Sort | `O(n^2)` | `O(1)` | Up to `n` | Yes | Correct but unnecessarily slow |

## Common Pitfalls

1. **Returning a new array**: The problem requires in-place modification of `nums`. Returning `[...nums].sort(...)` does not update the caller's array.
2. **Using the library sort**: `nums.sort()` is forbidden. It is also wrong without a numeric comparator: `[2,10].sort()` sorts lexicographically.
3. **Forgetting `mid` does not advance after a `2` swap**: When `nums[mid] === 2`, the value swapped in from the right has not been inspected. Incrementing `mid` would skip it.
4. **Confusing `low` and `mid` on a `0` swap**: Both advance. The value swapped into `mid` comes from the `1` region, so it is known to be `1`.
5. **Loop condition**: Use `mid <= high`; using `mid < high` leaves the final unknown element unprocessed.
6. **Counting array indexing**: `counts` must have exactly 3 slots. Values are guaranteed to be `0`, `1`, or `2`; if that were not guaranteed, `counts[nums[i]]` could be out of bounds.
7. **Assuming stability matters**: The three colors are indistinguishable within a group, so stability has no observable effect here.
