# Car Fleet - Solution

## Solution Code

```javascript
class Solution {
    /**
     * @param {number} target
     * @param {number[]} position
     * @param {number[]} speed
     * @return {number}
     */
    carFleet(target, position, speed) {
        const n = position.length;
        if (n === 0) return 0;
        
        // Create pairs of (position, time)
        const cars = [];
        for (let i = 0; i < n; i++) {
            cars.push({
                pos: position[i],
                time: (target - position[i]) / speed[i]
            });
        }
        
        // Sort by position descending (closest to target first)
        cars.sort((a, b) => b.pos - a.pos);
        
        let fleets = 0;
        let maxTime = 0;
        
        // If a car behind takes more time than the fleet in front, 
        // it starts a new fleet.
        for (const car of cars) {
            if (car.time > maxTime) {
                fleets++;
                maxTime = car.time;
            }
        }
        
        return fleets;
    }
}
```

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Max-Time Tracking** | $O(N \log N)$ | $O(N)$ | Simple, efficient space (no stack overhead) | Requires sorting |
| **Monotonic Stack** | $O(N \log N)$ | $O(N)$ | Intuitive for "nested" or "dependent" problems | Slightly more overhead than just a variable |

## Key Insights

1. **Bottleneck**: The car in front determines the speed of the fleet. If a car behind is faster, it just joins the fleet. If it's slower, it starts its own fleet.
2. **Reverse Sorting**: By looking at cars from closest to target first, we can easily determine if a car behind will be "blocked" by the fleet in front.

## Walkthrough

```
Input: target = 12, position = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]

Step 1: Calculate times
- Pos 10: (12-10)/2 = 1.0
- Pos 8:  (12-8)/4  = 1.0
- Pos 5:  (12-5)/1  = 7.0
- Pos 3:  (12-3)/3  = 3.0
- Pos 0:  (12-0)/1  = 12.0

Step 2: Sort by position DESC (closest first)
1. {pos: 10, time: 1.0}
2. {pos: 8,  time: 1.0}
3. {pos: 5,  time: 7.0}
4. {pos: 3,  time: 3.0}
5. {pos: 0,  time: 12.0}

Step 3: Count fleets
- Car 1 (1.0): 1.0 > 0.0 → fleets=1, maxTime=1.0
- Car 2 (1.0): 1.0 <= 1.0 → joins fleet
- Car 3 (7.0): 7.0 > 1.0 → fleets=2, maxTime=7.0
- Car 4 (3.0): 3.0 <= 7.0 → joins fleet
- Car 5 (12.0): 12.0 > 7.0 → fleets=3, maxTime=12.0

Output: 3
```