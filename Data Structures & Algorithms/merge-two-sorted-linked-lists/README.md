# Merge Two Sorted Linked Lists - LeetCode 21

## Problem Description

Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.

## Examples

### Example 1:
```
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
```

### Example 2:
```
Input: list1 = [], list2 = []
Output: []
```

### Example 3:
```
Input: list1 = [], list2 = [0]
Output: [0]
```

## Constraints

- The number of nodes in both lists is in the range `[0, 50]`.
- `-100 <= Node.val <= 100`
- Both `list1` and `list2` are sorted in non-decreasing order.

## Topics

- Linked List
- Recursion

## Company Tags

- Amazon
- Microsoft
- Apple

## Solution Approaches

### 1. Recursive (Implemented)

**Intuition**: Compare the heads of both lists. The smaller head becomes the current node, and we recursively merge the rest.

**Algorithm**:
1. If `list1` is null, return `list2`.
2. If `list2` is null, return `list1`.
3. If `list1.val <= list2.val`, set `list1.next` to the recursive merge of `list1.next` and `list2`, return `list1`.
4. Otherwise, set `list2.next` to the recursive merge of `list1` and `list2.next`, return `list2`.

**Time Complexity**: `O(n + m)` where n and m are the lengths of the two lists.
**Space Complexity**: `O(n + m)` due to the recursion stack.

### 2. Iterative with Dummy Node (Optimal)

**Intuition**: Use a dummy node and a pointer to build the merged list iteratively by always picking the smaller current node.

**Algorithm**:
1. Create a dummy node and a `tail` pointer.
2. While both lists are non-null, attach the smaller node to `tail` and advance that list.
3. Attach any remaining nodes.
4. Return `dummy.next`.

**Time Complexity**: `O(n + m)`
**Space Complexity**: `O(1)` — no extra space needed.

## Visual Explanation

```
list1: 1 -> 2 -> 4
list2: 1 -> 3 -> 4

Step 1: Compare 1 vs 1 -> pick list1(1), merge(2->4, 1->3->4)
Step 2: Compare 2 vs 1 -> pick list2(1), merge(2->4, 3->4)
Step 3: Compare 2 vs 3 -> pick list1(2), merge(4, 3->4)
Step 4: Compare 4 vs 3 -> pick list2(3), merge(4, 4)
Step 5: Compare 4 vs 4 -> pick list1(4), merge(null, 4)
Step 6: list1 is null -> return list2(4)

Result: 1 -> 1 -> 2 -> 3 -> 4 -> 4
```

## Common Pitfalls

1. **Stack overflow**: Recursive approach can hit stack limits for very long lists.
2. **Forgetting base cases**: Always handle null lists at the start.
3. **Mutating input**: Both approaches modify the original lists' `next` pointers.
