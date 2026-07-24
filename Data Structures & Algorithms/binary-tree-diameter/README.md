# Binary Tree Diameter - LeetCode 543

## Problem Description

Given the root of a binary tree, return the length of the diameter of the tree.

The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.

The length of a path between two nodes is represented by the number of edges between them.

## Examples

### Example 1:
```
Input: root = [1,2,3,4,5]
Output: 3
Explanation: 3 is the length of the path [4,2,1,3] or [5,2,1,3].
```

### Example 2:
```
Input: root = [1,2]
Output: 1
```

## Constraints

- The number of nodes in the tree is in the range `[1, 10^4]`.
- `-100 <= Node.val <= 100`

## Topics

- Tree
- Depth-First Search
- Binary Tree

## Company Tags

- Facebook
- Google
- Amazon

## Solution Approaches

### 1. Brute Force (For Each Node)

**Intuition**: For every node, compute the height of its left and right subtrees. The diameter through that node is `leftHeight + rightHeight`. Track the maximum across all nodes.

**Algorithm**:
1. For each node, compute the height of its left subtree.
2. Compute the height of its right subtree.
3. The diameter through this node is `leftHeight + rightHeight`.
4. Recursively do this for all nodes and track the maximum.

**Time Complexity**: `O(n^2)` in the worst case (height computation is O(n) for each of n nodes).
**Space Complexity**: `O(h)` where h is the tree height (recursion stack).

### 2. DFS with Global Maximum (Optimal)

**Intuition**: Compute the height of each subtree in a single DFS pass. While computing heights, update a global maximum diameter as `leftHeight + rightHeight` at each node.

**Algorithm**:
1. Initialize a global `maxLength = 0`.
2. Define a recursive function that returns the height of a subtree.
3. At each node, compute `left = height(node.left)` and `right = height(node.right)`.
4. Update `maxLength = max(maxLength, left + right)`.
5. Return `max(left, right) + 1` as the height of this subtree.
6. After the DFS completes, `maxLength` holds the diameter.

**Time Complexity**: `O(n)` - each node is visited once.
**Space Complexity**: `O(h)` where h is the tree height (recursion stack).

## Visual Explanation

```
        1
       / \
      2   3
     / \
    4   5

Diameter through node 2: left(4) = 1, right(5) = 1, diameter = 2
Diameter through node 1: left(2) = 2, right(3) = 1, diameter = 3

Maximum diameter = 3 (path: 4 -> 2 -> 1 -> 3)
```

## Common Pitfalls

1. **Diameter vs height**: Diameter counts edges, not nodes. A single node has diameter 0.
2. **Path may not pass through root**: The longest path could be entirely in a subtree.
3. **Global variable**: Using a class-level variable to track max diameter avoids passing it through recursion.
