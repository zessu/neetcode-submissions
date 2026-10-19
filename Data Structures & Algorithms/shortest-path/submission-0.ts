const edges = [
  ['w', 'x'],
  ['x', 'y'],
  ['z', 'y'],
  ['z', 'v'],
  ['w', 'v']
];

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


console.log(shortestPath(edges, "w", "z"));
