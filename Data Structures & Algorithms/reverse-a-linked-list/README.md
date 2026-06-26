# Reverse a Linked List - LeetCode 206

## Problem Description

Given the head of a singly linked list, reverse the list, and return the reversed list.

## Examples

### Example 1:
```
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
```

### Example 2:
```
Input: head = [1,2]
Output: [2,1]
```

### Example 3:
```
Input: head = []
Output: []
```

## Constraints

- The number of nodes in the list is in the range `[0, 5000]`.
- `-5000 <= Node.val <= 5000`

## Topics

- Linked List
- Recursion

## Company Tags

- Amazon
- Microsoft
- Apple
- Facebook

## Solution Approaches

### 1. Iterative (Implemented / Optimal)

**Intuition**: Use three pointers (`prev`, `curr`, `next`) to reverse each link one at a time as we traverse the list.

**Algorithm**:
1. Initialize `prev = null` and `curr = head`.
2. While `curr` is not null:
   - Save `next = curr.next`.
   - Reverse: `curr.next = prev`.
   - Advance: `prev = curr`, `curr = next`.
3. Return `prev` (new head).

**Time Complexity**: `O(n)` — single pass.
**Space Complexity**: `O(1)` — constant extra space.

### 2. Recursive

**Intuition**: Recursively reverse the rest of the list, then attach the current node to the end.

**Algorithm**:
1. Base case: if `head` or `head.next` is null, return `head`.
2. Recursively reverse `head.next`, getting the new head.
3. Set `head.next.next = head` (reverse the link).
4. Set `head.next = null` (break the old link).
5. Return the new head.

**Time Complexity**: `O(n)`
**Space Complexity**: `O(n)` due to the recursion stack.

## Visual Explanation

```
Input: 1 -> 2 -> 3 -> null

Iterative:
  Step 1: prev=null, curr=1, next=2
    1 -> null, prev=1, curr=2

  Step 2: prev=1, curr=2, next=3
    2 -> 1, prev=2, curr=3

  Step 3: prev=2, curr=3, next=null
    3 -> 2, prev=3, curr=null

  curr is null -> return prev = 3

Result: 3 -> 2 -> 1 -> null
```

## Common Pitfalls

1. **Losing the next pointer**: Always save `curr.next` before overwriting it.
2. **Forgetting to return prev**: After the loop, `prev` is the new head, not `curr` (which is null).
3. **Recursive stack overflow**: The recursive approach uses O(n) stack space.
