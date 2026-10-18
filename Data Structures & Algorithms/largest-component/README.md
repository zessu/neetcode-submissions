# Largest Component

## Problem Description

Given an **undirected graph** represented as an adjacency list (`Record<string, number[]>`), return the **size of the largest connected component**. The size of a component is the number of nodes it contains.

A **connected component** is a maximal set of nodes such that every node in the set can reach every other node in the set by following edges. A node with no edges is its own component of size `1`.

> This is NeetCode's **"Largest Component"** problem. It is the "size" sibling of counting connected components — see the related LeetCode problems in the Resources section.

## Examples

### Example 1:
```
Input: graph = {
  0: [8, 1, 5],
  1: [0],
  5: [0, 8],
  8: [0, 5],
  2: [3, 4],
  3: [2, 4],
  4: [3, 2],
}
Output: 4
```
**Explanation:** There are two components. `{0, 1, 5, 8}` contains 4 nodes, and `{2, 3, 4}` contains 3 nodes. The largest is **4**.

### Example 2:
```
Input: graph = {
  0: [1, 2, 3, 4],
  1: [0],
  2: [0],
  3: [0],
  4: [0],
}
Output: 5
```
**Explanation:** Every node is directly connected to node `0`, so the entire graph is one component of size **5**.

## Constraints

- The graph is **undirected**: if `b` appears in `graph[a]`, then `a` also appears in `graph[b]`.
- Nodes are integers; keys in the object are stringified (`"0"`, `"1"`, ...).
- The graph may be disconnected (multiple components) and may contain isolated nodes.
- Recommended time complexity: `O(V + E)` where `V` is the number of nodes and `E` is the number of edges.

## Topics

- Graph
- Depth-First Search (DFS)
- Breadth-First Search (BFS)
- Union-Find (Disjoint Set Union)

## Solution Approaches

### 1. Per-Node DFS (Implemented)

**Intuition**: A component's size is the number of nodes reachable from any one of its nodes. So for **every** node, run a traversal that counts how many distinct nodes it can reach, and keep the maximum.

**Algorithm**:
1. Start with `largest = 0`.
2. For each node `key` in the graph:
   - Run a DFS (`navigate`) from `key` with a **fresh** `visited` set.
   - Count each newly visited node.
   - Update `largest = max(largest, count)`.
3. Return `largest`.

**Time Complexity**: `O(V · (V + E))` — a full traversal is performed once per starting node.
**Space Complexity**: `O(V)` — the `visited` set and the DFS stack.

### 2. Single-Pass DFS/BFS with Global `visited` (Optimal)

**Intuition**: Running a traversal from *every* node re-explores the same components over and over. Instead, traverse the graph **once** with a single shared `visited` set. Each time we launch a traversal from an unvisited node, we are discovering a brand-new component; count how many nodes that traversal reaches and keep the maximum.

**Algorithm**:
1. Create one global `visited` set and `largest = 0`.
2. For each node, if it is **not** in `visited`:
   - Traverse (DFS or BFS) from it, marking and counting every node reached.
   - Update `largest = max(largest, count)`.
3. Return `largest`.

**Time Complexity**: `O(V + E)` — every node and edge is examined once.
**Space Complexity**: `O(V)` — `visited` set plus the stack/queue.

### 3. Union-Find (Disjoint Set Union)

**Intuition**: Merge nodes that share an edge into the same set. The largest set's size is the answer.

**Algorithm**:
1. Give every node its own set (`parent[x] = x`, `size[x] = 1`).
2. For each edge `(a, b)`, `union(a, b)` — merge the smaller set into the larger (union by size).
3. The answer is the largest `size` across all sets.

**Time Complexity**: `O((V + E) · α(V))` where `α` is the near-constant inverse Ackermann function.
**Space Complexity**: `O(V)`.

## Visual Explanation

```
Graph: {0,1,5,8} and {2,3,4}
   1             2
   |            / \
   0 --- 8     3---4
   |
   5

Component {0,1,5,8}  -> size 4   <-- largest
Component {2,3,4}    -> size 3
Answer: 4
```

## Common Pitfalls

1. **The function name lies**: despite being called `longestPath` in the original scratch code, this returns the size of the largest **connected component**, not the length of a longest path. A longest-path problem is NP-hard in general graphs; this one is a simple traversal.
2. **Re-traversing components**: launching a traversal from every node (Approach 1) is correct but wasteful — the same component is counted `k` times if it has `k` nodes. Share one `visited` set (Approach 2) to drop to `O(V + E)`.
3. **Visited-check timing**: the implemented stack DFS marks a node when it is *popped*. That is correct but pushes duplicates; marking when a node is *pushed*, or using BFS, avoids the redundant work.
4. **Isolated nodes**: a node with an empty adjacency list is a component of size `1`. The loop over all keys handles this, but make sure a "size 0" graph returns `0`.
5. **Recursion depth**: a recursive DFS can overflow the call stack on a very deep graph; the implemented version uses an explicit stack, which is safer.
