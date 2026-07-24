# Copy List with Random Pointer - LeetCode 138

## Problem Description

A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null.

Construct a deep copy of the list. The deep copy should consist of exactly n brand new nodes, where each new node has its value set to the value of its corresponding original node. Both the next and random pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state. None of the pointers in the new list should point to nodes in the original list.

Return the head of the copied linked list.

## Examples

### Example 1:
```
Input: head = [[7,null],[7,1],[13,0],[10,1],[5,null]]
Output: [[7,null],[7,1],[13,0],[10,1],[5,null]]
```

### Example 2:
```
Input: head = [[1,1],[2,1]]
Output: [[1,1],[2,1]]
```

### Example 3:
```
Input: head = [[3,null],[3,0],[3,null]]
Output: [[3,null],[3,0],[3,null]]
```

## Constraints

- `0 <= n <= 1000`
- `-10^4 <= Node.val <= 10^4`
- `Node.random` is null or points to a node in the list.

## Topics

- Hash Table
- Linked List

## Company Tags

- Amazon
- Microsoft
- Google

## Solution Approaches

### 1. Hash Map (Two Pass)

**Intuition**: Use a hash map to store the mapping from original nodes to their clones. First pass: create all clone nodes. Second pass: set next and random pointers using the map.

**Algorithm**:
1. First pass: traverse the list, create a clone of each node, and store `original -> clone` in a hash map.
2. Second pass: for each original node, set `clone.next = map[original.next]` and `clone.random = map[original.random]`.
3. Return the clone of the head.

**Time Complexity**: `O(n)`
**Space Complexity**: `O(n)` for the hash map.

### 2. Interweaving Nodes (Optimal - O(1) Extra Space)

**Intuition**: Interleave cloned nodes with original nodes in the list. This allows us to access the clone of any node via `original.next`, eliminating the need for a hash map.

**Algorithm**:
1. **First pass**: For each node, insert its clone right after it. `original -> clone -> original.next`.
2. **Second pass**: Set `clone.random = original.random.next` (the clone of the random target).
3. **Third pass**: Separate the interleaved list back into original and copied lists.
4. Return the head of the copied list.

**Time Complexity**: `O(n)` - three passes through the list.
**Space Complexity**: `O(1)` - no extra space beyond the cloned nodes themselves.

## Visual Explanation

```
Original: [7] -> [7] -> [13] -> [10] -> [5]
           |      |      |       |      |
          null    7     null     7     null

After interweaving:
[7] -> [7'] -> [7] -> [7'] -> [13] -> [13'] -> [10] -> [10'] -> [5] -> [5']

Set random pointers on clones, then separate.
```

## Common Pitfalls

1. **Random pointer to null**: Handle cases where `random` is null carefully.
2. **Separation logic**: The third pass must correctly restore the original list and extract the clone.
3. **Edge cases**: Empty list (head is null) should return null immediately.
