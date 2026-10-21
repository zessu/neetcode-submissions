# Binary Tree Postorder Traversal - LeetCode 145

## Problem Description

Given the `root` of a binary tree, return the **postorder traversal** of its nodes' values.

Postorder traversal visits every node in the order **left subtree → right subtree → node**. In other words, a node is only recorded after both of its children (and their entire subtrees) have been recorded. A null child contributes nothing.

The recursive definition is:

```
postorder(node):
    if node is null: return
    postorder(node.left)
    postorder(node.right)
    visit(node)
```

The follow-up asks for an **iterative** solution, which is the interesting part of this problem: postorder is the one depth-first order that does not map cleanly onto a single "pop and visit" stack loop.

## Examples

### Example 1:
```
Input: root = [1,null,2,3]
Output: [3,2,1]
```
**Explanation:** Node `1` has no left child, so its right subtree is visited first. Node `2` is the right child of `1`, and node `3` is the left child of `2`. The traversal is `3` (leaf) → `2` → `1`.

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
**Explanation:** A single node has no children, so it is visited immediately.

### Additional Example:
```
Input: root = [1,2,3,4,5,6,7]
Output: [4,5,2,6,7,3,1]
```
**Explanation:** The tree is perfect with three levels. The left subtree of `1` produces `4,5,2` (left child `4`, right child `5`, then `2`), the right subtree produces `6,7,3`, and the root `1` comes last.

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

**Intuition**: Postorder is defined recursively. Recurse into the left child, then the right child, and append the node's value on the way back up. Nothing needs to be combined; the call order itself is the answer.

**Algorithm**:
1. If the node is `null`, return.
2. Recurse on `node.left`.
3. Recurse on `node.right`.
4. Push `node.val` onto the result array.

**Time Complexity**: `O(n)` — every node is visited exactly once.
**Space Complexity**: `O(h)` for the recursion stack, where `h` is the tree height (`O(log n)` balanced, `O(n)` for a skewed tree). The output array is `O(n)`.

### 2. Iterative — Two Stacks (Reverse of Root-Right-Left)

**Intuition**: Postorder is `left, right, node`. Its reverse is `node, right, left`, which is a preorder-like traversal that visits the **right** child before the **left**. We can generate `node, right, left` with an ordinary stack, push each visited node onto a second stack, and then drain the second stack to reverse the order.

**Algorithm**:
1. If `root` is null, return `[]`.
2. Push `root` onto `stack1`.
3. While `stack1` is not empty:
   - Pop `node` from `stack1` and push it onto `stack2`.
   - Push `node.left` onto `stack1` (if it exists).
   - Push `node.right` onto `stack1` (if it exists).
     Because `stack1` is LIFO, `right` is popped before `left`.
4. Pop every node from `stack2` into the result. The second stack reverses `node, right, left` into `left, right, node`.

**Time Complexity**: `O(n)` — each node is pushed and popped a constant number of times.
**Space Complexity**: `O(n)` — both stacks together can hold all nodes.

### 3. Iterative — Single Stack with `lastVisited`

**Intuition**: Simulate the recursion with one stack and a `curr` pointer. Descend as far left as possible. When there is no left child, look at the top of the stack: if it has a right child that has **not just been output**, move into that right subtree. Otherwise both subtrees are done (or absent), so output the node and pop it. Tracking `lastVisited` is what tells us the right subtree has already been handled.

**Algorithm**:
1. `stack = []`, `curr = root`, `lastVisited = null`, `result = []`.
2. While `curr !== null` or the stack is not empty:
   - While `curr !== null`: push `curr`, then `curr = curr.left`.
   - Let `node = stack[stack.length - 1]` (peek, do not pop).
   - If `node.right !== null && lastVisited !== node.right`: set `curr = node.right`.
   - Else: push `node.val` to `result`, set `lastVisited = node`, and pop the stack.
3. Return `result`.

**Time Complexity**: `O(n)` — each node is pushed and popped once, and each edge is followed at most twice.
**Space Complexity**: `O(h)` — the stack holds the current root-to-node path.

### 4. Morris Traversal (O(1) Space, Advanced)

**Intuition**: Morris traversal temporarily rewires `null` right pointers into "threads" that point back to an ancestor, so no stack is needed. For postorder, attach a dummy node whose left child is the root. When a thread is found (meaning the left subtree has been explored), output the **reverse of the right spine** of that left subtree, then undo the thread. A final pass at the dummy outputs the reverse of the root's right boundary.

**Algorithm**:
1. Create a dummy node with `dummy.left = root`; set `curr = dummy`.
2. While `curr !== null`:
   - If `curr.left === null`, move `curr = curr.right`.
   - Otherwise find the rightmost node `pred` in `curr.left`'s right spine.
     - If `pred.right === null`: create a thread `pred.right = curr`, then `curr = curr.left`.
     - Else: output the values on the path `curr.left → ... → pred` in reverse, remove the thread (`pred.right = null`), then `curr = curr.right`.
3. Return the accumulated output.

**Time Complexity**: `O(n)` — each edge is traversed a constant number of times.
**Space Complexity**: `O(1)` auxiliary (the output array is still `O(n)`).

## Visual Explanation

```
Tree:  root = [1, null, 2, 3]

        1
         \
          2
         /
        3

Postorder = left subtree, right subtree, node

  descend left of 1        -> nothing
  descend right subtree 2  -> descend left -> leaf 3  => output 3
                           -> right of 2 empty        => output 2
  back at 1                                           => output 1

  result = [3, 2, 1]
```

The key ordering fact: **the root is always the last element** of a postorder traversal, and every subtree is contiguous in the output.

## Approach Comparison

| Approach | Time | Space | Iterative? | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Recursive DFS** (implemented) | `O(n)` | `O(h)` | No | Shortest, clearest code; recursion depth can overflow on skewed trees |
| **Two Stacks** | `O(n)` | `O(n)` | Yes | Simple to remember via "reverse of root-right-left"; uses an extra `O(n)` stack |
| **One Stack + `lastVisited`** | `O(n)` | `O(h)` | Yes | Best iterative space; the `lastVisited` condition is easy to get wrong |
| **Morris Traversal** | `O(n)` | `O(1)` | Yes | No stack at all, but temporarily mutates the tree and is hard to maintain |

## Common Pitfalls

1. **Confusing the three orders**: postorder is **left, right, node** — not inorder (`left, node, right`) and not preorder (`node, left, right`). The root of the whole tree is the *last* output, not the first.
2. **Two-stack push order**: push `left` before `right` onto `stack1`. Since the stack is LIFO, this makes `right` pop first, which is exactly the reverse-postorder order. Swapping the pushes silently produces a wrong traversal.
3. **Single-stack right-child test**: comparing `node.right !== null` alone is not enough — after the right subtree has been output, the same node is seen again and would loop forever. Compare against `lastVisited` as well.
4. **Popping too early**: with the single-stack method, peek at the top node while deciding whether to descend right. Popping it before exploring its right subtree loses the node.
5. **Class-level result array**: the submission stores `res` as a field initialized once. If the same `Solution` instance is reused for a second call, values from the first call remain. Create a fresh array (or a fresh `Solution`) per call in a real application.
6. **Empty tree**: return `[]` rather than throwing on `root.val`; the constraint allows zero nodes.
