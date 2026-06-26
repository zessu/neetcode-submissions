# Sliding Window Maximum - Solution

## Solution Code

```typescript
class Solution {
    largest = -Infinity;
    nums: number[] = [];
    result: number[] = [];
    k = 0;
    maxSlidingWindow(nums: number[], k: number): number[] {
        this.nums = nums;
        this.k = k;

        let start = 0;
        let end = k - 1;

        while(end < nums.length) {
            this.largest = -Infinity;
            let partition = nums.slice(start, end + 1);
            this.findLargest(partition);
            start++;
            end++;
        }

        return this.result;
    }

    findLargest(slice: number[]) {
        for(let i=0; i<this.k; i++) {
            this.largest = Math.max(slice[i], this.largest);
        }
        this.result.push(this.largest);
    }
}
```

## Approach

The solution uses a **brute force sliding window** approach.

1. **Initialize window**: Set `start = 0` and `end = k - 1`.
2. **Extract partition**: Slice the array from `start` to `end + 1`.
3. **Find max**: Iterate through the partition to find the largest element.
4. **Store result**: Push the max to the result array.
5. **Slide window**: Increment both `start` and `end`.
6. **Repeat**: Until `end` reaches the end of the array.

- **Time Complexity**: O(n * k) — for each of the `n - k + 1` windows, we scan `k` elements.
- **Space Complexity**: O(k) for the partition slice, O(n - k + 1) for the result.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Brute Force** | $O(n \cdot k)$ | $O(k)$ | Simple to implement | TLE on large inputs |
| **Monotonic Deque** | $O(n)$ | $O(k)$ | Optimal time | More complex logic |
| **Max Heap** | $O(n \log k)$ | $O(k)$ | Moderate improvement | Still slower than deque |

## Key Insights

```
nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3

Window 1: slice(0,3) = [1, 3, -1]
  max = 3 -> result = [3]

Window 2: slice(1,4) = [3, -1, -3]
  max = 3 -> result = [3, 3]

Window 3: slice(2,5) = [-1, -3, 5]
  max = 5 -> result = [3, 3, 5]

Window 4: slice(3,6) = [-3, 5, 3]
  max = 5 -> result = [3, 3, 5, 5]

Window 5: slice(4,7) = [5, 3, 6]
  max = 6 -> result = [3, 3, 5, 5, 6]

Window 6: slice(5,8) = [3, 6, 7]
  max = 7 -> result = [3, 3, 5, 5, 6, 7]
```

## Key Insights

1. **Why brute force is suboptimal**: We re-scan the entire window each time, even though only one element enters and one leaves.
2. **Monotonic deque is the way**: By maintaining a decreasing deque of indices, we get O(n) total time since each element is processed at most twice.
3. **Class-level state**: The implementation uses class properties (`largest`, `result`, etc.) which can cause issues if the method is called multiple times on the same instance — consider using local variables instead.
