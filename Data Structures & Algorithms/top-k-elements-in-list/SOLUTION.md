# Top K Frequent Elements - Solution

## Solution Code

```javascript
class Solution {
    itemsMap = new Map();

    topKFrequent(nums, k) {
        // Count frequencies
        for(const item in nums) {
            const valueInMap = this.itemsMap.get(nums[item]);
            if(!valueInMap) {
                this.itemsMap.set(nums[item], 0);
            }
            this.itemsMap.set(nums[item], valueInMap ? valueInMap + 1 : 1);
        }

        // Convert to array and sort by frequency
        const mapToArray = Array.from(this.itemsMap);
        const sorted = mapToArray.sort((a, b) => b[1] - a[1]);
        const sliced = sorted.slice(0, k);
        const res = [];
        sliced.map(item => res.push(item[0]));
        return res;
    }
}
```

## Solution Code (Bucket Sort - Optimal)

```javascript
class Solution {
    topKFrequent(nums, k) {
        const count = new Map();
        for (const num of nums) {
            count.set(num, (count.get(num) || 0) + 1);
        }
        
        // Bucket sort: index = frequency
        const bucket = new Array(nums.length + 1).fill(null).map(() => []);
        for (const [num, freq] of count) {
            bucket[freq].push(num);
        }
        
        // Get top k from highest frequency buckets
        const result = [];
        for (let i = bucket.length - 1; i >= 0 && result.length < k; i--) {
            if (bucket[i]) {
                result.push(...bucket[i]);
            }
        }
        
        return result.slice(0, k);
    }
}
```

## Approach

1. **Hash Map**: Count frequency of each element
2. **Sort by frequency** and take top k
3. **Alternative (Bucket Sort)**: Use frequency as bucket index for O(n)

## Complexity

- **Hash + Sort**: O(n log n)
- **Bucket Sort**: O(n)
- **Space**: O(n)

## Walkthrough

```
nums = [1,1,1,2,2,3], k = 2

Count:
- 1: 3
- 2: 2
- 3: 1

Sort by count:
- (1, 3)
- (2, 2)
- (3, 1)

Top 2: [1, 2] ✓
```