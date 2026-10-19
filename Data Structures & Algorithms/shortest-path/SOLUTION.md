# Shortest Path - Solution

## Solution Code

```typescript
const shortestPath = (edges: string[][], start: string, finish: string) => {
  const adjList = buildAdjacencyGraph(edges);
  const queue = [[start, 0]];
  const visited = new Set();

  while(queue.length) {
    let [item, idx] = queue.shift()!;
    if(visited.has(item)) continue;
    visited.add(item);
    if(item === finish) return Number(idx);
    for(const neighbor of adjList[item]) {
      queue.push([neighbor, Number(idx) + 1]);
    }
  }

  return -1;
}

const buildAdjacencyGraph = (edges: string[][]): Record<string, string[]> => {
  const graph: Record<string, string[]> = {};
  for(const [a,b] of edges) {
    (graph[a] ??= []).push(b);
    (graph[b] ??= []).push(a);
  }
  return graph;
}
```

## Approach

The solution uses **Breadth-First Search (BFS)** over an adjacency list.

1. **Build the adjacency list** (`buildAdjacencyGraph`). Every edge `[a, b]` is added in both directions (`a → b` and `b → a`), because the graph is undirected. `??=` lazily creates the array on first use.
2. **Seed the queue** with `[start, 0]` — the node plus its distance (number of edges) from `start`.
3. **Process the queue**:
   - Dequeue `[item, idx]`.
   - Skip it if already visited.
   - Mark it visited.
   - If it is `finish`, return `idx` — the number of edges travelled.
   - Otherwise enqueue every neighbor as `[neighbor, idx + 1]`.
4. **Return `-1`** if the queue empties, meaning `finish` is unreachable.

BFS is the right tool because all edges have equal weight. Nodes are dequeued in non-decreasing distance order, so the first time `finish` is dequeued, `idx` is the shortest distance.

- **Time Complexity**: `O(V + E)` — each reachable node is dequeued once and each edge is scanned once.
- **Space Complexity**: `O(V)` for the queue and `visited` set (plus `O(V + E)` for the adjacency list).

## Walkthrough

Graph: `w - x - y - z - v - w` (a 5-cycle), with the query `start = "w"`, `finish = "z"`.

**Adjacency list:**
```
w: [x, v]
x: [w, y]
y: [x, z]
z: [y, v]
v: [z, w]
```

**BFS, layer by layer:**

| Level | Nodes at this distance | Queue after processing the level |
| :--- | :--- | :--- |
| 0 | `w` | `[x,1], [v,1]` |
| 1 | `x`, `v` | `[w,2], [y,2]`, `[z,2], [w,2]` |
| 2 | `y`, `z` | `z` is dequeued at distance 2 → **return 2** |

**Exact queue trace:**

```
queue = [[w, 0]]

pop [w,0]  visited={w}   neighbors of w: x, v
           push [x,1], [v,1]

pop [x,1]  visited={w,x} neighbors of x: w, y
           push [w,2], [y,2]

pop [v,1]  visited={w,x,v} neighbors of v: z, w
           push [z,2], [w,2]

pop [w,2]  already visited -> skip

pop [y,2]  visited={w,x,v,y} neighbors of y: x, z
           push [x,3], [z,3]

pop [z,2]  z === finish -> return 2
```

The answer is **2**, via `w → v → z`. The alternative `w → x → y → z` has length 3, so BFS correctly picks the shorter route.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **BFS** (implemented) | $O(V + E)$ | $O(V)$ | Optimal for unweighted graphs; simple and iterative | Not directly usable when edges have different weights |
| **Dijkstra** | $O((V + E)\log V)$ | $O(V + E)$ | Handles weighted edges | Extra heap machinery; unnecessary work on unweighted graphs |
| **DFS / Backtracking** | $O(V!)$ worst case | $O(V)$ | Simple to write recursively; can enumerate all paths | Exponential; explores paths BFS prunes; risky recursion depth |

## Key Insights

1. **BFS gives shortest paths on unweighted graphs**: it visits nodes in order of distance, so the first arrival at `finish` is optimal. No need to compare path lengths explicitly.

2. **Distance travels with the node**: each queue entry is `[node, distance]`, and children get `distance + 1`. This is the crucial detail — a single global counter cannot represent distances for a branching frontier.

3. **Visited set prevents infinite loops**: the graph contains a cycle (`w-x-y-z-v-w`). Without `visited`, BFS would keep re-enqueueing nodes forever.

4. **Duplicate enqueues are harmless here**: the implementation checks `visited` on dequeue, so a node may be queued more than once. The first dequeue is always at its minimum distance, so results stay correct. Marking visited on enqueue is a small optimization that avoids the duplicates.

5. **Why not Dijkstra**: all edges cost `1`, so a FIFO queue already processes nodes in non-decreasing distance order. A priority queue adds `log V` overhead without changing the answer.
