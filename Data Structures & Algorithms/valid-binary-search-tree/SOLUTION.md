# Valid Binary Search Tree - Solution

## Solution Code

```typescript
class Solution {

    isValid(root: TreeNode | null, min: number, max:number): boolean {
        if(root === null) return true;
        if(root.val > min && root.val < max){
            return this.isValid(root.left, min, root.val) && this.isValid(root.right, root.val, max);
        } else return false;
    }

    isValidBST(root: TreeNode | null): boolean {
        return this.isValid(root, -Infinity, Infinity);
    }
}
```

## Approach

The solution uses **DFS with inherited bounds**. Rather than checking a node only against its parent, each recursive call carries the full open interval that the node's value must fall inside.

1. **Start with the widest interval** — `isValid(root, -Infinity, Infinity)`. The root is unconstrained because it has no ancestors.
2. **Accept the empty tree** — a `null` node contributes no violation, so it returns `true`.
3. **Enforce the strict interval** — the condition `root.val > min && root.val < max` is checked before descending. Equality is rejected, which correctly treats duplicate keys as invalid.
4. **Narrow the interval for each child**:
   - The entire **left** subtree must be less than the current node, so its upper bound becomes `root.val`: `isValid(root.left, min, root.val)`.
   - The entire **right** subtree must be greater than the current node, so its lower bound becomes `root.val`: `isValid(root.right, root.val, max)`.
   - The inherited bound on the other side is preserved, which is what catches violations like `3` under the right subtree of `5`.
5. **Combine with `&&`** — both subtrees must be valid. The short-circuit means the first violation aborts the remaining work.

Every node is examined at most once, and no traversal order or auxiliary array is needed.

- **Time Complexity**: `O(n)` — each node is visited once and does `O(1)` work.
- **Space Complexity**: `O(h)` for the recursion stack, where `h` is the tree height. This is `O(log n)` for a balanced tree and `O(n)` for a completely skewed one (up to `10^4` frames at the constraint limit).

## Walkthrough

### Example 1: `root = [2,1,3]` → `true`

```
        2
       / \
      1   3
```

| Call | Interval `(min, max)` | Check | Result |
| :--- | :--- | :--- | :--- |
| `isValid(2, -inf, inf)` | `(-inf, inf)` | `-inf < 2 < inf` ✓ | recurse both |
| `isValid(1, -inf, 2)` | `(-inf, 2)` | `-inf < 1 < 2` ✓ | children null → `true` |
| `isValid(null, -inf, 2)` | — | empty ✓ | `true` |
| `isValid(null, 1, 2)` | — | empty ✓ | `true` |
| `isValid(3, 2, inf)` | `(2, inf)` | `2 < 3 < inf` ✓ | children null → `true` |
| `isValid(null, 2, 3)` | — | empty ✓ | `true` |
| `isValid(null, 3, inf)` | — | empty ✓ | `true` |

Both branches return `true`, so the answer is `true`.

### Example 2: `root = [5,1,4,null,null,3,6]` → `false`

```
        5
       / \
      1   4
         / \
        3   6
```

1. `isValid(5, -inf, inf)`: `5` is inside the interval. Recurse left with `(-inf, 5)` and right with `(5, inf)`.
2. Left: `isValid(1, -inf, 5)` → `1` is valid; both children are `null` → `true`.
3. Right: `isValid(4, 5, inf)` → the guard checks `4 > 5`, which is **false**, so it returns `false` immediately.
4. The root's `&&` short-circuits: `true && false` → `false`.

The nodes `3` and `6` are never visited. This early rejection is a benefit of bounds propagation: the violation is detected at the node itself, before exploring its subtree.

### Example 3: `root = [5,4,6,null,null,3,7]` → `false`

```
        5
       / \
      4   6
         / \
        3   7
```

1. `isValid(5, -inf, inf)` → valid; left interval `(-inf, 5)`, right interval `(5, inf)`.
2. `isValid(4, -inf, 5)` → valid leaf branch.
3. `isValid(6, 5, inf)` → `5 < 6 < inf`, valid; now the intervals narrow again:
   - left child gets `(5, 6)`;
   - right child gets `(6, inf)`.
4. `isValid(3, 5, 6)` → `3 > 5` is **false** → returns `false`.

This is the case that defeats a naive parent-only check: `3 < 6` is true, but `3` must also be greater than the ancestor `5`. The inherited lower bound catches it.

## Comparison with the Alternatives

| Approach | Time Complexity | Space Complexity | When it wins |
| :--- | :--- | :--- | :--- |
| **Brute force subtree scan** | `O(n^2)` worst | `O(h)` | Only as a baseline; it mirrors the definition and is easy to argue correct, but re-scans subtrees. |
| **Bounds propagation DFS** (implemented) | `O(n)` | `O(h)` | The general-purpose choice: linear time, minimal memory, detects violations as soon as a node is out of range, and needs no traversal order. |
| **In-order traversal** | `O(n)` | `O(n)` or `O(h)` | When the BST property is best expressed as "sorted output" — useful if the problem also asks for the k-th smallest element or a sorted listing. |
| **Morris traversal** | `O(n)` | `O(1)` | Memory-constrained settings or very deep trees where recursion is unsafe. It temporarily modifies the tree, so it is the most error-prone option. |

**Why the implemented approach is preferred:** the interval is the *complete* state needed to validate any node. Passing it down the recursion is equivalent to carrying the path of ancestors, but costs only two numbers. The algorithm visits each node once, rejects bad nodes before descending, and uses stack space proportional to height rather than to the number of nodes. It also handles the full `-2^31 .. 2^31-1` value range naturally because the initial bounds are `-Infinity` and `Infinity` rather than sentinel integers.

**When alternatives win:** in-order traversal is more convenient when the surrounding problem already needs sorted order (for example, LeetCode 230, K-th Smallest Element in a BST). Morris traversal wins only when `O(1)` extra space is a hard requirement or the recursion depth would overflow; it is not worth the pointer bookkeeping otherwise. The brute-force scan is never preferable for performance, but it is a useful way to double-check the definition on small trees.

## Key Insights

1. **A BST constraint is global, not local.** Each node is constrained by *all* of its ancestors, which is exactly what the `(min, max)` interval encodes.
2. **Open intervals enforce distinct keys.** Using `>` and `<` rejects duplicates without a separate check.
3. **The interval narrows in one direction at a time.** Going left only lowers the upper bound; going right only raises the lower bound.
4. **`null` is valid.** The base case returns `true` without touching the bounds, so leaves and missing children are handled uniformly.
5. **Early exit comes for free.** Because the check happens before recursion, an invalid node stops its entire subtree from being explored.
6. **`-Infinity` / `Infinity` are safe sentinels** for the legal value range and avoid off-by-one errors with `2^31 - 1` or `-2^31`.
