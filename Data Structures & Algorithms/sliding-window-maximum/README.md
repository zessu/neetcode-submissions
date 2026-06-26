# Sliding Window Maximum - LeetCode 239

## Problem Description

You are given an array of integers `nums`, and a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.

## Examples

### Example 1:
```
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
```

### Example 2:
```
Input: nums = [1], k = 1
Output: [1]
```

## Constraints

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- `1 <= k <= nums.length`

## Topics

- Array
- Sliding Window
- Monotonic Queue
- Heap

## Company Tags

- Amazon
- Google
- Microsoft
- Facebook

## Solution Approaches

### 1. Brute Force Sliding Window (Implemented)

**Intuition**: For each window position, scan all `k` elements to find the maximum.

**Algorithm**:
1. Initialize a window from index `0` to `k-1`.
2. For each window position, iterate through all `k` elements and find the max.
3. Add the max to the result array.
4. Slide the window one position to the right.
5. Repeat until the window reaches the end.

**Time Complexity**: `O(n * k)` where n is the array length.
**Space Complexity**: `O(1)` extra space (besides the output).

### 2. Monotonic Deque (Optimal)

**Intuition**: Maintain a deque of indices where values are in decreasing order. The front of the deque is always the maximum in the current window.

**Algorithm**:
1. Use a deque to store indices.
2. For each new element:
   - Remove indices outside the window from the front.
   - Remove indices from the back whose values are <= current value.
   - Add the current index to the back.
3. The front of the deque is the max for the current window.

**Time Complexity**: `O(n)` — each element is added and removed at most once.
**Space Complexity**: `O(k)` for the deque.

### 3. Max Heap

**Intuition**: Use a max heap to track the maximum in the current window.

**Time Complexity**: `O(n log k)`
**Space Complexity**: `O(k)`

## Visual Explanation

```
nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3

Window positions:
  [1, 3, -1]           -> max = 3
     [3, -1, -3]       -> max = 3
        [-1, -3, 5]    -> max = 5
           [-3, 5, 3]  -> max = 5
              [5, 3, 6] -> max = 6
                 [3, 6, 7] -> max = 7

Result: [3, 3, 5, 5, 6, 7]
```

## Common Pitfalls

1. **O(n*k) is too slow**: The brute force approach will TLE for large inputs. Use the deque approach.
2. **Deque stores indices, not values**: You need indices to check if elements are outside the window.
3. **Off-by-one in window bounds**: Ensure the window covers exactly `k` elements at each step.
4. **Negative numbers**: The max can be negative — initialize with `-Infinity`, not `0`.
