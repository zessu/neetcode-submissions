# Binary Tree Preorder Traversal - Solution

## Solution Code

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
        this.res.push(root.val);
        this.traverse(root.left);
        this.traverse(root.right);
    }
    /**
     * @param {TreeNode} root
     * @return {number[]}
     */
    preorderTraversal(root: TreeNode | null): number[] {
        this.traverse(root);
        return this.res;
    }
}
```

## Approach

The solution uses **recursive depth-first search**. A helper `traverse` performs the preorder visit, and the public method seeds it with the root and returns the accumulated array.

1. **Base case**: `if (!root) return;` — a null subtree contributes nothing, and an empty tree yields `[]`.
2. **Visit first**: `this.res.push(root.val)` — the current node is recorded *before* either child, which is what makes the traversal preorder.
3. **Left subtree**: `this.traverse(root.left)` — fully explore the left side next.
4. **Right subtree**: `this.traverse(root.right)` — then the right side.
5. **Return**: `preorderTraversal` calls `traverse(root)` and returns `this.res`.

The result array is a class field, so the recursive helper does not need an extra parameter.

- **Time Complexity**: `O(n)` — one call per node, with `O(1)` work per call.
- **Space Complexity**: `O(h)` for the recursion stack, where `h` is the height of the tree. This is `O(log n)` for a balanced tree and `O(n)` for a skewed one. The returned array is `O(n)` and is required output.

## Walkthrough

### Example 1: `root = [1, null, 2, 3]`

The array is a level-order encoding: `1` is the root, its left child is `null`, its right child is `2`, and `3` is the left child of `2`.

```
        1
         \
          2
         /
        3
```

| Call | Action | `res` after the call |
| :--- | :--- | :--- |
| `traverse(1)` | push `1` | `[1]` |
| `traverse(null)` (left of 1) | return immediately | `[1]` |
| `traverse(2)` | push `2` | `[1, 2]` |
| `traverse(3)` | push `3` | `[1, 2, 3]` |
| `traverse(null)` (left of 3) | return | `[1, 2, 3]` |
| `traverse(null)` (right of 3) | return | `[1, 2, 3]` |
| back in `traverse(2)` | right child null | `[1, 2, 3]` |
| back in `traverse(1)` | right child done | `[1, 2, 3]` |

**Output:** `[1, 2, 3]`.

### Additional example: `root = [1, 2, 3, 4, 5, 6, 7]`

```
          1
        /   \
       2     3
      / \   / \
     4   5 6   7
```

| Step | Visit | Why |
| :--- | :--- | :--- |
| 1 | `1` | root is recorded on entry |
| 2 | `2` | left child of `1` |
| 3 | `4` | left child of `2` |
| 4 | `5` | right child of `2` (left subtree of `1` complete) |
| 5 | `3` | right child of `1` |
| 6 | `6` | left child of `3` |
| 7 | `7` | right child of `3` |

**Output:** `[1, 2, 4, 5, 3, 6, 7]`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it might be chosen |
| :--- | :--- | :--- | :--- |
| **Recursive DFS** (implemented) | `O(n)` | `O(h)` | The most direct expression of the definition: one append and two calls. Ideal for interviews and for the given 100-node limit. |
| **Explicit Stack** | `O(n)` | `O(h)` | No recursion-depth risk and the same asymptotic space. It is the standard follow-up answer; the only trap is pushing right before left. |
| **Morris Traversal** | `O(n)` | `O(1)` | The only approach with constant auxiliary space, useful for huge trees or memory-constrained environments. It temporarily rewrites `right` pointers, so it is unsuitable for immutable or concurrently-read trees, and the thread bookkeeping is easy to break. |

**Why the recursive approach is preferred here**: preorder has no branching state to manage. The helper's three statements *are* the specification, so there is very little to get wrong, and `O(h)` recursion is fine for at most 100 nodes.

**When an alternative wins**:

- **Deep or adversarial trees**: recursion can overflow the call stack at `O(n)` height. The explicit stack moves that storage to the heap and is the safer production choice.
- **Strict `O(1)` memory**: Morris is the only option. It is also a good demonstration that preorder does not inherently require a stack, because the node is visited before descending.
- **Read-only shared trees**: avoid Morris; use the recursive or explicit-stack version, since Morris mutates the tree (even though it restores it).

## Key Insights

1. **Preorder records on entry**: the append must come before both recursive calls. Moving it between the calls gives inorder; moving it after both gives postorder.
2. **The root is always first**, and each subtree is a contiguous block in the output. For `[1,2,3,4,5,6,7]`, everything after `1` splits into the left block `2,4,5` and the right block `3,6,7`.
3. **The iterative stack reverses child order**: because the stack is LIFO, pushing right then left is what preserves the node → left → right order. This is the single most common bug in the iterative version.
4. **Stack size is the height, not the node count**: the stack contains at most one pending sibling per level, so it is `O(h)`, not `O(n)`, for a balanced tree.
5. **`res` lives on the instance**: it is initialized once. LeetCode creates a fresh `Solution` per test, but reusing an instance across calls would append to previous results.
