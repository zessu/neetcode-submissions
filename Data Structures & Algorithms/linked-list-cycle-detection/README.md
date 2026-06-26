# Linked List Cycle Detection - LeetCode 141

## Problem Description

Given the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.

Return `true` if there is a cycle in the linked list. Otherwise, return `false`.

## Examples

### Example 1:
```
Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
```

### Example 2:
```
Input: head = [1,2], pos = 0
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.
```

### Example 3:
```
Input: head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.
```

## Constraints

- The number of nodes in the list is in the range `[0, 10^4]`.
- `-10^5 <= Node.val <= 10^5`
- `pos` is `-1` or a valid index in the linked list.

## Topics

- Linked List
- Hash Table
- Two Pointers

## Company Tags

- Amazon
- Microsoft
- Google

## Solution Approaches

### 1. HashSet (Implemented)

**Intuition**: Traverse the linked list and store each visited node in a HashSet. If we encounter a node that's already in the set, we've found a cycle.

**Algorithm**:
1. Create an empty HashSet.
2. Traverse the list node by node.
3. If the current node is in the set, return `true` (cycle detected).
4. Otherwise, add the node to the set and move to the next node.
5. If we reach `null`, return `false` (no cycle).

**Time Complexity**: `O(n)` where n is the number of nodes.
**Space Complexity**: `O(n)` to store visited nodes.

### 2. Floyd's Tortoise and Hare (Optimal)

**Intuition**: Use two pointers moving at different speeds. If there's a cycle, the fast pointer will eventually catch up to the slow pointer.

**Algorithm**:
1. Initialize `slow` and `fast` pointers to `head`.
2. Move `slow` one step and `fast` two steps at each iteration.
3. If `slow === fast`, a cycle exists — return `true`.
4. If `fast` reaches `null`, no cycle — return `false`.

**Time Complexity**: `O(n)`
**Space Complexity**: `O(1)` — no extra space needed.

## Visual Explanation

```
List: 3 -> 2 -> 0 -> -4 -> 2 (cycle back)

HashSet approach:
  Visit 3  -> Set: {3}
  Visit 2  -> Set: {3, 2}
  Visit 0  -> Set: {3, 2, 0}
  Visit -4 -> Set: {3, 2, 0, -4}
  Visit 2  -> 2 already in set! Cycle detected ✓

Floyd's approach:
  Step 1: slow=3, fast=3
  Step 2: slow=2, fast=0
  Step 3: slow=0, fast=2
  Step 4: slow=-4, fast=-4 -> slow === fast! Cycle detected ✓
```

## Common Pitfalls

1. **Comparing node values instead of references**: Two different nodes can have the same value. You must compare node references.
2. **Null pointer errors**: Always check that `fast` and `fast.next` exist before advancing.
3. **HashSet stores references**: Make sure you're storing node objects, not values.
