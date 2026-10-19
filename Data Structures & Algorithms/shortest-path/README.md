# Shortest Path

## Problem Description

You are given an **undirected graph** as a list of edges, where each edge is a pair of node labels: `edges[i] = [a, b]`. The graph may be disconnected.

Given a `start` node and a `finish` node, return the **length of the shortest path** between them, measured as the **number of edges** traversed. If no path exists, return `-1`.

Because every edge has the same weight, **Breadth-First Search (BFS)** finds the shortest path.

## Examples

### Example 1:
```
Input:
edges = [
  ['w', 'x'],
  ['x', 'y'],
  ['z', 'y'],
  ['z', 'v'],
  ['w', 'v'],
]
start = "w", finish = "z"

Output: 2
```
**Explanation:** The shortest route is `w → v → z`, which uses 2 edges. The alternative `w → x → y → z` uses 3.

### Example 2:
```
Input: start = "w", finish = "x"
Output: 1
```
**Explanation:** There is a direct edge `w - x`.

### Example 3:
```
Input: start = "w", finish = "w"
Output: 0
```
**Explanation:** You are already at the destination, so no edges are needed.

### Example 4:
```
Input: start = "w", finish = "nope"
Output: -1
```
**Explanation:** `nope` is not in the graph, so no path exists.

## Constraints

- The graph is **undirected**: each edge `[a, b]` can be traversed in both directions.
- Node labels are strings (or any hashable values).
- The graph may contain cycles and may be disconnected.
- `start` and `finish` may be the same node, or may not exist in the graph.
- Recommended time complexity: `O(V + E)`, where `V` is the number of nodes and `E` the number of edges.

## Topics

- Graph
- Breadth-First Search (BFS)
- Shortest Path

## Solution Approaches

### 1. BFS by Levels (Implemented)

**Intuition**: BFS explores the graph in concentric "rings" of increasing distance. All nodes at distance `d` are discovered before any node at distance `d + 1`. Therefore, the first time BFS reaches `finish`, it has found a shortest path.

**Algorithm**:
1. **Build an adjacency list** in both directions for every edge.
2. Put `[start, 0]` in a queue — node and its distance from `start`.
3. While the queue is not empty:
   - Dequeue `[node, dist]`. If `node` was already visited, skip it.
   - Mark it visited.
   - If `node === finish`, return `dist`.
   - For every neighbor, enqueue `[neighbor, dist + 1]`.
4. If the queue empties without reaching `finish`, return `-1`.

**Time Complexity**: `O(V + E)` — each node is dequeued and each edge examined once.
**Space Complexity**: `O(V)` — the queue, `visited` set, and adjacency list (the list itself is `O(V + E)`).

### 2. Dijkstra's Algorithm

**Intuition**: Dijkstra generalizes BFS to graphs with **non-uniform edge weights**. It always expands the node with the smallest known distance using a min-heap.

**Algorithm**:
1. Set `dist[start] = 0`; all others `Infinity`.
2. Push `[0, start]` into a min-heap.
3. Pop the smallest-distance node; if it is `finish`, return its distance.
4. Relax every edge: if `dist[node] + weight < dist[neighbor]`, update and push.

**Time Complexity**: `O((V + E) · log V)` with a binary heap.
**Space Complexity**: `O(V + E)`.

For **unweighted** graphs Dijkstra degenerates to BFS and is strictly more work — use BFS here.

### 3. DFS / Backtracking

**Intuition**: Explore every path from `start` to `finish` and keep the shortest one.

**Algorithm**:
1. DFS from `start`, tracking the current path and visited set.
2. When `finish` is reached, record the path length.
3. Backtrack and try other branches; return the minimum.

**Time Complexity**: `O(V!)` in the worst case — exponential.
**Space Complexity**: `O(V)` for the recursion stack.

This is correct but far too slow; it also has to explore paths that BFS prunes immediately.

## Visual Explanation

```
BFS layers starting from "w":

level 0:  {w}
level 1:  {x, v}
level 2:  {y, z}   <-- "z" found here, return 2

        x --- y
       /       \
      w         z
       \       /
        v ---
```

## Common Pitfalls

1. **Distance must propagate**: when enqueuing a neighbor, use `currentDistance + 1` (i.e. `Number(idx) + 1`). Using a fixed counter or forgetting to add one makes every node appear one edge from the start.
2. **Return the distance, not distance + 1**: if paths are measured in edges, the start is `0`. (Returning `dist + 1` is only correct if the problem counts *nodes*.)
3. **Mark nodes visited**: without a `visited` set, cycles (like `w-x-y-z-v-w`) cause an infinite loop.
4. **Visited timing**: checking `visited` when a node is *dequeued* is correct but may enqueue duplicates. Checking when a node is *enqueued* avoids duplicate work; both give the same shortest distance.
5. **Disconnected / missing nodes**: return `-1` when the queue empties. Also handle `start === finish` (answer `0`).
6. **Undirected adjacency**: add each edge in **both** directions; otherwise you can only travel one way.
