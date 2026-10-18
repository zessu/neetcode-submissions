# Largest Component - Solution

## Solution Code

```typescript
const largestComponent = (graph: Record<string, number[]>): number => {
  let largest = 0;
  for(let [key, _] of Object.entries(graph)) {
    const length = navigate(graph, Number(key));
    largest = Math.max(largest, length);
  }
  return largest;
}

const navigate = (graph: Record<string, number[]>, key: number): number => {
  const visited = new Set();
  let length = 0;
  const stack = [key];
  while(stack.length) {
    const current = stack.pop()!;
    if(visited.has(current)) continue;
    visited.add(current);
    length++;
    for(const neighbor of graph[current]) {
      stack.push(neighbor);
    }
  }
  return length;
}
```

## Approach

The implemented solution uses a **per-node iterative DFS**:

1. **Loop over every node** in the graph (`Object.entries`). Keys are stringified, so `Number(key)` converts back to the numeric node id.
2. **`navigate`** performs a stack-based DFS from a single start node. It keeps a `visited` set and counts each newly visited node — that count is the size of the component containing the start node.
   - Nodes are checked for `visited` when they are *popped* off the stack, which safely handles duplicate pushes.
3. **Keep the maximum** component size seen across all starting nodes.

Because a node is only counted once per traversal (`if (visited.has(current)) continue;`), `length` correctly equals the number of distinct reachable nodes, i.e. the component size.

- **Time Complexity**: `O(V · (V + E))` — `navigate` is called once per node, each call doing a full DFS.
- **Space Complexity**: `O(V)` — the `visited` set and stack hold up to `V` nodes.

## Walkthrough

Using the sample graph with two components:

```
graph = {
  0: [8, 1, 5], 1: [0], 5: [0, 8], 8: [0, 5],
  2: [3, 4],    3: [2, 4], 4: [3, 2],
}
```

| Start node | `navigate` reaches | Component size | `largest` after |
| :--- | :--- | :--- | :--- |
| `0` | `{0, 1, 5, 8}` | 4 | 4 |
| `1` | `{0, 1, 5, 8}` | 4 | 4 |
| `2` | `{2, 3, 4}` | 3 | 4 |
| `3` | `{2, 3, 4}` | 3 | 4 |
| `4` | `{2, 3, 4}` | 3 | 4 |
| `5` | `{0, 1, 5, 8}` | 4 | 4 |
| `8` | `{0, 1, 5, 8}` | 4 | 4 |

Result: **4**.

Note how nodes `0`, `1`, `5`, and `8` each trigger a **full re-traversal of the same component** — this redundancy is exactly what the optimal single-pass approach removes.

Trace of `navigate(graph, 0)`:

```
stack=[0]
pop 0 -> visited={0}, length=1, push 8,1,5   stack=[8,1,5]
pop 5 -> visited={0,5}, length=2, push 0,8   stack=[8,1,0,8]
pop 8 -> visited={0,5,8}, length=3, push 0,5 stack=[8,1,0,5]
pop 5 -> already visited, skip
pop 0 -> already visited, skip
pop 1 -> visited={0,5,8,1}, length=4, push 0
pop 0 -> already visited, skip
stack empty -> return 4
```

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Per-Node DFS** (implemented) | $O(V \cdot (V + E))$ | $O(V)$ | Simple to reason about; correct; iterative (no stack overflow) | Re-explores each component once per node — wasteful on large graphs |
| **Single-Pass DFS/BFS** | $O(V + E)$ | $O(V)$ | Optimal; each node/edge visited once | Needs one shared `visited` set and a launch loop |
| **Union-Find (DSU)** | $O((V + E) \cdot \alpha(V))$ | $O(V)$ | Great when edges stream in or graph must be queried incrementally | More code; overkill when the whole adjacency list is available |

## Key Insights

1. **What the return value really is**: the implemented function returns the size of the largest **connected component**, not a longest path. The traversal counts *distinct reachable nodes*, so any component with a cycle would still only be counted once — a genuine "longest path" is a different (much harder) problem.

2. **Why the implemented approach is correct**: for any node `s`, the set of nodes reachable from `s` is exactly the connected component containing `s`. Taking the max over all `s` therefore yields the largest component size.

3. **Why the optimal approach is faster but equivalent**: a component of size `k` is traversed `k` times by the implemented approach but once by the single-pass approach. Sharing `visited` across launches preserves correctness (unvisited nodes always belong to a not-yet-seen component) while cutting the time from `O(V · (V + E))` to `O(V + E)`.

4. **Union-Find vs traversal**: both are optimal in practice. Prefer traversal when the adjacency list is given up front (as here); prefer Union-Find when edges arrive incrementally or you need to merge components online.
