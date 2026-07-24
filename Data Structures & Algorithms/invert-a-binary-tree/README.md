# Invert Binary Tree - LeetCode 226

## Problem Description

Given the root of a binary tree, invert the tree, and return its root.

Inverting a binary tree means swapping the left and right children of every node in the tree.

## Examples

### Example 1:
```
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]
```

### Example 2:
```
Input: root = [2,1,3]
Output: [2,3,1]
```

### Example 3:
```
Input: root = []
Output: []
```

## Constraints

- The number of nodes in the tree is in the range `[0, 100]`.
- `-100 <= Node.val <= 100`

## Topics

- Tree
- Depth-First Search
- Breadth-First Search
- Binary Tree

## Company Tags

- Google (famous for: "90% of our engineers use the software you wrote, but you can't invert a binary tree on a whiteboard")

## Solution Approaches

### 1. BFS (Level Order)

**Intuition**: Traverse the tree level by level, swapping left and right children at each node.

**Algorithm**:
1. If root is null, return null.
2. Initialize a queue with the root node.
3. While the queue is not empty, dequeue a node.
4. Swap its left and right children.
5. Enqueue the children (if not null).
6. Return the root.

**Time Complexity**: `O(n)` where n is the number of nodes.
**Space Complexity**: `O(w)` where w is the maximum width of the tree (queue size).

### 2. Recursive DFS (Optimal)

**Intuition**: Recursively invert the left and right subtrees, then swap them at each node.

**Algorithm**:
1. If the node is null, return null.
2. Swap the left and right children.
3. Recursively invert the left subtree.
4. Recursively invert the right subtree.
5. Return the root.

**Time Complexity**: `O(n)` - each node is visited once.
**Space Complexity**: `O(h)` where h is the height of the tree (recursion stack).

## Visual Explanation

```
Before:              After:
    4                    4
   / \                  / \
  2   7     ---->      7   2
 / \ / \              / \ / \
1  3 6  9            9  6 3  1
```

## Common Pitfalls

1. **Null root**: An empty tree should return null.
2. **Swap before recursion**: Make sure to swap children before or during the recursive calls.
3. **Both subtrees must be inverted**: Forgetting to recurse on both sides leaves the tree partially inverted.
