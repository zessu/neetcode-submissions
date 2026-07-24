# Maximum Depth of Binary Tree - LeetCode 104

## Problem Description

Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

## Examples

### Example 1:
```
Input: root = [3,9,20,null,null,15,7]
Output: 3
```

### Example 2:
```
Input: root = [1,null,2]
Output: 2
```

## Constraints

- The number of nodes in the tree is in the range `[0, 10^4]`.
- `-100 <= Node.val <= 100`

## Topics

- Tree
- Depth-First Search
- Breadth-First Search
- Binary Tree

## Company Tags

- Amazon
- Google
- Facebook

## Solution Approaches

### 1. Breadth-First Search (Level Order)

**Intuition**: Traverse the tree level by level using a queue. Count the number of levels.

**Algorithm**:
1. If root is null, return 0.
2. Initialize a queue with the root node and a depth counter at 0.
3. While the queue is not empty, process all nodes at the current level.
4. For each level processed, increment the depth counter.
5. Return the depth counter.

**Time Complexity**: `O(n)` where n is the number of nodes.
**Space Complexity**: `O(w)` where w is the maximum width of the tree (queue size).

### 2. Recursive DFS (Optimal)

**Intuition**: The maximum depth of a tree is `1 + max(depth of left subtree, depth of right subtree)`.

**Algorithm**:
1. If the node is null, return 0.
2. Recursively compute the depth of the left subtree.
3. Recursively compute the depth of the right subtree.
4. Return `1 + max(leftDepth, rightDepth)`.

**Time Complexity**: `O(n)` - each node is visited once.
**Space Complexity**: `O(h)` where h is the height of the tree (recursion stack).

## Visual Explanation

```
        3
       / \
      9  20
        /  \
       15   7

Depth = 1 + max(depth(left), depth(right))
      = 1 + max(1, 2)
      = 3
```

## Common Pitfalls

1. **Empty tree**: A null root has depth 0.
2. **Leaf node**: A single node has depth 1, not 0.
3. **Unbalanced trees**: Skewed trees have O(n) recursion depth, which may cause stack overflow for very large inputs.
