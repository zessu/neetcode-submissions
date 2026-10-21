# Binary Tree Inorder Traversal - Solution

## Solution Code

The only submission is `submission-0.ts`.

```typescript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     constructor(val = 0, left = null, right = null) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    res: number[] = [];
    traverse(root: TreeNode | null) {
        if(!root) return;
        this.traverse(root.left);
        this.res.push(root.val);
        this.traverse(root.right);
    }
    /**
     * @param {TreeNode} root
     * @return {number[]}
     */
    inorderTraversal(root: TreeNode | null): number[] {
        this.traverse(root);
        return this.res;
    }
}
```

## Approach

The solution uses **recursive depth-first search** and records each node between its left and right subtree calls.

1. **Shared result**: `res` is a class field that accumulates the visited values.
2. **Base case**: `if(!root) return;` stops the recursion at every missing child.
3. **Left first**: `this.traverse(root.left)` explores the entire left subtree before the current node is recorded.
4. **Visit the root**: `this.res.push(root.val)` records the node at the correct inorder moment.
5. **Right last**: `this.traverse(root.right)` explores the right subtree.
6. **Return**: `inorderTraversal` starts the traversal once and returns `res`.

The order of the three statements inside `traverse` is the entire algorithm:

```
left  ->  root  ->  right
```

- **Time Complexity**: `O(n)` — each node is entered once and does `O(1)` work.
- **Space Complexity**: `O(h)` for the recursion stack, where `h` is the tree height. Worst case `O(n)` for a chain; `O(log n)` for a balanced tree. The output array uses `O(n)` additional space but is required by the problem.

## Walkthrough

### Example 1: `root = [1,null,2,3]`

```
        1
         \
          2
         /
        3
```

Call trace (`traverse` abbreviated as `t`):

```
t(1)
  t(1.left = null)        -> returns
  push 1                  -> res = [1]
  t(1.right = 2)
      t(2.left = 3)
          t(3.left = null)  -> returns
          push 3            -> res = [1, 3]
          t(3.right = null) -> returns
      push 2                -> res = [1, 3, 2]
      t(2.right = null)     -> returns
  return
```

Final result: `[1, 3, 2]`.

Notice that `3` is recorded before `2` because it is in `2`'s left subtree, even though `2` appears first in the level-order input.

### Example 2: `root = []`

```
t(null) -> returns immediately
return []
```

### Additional Example 3: `root = [1]`

```
t(1)
  t(null) -> returns
  push 1  -> res = [1]
  t(null) -> returns
return [1]
```

### Additional Example 4: `root = [1,2,3,4,5,null,6]`

```
        1
       / \
      2   3
     / \   \
    4   5   6

t(2) -> t(4) -> push 4 -> push 2 -> t(5) -> push 5
t(1) -> push 1
t(3) -> t(null) -> push 3 -> t(6) -> push 6
```

Result: `[4, 2, 5, 1, 3, 6]`.

## Comparison with the Alternatives

| Approach | Time | Space | Trade-off |
| :--- | :--- | :--- | :--- |
| **Recursive DFS (implemented)** | `O(n)` | `O(h)` | Shortest code and a direct translation of the definition. Uses the call stack. |
| **Iterative stack** | `O(n)` | `O(h)` | Same complexity, but makes the stack explicit and works even when recursion depth is a concern. More code and more room for ordering mistakes. |
| **Morris traversal** | `O(n)` | `O(1)` | Constant auxiliary space, but temporarily rewires `right` pointers and is harder to explain and debug. |

**Why the implemented approach is preferred:** for this problem the tree has at most `100` nodes, so recursion depth is not a practical concern. The recursive version is the clearest expression of "left, root, right" and has no extra data structure beyond the result array and the call stack. It is also the version most readers can verify at a glance.

**When an alternative wins:**

- **Iterative stack** is the expected answer to the follow-up question. It is preferable when the tree can be deep (thousands of levels), because an explicit stack avoids a potential call-stack overflow. It also exposes the traversal mechanics, which helps when the same pattern is adapted to problems like validating a BST.
- **Morris traversal** wins when `O(1)` auxiliary space is required, for example on memory-constrained systems or when the tree is enormous. The price is temporary mutation of the tree and a more intricate predecessor search.
- The **recursive** version remains the best default for small trees and for readability.

## Key Insights

1. **Position of the visit matters**: Inorder pushes the node after the left recursion and before the right recursion. Moving that single line produces preorder or postorder instead.
2. **The call stack is the traversal state**: Each frame remembers which node it is at and whether it still needs to process its right subtree.
3. **BST connection**: If the tree were a binary search tree, the inorder result would be sorted. That property is the basis for BST validation and for finding the k-th smallest element.
4. **Instance field caveat**: `res` is initialized once per `Solution` instance. If the same instance is reused for multiple calls, the previous results remain in the array. LeetCode's harness normally creates a new instance per test case, but a reusable implementation should reset `res` (or use a local array).
