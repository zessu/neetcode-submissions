# Balanced Binary Tree - Solution

## Solution Code

The latest submission is `submission-3.ts`. It is identical to `submission-2.ts`, so the final implementation is documented here.

```typescript
class Solution {
    isBalanced(root: TreeNode | null): boolean {
        let balanced = true;
        const traverse = (root: TreeNode | null) => {
            if(root === null) return 0;
            const left = traverse(root.left);
            const right = traverse(root.right);
            const res = left - right;
            if(Math.abs(res) > 1) balanced = false;
            return Math.max(left, right) + 1;
        }
        traverse(root);
        return balanced;
    }
}
```

## Approach

The solution uses **post-order DFS with a global flag** to check balance and compute heights in a single pass.

1. **Flag**: `balanced` starts as `true`. It is flipped to `false` if any node violates the height condition.
2. **Base case**: `traverse(null)` returns `0`, so an empty subtree has height zero.
3. **Children first**: `left` and `right` are the heights of the two subtrees, computed recursively before the current node is examined. This is post-order traversal.
4. **Balance check**: `res = left - right`; if `Math.abs(res) > 1`, the current node is unbalanced, so the flag is cleared. Note that the code deliberately does **not** stop recursing here — the remaining heights are still needed by ancestors.
5. **Return height**: `Math.max(left, right) + 1` is the height of the subtree rooted at the current node (counting nodes).
6. **Answer**: after the single traversal, return the flag.

- **Time Complexity**: `O(n)` — every node is entered once and does constant work.
- **Space Complexity**: `O(h)` — the recursion stack holds one frame per level, where `h` is the tree height. Worst case `O(n)` for a chain; `O(log n)` for a balanced tree.

## Walkthrough

### Example 1: `root = [3,9,20,null,null,15,7]`

```
        3
       / \
      9  20
         / \
        15  7
```

The DFS reaches the leaves first and returns heights upward:

```
node 9:  left = 0, right = 0, |0 - 0| = 0, balanced = true,  return 1
node 15: left = 0, right = 0, |0 - 0| = 0, balanced = true,  return 1
node 7:  left = 0, right = 0, |0 - 0| = 0, balanced = true,  return 1
node 20: left = 1, right = 1, |1 - 1| = 0, balanced = true,  return 2
node 3:  left = 1, right = 2, |1 - 2| = 1, balanced = true,  return 3
```

No node has a difference greater than `1`, so the result is `true`.

### Example 2: `root = [1,2,2,3,3,null,null,4,4]`

```
        1
       / \
      2   2
     / \
    3   3
   / \
  4   4
```

```
node 4 (left):  left = 0, right = 0, |0 - 0| = 0, balanced = true,  return 1
node 4 (right): left = 0, right = 0, |0 - 0| = 0, balanced = true,  return 1
node 3 (left):  left = 1, right = 1, |1 - 1| = 0, balanced = true,  return 2
node 3 (right): left = 0, right = 0, |0 - 0| = 0, balanced = true,  return 1
node 2 (left):  left = 2, right = 1, |2 - 1| = 1, balanced = true,  return 3
node 2 (right): left = 0, right = 0, |0 - 0| = 0, balanced = true,  return 1
node 1:  left = 3, right = 1, |3 - 1| = 2, balanced = false, return 4
```

The failing comparison happens at the root, but the traversal has already visited every node. The method still returns the correct answer (`false`) because the flag is never reset.

## Comparison with the Alternatives

| Approach | Time | Space | Why it is or is not preferred |
| :--- | :--- | :--- | :--- |
| **Brute Force** | `O(n^2)` worst | `O(h)` | Easiest to derive from the definition, but calls `height()` separately for every node. On a skewed tree of `5000` nodes this repeats roughly `n^2 / 2` visits. |
| **DFS + Global Flag (implemented)** | `O(n)` | `O(h)` | Best balance of clarity and efficiency. Each node's height is computed once, and the flag removes the need to thread a boolean through return values. |
| **Sentinel `-1` (early exit)** | `O(n)` worst | `O(h)` | Same complexity, but returns immediately when a subtree is unbalanced. It can be much faster when the bad subtree is found early and avoids computing the rest of the tree. Slightly trickier because `-1` is both a sentinel and an invalid height. |
| **Iterative post-order** | `O(n)` | `O(h)` | Avoids call-stack limits on deep trees, at the cost of an explicit stack and more code. Useful if recursion depth is a concern. |

**Why the implemented approach is preferred:** it is a direct, readable single-pass solution. The global flag is a small amount of extra state, and the recursion still returns exactly the subtree height that the parent needs. It avoids the `O(n^2)` recomputation of the brute force without the sentinel's extra constraints on the return value.

**When an alternative wins:**

- Choose the **brute force** only for explaining the definition or for tiny trees; it is not suitable for the `5000`-node limit.
- Choose the **sentinel version** when most inputs are unbalanced and you want to stop as soon as possible, or when you prefer a helper whose return value carries all the information (no shared mutable state).
- Choose the **iterative version** when the tree may be a long chain and the JavaScript call stack is a real risk.

## Key Insights

1. **Post-order is required**: balance depends on child heights, so the children must be processed before the parent.
2. **Height is computed once**: returning `max(left, right) + 1` lets the parent reuse the work, which is what reduces the brute force from `O(n^2)` to `O(n)`.
3. **Do not stop too early**: a parent cannot judge its own balance without both child heights. The implemented code records the failure and keeps going; only the sentinel variant can prune safely because it propagates failure through return values.
4. **Height convention**: `null -> 0` and a leaf -> `1` is equivalent to the edge-counting convention as long as it is used consistently, since only differences are compared.
