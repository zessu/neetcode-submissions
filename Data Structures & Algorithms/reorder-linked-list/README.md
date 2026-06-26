# Reorder Linked List - LeetCode 143

## Problem Description

You are given the head of a singly linked-list. The list can be represented as:

`L0 → L1 → … → Ln - 1 → Ln`

Reorder the list to be in the following form:

`L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …`

You may not modify the values in the list's nodes. Only nodes themselves may be changed.

## Examples

### Example 1:
```
Input: head = [1,2,3,4]
Output: [1,4,2,3]
```

### Example 2:
```
Input: head = [1,2,3,4,5]
Output: [1,5,2,4,3]
```

## Constraints

- The number of nodes in the list is in the range `[1, 5 * 10^4]`.
- `1 <= Node.val <= 1000`

## Topics

- Linked List
- Two Pointers
- Stack

## Company Tags

- Amazon
- Microsoft
- Facebook

## Solution Approaches

### 1. Find Middle + Reverse + Merge (Implemented / Optimal)

**Intuition**: Split the list in half, reverse the second half, then merge the two halves alternately.

**Algorithm**:
1. Use slow/fast pointers to find the middle of the list.
2. Reverse the second half of the list.
3. Merge the first half and reversed second half by alternating nodes.

**Time Complexity**: `O(n)` — three passes through the list.
**Space Complexity**: `O(1)` — in-place manipulation.

### 2. Stack-Based

**Intuition**: Push all nodes onto a stack, then pop from the stack while iterating from the front to interleave nodes.

**Algorithm**:
1. Traverse the list and push all nodes onto a stack.
2. Iterate from the head, alternating between the current front node and the stack top.
3. Stop after `n/2` iterations and set the last node's `next` to `null`.

**Time Complexity**: `O(n)`
**Space Complexity**: `O(n)` for the stack.

### 3. Array-Based

**Intuition**: Store all nodes in an array, then use two pointers (start and end) to rebuild the list.

**Time Complexity**: `O(n)`
**Space Complexity**: `O(n)` for the array.

## Visual Explanation

```
Input: 1 -> 2 -> 3 -> 4 -> 5

Step 1 - Find middle:
  slow = 3, fast = 5

Step 2 - Reverse second half:
  First half:  1 -> 2 -> 3
  Second half: 5 -> 4

Step 3 - Merge alternately:
  1 -> 5 -> 2 -> 4 -> 3

Result: [1, 5, 2, 4, 3]
```

## Common Pitfalls

1. **Forgetting to break the list**: Must set `slow.next = null` after finding the middle to avoid cycles.
2. **Off-by-one in merge**: The second half can be shorter; stop merging when `ptr2` (second half) is null.
3. **Not reversing correctly**: Ensure all pointers are properly updated during the reverse step.
