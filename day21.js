const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__filename.split('/').pop().split('.')[0]}.txt`, 'utf8').split('\n');

var map = file.map(line => line = line.split(''));

const visited = new Map();
let start = null;

map.forEach((row, x) => {
  row.forEach((col, y) => {
    if (col == "S") {
      start = [x, y];
      visited.set(`${x},${y}`, 0);
    } else if (col == ".") {
      visited.set(`${x},${y}`, -1);
    }
  })
});

const queue = [start];
const directions = [
  [1, 0],
  [-1, 0],
  [0, -1],
  [0, 1],
];

while (queue.length > 0) {
  const [cx, cy] = queue.shift();
  const currentDistance = visited.get(`${cx},${cy}`);

  for (const [dx, dy] of directions) {
    const nx = cx + dx;
    const ny = cy + dy;
    const key = `${nx},${ny}`;

    if (visited.has(key) && visited.get(key) === -1) {
      visited.set(key, currentDistance + 1);
      queue.push([nx, ny]);
    }
  }
}

const values = Array.from(visited.values());

const fullLength = map[0].length;
const halfLength = (fullLength - 1) / 2;

const p1 = values.filter(v => v % 2 == 0 && v < halfLength).length;

const cornerEven = values.filter(v => v % 2 == 0 && v > halfLength).length;
const cornerOdd = values.filter(v => v % 2 == 1 && v > halfLength).length;

const squareEven = values.filter(v => v % 2 == 0).length;
const squareOdd = values.filter(v => v % 2 == 1).length;

const n = Math.floor((26501365 - halfLength / 2) / fullLength);
const p2 = ((n + 1) * (n + 1)) * squareOdd + (n * n) * squareEven - (n + 1) * cornerOdd + n * cornerEven;

console.log(p1);
console.log(p2);