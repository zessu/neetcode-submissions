# Construct Binary Tree from Preorder and Inorder Traversal - LeetCode 105

## Problem Description

Given two integer arrays `preorder` and `inorder` where `preorder` is the **preorder traversal** of a binary tree and `inorder` is the **inorder traversal** of the same tree, construct and return the binary tree.

Recall the traversal orders:

- **Preorder**: visit the root, then the left subtree, then the right subtree.
- **Inorder**: visit the left subtree, then the root, then the right subtree.

The first element of a preorder sequence is always the root of the (sub)tree, and its position in the inorder sequence separates the left subtree's nodes from the right subtree's nodes.

## Examples

### Example 1:
```
Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]
```
**Explanation:** The first preorder value is `3`, so `3` is the root. In `inorder`, `[9]` is to the left of `3` and `[15,20,7]` is to the right. The next preorder value after `3` is `9`, which must be the left child. The remaining preorder values `[20,15,7]` describe the right subtree; `20` is its root, and its inorder segment is `[15] 20 [7]`, making `15` the left child and `7` the right child.

```
        3
       / \
      9  20
         / \
        15  7
```

### Example 2:
```
Input: preorder = [-1], inorder = [-1]
Output: [-1]
```
**Explanation:** A single node is its own preorder and inorder traversal. The root is `-1` and it has no children.

### Additional Example:
```
Input: preorder = [1,2,4,5,3,6,7], inorder = [4,2,5,1,6,3,7]
Output: [1,2,3,4,5,6,7]
```
**Explanation:** The root is `1`. Its left inorder segment is `[4,2,5]`, whose preorder segment is `[2,4,5]`, so `2` is the left child with children `4` and `5`. The right inorder segment is `[6,3,7]`, whose preorder segment is `[3,6,7]`, so `3` is the right child with children `6` and `7`.

## Constraints

- `1 <= preorder.length <= 3000`
- `inorder.length == preorder.length`
- `-3000 <= preorder[i], inorder[i] <= 3000`
- `preorder` and `inorder` consist of **unique** values.
- Each value of `inorder` also appears in `preorder`.
- `preorder` and `inorder` are guaranteed to be the preorder and inorder traversal of the tree.

## Topics

- Array
- Hash Table
- Divide and Conquer
- Tree
- Binary Tree

## Company Tags

- Amazon
- Microsoft
- Google
- Meta
- Bloomberg

## Solution Approaches

### 1. Recursive with Linear Search (Brute Force)

**Intuition**: The root of the current subtree is the next unused value in `preorder`. Find that value in the current `inorder` range with a linear scan. Everything before it belongs to the left subtree; everything after it belongs to the right subtree. Recurse with the corresponding ranges.

**Algorithm**:
1. Keep a global pointer `preIdx` into `preorder`.
2. Define `build(inLeft, inRight)` for the current inorder range:
   - If `inLeft > inRight`, return `null`.
   - Take `rootVal = preorder[preIdx++]` and create the root node.
   - Scan `inorder[inLeft..inRight]` to find the index `mid` of `rootVal`.
   - Recurse: `root.left = build(inLeft, mid - 1)`.
   - Recurse: `root.right = build(mid + 1, inRight)`.
3. Return `build(0, inorder.length - 1)`.

**Time Complexity**: `O(n^2)` worst case — a skewed tree scans a long inorder range at every level. It is `O(n log n)` for a balanced tree.
**Space Complexity**: `O(h)` for the recursion stack, where `h` is the tree height (`O(n)` worst case), plus `O(n)` for the output tree.

### 2. Hash Map + Preorder Pointer (Implemented)

**Intuition**: The only slow part of the brute force is finding the root's position in `inorder`. Because values are unique, precompute a hash map from value to inorder index once. Then every split is `O(1)`, and the recursion is a single linear pass over the arrays.

**Algorithm**:
1. Build `inorderIndex: Map<number, number>` from each value to its index.
2. Keep a global `preIdx = 0`.
3. Define `build(inLeft, inRight)`:
   - If `inLeft > inRight`, return `null` (empty range).
   - `rootVal = preorder[preIdx++]`; create the root.
   - `mid = inorderIndex.get(rootVal)`.
   - Build the left subtree from `[inLeft, mid - 1]`.
   - Build the right subtree from `[mid + 1, inRight]`.
   - Return the root.
4. Return `build(0, inorder.length - 1)`.

**Time Complexity**: `O(n)` — the map is built in `O(n)`, and each node is created once.
**Space Complexity**: `O(n)` for the map and output tree, plus `O(h)` recursion stack.

### 3. Iterative Construction with a Stack

**Intuition**: Walk the preorder array and maintain a stack of nodes whose right subtree has not been resolved yet. The inorder array acts as a "next node to finish" cursor. If the current stack top is not the next inorder value, the new node is its left child. Otherwise, pop finished nodes until the stack top is an ancestor that still needs a right child, and attach the new node there.

**Algorithm**:
1. Create the root from `preorder[0]` and push it onto a stack.
2. Set `inIdx = 0` (next inorder value expected to be completed).
3. For each subsequent `preorder[i]`:
   - Create `node`.
   - Let `top` be the stack top.
   - If `top.val !== inorder[inIdx]`, attach `node` as `top.left` and push it.
   - Otherwise, pop while the stack top equals `inorder[inIdx]`, incrementing `inIdx` after each pop. Attach `node` as the right child of the last popped node, then push it.
4. Return the root created in step 1.

**Time Complexity**: `O(n)` — each preorder value is processed once and each node is pushed and popped at most once.
**Space Complexity**: `O(h)` for the stack, where `h` is the tree height or the length of the right spine (`O(n)` worst case), plus `O(n)` for the output.

## Visual Explanation

```
preorder:  [ 3, 9, 20, 15, 7 ]
             ^ root

inorder:   [ 9, 3, 15, 20, 7 ]
                 ^ root 3 splits the array

             [9]   3   [15, 20, 7]
              |            |
        left subtree   right subtree

Next preorder values: 9 | 20, 15, 7
  -> 9 is the left child (only one inorder value)
  -> 20 is the right subtree's root
       inorder [15] 20 [7]  ->  15 is left child, 7 is right child

Result:
          3
         / \
        9  20
           / \
          15  7
```

The key invariant is that **preorder supplies roots in top-down order**, while **inorder supplies the boundaries of each subtree**.

## Approach Comparison

| Approach | Time Complexity | Space Complexity | Notes |
| :--- | :--- | :--- | :--- |
| **Linear search** | `O(n^2)` worst | `O(h)` + output | No extra data structure; scans inorder at every node |
| **Hash map + pointer** | `O(n)` | `O(n)` | Implemented; precomputes positions for `O(1)` splits |
| **Iterative stack** | `O(n)` | `O(h)` + output | Avoids recursion depth; less intuitive |

## Common Pitfalls

1. **Wrong root for a subtree**: The root is always the next element of `preorder` in the current subtree's range, not `preorder[0]` at every recursion level. Advance a global pointer instead.
2. **Inorder split boundaries**: The left subtree is `inorder[inLeft..mid-1]` and the right subtree is `inorder[mid+1..inRight]`. Using `mid` in either range duplicates the root.
3. **Empty ranges**: The base case is `inLeft > inRight`, not `inLeft >= inRight`; a single node is a valid subtree.
4. **Using `indexOf` incorrectly**: Searching for the root's value in the **whole** inorder array ignores the current range and can pick an index outside it. Restrict the search to `[inLeft, inRight]` (or use the map and trust the unique-value guarantee).
5. **Assuming values are unique without checking**: The map approach relies on the constraint that all values are unique. With duplicates, value-to-index mapping alone is ambiguous.
6. **Recursion depth**: A skewed tree of `3000` nodes produces a `3000`-deep call stack. The iterative approach removes that risk.
7. **Building with slices**: Passing `preorder.slice(...)` and `inorder.slice(...)` at each level is easy to read but copies `O(n)` data per level, adding `O(n^2)` time and memory overhead in the worst case.
