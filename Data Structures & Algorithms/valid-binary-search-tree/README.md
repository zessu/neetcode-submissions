# Valid Binary Search Tree - LeetCode 98

## Problem Description

Given the `root` of a binary tree, determine if it is a **valid binary search tree (BST)**.

A valid BST is defined as follows:

- The **left subtree** of a node contains only nodes with keys **strictly less than** the node's key.
- The **right subtree** of a node contains only nodes with keys **strictly greater than** the node's key.
- Both the left and right subtrees must also be binary search trees.

The key phrase is "subtree", not "child": every node in the entire left subtree must be smaller than the node, and every node in the entire right subtree must be larger. Checking only a node's immediate children is not sufficient.

## Examples

### Example 1:
```
Input: root = [2,1,3]
Output: true
```
**Explanation:** The left child `1` is less than `2`; the right child `3` is greater than `2`. Both children are leaves, so the tree is a valid BST.

```
        2
       / \
      1   3
```

### Example 2:
```
Input: root = [5,1,4,null,null,3,6]
Output: false
```
**Explanation:** The root is `5`, but its right child is `4`. Every value in the root's right subtree must be greater than `5`, and `4 < 5`.

```
        5
       / \
      1   4
         / \
        3   6
```

### Example 3:
```
Input: root = [5,4,6,null,null,3,7]
Output: false
```
**Explanation:** Every parent-child pair looks locally valid (`3 < 6`, `6 < 7`), but `3` sits in the right subtree of `5` and is smaller than `5`. A local check at node `6` cannot see this violation; the constraint comes from an ancestor.

```
        5
       / \
      4   6
         / \
        3   7
```

## Constraints

- The number of nodes in the tree is in the range `[1, 10^4]`.
- `-2^31 <= Node.val <= 2^31 - 1`

## Topics

- Tree
- Depth-First Search
- Binary Search Tree
- Binary Tree

## Company Tags

- Amazon
- Microsoft
- Meta
- Bloomberg

## Solution Approaches

### 1. Brute Force: Validate Each Node Against Its Subtrees

**Intuition**: Directly transcribe the definition. For every node, verify that **all** values in its left subtree are smaller and **all** values in its right subtree are larger, then repeat the process for both children.

**Algorithm**:
1. For the current node, traverse its entire left subtree and find the maximum value; it must be `< node.val`.
2. Traverse its entire right subtree and find the minimum value; it must be `> node.val`.
3. Recursively validate the left and right subtrees.
4. Return `true` only if every check passes.

**Time Complexity**: `O(n^2)` worst case — each node's validation can scan an entire subtree. A skewed tree hits the worst case; a balanced tree is `O(n log n)`.
**Space Complexity**: `O(h)` for the recursion stack, where `h` is the tree height (`O(n)` worst case).

### 2. Bounds Propagation DFS (Implemented)

**Intuition**: Instead of walking subtrees repeatedly, carry the **allowed value range** down the recursion. The root may be anything. A left child must be below its parent and above the parent's lower bound. A right child must be above its parent and below the parent's upper bound. Every node is checked exactly once.

**Algorithm**:
1. Call `isValid(root, -Infinity, Infinity)`.
2. If the node is `null`, the empty tree is valid — return `true`.
3. If `node.val` is not strictly inside `(min, max)`, return `false`.
4. Recurse left with `(min, node.val)` and right with `(node.val, max)`.
5. Both recursive calls must return `true`.

**Time Complexity**: `O(n)` — every node is visited once.
**Space Complexity**: `O(h)` for the recursion stack (`O(log n)` balanced, `O(n)` skewed).

### 3. In-Order Traversal

**Intuition**: An in-order traversal of a valid BST produces values in **strictly increasing** order. So traverse the tree in-order and verify that each value is greater than the previous one.

**Algorithm**:
1. Traverse left subtree.
2. Visit the node: if `prev !== null && node.val <= prev`, return `false`; otherwise set `prev = node.val`.
3. Traverse right subtree.
4. Return `true` if no inversion is found.

**Time Complexity**: `O(n)` — each node visited once.
**Space Complexity**: `O(n)` if values are collected into an array, or `O(h)` with a `prev` pointer plus the recursion stack.

### 4. Morris In-Order Traversal

**Intuition**: Morris traversal performs an in-order walk in `O(1)` extra space by temporarily threading each node's rightmost left-subtree predecessor back to the node. The same strictly-increasing check applies, then the temporary links are removed.

**Algorithm**:
1. Start at the root with `prev = -Infinity`.
2. If the current node has no left child, visit it (compare with `prev`) and move right.
3. Otherwise, find its in-order predecessor (rightmost node in the left subtree):
   - If the predecessor's right pointer is `null`, link it to the current node and move left.
   - If it already points to the current node, unlink it, visit the current node, and move right.
4. Return `false` as soon as `node.val <= prev`.

**Time Complexity**: `O(n)` — each edge is traversed at most twice.
**Space Complexity**: `O(1)` — no stack, no array (the tree is temporarily modified and restored).

## Visual Explanation

```
Example 2: root = [5,1,4,null,null,3,6]

Each node receives an open interval (min, max) from its ancestors:

                      5
                  (-inf, +inf)
                    /       \
               1                 4
          (-inf, 5)          (5, +inf)
                              /     \
                             3       6
                        (5, 4)   (4, +inf)

At node 4: its allowed interval is (5, +inf).
  Is 5 < 4 < +inf ?  NO  ->  invalid BST.

Compare with Example 3:

                      5
                  (-inf, +inf)
                    /       \
               4                 6
          (-inf, 5)          (5, +inf)
                              /     \
                             3       7
                        (5, 6)   (6, +inf)

At node 3: its interval is (5, 6).
  Is 5 < 3 < 6 ?  NO  ->  invalid BST, even though 3 < 6 locally.

The interval narrows as we descend:
  go left  -> upper bound becomes the parent's value
  go right -> lower bound becomes the parent's value
```

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Brute force subtree scan** | `O(n^2)` worst, `O(n log n)` balanced | `O(h)` | Literal transcription of the definition | Repeated subtree scans; slow for skewed trees |
| **Bounds propagation DFS** (implemented) | `O(n)` | `O(h)` | One pass; early rejection; no extra data structures | Bounds must be threaded correctly |
| **In-order traversal** | `O(n)` | `O(n)` or `O(h)` | Simple invariant: values must increase | Must traverse to the leftmost node before any check; array version uses extra memory |
| **Morris traversal** | `O(n)` | `O(1)` | Constant extra space | Temporarily rewires the tree; subtle pointer handling |

## Common Pitfalls

1. **Checking only immediate children**: `[5,4,6,null,null,3,7]` passes every parent-child comparison but is not a BST, because `3` is in the right subtree of `5`.
2. **Using non-strict comparisons**: Duplicates are not allowed. The check must be `min < node.val < max`, not `<=` / `>=`.
3. **Forgetting to narrow the interval**: Passing only one bound, or passing the parent's interval unchanged, loses the ancestor constraints. Left gets `(min, node.val)`, right gets `(node.val, max)`.
4. **Sentinel values**: Starting with `0` or `-1` fails for negative node values. Use `-Infinity` / `Infinity` (or values below/above the legal range, such as `Number.MIN_SAFE_INTEGER`).
5. **In-order must be strictly increasing**: A non-decreasing check misses duplicate-value violations.
6. **Empty tree**: `null` is a valid BST, though the LeetCode constraints guarantee at least one node.
7. **Recursion depth**: Up to `10^4` nodes can form a skewed tree. A recursive DFS may exhaust the call stack in some JavaScript environments; an iterative in-order or Morris traversal avoids that.

## Related Problems

- [Binary Tree Diameter](../binary-tree-diameter/README.md) — bottom-up tree reasoning with return values from both children.
- [Invert a Binary Tree](../invert-a-binary-tree/README.md) — recursive tree traversal and structural changes.
