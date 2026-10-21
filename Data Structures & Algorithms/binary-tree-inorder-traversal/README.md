# Binary Tree Inorder Traversal - LeetCode 94

## Problem Description

Given the `root` of a binary tree, return the **inorder traversal** of its nodes' values.

Inorder traversal visits a binary tree in the order:

1. Traverse the **left** subtree.
2. Visit the **root**.
3. Traverse the **right** subtree.

For a binary **search** tree, an inorder traversal produces the node values in non-decreasing sorted order. For an arbitrary binary tree, it simply produces the left-root-right sequence.

## Examples

### Example 1:
```
Input: root = [1,null,2,3]
Output: [1,3,2]
```
**Explanation:** The tree is:

```
    1
     \
      2
     /
    3
```

The traversal visits `1` (no left child), then moves to `2`; before visiting `2`, it visits its left child `3`. The order is left-root-right: `1, 3, 2`.

### Example 2:
```
Input: root = []
Output: []
```
**Explanation:** An empty tree has no nodes, so the traversal is an empty list.

### Additional Example 3:
```
Input: root = [1]
Output: [1]
```
**Explanation:** A single node has no left or right subtree, so it is visited once.

### Additional Example 4:
```
Input: root = [1,2,3,4,5,null,6]
Output: [4,2,5,1,3,6]
```
**Explanation:** The left subtree of `1` is rooted at `2` with children `4` and `5`; its inorder is `4, 2, 5`. Then the root `1` is visited. The right subtree is rooted at `3` with a right child `6`; its inorder is `3, 6`. Concatenating gives `4, 2, 5, 1, 3, 6`.

## Constraints

- The number of nodes in the tree is in the range `[0, 100]`.
- `-100 <= Node.val <= 100`

**Follow-up:** The recursive solution is trivial. Could you do it iteratively?

## Topics

- Stack
- Tree
- Depth-First Search
- Binary Tree

## Company Tags

- Amazon
- Microsoft
- Meta
- Google
- Bloomberg

## Solution Approaches

### 1. Recursive DFS (Implemented)

**Intuition**: Inorder traversal is defined recursively. Visit the left subtree, record the current node, then visit the right subtree. The call stack takes care of remembering where to return.

**Algorithm**:
1. Define `traverse(node)`:
   - Return if `node` is `null`.
   - Recursively call `traverse(node.left)`.
   - Push `node.val` onto the result array.
   - Recursively call `traverse(node.right)`.
2. Call `traverse(root)` and return the result array.

**Time Complexity**: `O(n)` — every node is visited exactly once.
**Space Complexity**: `O(h)` for the recursion stack, where `h` is the tree height (`O(n)` worst case for a chain, `O(log n)` for a balanced tree).

### 2. Iterative with an Explicit Stack

**Intuition**: Simulate the recursion manually. Walk as far left as possible while pushing nodes onto a stack. When there is no left child, pop a node, visit it, and then move to its right subtree. This reproduces the left-root-right order without relying on the call stack.

**Algorithm**:
1. Initialize `stack = []`, `result = []`, and `curr = root`.
2. While `curr !== null` or the stack is not empty:
   - While `curr !== null`: push `curr`; set `curr = curr.left`.
   - Pop the top node and append its value to `result`.
   - Set `curr = node.right`.
3. Return `result`.

**Time Complexity**: `O(n)` — each node is pushed and popped once.
**Space Complexity**: `O(h)` for the stack.

### 3. Morris Traversal (Constant Space)

**Intuition**: Use the tree's own unused `right` pointers to remember the way back. For a node with a left subtree, find its **inorder predecessor** (the rightmost node in the left subtree). Point the predecessor's `right` back to the current node, creating a temporary thread. After traversing the left subtree, follow the thread back, remove it, and visit the node.

**Algorithm**:
1. Set `curr = root`.
2. While `curr !== null`:
   - If `curr.left === null`: visit `curr`; set `curr = curr.right`.
   - Otherwise, find the rightmost node `pred` in `curr.left`:
     - If `pred.right === null`: set `pred.right = curr` (create thread); set `curr = curr.left`.
     - If `pred.right === curr` (thread already exists): remove it (`pred.right = null`); visit `curr`; set `curr = curr.right`.
3. Return the collected values.

**Time Complexity**: `O(n)` — each edge is traversed at most a constant number of times.
**Space Complexity**: `O(1)` auxiliary space (the output array is not counted; the tree is temporarily modified but restored).

## Visual Explanation

```
Tree: [1,null,2,3]

        1
         \
          2
         /
        3

Inorder = left, root, right

traverse(1)
├── traverse(1.left = null)      -> return
├── visit 1                      -> output [1]
└── traverse(1.right = 2)
    ├── traverse(2.left = 3)
    │   ├── traverse(3.left = null)
    │   ├── visit 3              -> output [1, 3]
    │   └── traverse(3.right = null)
    ├── visit 2                  -> output [1, 3, 2]
    └── traverse(2.right = null)

Result: [1, 3, 2]
```

The recursion only records a node **between** its two subtree calls. That single detail is what distinguishes inorder from preorder and postorder.

## Approach Comparison

| Approach | Time Complexity | Space Complexity | Notes |
| :--- | :--- | :--- | :--- |
| **Recursive DFS** | `O(n)` | `O(h)` | Implemented; shortest and clearest |
| **Iterative stack** | `O(n)` | `O(h)` | Avoids recursion; natural follow-up answer |
| **Morris traversal** | `O(n)` | `O(1)` | Constant auxiliary space; temporarily rewires the tree |

## Common Pitfalls

1. **Recording at the wrong time**: Pushing the node before recursing left produces preorder. Inorder must push **after** the left subtree returns and **before** the right subtree is explored.
2. **Forgetting the null base case**: Without it, the recursion never stops on a leaf's missing children.
3. **Iterative stack order**: Push nodes while walking left, then pop and visit. Pushing the right child before walking left changes the order.
4. **Reusing a shared result array**: A class-level `res` array accumulates values across calls if the same `Solution` instance is reused. LeetCode normally creates a fresh instance per test, but a long-lived instance should reset the array (or use a local accumulator).
5. **Morris thread cleanup**: The temporary `right` pointers must be removed, otherwise the tree is left corrupted and the traversal can loop.
6. **Empty tree**: Return `[]`, not `[null]`. The base case and the loop condition both handle this naturally.
