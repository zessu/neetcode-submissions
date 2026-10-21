# Binary Tree Postorder Traversal - Solution

## Solution Code

```typescript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     constructor(val = 0, left = null, right = null) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    res: number[] = [];
    traverse(root: TreeNode | null) {
        if(!root) return;
        this.traverse(root.left);
        this.traverse(root.right);
        this.res.push(root.val);
    }
    /**
     * @param {TreeNode} root
     * @return {number[]}
     */
    postorderTraversal(root: TreeNode | null): number[] {
        this.traverse(root);
        return this.res;
    }
}
```

## Approach

The solution uses **recursive depth-first search**. A helper `traverse` performs the standard postorder visit, and the public method seeds it with the root and returns the accumulated array.

1. **Base case**: `if (!root) return;` — a null subtree contributes no values. This also makes the empty-tree case return `[]` naturally.
2. **Left subtree**: `this.traverse(root.left)` — fully process everything to the left before recording the current node.
3. **Right subtree**: `this.traverse(root.right)` — then fully process everything to the right.
4. **Visit**: `this.res.push(root.val)` — the node is appended only after both subtrees are complete. This single line is the entire difference between postorder and the other two depth-first orders.
5. **Return**: `postorderTraversal` calls `traverse(root)` and returns `this.res`.

`res` is a class field rather than a parameter, so the helper does not have to thread an array through every recursive call.

- **Time Complexity**: `O(n)` — `traverse` is called once per node (plus once per null child), and the `push` is `O(1)`.
- **Space Complexity**: `O(h)` for the recursion stack, where `h` is the height of the tree. This is `O(log n)` for a balanced tree and `O(n)` for a completely skewed one. The returned array is `O(n)` and is required output.

## Walkthrough

### Example 1: `root = [1, null, 2, 3]`

The array is a level-order encoding: `1` is the root, its left child is `null`, its right child is `2`, and `3` is the left child of `2`.

```
        1
         \
          2
         /
        3
```

| Call | Action | `res` after the call |
| :--- | :--- | :--- |
| `traverse(1)` | descend left | `[]` |
| `traverse(null)` | return immediately | `[]` |
| `traverse(2)` | descend left | `[]` |
| `traverse(3)` | both children null | `[]` |
| `traverse(null)` (left of 3) | return | `[]` |
| `traverse(null)` (right of 3) | return | `[]` |
| back in `traverse(3)` | push `3` | `[3]` |
| `traverse(null)` (right of 2) | return | `[3]` |
| back in `traverse(2)` | push `2` | `[3, 2]` |
| back in `traverse(1)` | push `1` | `[3, 2, 1]` |

**Output:** `[3, 2, 1]`.

### Additional example: `root = [1, 2, 3, 4, 5, 6, 7]`

```
          1
        /   \
       2     3
      / \   / \
     4   5 6   7
```

- Subtree `2`: left `4` outputs `4`, right `5` outputs `5`, then `2` → `[4, 5, 2]`.
- Subtree `3`: left `6` outputs `6`, right `7` outputs `7`, then `3` → `[6, 7, 3]`.
- Root `1` is appended last.

**Output:** `[4, 5, 2, 6, 7, 3, 1]`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it might be chosen |
| :--- | :--- | :--- | :--- |
| **Recursive DFS** (implemented) | `O(n)` | `O(h)` | The traversal definition is recursive, so the code is a direct transcription: three lines in the helper. Best readability and the smallest amount of state. |
| **Two Stacks** | `O(n)` | `O(n)` | Iterative and easy to recall ("reverse of root-right-left"). It avoids any recursion-depth risk, at the cost of a second stack holding every node. |
| **One Stack + `lastVisited`** | `O(n)` | `O(h)` | The best iterative choice when stack space matters: it never holds more than one root-to-node path. It needs a `lastVisited` pointer and careful peeking, so it is easier to get wrong. |
| **Morris Traversal** | `O(n)` | `O(1)` | Wins when auxiliary memory must be constant (e.g. huge or deeply skewed trees). It temporarily rewires right pointers, which is unsafe for a shared/read-only tree and harder to review. |

**Why the recursive approach is preferred here**: the constraints allow at most 100 nodes, so recursion depth is a non-issue, and postorder has no natural single-stack analogue. The recursive version is the least error-prone and mirrors the definition exactly.

**When an alternative wins**:

- If the tree can be deep (up to `10^5` nodes in a line) or the runtime stack is small, use the **single-stack** method. Recursion would overflow the call stack where an explicit `O(h)` heap stack merely grows.
- If the environment forbids recursion *and* memory is tight, use **Morris**. It is the only approach with `O(1)` auxiliary space.
- If code clarity matters more than memory, the **two-stack** method is easier to explain in an interview than the `lastVisited` variant, even though it uses more memory.

## Key Insights

1. **Postorder is bottom-up**: each node is recorded after its whole subtree. Consequently, the last element of the output is always the original root, and any subtree occupies a contiguous block in the result.
2. **One line distinguishes the orders**: moving `this.res.push(root.val)` before, between, or after the recursive calls yields preorder, inorder, or postorder respectively.
3. **The iterative difficulty is real**: preorder can visit on pop, and inorder can visit after descending left, but postorder must know whether the right subtree has already been processed. That is exactly what `lastVisited` records.
4. **The reverse trick is the simplest iterative formulation**: `reverse(postorder) = node, right, left`. Generating that with a stack and reversing it is much easier to write correctly than the one-stack simulation.
5. **State lives on the instance**: `res` is initialized once per `Solution` object. That is fine for LeetCode (a fresh instance per test), but reuse of one instance across calls would append to stale results.
