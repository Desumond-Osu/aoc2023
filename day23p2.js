const fs = require('node:fs');
let hikeMap = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js').split('p')[0]}.txt`), 'utf8').trim();

const width = hikeMap.indexOf('\n');
const height = (hikeMap.length + 1) / (width + 1);

const start = 1;
const end = (height - 1) * (width + 1) + (width - 2);

const graph = new Map();
for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
        const idx = row * (width + 1) + col;
        if (hikeMap[idx] == '#') {
            continue;
        }

        // check right and down path
        for (const [dr, dc] of [[0, 1], [1, 0]]) {
            const nRow = row + dr, nCol = col + dc;
            if (nRow >= height || nCol >= width || hikeMap[nRow * (width + 1) + nCol] == '#') {
                continue;
            }

            const nIdx = nRow * (width + 1) + nCol;
            [idx, nIdx].forEach(i => graph.set(i, graph.get(i) || []));

            graph.get(idx).push([nIdx, 1]);
            graph.get(nIdx).push([idx, 1]);
        }
    }
}

// compress degree-2 nodes
const compressNode = (graph, node) => {
    const edges = graph.get(node);
    const [n1, n2] = [edges[0][0], edges[1][0]];
    const weight = edges[0][1] + edges[1][1];

    graph.delete(node);

    [n1, n2].forEach(n => {
        const edgeIdx = graph.get(n).findIndex(e => e[0] == node);
        graph.get(n).splice(edgeIdx, 1);
    });

    graph.get(n1).push([n2, weight]);
    graph.get(n2).push([n1, weight]);

    return [n1, n2];
}

const nodes = [...graph.keys()].filter(n => n != start && n != end);
for (const node of nodes) {
    if (graph.has(node) && graph.get(node).length == 2) {
        compressNode(graph, node).forEach(n => graph.get(n).length == 2 && n != start && n != end && nodes.push(n))
    }
}

// build map
const nodeList = [...graph.keys()];
const nodeMap = new Map(nodeList.map((n, i) => [n, i]));
const reducedMap = [...Array(nodeList.length)].map(() => []);

for (const [from, edges] of graph) {
    const src = nodeMap.get(from);
    for (const [to, weight] of edges) {
        if (nodeMap.has(to)) {
            reducedMap[src].push([nodeMap.get(to), weight]);
        }
    }
}

//dfs
const startIdx = nodeMap.get(start);
const endIdx = nodeMap.get(end);
const visited = new Uint8Array(reducedMap.length);

const dfs = (pos) => {
    if (pos == endIdx) {
        return 0;
    }

    visited[pos] = 1;
    let longestPath = -Infinity;
    for (const [neighbor, weight] of reducedMap[pos]) {
        if (!visited[neighbor]) {
            longestPath = Math.max(longestPath, weight + dfs(neighbor));
        }
    }

    visited[pos] = 0;
    return longestPath;
}

console.log(dfs(startIdx));