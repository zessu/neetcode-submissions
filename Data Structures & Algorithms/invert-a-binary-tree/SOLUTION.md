# Invert Binary Tree - Solution

## Solution Code

```typescript
class Solution {
    invertTree(root: TreeNode | null): TreeNode {
        if(root === null) return null;
        [root.left, root.right] = [root.right, root.left];
        this.invertTree(root.left);
        this.invertTree(root.right);
        return root;
    }
}
```

## Approach

The solution uses **Recursive DFS** with pre-order traversal (swap first, then recurse).

1. **Base case**: If the node is null, return null.
2. **Swap**: Use destructuring to swap `root.left` and `root.right`.
3. **Recurse**: Invert the left subtree, then invert the right subtree.
4. **Return**: Return the root of the inverted tree.

- **Time Complexity**: O(n) where n is the number of nodes.
- **Space Complexity**: O(h) where h is the height of the tree (recursion stack).

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **BFS** | $O(n)$ | $O(w)$ | Iterative, no stack overflow | Uses queue, more code |
| **Recursive DFS** | $O(n)$ | $O(h)$ | Elegant, minimal code | Stack overflow for skewed trees |

## Key Insights

```
Input: root = [4,2,7,1,3,6,9]

    4
   / \
  2   7
 / \ / \
1  3 6  9

Step 1: Swap at node 4: left=7, right=2
Step 2: Recurse left (node 7): swap 6 and 9
Step 3: Recurse right (node 2): swap 1 and 3

Result:
    4
   / \
  7   2
 / \ / \
9  6 3  1
```

## Key Insights

1. **Why recursive DFS**: The most elegant solution - swap at each node and recurse on both subtrees.
2. **Destructuring swap**: `[root.left, root.right] = [root.right, root.left]` is a clean way to swap without a temp variable.
3. **Pre-order vs post-order**: Both work. Pre-order (swap then recurse) and post-order (recurse then swap) produce the same result.
