# Merge k Sorted Lists - LeetCode 23

## Problem Description

You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

## Examples

### Example 1:
```
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: The linked-lists are:
[
  1->4->5,
  1->3->4,
  2->6
]
merging them into one sorted list: 1->1->2->3->4->4->5->6
```

### Example 2:
```
Input: lists = []
Output: []
```

### Example 3:
```
Input: lists = [[]]
Output: []
```

## Constraints

- `k == lists.length`
- `0 <= k <= 10^4`
- `0 <= lists[i].length <= 500`
- `-10^4 <= lists[i][j] <= 10^4`
- `lists[i]` is sorted in ascending order.
- The sum of `lists[i].length` will not exceed `10^4`.

## Topics

- Linked List
- Divide and Conquer
- Heap (Priority Queue)
- Merge Sort

## Company Tags

- Facebook
- Amazon
- Microsoft

## Solution Approaches

### 1. Collect All Values and Sort

**Intuition**: Extract all values from all lists, sort them, and create a new linked list.

**Algorithm**:
1. Traverse all lists and collect all values into an array.
2. Sort the array.
3. Create a new linked list from the sorted values.

**Time Complexity**: `O(N log N)` where N is the total number of nodes.
**Space Complexity**: `O(N)` for the values array and new list.

### 2. Iterative Min Selection (Implemented)

**Intuition**: At each step, find the minimum value among all list heads, append it to the result, and advance that list.

**Algorithm**:
1. Create a dummy head for the result list.
2. While any list still has nodes:
   - Find the minimum value among all current list heads.
   - Append the node with the minimum value to the result.
   - Advance that list to its next node.
3. Return the result list.

**Time Complexity**: `O(k * N)` where k is the number of lists and N is the total number of nodes.
**Space Complexity**: `O(1)` beyond the result list.

### 3. Min-Heap (Priority Queue)

**Intuition**: Use a min-heap to efficiently find the smallest element among all list heads.

**Algorithm**:
1. Push the head of each non-empty list into a min-heap.
2. While the heap is not empty:
   - Pop the smallest node.
   - Append it to the result.
   - If the popped node has a next, push it into the heap.
3. Return the result.

**Time Complexity**: `O(N log k)` where N is total nodes and k is the number of lists.
**Space Complexity**: `O(k)` for the heap.

## Visual Explanation

```
lists = [[1,4,5], [1,3,4], [2,6]]

Step 1: heads = [1, 1, 2] -> min = 1 (list 0)
Step 2: heads = [4, 1, 2] -> min = 1 (list 1)
Step 3: heads = [4, 3, 2] -> min = 2 (list 2)
Step 4: heads = [4, 3, 6] -> min = 3 (list 1)
Step 5: heads = [4, 4, 6] -> min = 4 (list 0)
Step 6: heads = [5, 4, 6] -> min = 4 (list 1)
Step 7: heads = [5, null, 6] -> min = 5 (list 0)
Step 8: heads = [null, null, 6] -> min = 6 (list 2)

Result: 1->1->2->3->4->4->5->6
```

## Common Pitfalls

1. **Empty lists**: Handle empty input array and empty sub-lists.
2. **All lists exhausted**: Break when all lists are null.
3. **Infinity sentinel**: Use Infinity for null list values when comparing.
