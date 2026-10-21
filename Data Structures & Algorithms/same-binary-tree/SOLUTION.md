# Same Tree - Solution

## Solution Code

```typescript
class Solution {
    isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
        if(!p && !q) return true;
        if(p && q && p.val === q.val) {
            return (
                this.isSameTree(p.left, q.left) && this.isSameTree(p.right, q.right)
                )
        } else {
            return false;
        }
    }
}
```

## Approach

The submission uses **recursive lockstep DFS**. Both trees are walked together, one position at a time, so the comparison naturally enforces both structure and values.

1. **Both empty**: `if (!p && !q) return true`. Two missing nodes are a matching pair. This is also the base case that terminates every successful branch.
2. **Both present and equal**: if `p && q && p.val === q.val`, the current pair matches and the decision moves to the children.
3. **Recurse on matching positions**: `isSameTree(p.left, q.left)` compares left children, and `isSameTree(p.right, q.right)` compares right children. The `&&` requires both to match — a mismatch anywhere makes the whole result `false`.
4. **Every other case returns `false`**: exactly one node is `null` (different shape), or both exist with different values. The `else` branch captures both.

- **Time Complexity**: `O(n)` — each node pair is visited once, and evaluation stops at the first mismatch.
- **Space Complexity**: `O(h)` — the recursion stack holds one frame per level. `O(log n)` balanced, `O(n)` for a skewed tree (at most 100 nodes here, so recursion is safe).

## Walkthrough

### Example 1: `p = [1,2,3]`, `q = [1,2,3]`

```
   1          1
  / \        / \
 2   3      2   3
```

```
isSameTree(1, 1)
  both present, 1 === 1
  left  = isSameTree(2, 2)
            both present, 2 === 2
            left  = isSameTree(null, null) -> true
            right = isSameTree(null, null) -> true
            => true
  right = isSameTree(3, 3)
            both present, 3 === 3
            left  = isSameTree(null, null) -> true
            right = isSameTree(null, null) -> true
            => true
  => true && true = true
```

### Example 2: `p = [1,2]`, `q = [1,null,2]`

```
   1          1
  /            \
 2              2
```

```
isSameTree(1, 1)
  both present, 1 === 1
  left = isSameTree(2, null)
           !p && !q        -> false (p exists)
           p && q && ...   -> false (q is null)
           else            -> false
  && short-circuits: the right pair (null, 2) is not evaluated
  => false
```

The values are identical (`{1, 2}` in both trees), which is exactly why a value-only comparison fails. The left/right position is part of the tree's identity.

### Example 3: `p = [1,2,1]`, `q = [1,1,2]`

```
isSameTree(1, 1)
  left = isSameTree(2, 1)
           both present, but 2 !== 1 -> false
  && short-circuits
  => false
```

The shapes are identical, so the structural checks pass; the value check at the left child is what rejects the pair.

### Example 4 (edge case): `p = []`, `q = []`

```
isSameTree(null, null)
  !p && !q -> true
```

Two empty trees are the same tree.

### Example 5 (edge case): `p = []`, `q = [0]`

```
isSameTree(null, 0-node)
  !p && !q  -> false (q exists)
  p && q    -> false (p is null)
  else      -> false
```

An empty tree never equals a non-empty tree, even one whose only value is `0`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it is or is not chosen here |
| :--- | :--- | :--- | :--- |
| **Recursive lockstep DFS (implemented)** | `O(n)` | `O(h)` | The definition of tree equality is recursive: equal roots plus equal left subtrees plus equal right subtrees. The code is three cases and needs no auxiliary structure. |
| **Iterative DFS with a stack of pairs** | `O(n)` | `O(h)` average, `O(n)` worst | Same comparisons, no call-stack limit. Better if the depth could approach the engine's stack limit (not a concern at `n <= 100`, but a good habit). |
| **BFS with a queue of pairs** | `O(n)` | `O(w)` | Compares level by level and can reject a shallow structural difference immediately. Uses more memory on wide trees and does not match the recursive structure as directly. |

**Why the recursive version is preferred in this submission**: tree equality is inherently recursive, and the base cases map one-to-one onto the problem statement. The guard order (both null → both present and equal → otherwise false) is exhaustive and safe, and `&&` provides short-circuiting so a single mismatch ends the work.

**When an alternative wins**:

- **Very deep trees**: the iterative stack version cannot overflow. A degenerate tree of depth `n` would need `n` recursive frames.
- **Wide trees with an early shallow mismatch**: BFS can detect a difference in the first few levels without descending, whereas DFS commits to the leftmost path first. Both are `O(n)` worst case, but BFS may finish sooner in practice.
- **Comparing serialized forms**: if the trees already have canonical serializations that include null markers, string equality is `O(n)` and simple. Without null markers it is incorrect, and it always allocates extra memory.

## Key Insights

1. **Position is part of the data**: `[1,2]` and `[1,null,2]` have the same value set and different shapes. Comparing values without position is the classic wrong answer.
2. **Three cases are exhaustive**: both null, both non-null with equal values, everything else. Any implementation that does not cover "exactly one null" will crash or lie.
3. **`&&`, not `||`**: both subtrees must match. Using `||` accepts trees that differ on one side.
4. **Short-circuiting is free pruning**: the first mismatching pair stops the entire traversal, so the best case is `O(1)` and the worst case is `O(n)`.
5. **The empty-tree case is the base case**: `[ ] == [ ]` is `true`; do not add a blanket "if either is null, return false" guard.
