# Binary Tree Right Side View - Solution

## Solution Code

```typescript
class Solution {

    traverse(root: TreeNode | null, result: number[][], level: number){
        if(root === null) return;
        if(result.length === level) {
            result.push([]);
        }
        result[level].push(root.val);

        this.traverse(root.left, result, level + 1);
        this.traverse(root.right, result, level + 1);
    }

    rightSideView(root: TreeNode | null): number[] {
        const result = [];
        this.traverse(root, result, 0);
        const mapped = result.map(arr => {
            return arr[arr.length - 1]
        });
        return mapped;
    }
}
```

## Approach

The solution uses **depth-first search that groups values by depth**. It does not try to decide visibility during the traversal; it records every node in its level bucket and picks the last value afterwards.

1. **Collect levels**: `traverse(root, result, 0)` is called with an empty `result` array and level `0`.
2. **Base case**: a `null` node returns immediately, so missing children simply do not create buckets.
3. **New level bucket**: `if (result.length === level)` appends a fresh array. Because levels are visited in increasing order and never skipped, the level index always equals the bucket count at the moment a level is first reached.
4. **Append the value**: `result[level].push(root.val)` records the node at its depth.
5. **Left before right**: recursing left first means each bucket is filled in **left-to-right** order. The last element appended to a bucket is therefore the rightmost node at that depth.
6. **Extract the visible nodes**: `result.map(arr => arr[arr.length - 1])` takes the final element of every level.

- **Time Complexity**: `O(n)` — each node is visited once, and the final `map` touches one value per level (`O(h)`), which is bounded by `n`.
- **Space Complexity**: `O(n)` for the 2D `result` array, because every node value is stored, plus `O(h)` for the recursion stack. Only `O(h)` of the stored data is actually needed for the answer.

## Walkthrough

### Example 1: `root = [1, 2, 3, null, 5, null, 4]`

```
            1
          /   \
         2     3
          \     \
           5     4
```

The DFS visits nodes in preorder (left first):

| Visit | Node | Level | `result` after the push |
| :--- | :--- | :--- | :--- |
| 1 | `1` | 0 | `[[1]]` |
| 2 | `2` | 1 | `[[1], [2]]` |
| 3 | `5` | 2 | `[[1], [2], [5]]` |
| 4 | `3` | 1 | `[[1], [2, 3], [5]]` |
| 5 | `4` | 2 | `[[1], [2, 3], [5, 4]]` |

Then `map` takes the last element of each bucket:

- Level 0: last of `[1]` → `1`
- Level 1: last of `[2, 3]` → `3`
- Level 2: last of `[5, 4]` → `4`

**Output:** `[1, 3, 4]`.

### Example 2: `root = [1, 2, 3, 4, null, null, null, 5]`

```
        1
       / \
      2   3
     /
    4
   /
  5
```

| Level | Nodes in left-to-right order | Visible (last) |
| :--- | :--- | :--- |
| 0 | `[1]` | `1` |
| 1 | `[2, 3]` | `3` |
| 2 | `[4]` | `4` |
| 3 | `[5]` | `5` |

**Output:** `[1, 3, 4, 5]`.

This example shows why "follow the right child" is wrong: `4` and `5` are left children, but they are the only nodes at their depths.

## Comparison with the Alternatives

| Approach | Time | Space | Why it might be chosen |
| :--- | :--- | :--- | :--- |
| **DFS Left-to-Right, collect all** (implemented) | `O(n)` | `O(n)` | Very simple to reason about: group by level, take the last of each group. The code reads like a level-order grouping and needs no visibility special case. |
| **BFS Level Order** | `O(n)` | `O(w)` | The most direct definition of "rightmost per level": process one level at a time and keep the last dequeued node. Uses less memory than the implemented version when the tree is narrow. |
| **DFS Right-First** | `O(n)` | `O(h)` | Best memory profile: writes one value per level and stops. It visits the right side first, so the first node at each new depth is the answer. |
| **Brute Force (scan per depth)** | `O(n · h)` | `O(h)` | Only useful as a conceptual stepping stone; it re-walks the tree once per level and is asymptotically worse. |

**Why the implemented approach is preferred here**: it separates the two concerns cleanly — traversal collects the tree by level, and a one-line `map` selects the rightmost. It is robust and easy to adapt (for example, to get the left side view by taking `arr[0]`). The extra `O(n)` storage is acceptable for the 100-node constraint.

**When an alternative wins**:

- **Large or wide trees**: BFS uses `O(w)` queue space and never stores internal levels. If `w` is much smaller than `n`, it is a real saving.
- **Deep, narrow trees**: DFS right-first uses only `O(h)` stack space and no per-node second array. It is the best choice when memory is constrained.
- **Streaming / early answer**: DFS right-first can emit each depth's answer as soon as that depth is first reached, whereas the implemented version must finish the entire traversal and then map.

## Key Insights

1. **Visibility is per depth, not per edge**: the answer at each depth is the rightmost node that exists there. It may be a left child if the right side of that level is empty.
2. **Order within a level matters**: DFS left-to-right fills buckets left-to-right, so the last element is the rightmost. Reversing the recursive calls without changing the `last` selection would return the left side view instead.
3. **Bucket creation is safe**: `result.length === level` is the correct "first time at this depth" test because DFS always reaches depth `d` only after depth `d - 1` exists.
4. **Recursion depth is the tree height**: `O(h)` stack, which is fine for 100 nodes but worth noting for general inputs.
5. **The final `map` is `O(h)`**: it iterates over levels, not nodes, so it does not change the overall `O(n)` time.
