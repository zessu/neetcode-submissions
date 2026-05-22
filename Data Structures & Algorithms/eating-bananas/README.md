# Koko Eating Bananas - LeetCode 875

## Problem Description

Koko loves to eat bananas. There are `n` piles of bananas, the `i-th` pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours.

Koko can decide her eating speed of `k` bananas per hour. Each hour, she chooses some pile and eats `k` bananas from it. If the pile has less than `k` bananas, she eats all of them and then won't eat any more bananas in this hour.

Koko can eat at most one pile per hour but may have leftover bananas from previous hours.

Return the minimum integer `k` such that she can eat all bananas within `h` hours.

## Examples

### Example 1:
```
Input: piles = [3,6,7,11], h = 8
Output: 4
```

### Example 2:
```
Input: piles = [30,11,23,4,20], h = 5
Output: 30
```

### Example 3:
```
Input: piles = [30,11,23,4,20], h = 6
Output: 23
```

## Constraints

- `1 <= piles.length <= 10^4`
- `1 <= piles[i] <= 10^9`
- `h <= piles.length`
- `h <= 10^9`

## Topics

- Binary Search
- Math

## Company Tags

- Google
- Uber
- Facebook

## Solution Approaches

### 1. Brute Force

**Intuition**: Try every possible eating speed `k` starting from 1 until we find the first speed that allows Koko to finish all bananas within `h` hours.

**Algorithm**:
1. Start with `k = 1`.
2. For each `k`, calculate the total hours needed.
3. If total hours <= `h`, return `k`.
4. Increment `k` and repeat.

**Time Complexity**: `O(n * max(piles))` where `n` is the number of piles.
**Space Complexity**: `O(1)`

### 2. Binary Search (Optimal)

**Intuition**: The possible eating speed `k` is within the range `[1, max(piles)]`. Since the total time spent eating is inversely proportional to `k`, we can use binary search to find the minimum `k` efficiently.

**Algorithm**:
1. Set `low = 1` and `high = max(piles)`.
2. While `low <= high`:
   - Calculate `mid = (low + high) / 2`.
   - Calculate total hours needed at speed `mid`.
   - If total hours <= `h`, it's a possible speed, but try to find a smaller one: `high = mid - 1`.
   - Else, speed is too slow: `low = mid + 1`.
3. Return `low`.

**Time Complexity**: `O(n * log(max(piles)))`
**Space Complexity**: `O(1)`


## Visual Explanation

```
piles = [3, 6, 7, 11], h = 8

Speed 4:
  3/4 + 6/4 + 7/4 + 11/4 = 1 + 2 + 2 + 3 = 8 hours ✓

Speed 3:
  3/3 + 6/3 + 7/3 + 11/3 = 1 + 2 + 3 + 4 = 10 hours ✗

Minimum speed = 4
```

## Common Pitfalls

1. **Integer division**: Remember to add 1 if there's a remainder (pile % k !== 0)
2. **Binary search boundaries**: Use correct low/high values
3. **Overflow**: Use appropriate data types