# Path Sum - Solution

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
    /**
     * @param {TreeNode} root
     * @param {number} targetSum
     * @return {boolean}
     */
    hasPathSum(root: TreeNode | null, targetSum: number): boolean {


        const recurr = (root: TreeNode, targetSum: number, counter: number) => {
            if(root === null) return false;

            const newCount = counter + root.val;

            if(!root.left && !root.right && newCount === targetSum) return true;


            return recurr(root.left, targetSum, newCount) || recurr(root.right, targetSum, newCount);
        }

        return recurr(root, targetSum, 0);

    }
}
```

## Approach

The submission uses **recursive DFS with a running path sum**. The helper carries the sum of the nodes already on the current path, and the leaf check compares the completed sum against the target.

1. **Helper signature**: `recurr(node, targetSum, counter)`. `counter` is the sum of the ancestors of `node` (not including `node` itself). `targetSum` is passed down unchanged so every comparison uses the original target.
2. **Base case**: `root === null` returns `false`. This covers missing children and the empty tree in one check — a null node is never a valid path endpoint.
3. **Extend the path**: `newCount = counter + root.val` is exactly the sum from the original root down to this node.
4. **Leaf check**: only when `!root.left && !root.right` does `newCount` represent a complete root-to-leaf sum. If it equals `targetSum`, return `true`.
5. **Recurse**: `recurr(left, ...) || recurr(right, ...)`. JavaScript's `||` short-circuits, so the right subtree is skipped once the left finds a match.
6. **Initial call**: `counter = 0`, because no nodes have been added before the root.

- **Time Complexity**: `O(n)` — each node gets exactly one helper call; a match stops the search early.
- **Space Complexity**: `O(h)` — one stack frame per node on the current path. `O(log n)` for a balanced tree, `O(n)` for a degenerate one.

## Walkthrough

### Example 1: `root = [5,4,8,11,null,13,4,7,2,null,null,null,1]`, `targetSum = 22`

```
            5
           / \
          4   8
         /   / \
        11  13  4
       /  \      \
      7    2      1
```

```
recurr(5, 22, 0)
  newCount = 0 + 5 = 5        not a leaf
  |
  +-- recurr(4, 22, 5)
        newCount = 5 + 4 = 9  not a leaf
        |
        +-- recurr(11, 22, 9)
              newCount = 9 + 11 = 20   not a leaf
              |
              +-- recurr(7, 22, 20)
                    newCount = 27     leaf, 27 !== 22 -> false
              |
              +-- recurr(2, 22, 20)
                    newCount = 22     leaf, 22 === 22 -> true
  return true (short-circuit: the right subtree of 5 is never explored)
```

The call stack at the moment of success is `recurr(5) → recurr(4) → recurr(11) → recurr(2)`, which is exactly the path `5 → 4 → 11 → 2` and its sum `22`.

### Example 2: `root = [1,2,3]`, `targetSum = 5`

```
recurr(1, 5, 0)  newCount = 1
  recurr(2, 5, 1)  newCount = 2  leaf -> 2 !== 5 -> false
  recurr(3, 5, 1)  newCount = 4  leaf -> 4 !== 5 -> false
return false
```

Both leaves are checked; neither completes a path summing to `5`.

### Example 3: `root = []`, `targetSum = 0`

```
recurr(null, 0, 0) -> base case returns false
```

No node is ever added to the path, so no leaf exists and the answer is `false`. Importantly, the implementation does **not** treat "counter equals target on a null node" as success.

### Extra: a one-child node is not a leaf

For `root = [1,2]` (root has only a left child) and `targetSum = 1`, the call at node `1` has `newCount = 1` but `root.left` exists, so the leaf check is skipped. The only path ends at `2`, giving sum `3`; the answer is `false`. Checking `newCount === targetSum` without the leaf guard would incorrectly return `true`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it is or is not chosen here |
| :--- | :--- | :--- | :--- |
| **Recursive DFS + running sum (implemented)** | `O(n)` | `O(h)` | The most direct expression of the problem: walk a root-to-leaf path, accumulate, compare at the leaf. Short-circuits on success and stores only one path's worth of state. |
| **Iterative DFS + stack** | `O(n)` | `O(h)` | Functionally identical and immune to call-stack limits. Slightly harder to read because the remaining sum must be pushed alongside each node. |
| **BFS + queue** | `O(n)` | `O(w)` | Correct and can find a shallow valid leaf without descending deep elsewhere. But it keeps an entire frontier alive, which is usually more memory than DFS's single path. |

**Why the recursive version is preferred in this submission**: the running sum is naturally a parameter of the recursion, so no extra data structure is needed. The leaf test reads exactly like the problem statement, and `||` gives free early exit. On the given constraint of at most 5000 nodes, stack depth is not a practical concern even for a skewed tree in Node.js.

**When an alternative wins**:

- **Deep trees / large constraints**: if the depth can approach the call-stack limit (or the environment has a small stack), the iterative DFS is the safe choice. It preserves the `O(h)` path-local memory without recursion.
- **Answer likely near the root**: BFS reaches shallow leaves first and can return earlier in wall-clock terms, though the asymptotic bound is unchanged.
- **You need every valid path** (a follow-up variant): neither early-returning version suffices; collect paths during DFS and keep the ones that match, which costs `O(n · h)` in the worst case for copying paths.

## Key Insights

1. **The sum must be evaluated at leaves only**: the problem asks for a complete root-to-leaf path, not a prefix. The `!root.left && !root.right` guard is the whole difference between correct and incorrect.
2. **Pass sums by value**: `newCount` is recomputed per call and passed as an argument, so sibling branches never share mutable state.
3. **`null` is not a path**: returning `false` for `null` before any sum comparison handles both the empty tree and missing children correctly.
4. **Negative values forbid pruning**: you cannot stop early when the running sum exceeds the target, because later negative nodes can bring it back down. Visit every node in the worst case.
5. **Short-circuiting is a real optimization**: `||` stops at the first successful subtree, which matters when the matching path is shallow.
