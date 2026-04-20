# Car Fleet - LeetCode 853

## Problem Description

N cars are going to the same destination along a one-lane road. The destination is `target` miles away.

Each car i starts at position `position[i]` and moves at a constant speed `speed[i]`. A car fleet is some non-empty set of cars driving at the same position and same speed. Note that a single car is also a car fleet.

A car never passes another car ahead of it, but it can catch up to it and drive bumper to bumper at the same speed.

Return the number of car fleets that will arrive at the destination.

## Examples

### Example 1:
```
Input: target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]
Output: 3
Explanation:
- Cars at positions 10 and 8 become a fleet, meeting at position 12
- Car at position 0 is a fleet by itself
- Cars at positions 5 and 3 become a fleet, meeting at position 6
```

### Example 2:
```
Input: target = 6, position = [2,1,0,1,3,1], speed = [3,3,2,5,5,3]
Output: 1
```

## Constraints

- `1 <= N <= 10^4`
- `0 < target <= 10^6`
- `0 < speed[i] <= 10^6`
- `0 <= position[i] < target`

## Topics

- Array
- Sorting
- Stack (Monotonic)

## Company Tags

- Apple
- Amazon
- Uber

## Hint 1

Calculate the time each car needs to reach the destination: `time = (target - position[i]) / speed[i]`

## Hint 2

Sort cars by their starting position from farthest to closest to destination.

## Hint 3

If a car takes longer to reach the destination than the car ahead of it, it will never catch up and forms its own fleet.

## Solution Approach

### Monotonic Stack / Two Pointers

**Intuition**: 
1. Calculate time to reach target for each car
2. Sort by starting position (farthest first)
3. Cars form a fleet if the one behind takes LONGER time than the one ahead (they can't catch up)

**Algorithm**:
1. Create array of `{position, time}` pairs
2. Sort by position descending (furthest first)
3. Iterate and track the maximum time seen so far
4. If current car's time > maxTime, it forms a new fleet
5. Otherwise, it joins the fleet ahead

**Time Complexity**: `O(N log N)` for sorting
**Space Complexity**: `O(N)` for storing pairs