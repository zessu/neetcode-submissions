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

## Solution Approaches

### 1. Max-Time Tracking (Iterative)

**Intuition**: 
1. Calculate the time each car needs to reach the destination: `time = (target - position) / speed`.
2. Sort cars by their starting position in descending order (closest to the destination first).
3. If a car behind takes more time to reach the destination than the car (or fleet) in front of it, it will never catch up and thus forms a new fleet. If it takes less or equal time, it will join the fleet in front.

**Algorithm**:
1. Pair each position with its calculated time to destination.
2. Sort pairs by position descending.
3. Initialize `fleets = 0` and `maxTime = 0`.
4. Iterate through the sorted cars:
   - If current car's `time > maxTime`:
     - Increment `fleets`.
     - Update `maxTime = current car's time`.
5. Return `fleets`.

**Time Complexity**: `O(N log N)` due to sorting.
**Space Complexity**: `O(N)` to store the position-time pairs.

### 2. Monotonic Stack

**Intuition**: Similar to the max-time tracking, but uses a stack to keep track of the fleets. We push the arrival time onto the stack if it's greater than the top of the stack (meaning it can't catch up to the fleet ahead).

**Algorithm**:
1. Pair positions and speeds, then sort by position descending.
2. For each car, calculate its time to target.
3. If the stack is empty or the current time is greater than the top of the stack, push the current time.
4. The size of the stack at the end is the number of fleets.

**Time Complexity**: `O(N log N)` due to sorting.
**Space Complexity**: `O(N)` for the stack and storage.