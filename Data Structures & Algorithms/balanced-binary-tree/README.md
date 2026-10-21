# Balanced Binary Tree - LeetCode 110

## Problem Description

Given a binary tree, determine if it is **height-balanced**.

A height-balanced binary tree is defined as a binary tree in which the **left and right subtrees of every node** differ in height by no more than `1`.

The height of a node is the number of nodes on the longest path from that node down to a leaf. An empty subtree has height `0`, and a leaf has height `1`.

## Examples

### Example 1:
```
Input: root = [3,9,20,null,null,15,7]
Output: true
```
**Explanation:** Node `20` has two leaf children (`15` and `7`), so its subtrees both have height `1`. At the root `3`, the left subtree (`9`) has height `1` and the right subtree (`20`) has height `2`; the difference is `1`, which is allowed. Every node satisfies the condition.

### Example 2:
```
Input: root = [1,2,2,3,3,null,null,4,4]
Output: false
```
**Explanation:** At the root `1`, the left subtree has height `3` (path `1 -> 2 -> 3 -> 4`) while the right subtree has height `1`. The difference is `2`, so the tree is not height-balanced. Inside the left subtree, node `2` has a left child `3` with two children (`4` and `4`) and a right child `3` that is a leaf.

### Example 3:
```
Input: root = []
Output: true
```
**Explanation:** An empty tree has no node whose subtrees could differ, so it is vacuously height-balanced.

## Constraints

- The number of nodes in the tree is in the range `[0, 5000]`.
- `-10^4 <= Node.val <= 10^4`

## Topics

- Tree
- Depth-First Search
- Binary Tree

## Company Tags

- Amazon
- Google
- Microsoft
- Meta

## Solution Approaches

### 1. Brute Force (Check Height at Every Node)

**Intuition**: A tree is balanced if the root is balanced **and** both of its subtrees are balanced. For each node, compute the height of its left and right subtrees with a separate `height()` function, compare them, then recursively check the children. This directly mirrors the definition, but it recomputes the same subtree heights over and over.

**Algorithm**:
1. Define `height(node)`:
   - Return `0` if `node` is `null`.
   - Otherwise return `1 + max(height(node.left), height(node.right))`.
2. Define `isBalanced(node)`:
   - Return `true` if `node` is `null`.
   - Compute `leftHeight = height(node.left)` and `rightHeight = height(node.right)`.
   - If `abs(leftHeight - rightHeight) > 1`, return `false`.
   - Otherwise return `isBalanced(node.left) && isBalanced(node.right)`.
3. Call `isBalanced(root)`.

**Time Complexity**: `O(n^2)` in the worst case (a skewed tree, where `height()` walks an ever-shrinking chain for every node). It is `O(n log n)` for a perfectly balanced tree.
**Space Complexity**: `O(h)` for the recursion stack, where `h` is the tree height (`O(n)` worst case).

### 2. Post-order DFS with a Global Flag (Implemented)

**Intuition**: Height computation is naturally post-order: a node's height depends on the heights of its children. If we compute heights **once** and check the balance condition at each node during that same traversal, we avoid the repeated work of the brute force. A single boolean flag records whether any node has been found unbalanced.

**Algorithm**:
1. Initialize `balanced = true`.
2. Define `traverse(node)`:
   - Return `0` if `node` is `null`.
   - Recursively compute `left = traverse(node.left)` and `right = traverse(node.right)`.
   - If `abs(left - right) > 1`, set `balanced = false`.
   - Return `max(left, right) + 1` as this subtree's height.
3. Run `traverse(root)` once and return `balanced`.

**Time Complexity**: `O(n)` — each node is visited exactly once.
**Space Complexity**: `O(h)` for the recursion stack.

### 3. Bottom-up DFS with a Sentinel (`-1`) and Early Exit

**Intuition**: Instead of a separate flag, let the height function itself report failure. Return the height when a subtree is balanced, and return `-1` as soon as any subtree is unbalanced. Parents can then stop immediately when they see `-1`, so the traversal prunes whole branches instead of visiting every node.

**Algorithm**:
1. Define `check(node)`:
   - Return `0` if `node` is `null`.
   - Compute `left = check(node.left)`. If `left === -1`, return `-1`.
   - Compute `right = check(node.right)`. If `right === -1`, return `-1`.
   - If `abs(left - right) > 1`, return `-1`.
   - Otherwise return `max(left, right) + 1`.
2. Return `check(root) !== -1`.

**Time Complexity**: `O(n)` worst case; in practice it stops early once an imbalance is found.
**Space Complexity**: `O(h)` for the recursion stack.

## Visual Explanation

```
Balanced tree: [3,9,20,null,null,15,7]

          3              height(9)  = 1
         / \             height(20) = 2  (children 15, 7 are leaves)
        9  20            diff at 3  = |1 - 2| = 1  -> OK
           / \
          15  7

Unbalanced tree: [1,2,2,3,3,null,null,4,4]

          1              height(left subtree)  = 3
         / \             height(right subtree) = 1
        2   2            diff at 1 = |3 - 1| = 2  -> NOT balanced
       / \
      3   3
     / \
    4   4
```

The imbalance in the second tree is only visible after the child heights are known, which is why a **post-order** traversal (children before parent) is the natural fit.

## Approach Comparison

| Approach | Time Complexity | Space Complexity | Early Exit | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Brute Force** | `O(n^2)` worst | `O(h)` | No | Recomputes subtree heights at every node |
| **DFS + Global Flag** | `O(n)` | `O(h)` | No | Implemented; one pass, simple to read |
| **Sentinel `-1`** | `O(n)` worst | `O(h)` | Yes | Prunes remaining branches after an imbalance |

## Common Pitfalls

1. **Checking only the root**: The definition applies to **every** node, not just the root. A tree can have a balanced root but an unbalanced subtree.
2. **Confusing height and depth**: This solution uses height measured in **nodes** (`null` has height `0`, a leaf has height `1`). Be consistent; mixing edge-based and node-based heights shifts every difference.
3. **Forgetting the absolute value**: A left subtree that is two levels taller than the right is just as invalid as the reverse. Use `Math.abs(left - right)`.
4. **Recomputing heights per node**: Calling `height()` inside `isBalanced()` for every node turns an `O(n)` problem into `O(n^2)`.
5. **Short-circuiting a flag-based traversal**: If you stop the post-order pass while an ancestor still needs a child height, the parent may receive a bogus value. Either finish the traversal (as implemented) or return a sentinel such as `-1` that propagates failure to the root.
6. **Empty tree**: `root = []` is balanced (`true`). Make sure the base case returns `0` and the flag starts as `true`.
7. **Recursion depth**: A chain of up to `5000` nodes creates a deep call stack. JavaScript engines usually cope, but an explicit stack is safer in memory-constrained environments.
