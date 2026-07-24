# Reverse Nodes in k-Group - LeetCode 25

## Problem Description

Given the head of a linked list, reverse the nodes of the list `k` at a time, and return the modified list.

`k` is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of `k` then left-out nodes, in the end, should remain as it is.

You may not alter the values in the list's nodes, only nodes themselves may be changed.

## Examples

### Example 1:
```
Input: head = [1,2,3,4,5], k = 2
Output: [2,1,4,3,5]
```

### Example 2:
```
Input: head = [1,2,3,4,5], k = 3
Output: [3,2,1,4,5]
```

## Constraints

- The number of nodes in the list is `n`.
- `1 <= k <= n <= 5000`
- `0 <= Node.val <= 1000`

## Topics

- Linked List
- Recursion

## Company Tags

- Amazon
- Microsoft
- Google

## Solution Approaches

### 1. Recursive

**Intuition**: Reverse the first k nodes, then recursively reverse the rest of the list.

**Algorithm**:
1. Check if there are at least k nodes remaining. If not, return the head as-is.
2. Reverse the first k nodes.
3. Recursively call on the rest of the list and connect it to the reversed portion.
4. Return the new head (which was the k-th node).

**Time Complexity**: `O(n)` - each node is visited a constant number of times.
**Space Complexity**: `O(n/k)` for the recursion stack.

### 2. Iterative (Implemented)

**Intuition**: Count total nodes, then reverse each group of k nodes iteratively.

**Algorithm**:
1. Count the total number of nodes.
2. Calculate how many full groups of k exist.
3. For each group, reverse the k nodes and connect to the previous group's tail.
4. Any remaining nodes (less than k) stay as-is.

**Time Complexity**: `O(n)` - each node is visited a constant number of times.
**Space Complexity**: `O(1)` - iterative, no recursion stack.

## Visual Explanation

```
Input: [1,2,3,4,5], k = 2

Group 1: [1,2] -> reverse -> [2,1]
Group 2: [3,4] -> reverse -> [4,3]
Remaining: [5] -> keep as-is

Result: [2,1,4,3,5]
```

## Common Pitfalls

1. **Incomplete last group**: If fewer than k nodes remain, they should not be reversed.
2. **Connecting groups**: The tail of each reversed group must connect to the head of the next group.
3. **Edge case k=1**: No reversal needed; return the original list.
