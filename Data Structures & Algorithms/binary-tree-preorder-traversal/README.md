# Binary Tree Preorder Traversal - LeetCode 144

## Problem Description

Given the `root` of a binary tree, return the **preorder traversal** of its nodes' values.

Preorder traversal visits every node in the order **node → left subtree → right subtree**. The node is recorded the moment it is reached, before either child is explored. A null child contributes nothing.

The recursive definition is:

```
preorder(node):
    if node is null: return
    visit(node)
    preorder(node.left)
    preorder(node.right)
```

The follow-up asks for an **iterative** solution. Unlike postorder, preorder maps cleanly onto an explicit stack: push the right child first, then the left child, so the left child is popped and visited next.

## Examples

### Example 1:
```
Input: root = [1,null,2,3]
Output: [1,2,3]
```
**Explanation:** Node `1` has no left child, so it is visited first, then its right child `2`, then `2`'s left child `3`.

### Example 2:
```
Input: root = []
Output: []
```
**Explanation:** The tree is empty, so the traversal is empty.

### Example 3:
```
Input: root = [1]
Output: [1]
```
**Explanation:** A single node is visited immediately.

### Additional Example:
```
Input: root = [1,2,3,4,5,6,7]
Output: [1,2,4,5,3,6,7]
```
**Explanation:** The tree is perfect with three levels. The root `1` comes first, then the entire left subtree (`2,4,5`), then the entire right subtree (`3,6,7`).

## Constraints

- The number of nodes in the tree is in the range `[0, 100]`.
- `-100 <= Node.val <= 100`

**Follow-up:** Recursive solution is trivial, could you do it iteratively?

## Topics

- Stack
- Tree
- Depth-First Search
- Binary Tree

## Company Tags

- Amazon
- Microsoft
- Google
- Meta

## Solution Approaches

### 1. Recursive DFS (Implemented)

**Intuition**: Preorder is a direct recursive definition: record the node, then process the left subtree, then the right subtree. The result is naturally in visit order because appending happens before the recursive calls.

**Algorithm**:
1. If the node is `null`, return.
2. Push `node.val` onto the result array.
3. Recurse on `node.left`.
4. Recurse on `node.right`.

**Time Complexity**: `O(n)` — every node is visited exactly once.
**Space Complexity**: `O(h)` for the recursion stack (`O(log n)` balanced, `O(n)` skewed). The output array is `O(n)`.

### 2. Iterative — Explicit Stack

**Intuition**: Use a stack to simulate the recursion. Pop a node, visit it immediately, then push its children. Push the **right** child first and the **left** child second: the stack is LIFO, so the left child is popped first and the traversal remains node → left → right.

**Algorithm**:
1. If `root` is null, return `[]`.
2. Push `root` onto the stack.
3. While the stack is not empty:
   - Pop `node` and append `node.val` to the result.
   - If `node.right` exists, push it.
   - If `node.left` exists, push it.
4. Return the result.

At any moment the stack holds at most one pending sibling per level, so its size is `O(h)`.

**Time Complexity**: `O(n)` — each node is pushed and popped once.
**Space Complexity**: `O(h)` — the stack holds at most one node per level.

### 3. Morris Preorder Traversal (O(1) Space, Advanced)

**Intuition**: Morris traversal avoids a stack by temporarily turning the rightmost `null` pointer of a left subtree into a "thread" back to the current node. That thread is the signal that the left subtree has been explored, so it can be removed and the walk can continue to the right. Because preorder records a node before descending, the value is emitted when the thread is **created**.

**Algorithm**:
1. `curr = root`.
2. While `curr !== null`:
   - If `curr.left === null`: append `curr.val`, then `curr = curr.right`.
   - Otherwise find `pred`, the rightmost node of `curr.left`'s subtree.
     - If `pred.right === null`: set `pred.right = curr` (thread), append `curr.val`, then `curr = curr.left`.
     - Else (`pred.right === curr`, the thread): remove it with `pred.right = null`, then `curr = curr.right`.

**Time Complexity**: `O(n)` — each edge is walked at most twice.
**Space Complexity**: `O(1)` auxiliary (output array excluded).

## Visual Explanation

```
Tree:  root = [1, null, 2, 3]

        1
         \
          2
         /
        3

Preorder = node, left subtree, right subtree

  visit 1                  => output 1
  left of 1 is null
  enter right subtree 2    => output 2
  enter left subtree 3     => output 3

  result = [1, 2, 3]
```

For the perfect tree `[1,2,3,4,5,6,7]`, the whole left side is finished before the right side begins:

```
          1
        /   \
       2     3
      / \   / \
     4   5 6   7

preorder:  1, 2, 4, 5, 3, 6, 7
           |  \_____/  \_____/
           |   left      right
          root
```

## Approach Comparison

| Approach | Time | Space | Iterative? | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Recursive DFS** (implemented) | `O(n)` | `O(h)` | No | Minimal code, mirrors the definition; can overflow on very deep trees |
| **Explicit Stack** | `O(n)` | `O(h)` | Yes | Standard interview answer; one subtlety: push right before left |
| **Morris Traversal** | `O(n)` | `O(1)` | Yes | Constant extra memory; temporarily mutates right pointers |

## Common Pitfalls

1. **Wrong push order**: pushing `left` before `right` makes the stack pop `right` first, producing `node, right, left` instead of preorder. Push **right first**, then left.
2. **Visiting on pop vs on push**: with this stack method, append when **popping**. If you append when pushing, the right child (pushed first) is recorded before the left child is even processed, producing `node, right, left`.
3. **Confusing with BFS**: preorder is depth-first. A queue produces level order (`[1,2,3,4,5,6,7]`), not preorder (`[1,2,4,5,3,6,7]`).
4. **Null children**: pushing `null` onto the stack is harmless only if the pop loop skips it. Cleaner to test before pushing, as the implementation does.
5. **Class-level result array**: the submission stores `res` as an instance field initialized once. Reusing the same `Solution` object across calls would accumulate stale values.
6. **Recursion depth**: the constraints keep the tree at 100 nodes, but for general inputs a skewed tree needs `O(n)` stack frames and may overflow.

## Related Problems

- [Binary Tree Postorder Traversal](../binary-tree-postorder-traversal/) — the reverse-shaped depth-first order.
- [Maximum Depth of Binary Tree](../depth-of-binary-tree/) — another recursive DFS over the same structure.
