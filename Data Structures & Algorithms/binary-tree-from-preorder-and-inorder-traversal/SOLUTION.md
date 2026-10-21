# Construct Binary Tree from Preorder and Inorder Traversal - Solution

## Solution Code

The only submission is `submission-5.ts`.

```typescript
class Solution {
    buildTree(preorder: number[], inorder: number[]): TreeNode {
        const inorderIndex = new Map<number, number>();
        for (const [idx, item] of inorder.entries()) {
            inorderIndex.set(item, idx);
        }

        let preIdx = 0;

        const build = (inLeft: number, inRight: number): TreeNode | null => {
            if (inLeft > inRight) return null;

            const rootVal = preorder[preIdx++];
            const root = new TreeNode(rootVal);
            const mid = inorderIndex.get(rootVal)!;

            root.left = build(inLeft, mid - 1);
            root.right = build(mid + 1, inRight);

            return root;
        };

        return build(0, inorder.length - 1);
    }
}
```

> **Type note:** `buildTree` is annotated to return `TreeNode`, while the recursive helper returns `TreeNode | null`. The input is guaranteed non-empty, so the top-level call always returns a node at runtime. Under strict null checks, the method signature would normally be `TreeNode | null` (or the result would need a non-null assertion).

## Approach

The solution uses **divide and conquer with a hash map** to construct the tree in linear time.

1. **Index the inorder array**: `inorderIndex` maps every value to its position. Building it costs `O(n)` and turns each root lookup into `O(1)`.
2. **Track the preorder cursor**: `preIdx` advances through `preorder` exactly once. Every call to `build` consumes the next preorder value, which is the root of the current subtree.
3. **Work with ranges, not copies**: `build(inLeft, inRight)` describes the current subtree by its inclusive inorder boundaries. No arrays are sliced.
4. **Base case**: `inLeft > inRight` means the range is empty, so the subtree is `null`.
5. **Split**: the root's inorder position is `mid`. Values in `[inLeft, mid - 1]` are in the left subtree, and values in `[mid + 1, inRight]` are in the right subtree.
6. **Build children**: the left recursion runs first, consuming the preorder values that belong to the left subtree. The right recursion then consumes the remaining values. This order is essential: preorder lists the entire left subtree before the right subtree.
7. **Return**: the root of the whole tree is the result of `build(0, inorder.length - 1)`.

- **Time Complexity**: `O(n)` — `O(n)` to build the map and `O(1)` work per node.
- **Space Complexity**: `O(n)` for the map and the constructed tree, plus `O(h)` recursion stack, where `h` is the tree height. The total is `O(n)`.

## Walkthrough

### Example 1: `preorder = [3,9,20,15,7]`, `inorder = [9,3,15,20,7]`

Inorder index map:

```
value:  9  3  15  20  7
index:  0  1   2   3  4
```

Recursion trace (`preIdx` starts at 0):

```
build(0, 4)
  rootVal = preorder[0] = 3, preIdx -> 1
  mid = index[3] = 1
  left  = build(0, 0)
  right = build(2, 4)
```

Left subtree:

```
build(0, 0)
  rootVal = preorder[1] = 9, preIdx -> 2
  mid = index[9] = 0
  left  = build(0, -1) -> null
  right = build(1, 0)  -> null
  return node 9
```

Right subtree:

```
build(2, 4)
  rootVal = preorder[2] = 20, preIdx -> 3
  mid = index[20] = 3

  left = build(2, 2)
    rootVal = preorder[3] = 15, preIdx -> 4
    mid = index[15] = 2
    build(2, 1) -> null
    build(3, 2) -> null
    return node 15

  right = build(4, 4)
    rootVal = preorder[4] = 7, preIdx -> 5
    mid = index[7] = 4
    build(4, 3) -> null
    build(5, 4) -> null
    return node 7

  return node 20 with left 15 and right 7
```

The root `3` gets left child `9` and right child `20`; `20` gets children `15` and `7`:

```
        3
       / \
      9  20
         / \
        15  7
```

The returned level-order representation is `[3,9,20,null,null,15,7]`, matching the expected output.

### Example 2: `preorder = [-1]`, `inorder = [-1]`

```
build(0, 0)
  rootVal = -1, preIdx -> 1
  mid = 0
  left  = build(0, -1) -> null
  right = build(1, 0)  -> null
  return node -1
```

The result is a single node `[-1]`.

## Comparison with the Alternatives

| Approach | Time | Space | Trade-off |
| :--- | :--- | :--- | :--- |
| **Linear search** | `O(n^2)` worst | `O(h)` + output | No map allocation, but every node scans an inorder range. On a skewed tree this is quadratic. |
| **Hash map + pointer (implemented)** | `O(n)` | `O(n)` | Linear time with a simple recursive structure. The map is the only extra allocation. |
| **Iterative stack** | `O(n)` | `O(h)` + output | Same asymptotic time, avoids recursion depth, but the stack/inorder cursor logic is harder to reason about. |

**Why the implemented approach is preferred:** it is the cleanest way to get `O(n)` time. The map removes the only repeated work in the brute force, and the global `preIdx` avoids passing and slicing preorder subarrays. The recursive code mirrors the definition of the traversals almost directly, which makes boundary mistakes easier to spot.

**When an alternative wins:**

- **Linear search** is reasonable for very small trees, or when allocating a hash map is undesirable. It is also a useful first step when explaining the algorithm, because the split is visible directly in the array scan.
- **Iterative construction** is the safer choice when the tree can be a long chain of up to `3000` nodes and recursion depth might exceed the JavaScript call stack. It also uses less auxiliary memory than the map when the tree is balanced.
- **Slicing arrays** produces readable code, but each level copies data, adding `O(n^2)` time and memory in the worst case. Range indices are preferable even in a brute-force version.

## Key Insights

1. **Preorder gives the roots; inorder gives the split.** The first preorder value of a subtree is its root, and that root's inorder position partitions the remaining values.
2. **Consume preorder left-to-right.** The preorder cursor must advance globally in left-subtree-first order. Recomputing a root from `preorder[0]` at each level is a common bug.
3. **Unique values make the map valid.** Without uniqueness, a value alone would not identify a single inorder position.
4. **Ranges avoid copies.** Passing `inLeft` and `inRight` keeps each recursive call `O(1)`; slicing would hide an `O(n)` cost per call.
5. **The recursion is linear, not logarithmic.** Every node is created once. The tree height affects stack space (`O(h)`), not the number of nodes processed.
