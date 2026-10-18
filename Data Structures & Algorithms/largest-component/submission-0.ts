// const graph = {
//   0: [8,1,5],
//   1: [0],
//   5: [0,8],
//   8: [0,5],
//   2: [3,4],
//   3: [2,4],
//   4: [3,2]
// }

const graph = {
  0: [1, 2, 3, 4],
  1: [0],
  2: [0],
  3: [0],
  4: [0],
};

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

const ans = largestComponent(graph);

console.log(ans);
