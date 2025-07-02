const fs = require('node:fs');
const hikeMap = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js').split('p')[0]}.txt`), 'utf8').split(/\r?\n/).map(row => row.split(''));

const start = [0, hikeMap[0].indexOf('.')];
const end = [hikeMap.length - 1, hikeMap.at(-1).indexOf('.')];

const path = { 'u': [-1, 0], 'l': [0, -1], 'd': [1, 0], 'r': [0, 1] };
const dirOpp = { 'u': 'd', 'l': 'r', 'd': 'u', 'r': 'l' };
const arrowToDir = { '^': 'u', '<': 'l', 'v': 'd', '>': 'r' };
const stepsArr = [];

const stack = [[start, 'd', []]];

do {
    const [[x, y], dir, steps] = stack.pop();

    if (hikeMap[x]?.[y] === undefined || hikeMap[x][y] == '#') {
        continue;
    }

    if (steps.includes(`${x},${y}`)) {
        continue;
    }

    if (x == end[0] && y == end[1]) {
        // console.log(steps.join('|'), [...new Set(steps.map(tile => tile.split(' ')[0]))].length)
        console.log(steps.length)
        stepsArr.push([...new Set(steps.map(tile => tile.split(' ')[0]))].length);
        continue;
    }

    steps.push(`${x},${y}`);

    Object.keys(path).filter(key => key !== dirOpp[dir]).forEach(newDir => {
        stack.push([[x + path[newDir][0], y + path[newDir][1]], newDir, [...steps]]);
    });
} while (stack.length > 0);

console.log(Math.max(...stepsArr));