const fs = require('node:fs');
let bricks = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js')}.txt`), 'utf8').split(/\r?\n/).map(row => row.split('~').map(val => val.split(',')));

bricks.sort((a, b) => a[0][2] - b[0][2]);

function generateRange(start, end) {
    let range = [];
    let step = start <= end ? 1 : -1;
    for (let i = +start; i !== +end + step; i += step) {
        range.push(i);
    }
    return range;
}
  
bricks.forEach((pair, index) => {
    let [start, end] = pair;
    let xRange = generateRange(start[0], end[0]);
    let yRange = generateRange(start[1], end[1]);
    let zRange = generateRange(start[2], end[2]);
  
    let points = [];

    for (let x of xRange) {
        for (let y of yRange) {
            for (let z of zRange) {
                points.push([x, y, z]);
            }
        }
    }
  
    bricks[index] = points;
});

bricks.forEach((row, i) => {
    if (row[0][2] == 1) {
        bricks[i] = row;
        return;
    }

    let isCollide = false;
    let newBricks = row;

    while (!isCollide) {
        let tempBricks = newBricks.map(brick => {
            let newBrick = [...brick];
            newBrick[2]--;
            return newBrick;
        });

        isCollide = tempBricks.flat(0).some(point => {
            return bricks.filter((_, j) => j !== i).flat(1).map(val => val.toString()).includes(point.toString())
        });

        if (isCollide || tempBricks[0][2] == 1) {
            break;
        }

        newBricks = tempBricks;
    };

    bricks[i] = newBricks;
})

let touching = [];

bricks.forEach((row, i) => {
    touching[i] = row.flat(0).map(row => {
        row = [row[0], row[1], row[2] + 1];
        let index = bricks.filter((_, j) => j !== i).flat(1).map(val => val.toString()).indexOf(row.toString());

        if (index !== -1) {
            index += 3;
        }
        return index;
    });

    touching[i] = touching[i].map(k => {
        if (k == -1) {
            return -1;
        }
        return Math.ceil((k + 1) / 3) - 1;
    }).filter(val => val !== -1);
}, 0);

console.log(touching.reduce((acc, val, i) => acc += val.every(brick => touching.filter((_, j) => j !== i).flat(1).includes(brick)) ? 1 : 0, 0))