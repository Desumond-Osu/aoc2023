const fs = require('node:fs');
const hikeMap = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js').split('p')[0]}.txt`), 'utf8').split(/\r?\n/).map(row => row.split(''));

const start = [0, hikeMap[0].indexOf('.')];
const end = [hikeMap.length - 1, hikeMap.at(-1).indexOf('.')];

const path = { 'u': [-1, 0], 'l': [0, -1], 'd': [1, 0], 'r': [0, 1] };
const dirOpp = { 'u': 'd', 'l': 'r', 'd': 'u', 'r': 'l' };
const stepsArr = [];

const memo = new Set();

const stack = [[start, 'd', [], []]];

do {
    const [[x, y], dir, steps, stepMemo] = stack.pop();

    if (hikeMap[x]?.[y] === undefined || hikeMap[x][y] == '#') {
        continue;
    }

    if (steps.includes(`${x},${y}`)) {
        continue;
    }

    if (x == end[0] && y == end[1]) {
        console.log(steps.length)
        stepsArr.push([...new Set(steps.map(tile => tile.split(' ')[0]))].length);
        continue;
    }

    steps.push(`${x},${y}`);

    let i = 3;

    Object.keys(path).filter(key => key !== dirOpp[dir]).forEach(newDir => {
        const newX = x + path[newDir][0];
        const newY = y + path[newDir][1];

        if (hikeMap[newX]?.[newY] === undefined || hikeMap[newX][newY] == '#' || steps.includes(`${newX},${newY}`)) {
            i--;
        }

        stack.push([[newX, newY], newDir, [...steps], [...stepMemo]]);
    });

    if (i == 1) {
        stepMemo.push(`${x},${y}`);
    } else if (i > 1) {
        
    }
} while (stack.length > 0);

console.log(Math.max(...stepsArr));