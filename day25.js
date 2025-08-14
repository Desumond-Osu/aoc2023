const fs = require('node:fs');

//store each connection as an undirected edge [a, b]
const edges = [];
fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js').split('p')[0]}.txt`), 'utf8').trim().split("\n").forEach(line => {
  const [a, bs] = line.split(": ");
  bs.split(" ").forEach(b => edges.push([a, b]));
});

//find augmenting paths in graph
function bfsCapacity(parent, g, s, t) {
  const visited = new Set([s]);
  const queue = [s];
  parent[s] = null;
  while (queue.length) {
    const u = queue.shift();
    for (const v in g[u]) {
      //only visit nodes with positive remaining capacity
      if (!visited.has(v) && g[u][v] > 0) {
        parent[v] = u;
        //if target reach, path exists
        if (v == t) {
          return true;
        }
        visited.add(v);
        queue.push(v);
      }
    }
  }
  return false;
}

//compute max flow between s and t (im not too sure how it works)
function edmondsKarp(g, s, t) {
  const parent = {};
  let maxFlow = 0;

  //while there is an augmenting path
  while (bfsCapacity(parent, g, s, t)) {
    //find min capacity along the path
    let pathFlow = Infinity;
    for (let v = t; v != s; v = parent[v]) {
      const u = parent[v];
      pathFlow = Math.min(pathFlow, g[u][v]);
    }

    //update residual capacities along the path
    for (let v = t; v != s; v = parent[v]) {
      const u = parent[v];
      g[u][v] -= pathFlow;
      g[v][u] = (g[v][u] || 0) + pathFlow; //add reverse edge for backflow
    }
    maxFlow += pathFlow;
  }
  return maxFlow;
}

//find all nodes reachable from start in the graph
function reachableFrom(g, start) {
  const seen = new Set([start]);
  const stack = [start];
  while (stack.length) {
    const u = stack.pop();
    for (const v in g[u]) {
      if (g[u][v] > 0 && !seen.has(v)) {
        seen.add(v);
        stack.push(v);
      }
    }
  }
  return seen;
}

//build initial undirected graph with unit capacities
const graph = {};

for (const [a, b] of edges) {
  graph[a] = graph[a] || {};
  graph[b] = graph[b] || {};
  graph[a][b] = 1;
  graph[b][a] = 1;
}

const nodes = Object.keys(graph);

//try every pair (s, t) to find one with min 3 cuts
for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    const s = nodes[i], t = nodes[j];
    const g = JSON.parse(JSON.stringify(graph));

    if (edmondsKarp(g, s, t) == 3) {
      const groupA = reachableFrom(g, s);
      const groupB = new Set(nodes.filter(n => !groupA.has(n)));
      console.log(`${groupA.size} x ${groupB.size} = ${groupA.size * groupB.size}`);
      return;
    }
  }
}