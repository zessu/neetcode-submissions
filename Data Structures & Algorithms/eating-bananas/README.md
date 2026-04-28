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

### Binary Search

**Intuition**: The answer lies between 1 and max(piles). Use binary search to find the minimum speed k that allows Koko to finish in h hours.

**Algorithm**:
1. Set `low = 1` and `high = max(piles)`
2. While `low <= high`:
   - Calculate `mid = (low + high) / 2`
   - Calculate hours needed at speed `mid`
   - If hours <= h, try lower speed (high = mid - 1)
   - Else, need higher speed (low = mid + 1)
3. Return `low` (or `high + 1`)

**Time Complexity**: O(n log max(piles))
**Space Complexity**: O(1)

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