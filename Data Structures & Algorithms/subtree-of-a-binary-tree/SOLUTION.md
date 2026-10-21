# Subtree of Another Tree - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {TreeNode} root
     * @param {TreeNode} subRoot
     * @return {boolean}
     */
    isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
        let isSubTree = false;

        const compareTrees = (root: TreeNode | null, subRoot: TreeNode | null) => {
            if(!root && !subRoot) return true;
            if(root && subRoot && root.val === subRoot.val) {
                return compareTrees(root.left, subRoot.left) && compareTrees(root.right, subRoot.right)
            }
            return false;
        }

        const traverseTree = (root: TreeNode | null) => {
            if(root === null) return;
            if(root.val === subRoot.val) {
                const res = compareTrees(root, subRoot);
                if(res) isSubTree = true;
            };
            traverseTree(root.left);
            traverseTree(root.right);
            return;
        }

        traverseTree(root);

        return isSubTree;
    }
}
```

## Approach

This is the **DFS at every candidate node** approach. The key observation is that a subtree of `root` is completely identified by the node where it starts. So the algorithm does two nested searches:

1. **Outer traversal (`traverseTree`)** — a preorder DFS over every node of `root`. Each node is a possible subtree root.
2. **Cheap filter** — before doing any real work, compare `root.val === subRoot.val`. If the values differ, the trees cannot be identical, so the candidate is skipped. This is purely an optimization: the algorithm would still be correct without it.
3. **Structural comparison (`compareTrees`)** — a simultaneous DFS of two trees:
   - If both nodes are `null`, this branch matches.
   - If both nodes exist and have equal values, the branch matches only if **both** the left and right recursive comparisons match.
   - Any other combination (one `null`, or unequal values) is a mismatch.
4. **Accumulate, don't abort** — a closure variable `isSubTree` is set to `true` when a match is found. The traversal then continues over the remaining nodes. Because a match can never be "un-found", the final value is correct even without an early return.

The `compareTrees` call is made only at nodes whose value equals `subRoot.val`, which is why the implementation is correct with duplicate values: each duplicate candidate gets its own comparison.

- **Time Complexity**: `O(n · m)` worst case, where `n = |root|` and `m = |subRoot|`. The outer traversal visits `n` nodes. At each candidate whose value equals `subRoot.val`, `compareTrees` can visit up to `m` nodes. The bound is tight when every node of `root` has the same value as `subRoot`'s root, e.g. two skew trees of all `1`s.
- **Space Complexity**: `O(h_root + h_sub)` for the recursion stacks. `traverseTree` nests up to `h_root` deep, and inside a candidate it runs `compareTrees` up to `h_sub` deep, so the worst-case stack is `O(n + m)` for skewed trees and `O(log n + log m)` for balanced ones.

## Walkthrough

### Example 1: `root = [3,4,5,1,2]`, `subRoot = [4,1,2]`

```
        3
       / \
      4   5
     / \
    1   2
```

| Step | Node visited | `val === subRoot.val`? | `compareTrees` result | `isSubTree` |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `3` | `3 !== 4` | not called | `false` |
| 2 | `4` | yes | `true` (see below) | `true` |
| 3 | `1` | `1 !== 4` | not called | `true` |
| 4 | `2` | `2 !== 4` | not called | `true` |
| 5 | `5` | `5 !== 4` | not called | `true` |

The comparison at node `4`:

```
compareTrees(4, 4)
├─ values equal
├─ left:  compareTrees(1, 1)
│         ├─ values equal
│         ├─ left:  compareTrees(null, null) -> true
│         └─ right: compareTrees(null, null) -> true
│         -> true
└─ right: compareTrees(2, 2)
          ├─ values equal
          ├─ left:  compareTrees(null, null) -> true
          └─ right: compareTrees(null, null) -> true
          -> true
-> true
```

Return `true`.

### Example 2: `root = [3,4,5,1,2,null,null,null,null,0]`, `subRoot = [4,1,2]`

```
        3
       / \
      4   5
     / \
    1   2
       /
      0
```

The outer traversal finds node `4` again and calls `compareTrees(4, 4)`:

1. Values `4 == 4` → compare left children.
2. `compareTrees(1, 1)` → both leaves, `true`.
3. `compareTrees(2, 2)` → values equal, so compare their left children:
   - left side is node `0`;
   - right side is `null`.
   - The first branch `if (!root && !subRoot)` is `false` because only one side is null.
   - The second branch requires both nodes to exist, so it is also `false`.
   - Result: `false`.
4. The `&&` short-circuits and `compareTrees(4, 4)` returns `false`.

The traversal then visits `0`, `1`, `2`, and `5`; none has value `4`, so no further comparison runs. `isSubTree` remains `false`, and the method returns `false`.

## Comparison with the Alternatives

| Approach | Time Complexity | Space Complexity | When it wins |
| :--- | :--- | :--- | :--- |
| **DFS at every node** (implemented) | `O(n · m)` | `O(h_root + h_sub)` | Small-to-medium trees and interviews: shortest correct code, no serialization or hashing edge cases. With `n ≤ 2000` and `m ≤ 1000`, the worst case is about 2 million node visits. |
| **BFS at every node** | `O(n · m)` | `O(w + h_sub)` | When recursion depth is a concern, or when the match is likely near the top of the tree (BFS finds shallow candidates earlier). |
| **Serialize + KMP** | `O(n + m)` | `O(n + m)` | Very large trees or repeated subtree queries. The asymptotic improvement is real, but the code must handle delimiters and `null` markers carefully. |
| **Subtree hashing** | `O(n + m)` expected | `O(n + m)` | Performance-critical code with many candidate comparisons. Needs a strong mixing function and collision handling to be trustworthy. |

**Why the implemented approach was chosen:** it maps one-to-one onto the definition of a subtree. The outer DFS enumerates candidates, and the inner DFS decides equality. There is no encoding to design, no hash to tune, and no auxiliary structure to keep in sync. Given the LeetCode limits (`root` ≤ 2000 nodes), the quadratic worst case is comfortably fast, and the common case is much better because comparisons only start when the root values match.

**When the alternatives win:** if `n` were much larger (say `10^5`–`10^6` nodes) or if the same `subRoot` were checked against many trees, `O(n · m)` would become a bottleneck. Then serialization + KMP or Merkle hashing gives linear-time behavior. Note that a naive `String.includes` on serialized trees is *not* automatically linear — it is `O(n · m)` in the worst case, so KMP (or another linear substring algorithm) is what actually delivers the improvement.

## Key Insights

1. **A subtree is defined by its root** — checking every node of `root` as a candidate is exhaustive and cannot miss a valid subtree.
2. **Value filter is safe** — two identical trees must have equal root values, so skipping unequal candidates can never skip a valid match.
3. **Structure is part of equality** — `compareTrees` must treat "one side null, the other not" as a mismatch. This is the difference between subtree and substructure.
4. **Duplicates require persistence** — a failed comparison at one node with value `v` says nothing about another node with value `v`.
5. **The flag approach is correct but not optimal** — replacing `isSubTree = true` with an immediate `return true` (and propagating it) would avoid traversing the rest of the tree after a match, with the same asymptotic bound.
6. **`subRoot` is guaranteed non-empty here** — the implementation relies on that when reading `subRoot.val`. A general-purpose version should guard `if (!subRoot) return true`.
