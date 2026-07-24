# Maximum Depth of Binary Tree - Solution

## Solution Code

```typescript
class Solution {
    maxDepth(root: TreeNode | null): number {
        if (root === null) return 0;
        return Math.max(this.maxDepth(root.left), this.maxDepth(root.right)) + 1;
    }
}
```

## Approach

The solution uses **Recursive DFS** to compute the maximum depth.

1. **Base case**: If the node is null, return 0.
2. **Recursive step**: Compute the depth of the left and right subtrees.
3. **Combine**: Return `1 + max(leftDepth, rightDepth)`.

- **Time Complexity**: O(n) where n is the number of nodes.
- **Space Complexity**: O(h) where h is the height of the tree (recursion stack).

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **BFS (Level Order)** | $O(n)$ | $O(w)$ | Iterative, no stack overflow | Uses queue, more code |
| **Recursive DFS** | $O(n)$ | $O(h)$ | Elegant, minimal code | Stack overflow for skewed trees |

## Key Insights

```
Input: root = [3,9,20,null,null,15,7]

        3
       / \
      9  20
        /  \
       15   7

maxDepth(3) = 1 + max(maxDepth(9), maxDepth(20))
maxDepth(9) = 1 + max(maxDepth(null), maxDepth(null)) = 1 + max(0, 0) = 1
maxDepth(20) = 1 + max(maxDepth(15), maxDepth(7))
maxDepth(15) = 1 + max(0, 0) = 1
maxDepth(7) = 1 + max(0, 0) = 1
maxDepth(20) = 1 + max(1, 1) = 2
maxDepth(3) = 1 + max(1, 2) = 3

Result: 3
```

## Key Insights

1. **Why recursive DFS**: The depth of a tree is naturally defined recursively, making this the most elegant solution.
2. **Base case**: A null node contributes 0 to the depth.
3. **Recurrence**: Each node adds 1 to the maximum of its children's depths.
