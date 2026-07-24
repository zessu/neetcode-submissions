# Binary Tree Diameter - Solution

## Solution Code

```typescript
class Solution {
    maxLength = 0;
    diameterOfBinaryTree(root: TreeNode | null): number {
        const findDiameter = (root: TreeNode | null) => {
            if(root === null) return 0;
            const left = findDiameter(root.left);
            const right = findDiameter(root.right);
            this.maxLength = Math.max(this.maxLength, left + right);
            return Math.max(left, right) + 1;
        }

        findDiameter(root);
        return this.maxLength;
    }
}
```

## Approach

The solution uses **DFS with Global Maximum** to compute the diameter in a single pass.

1. **Global tracker**: `maxLength` stores the maximum diameter found so far.
2. **Recursive height function**: `findDiameter` returns the height of the subtree rooted at the given node.
3. **At each node**: Compute left and right subtree heights, then update `maxLength` with `left + right`.
4. **Return height**: The height of a subtree is `max(left, right) + 1`.
5. **Final result**: After the DFS completes, `maxLength` contains the diameter.

- **Time Complexity**: O(n) where n is the number of nodes.
- **Space Complexity**: O(h) where h is the height of the tree (recursion stack).

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Brute Force** | $O(n^2)$ | $O(h)$ | Simple concept | Recomputes heights repeatedly |
| **DFS with Global Max** | $O(n)$ | $O(h)$ | Single pass, optimal | Requires global variable |

## Key Insights

```
Input: root = [1,2,3,4,5]

        1
       / \
      2   3
     / \
    4   5

DFS Traversal:
  Node 4: left=0, right=0, maxLength = max(0, 0+0) = 0, return 1
  Node 5: left=0, right=0, maxLength = max(0, 0+0) = 0, return 1
  Node 2: left=1, right=1, maxLength = max(0, 1+1) = 2, return 2
  Node 3: left=0, right=0, maxLength = max(2, 0+0) = 2, return 1
  Node 1: left=2, right=1, maxLength = max(2, 2+1) = 3, return 3

Result: 3
```

## Key Insights

1. **Why DFS with global max**: Avoids recomputing heights by combining height calculation and diameter tracking in one pass.
2. **Diameter formula**: At each node, the diameter through it is `leftHeight + rightRight` (number of edges).
3. **Global variable necessity**: The diameter may not pass through the root, so we must track the maximum across all nodes.
