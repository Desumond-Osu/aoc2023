const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__filename.split('\\').pop().split('.')[0]}.txt`, 'utf8').split('\r\n');

const moveList = { 'U': [-1, 0], 'L': [0, -1], 'D': [1, 0], 'R': [0, 1] };
const moveListHex = { '0': 'R', '1': 'D', '2': 'L', '3': 'U'};

function getTotalHoles(vertices, points) {
    let sum = 0;
    for (let i = 0; i < vertices.length - 1; i++) {
        const [x1, y1] = vertices[i];
        const [x2, y2] = vertices[i + 1];
        sum += x1 * y2 - x2 * y1;
    }
    const area = Math.abs(sum) / 2; //shoelace formula
    return area - (points / 2) + 1 + points; //pick's theorem
}

const verticesP1 = [[0, 0]], verticesP2 = [[0, 0]];
var pointsP1 = 0, pointsP2 = 0;
file.forEach(row => {
    var [dir, meter, hex] = row.split(' ');

    //p1
    var [moveX, moveY] = moveList[dir];
    const [lastXP1, lastYP1] = verticesP1.at(-1);
    verticesP1.push([lastXP1 + (moveX * meter), lastYP1 + (moveY * meter)]);
    pointsP1 += +meter;

    //p2
    const [lastXP2, lastYP2] = verticesP2.at(-1);
    var [meter, dir] = [parseInt(hex.substring(2, 7), 16), hex.substring(7, 8)];
    var [moveX, moveY] = moveList[moveListHex[dir]];
    verticesP2.push([lastXP2 + (moveX * meter), lastYP2 + (moveY * meter)]);
    pointsP2 += +meter;
});
console.log(getTotalHoles(verticesP1, pointsP1));
console.log(getTotalHoles(verticesP2, pointsP2));