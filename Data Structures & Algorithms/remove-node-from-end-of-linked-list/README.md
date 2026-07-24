# Remove Nth Node From End of List - LeetCode 19

## Problem Description

Given the head of a linked list, remove the `n-th` node from the end of the list and return its head.

## Examples

### Example 1:
```
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
```

### Example 2:
```
Input: head = [1], n = 1
Output: []
```

### Example 3:
```
Input: head = [1,2], n = 1
Output: [1]
```

## Constraints

- The number of nodes in the list is `sz`.
- `1 <= sz <= 30`
- `0 <= Node.val <= 100`
- `1 <= n <= sz`

## Topics

- Linked List
- Two Pointers

## Company Tags

- Amazon
- Google
- Microsoft

## Solution Approaches

### 1. Two Pass (Length Calculation)

**Intuition**: First pass: count the total number of nodes. Second pass: traverse to the node before the one to remove.

**Algorithm**:
1. First pass: count total nodes.
2. Calculate the position from the start: `sz - n`.
3. Second pass: traverse to that position and remove the next node.

**Time Complexity**: `O(sz)` - two passes through the list.
**Space Complexity**: `O(1)`

### 2. Reverse, Remove, Reverse (Implemented)

**Intuition**: Reverse the list, remove the n-th node from the start (which was n-th from end), then reverse back.

**Algorithm**:
1. Reverse the linked list.
2. Remove the n-th node from the start.
3. Reverse the list again to restore order.
4. Return the new head.

**Time Complexity**: `O(sz)` - three passes (reverse, remove, reverse).
**Space Complexity**: `O(1)`

### 3. One Pass (Two Pointers)

**Intuition**: Use two pointers separated by n nodes. When the fast pointer reaches the end, the slow pointer is at the node to remove.

**Algorithm**:
1. Initialize two pointers: `fast` and `slow`, both at a dummy node before head.
2. Advance `fast` by n + 1 steps.
3. Move both pointers until `fast` reaches the end.
4. `slow.next` is the node to remove; set `slow.next = slow.next.next`.

**Time Complexity**: `O(sz)` - one pass.
**Space Complexity**: `O(1)`

## Visual Explanation

```
Input: [1,2,3,4,5], n = 2

Remove 2nd from end = 4

After reverse: [5,4,3,2,1]
Remove 2nd from start (4): [5,3,2,1]
Reverse back: [1,2,3,5]
```

## Common Pitfalls

1. **Removing the head**: When n equals the list length, the head itself must be removed.
2. **Single node list**: Removing the only node should return null.
3. **Off-by-one errors**: Carefully track the position of the node to remove.
