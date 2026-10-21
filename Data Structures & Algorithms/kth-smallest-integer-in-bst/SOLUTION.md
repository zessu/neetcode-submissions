# Kth Smallest Element in a BST - Solution

## Solution Code

```typescript
class Solution {
    traverse(root: TreeNode | null, results: number[]) {
        if(root === null) return;
        this.traverse(root.left, results);
        results.push(root.val);
        this.traverse(root.right, results);
    }
    kthSmallest(root: TreeNode | null, k: number): number {
        const results = [];
        this.traverse(root, results);
        return results[k-1];
    }
}
```

> **Submission history:** `submission-1.ts` was identical except for a `console.log(results)` between the traversal and the return. `submission-2.ts` (shown above) removes the debug output and is the latest version.

## Approach

The solution uses a **recursive inorder traversal** and indexes into the resulting array.

1. **Inorder visits a BST in sorted order**: for every node, the entire left subtree is smaller, then the node, then the entire right subtree is larger. Recursing left → node → right therefore appends values in ascending order.
2. **Collect the values**: `traverse(root, results)` pushes each `node.val` between the two recursive calls. The base case returns on `null`.
3. **No sorting needed**: the array is already sorted by the BST property.
4. **Index with `k - 1`**: the problem is 1-indexed, so the `k`-th smallest is the element at zero-based index `k - 1`.
5. **Return it**: `kthSmallest` creates the array, runs the traversal, and returns `results[k-1]`.

The traversal does not stop early. It processes all `n` nodes even when `k = 1`, which is the main inefficiency relative to the iterative version.

- **Time Complexity**: `O(n)` — every node is visited exactly once.
- **Space Complexity**: `O(n)` for the `results` array plus `O(h)` for the recursion stack, where `h` is the tree height.

## Walkthrough

### Example 1: `root = [3, 1, 4, null, 2]`, `k = 1`

```
        3
       / \
      1   4
       \
        2
```

| Step | Node visited | `results` |
| :--- | :--- | :--- |
| 1 | descend to `1` | `[]` |
| 2 | `1` has no left child → push | `[1]` |
| 3 | right child `2`: no left → push | `[1, 2]` |
| 4 | back to `3` → push | `[1, 2, 3]` |
| 5 | right subtree `4` → push | `[1, 2, 3, 4]` |

`results[1 - 1] = results[0] = 1`.

**Output:** `1`.

### Example 2: `root = [5, 3, 6, 2, 4, null, null, 1]`, `k = 3`

```
              5
            /   \
           3     6
          / \
         2   4
        /
       1
```

| Inorder position | Node | `results` after the push |
| :--- | :--- | :--- |
| 1 | `1` | `[1]` |
| 2 | `2` | `[1, 2]` |
| 3 | `3` | `[1, 2, 3]` |
| 4 | `4` | `[1, 2, 3, 4]` |
| 5 | `5` | `[1, 2, 3, 4, 5]` |
| 6 | `6` | `[1, 2, 3, 4, 5, 6]` |

`results[3 - 1] = results[2] = 3`.

**Output:** `3`.

Note that the traversal keeps going after reaching position 3: it still visits `4`, `5`, and `6` before returning. A `k`-th-smallest query does not need those values.

## Comparison with the Alternatives

| Approach | Time | Space | Why it might be chosen |
| :--- | :--- | :--- | :--- |
| **Recursive Inorder, collect all** (implemented) | `O(n)` | `O(n)` | The shortest correct solution that exploits the BST property. Easy to read, no manual stack, no index arithmetic during traversal. |
| **Iterative Inorder, early exit** | `O(h + k)` | `O(h)` | Wins when `k` is small: it stops as soon as the `k`-th value is popped, and avoids recursion depth entirely. |
| **Morris Inorder** | `O(n)` | `O(1)` | The only constant-extra-space option. Useful for very large trees or strict memory limits; requires temporary pointer rewiring. |
| **Collect and Sort** | `O(n log n)` | `O(n)` | Baseline only. It ignores the BST ordering and pays for a sort that is never needed. |

**Why the recursive approach is preferred here**: the constraints are `n <= 10^4`, and the code is a direct application of the defining BST property. Collecting the inorder sequence makes the answer a single index lookup, and there is no stack or counter to keep in sync.

**When an alternative wins**:

- **`k` much smaller than `n`**: the iterative version can stop after `k` pops, doing `O(h + k)` work instead of `O(n)`. For `k = 1` on a large tree this is a substantial difference.
- **Deep/skewed trees**: recursion can overflow at `O(n)` height; the explicit stack or Morris avoids that.
- **Strict `O(1)` memory**: Morris is the only choice. It restores the tree afterwards, but it must not be used on a read-only or concurrently traversed tree.
- **Frequent inserts/deletes plus frequent k-th queries**: none of these traversals is ideal. Augment each node with its left-subtree size and answer in `O(h)` by descending; update sizes along the modification path.

## Key Insights

1. **A BST's inorder is sorted**: this is the single fact the whole solution rests on. No comparison sort is required.
2. **`k` is 1-indexed, arrays are 0-indexed**: the conversion is `results[k - 1]`.
3. **Full traversal vs early exit**: the implemented version is `O(n)` regardless of `k`; the iterative version is `O(h + k)`. The difference matters for small `k` on large trees.
4. **The inorder sequence has exactly `n` values**: since `1 <= k <= n`, `results[k - 1]` is always in bounds for valid input.
5. **The follow-up is about data-structure design, not traversal**: subtree-size augmentation turns the query into a binary-search-like descent and keeps updates logarithmic on a balanced tree.
