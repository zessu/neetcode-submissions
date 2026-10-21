# Lowest Common Ancestor of a Binary Search Tree - Solution

## Solution Code

```typescript
class Solution {
    lowestCommonAncestor(
        root: TreeNode | null,
        p: TreeNode | null,
        q: TreeNode | null,
    ) {
        if (!p || !q || !root) {
            return null;
        }

        if (p.val < root.val && q.val < root.val) {
            return this.lowestCommonAncestor(root.left, p, q);
        }

        if (p.val > root.val && q.val > root.val) {
            return this.lowestCommonAncestor(root.right, p, q);
        }

        return root;
    }
}
```

## Approach

The submission uses **BST-guided recursive descent**. It follows a single root-to-node path and stops at the first node whose value lies between the two targets (inclusive).

1. **Guard clause**: if `root`, `p`, or `q` is `null`, return `null`. Under the problem constraints `p` and `q` always exist, so this branch is defensive; it also handles an empty tree cleanly.
2. **Both targets to the left**: if `p.val < root.val` and `q.val < root.val`, then by the BST invariant both nodes are in the left subtree. The LCA cannot be `root` (its right side has nothing to contribute) and cannot be above `root`, so recurse left.
3. **Both targets to the right**: symmetrically, if both values are greater than `root.val`, recurse right.
4. **Split point**: in every other case, at least one target equals the current value or the two targets lie on different sides. `root` is then the lowest node that can reach both, so return it.

- **Time Complexity**: `O(h)` where `h` is the tree height — each recursive call discards one entire subtree and moves down one level. `O(log n)` when balanced, `O(n)` when skewed.
- **Space Complexity**: `O(h)` for the recursion stack, for the same reason.

## Walkthrough

### Example 1: `root = [6,2,8,0,4,7,9,null,null,3,5]`, `p = 2`, `q = 8`

```
          6
        /   \
       2     8
      / \   / \
     0   4 7   9
        / \
       3   5
```

```
lowestCommonAncestor(6, 2, 8)
  p.val = 2 < 6   -> not both smaller
  q.val = 8 > 6   -> not both larger
  -> values straddle 6, return 6
```

Result: node `6`.

### Example 2: `p = 2`, `q = 4`

```
lowestCommonAncestor(6, 2, 4)
  2 < 6 and 4 < 6            -> recurse left
lowestCommonAncestor(2, 2, 4)
  2 < 2 is false             -> not both smaller
  2 > 2 is false             -> not both larger
  -> current node equals p, q lies to its right, return 2
```

Result: node `2`. This is the case that requires strict inequalities: with `<=` in the first branch, the walk would incorrectly descend into `0` or stop being able to return `2`.

### Example 3: `root = [2,1]`, `p = 2`, `q = 1`

```
lowestCommonAncestor(2, 2, 1)
  2 < 2 false, 2 > 2 false  -> return 2
```

Result: node `2`, because a node is its own descendant.

### Extra trace: `p = 3`, `q = 5`

```
lowestCommonAncestor(6, 3, 5)  -> both < 6  -> left
lowestCommonAncestor(2, 3, 5)  -> both > 2  -> right
lowestCommonAncestor(4, 3, 5)  -> 3 < 4, 5 > 4 -> return 4
```

Three comparisons along a single path — no subtree is ever visited twice.

## Comparison with the Alternatives

| Approach | Time | Space | Why it is or is not chosen here |
| :--- | :--- | :--- | :--- |
| **BST recursive descent (implemented)** | `O(h)` | `O(h)` | The clearest expression of the split rule: three branches, no bookkeeping, and it leverages the BST ordering fully. Chosen for readability. |
| **BST iterative walk** | `O(h)` | `O(1)` | Same number of comparisons with no call stack. Better for very deep/skewed trees (up to `10^5` nodes here) and avoids stack-overflow risk. This is what NeetCode recommends as the final answer. |
| **General binary tree LCA (LeetCode 236)** | `O(n)` | `O(h)` | Correct for any binary tree and useful when the BST invariant is unavailable. On a BST it wastes work: it may explore both subtrees when a single comparison would eliminate one. |

**Why the recursive version is still preferred here**: it is the shortest correct implementation and mirrors the definition of a BST search. Since the recursion is tail-recursive, a compiler could in principle reuse the frame, though JavaScript engines generally do not perform tail-call optimization.

**When an alternative wins**:

- **Worst-case height matters** (`n = 10^5`, possibly a chain): use the iterative walk. The recursive version can throw `RangeError: Maximum call stack size exceeded` on a degenerate BST.
- **The tree is not a BST** (LeetCode 236): the general post-order LCA is the only correct option; the BST comparisons would prune the wrong subtree.
- **You need the ancestor path** for follow-up work: build root-to-node paths with arrays; the last common element is the LCA. That costs `O(h)` memory but gives you the whole path, which the other approaches discard.

## Key Insights

1. **The first split is the answer**: the LCA is the first node on the root-to-target paths where the two paths diverge. BST ordering makes "diverged" a two-comparison test.
2. **Strict comparisons encode "or equal"**: equality is handled by falling through to `return root`, which is exactly the "a node is its own descendant" rule.
3. **Only one path is explored**: at each step one subtree is eliminated, so the work is proportional to the height, not the node count.
4. **`O(h)` is not automatically `O(log n)`**: a BST can be skewed. The bound is `O(n)` worst case, and that is also the recursion-space worst case.
5. **Return the node, not the value**: the caller expects a `TreeNode` reference; returning `root.val` would fail type checks and any follow-up traversal.
