const fs = require('node:fs');
let bricks = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js').split('p')[0]}.txt`), 'utf8').trim().split(/\r?\n/).map(row => row.split('~').map(val => val.split(',').map(Number)));

// sort by z
bricks.sort((a, b) => a[0][2] - b[0][2]);

// expand bricks into points
const range = (a, b) => {
	let r = [], step = a <= b ? 1 : -1;
	for (let i = a; i != b + step; i += step) {
		r.push(i);
	}

	return r;
};

bricks = bricks.map(([start, end]) => {
	let points = [];
	for (let x of range(start[0], end[0])) {
		for (let y of range(start[1], end[1])) {
			for (let z of range(start[2], end[2])) {
				points.push([x, y, z]);
			}
		}
	}

	return points;
});

// fall simulation
let occupied = new Map();
bricks.forEach((brick, i) => {
	let points = brick;
	while (true) {
		let moved = points.map(([x, y, z]) => [x, y, z - 1]);
		if (moved.some(([x, y, z]) => z <= 0 || occupied.has(`${x},${y},${z}`))) {
			break;
		}

		points = moved;
	}
	bricks[i] = points;
	points.forEach(([x, y, z]) => occupied.set(`${x},${y},${z}`, i));
});

// part 1
// touching calculation
let touching = bricks.map(() => []);
bricks.forEach((brick, i) => {
	let above = new Set();
	brick.forEach(([x, y, z]) => {
		let aboveId = occupied.get(`${x},${y},${z + 1}`);
		if (aboveId != null && aboveId != i) {
			above.add(aboveId);
		}
	});
	touching[i] = [...above];
});

let result = touching.reduce((count, supports, i) => count + (supports.every(b => touching.some((arr, j) => j != i && arr.includes(b))) ? 1 : 0), 0);

console.log(result);

// part 2
// build support graph
let above = bricks.map(() => new Set());
let below = bricks.map(() => new Set());

bricks.forEach((brick, i) => {
	brick.forEach(([x, y, z]) => {
		let under = occupied.get(`${x},${y},${z - 1}`);
		if (under != null && under != i) {
			above[under].add(i);
			below[i].add(under);
		}
	});
});

let total = 0;
for (let removed = 0; removed < bricks.length; removed++) {
	let falling = new Set();
	let queue = [...above[removed]];
	let supports = below.map(set => new Set(set));
	queue.forEach(b => supports[b].delete(removed));

	while (queue.length > 0) {
		let curr = queue.pop();
		if (supports[curr].size > 0 || falling.has(curr)) continue;
		falling.add(curr);
		above[curr].forEach(b => {
			supports[b].delete(curr);
			queue.push(b);
		});
	}

	total += falling.size;
}

console.log(total);