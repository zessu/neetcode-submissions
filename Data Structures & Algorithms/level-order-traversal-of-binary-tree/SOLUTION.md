# Binary Tree Level Order Traversal - Solution

## Solution Code

```typescript
class Solution {
    traverse(root: TreeNode | null, result: number[][], level: number) {
        if(root === null) return;
        if(result.length === level){
            result.push([]);
        }
        result[level].push(root.val);
        this.traverse(root.left, result, level + 1);
        this.traverse(root.right, result, level + 1);
    }

    levelOrder(root: TreeNode | null): number[][] {
        const result = [];
        this.traverse(root, result, 0);
        return result;
    }
}
```

## Approach

The submission uses **recursive DFS with a depth parameter**. The depth doubles as the index of the output bucket, so no queue or level-boundary tracking is needed.

1. **Start with an empty result** and call `traverse(root, result, 0)`. The third argument is the current depth, starting at `0` for the root.
2. **Base case**: a `null` node contributes nothing, so return immediately. This also handles the empty tree — `traverse` returns and `result` stays `[]`.
3. **Grow the output on demand**: levels are discovered top-down, left-to-right, so the first time we reach depth `level`, `result.length` is exactly `level`. Pushing a fresh array then creates `result[level]`.
4. **Append the value**: `result[level].push(root.val)` places the node in its level bucket, in visit order.
5. **Recurse left, then right** with `level + 1`. Visiting the left subtree before the right guarantees the left-to-right order the problem requires.
6. **Return `result`** after the traversal completes.

- **Time Complexity**: `O(n)` — each of the `n` nodes triggers exactly one `traverse` call and one array push.
- **Space Complexity**: `O(h)` auxiliary for the recursion stack, where `h` is the tree height (`O(log n)` balanced, `O(n)` skewed), plus `O(n)` for the returned nested arrays.

## Walkthrough

Using Example 1: `root = [3,9,20,null,null,15,7]`.

```
        3
       / \
      9  20
         /  \
        15   7
```

```
traverse(3, result=[], level=0)
  result.length (0) === level (0)  ->  result.push([])      result = [[]]
  result[0].push(3)                                          result = [[3]]
  traverse(9, result, 1)
    result.length (1) === level (1) ->  result.push([])      result = [[3],[]]
    result[1].push(9)                                        result = [[3],[9]]
    traverse(null, result, 2) -> return
    traverse(null, result, 2) -> return
  traverse(20, result, 1)
    result.length (2) !== level (1) -> no new bucket
    result[1].push(20)                                       result = [[3],[9,20]]
    traverse(15, result, 2)
      result.length (2) === level (2) -> result.push([])     result = [[3],[9,20],[]]
      result[2].push(15)                                     result = [[3],[9,20],[15]]
      traverse(null, ...) -> return
      traverse(null, ...) -> return
    traverse(7, result, 2)
      result.length (3) !== level (2) -> no new bucket
      result[2].push(7)                                      result = [[3],[9,20],[15,7]]
      traverse(null, ...) -> return
      traverse(null, ...) -> return
return [[3],[9,20],[15,7]]
```

Example 2 (`root = [1]`): one call at level `0` creates `result[0]` and pushes `1`, giving `[[1]]`.

Example 3 (`root = []`): the first call hits `root === null` and returns; `result` was never touched, giving `[]`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it is or is not chosen here |
| :--- | :--- | :--- | :--- |
| **Recursive DFS + level index (implemented)** | `O(n)` | `O(h)` + `O(n)` output | Shortest code, no queue, and the depth is free from the call stack. Preferred when recursion is acceptable and the output structure itself can hold the grouping. |
| **BFS + level-size loop** | `O(n)` | `O(w)` + `O(n)` output | The textbook level-order traversal. Uses memory proportional to the widest level rather than the height (better for deep, narrow trees), and never risks stack overflow. Slightly more code and needs the `levelSize` snapshot. |
| **BFS + `(node, depth)` pairs** | `O(n)` | `O(w)` + `O(n)` output | Explicit depth per entry, but pays an allocation per node and a depth check per dequeue. Useful when nodes arrive from several levels at once, which is not the case here. |

**Why the DFS version is preferred in this submission**: it is the most compact correct solution. The depth parameter removes the need for a queue entirely, and `result.length === level` is a constant-time way to create buckets in the exact order they are needed. Recursion also mirrors the tree's definition, which makes the code easy to review.

**When an alternative wins**:

- **Very deep / skewed trees** (`n` in the millions): recursion can overflow the call stack. Use BFS with the level-size loop, whose auxiliary memory is the queue width rather than the depth.
- **Memory-sensitive environments**: the BFS queue is at most the widest level, while DFS stack is the height. For a balanced tree the queue is wider (`O(n/2)` leaves) and DFS wins; for a linked-list-shaped tree the queue is tiny (`O(1)`) and BFS wins.
- **Streaming / online traversal**: if values arrive level by level from an external source, the `(node, depth)` pair approach generalizes naturally.

## Key Insights

1. **Depth is the bucket index**: in a top-down DFS, the first node seen at depth `d` is also the first node of level `d`, so `result.length === d` is a safe "does this level exist?" test.
2. **Order of recursion is the order inside a level**: left before right is what makes the inner arrays read left-to-right. Swapping the two recursive calls produces a right-to-left traversal.
3. **Empty tree is a special case of the base case**: no explicit guard is needed because `result` is only populated by non-null nodes.
4. **The output dominates memory**: both approaches allocate `n` integers for the result; the difference is only in the auxiliary stack/queue.
