# Longest Consecutive Sequence - Solution

## Solution Code (Optimal HashSet)

```javascript
class Solution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    longestConsecutive(nums) {
        const numSet = new Set(nums);
        let longest = 0;
        
        for (const num of nums) {
            // Only start counting if num is the start of a sequence
            if (!numSet.has(num - 1)) {
                let length = 0;
                while (numSet.has(num + length)) {
                    length++;
                }
                longest = Math.max(longest, length);
            }
        }
        
        return longest;
    }
}
```

## Solution Code (Another Sorting-Based Approach)

```javascript
class Solution {
    sortAndRemoveDuplicates(nums) {
        const sorted = nums.sort((a,b) => a - b);
        const items = new Set(sorted);
        return Array.from(items);
    }

    countSequence(nums) {
        let longestSequence = 0;
        for(let count=0; count<nums.length;count++) {
            const curr = nums[count];
            if(count === 0) {
                longestSequence++;
                continue;
            }
            const prev = nums[count-1];
            if((curr - 1) === prev) {
                longestSequence++;
            } else {
                longestSequence = 1;
            }
        }
        return longestSequence;
    }

    longestConsecutive(nums) {
        const sortedAndDeDuped = this.sortAndRemoveDuplicates(nums);
        return this.countSequence(sortedAndDeDuped);
    }
}
```

## Approach

### Optimal HashSet (O(n))
1. Put all elements in a HashSet for O(1) lookups
2. For each number `num`, check if it's a sequence starter (`num-1` not in set)
3. If yes, count consecutive numbers forward
4. Track maximum length

### Sorting (O(n log n))
1. Sort and remove duplicates
2. Count consecutive numbers in sorted array
3. Return max count

## Complexity Analysis

**HashSet**:
- Time: `O(n)` - each element processed once
- Space: `O(n)`

**Sorting**:
- Time: `O(n log n)`
- Space: `O(n)`

## Walkthrough

```
nums = [100, 4, 200, 1, 3, 2]

Set = {100, 4, 200, 1, 3, 2}

Check sequence starts:
- 100: has 99? No → length = 1
- 4: has 3? Yes → NOT a start
- 200: has 199? No → length = 1
- 1: has 0? No → length = 1,2,3,4 → length = 4 ✓
- 3: has 2? Yes → NOT a start
- 2: has 1? Yes → NOT a start

Output: 4
```