const fs = require('fs');
const file = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\r\n');

var map = file.map(line => line = line.split(''));

//p1
//find pipe S
const pipeS = map.reduce((acc, line, index) => {
    const charIndex = line.indexOf('S');
    if (charIndex !== -1) {
        acc.push(index, charIndex);
    }
    return acc;
}, []);

var currPipeCoor = pipeS;
var beforePipeCoor = [];
var length = 0;
var pathTaken = [];
outerLoop: do {
    //all 4 adjacent pipes of current pipe
    var adjPipesCoor = {
        't' : [currPipeCoor[0] - 1, currPipeCoor[1]], 
        'l' : [currPipeCoor[0], currPipeCoor[1] - 1], 
        'r' : [currPipeCoor[0], currPipeCoor[1] + 1], 
        'b' : [currPipeCoor[0] + 1, currPipeCoor[1]],
    };

    for (const dir in adjPipesCoor) {
        //if outside range, continue
        const [x, y] = [adjPipesCoor[dir][0], adjPipesCoor[dir][1]];
        if (typeof map[x] == "undefined" || typeof map[x][y] == "undefined") {
            continue;
        }

        const nextPipe = map[x][y];
        const currPipe = map[currPipeCoor[0]][currPipeCoor[1]];

        if (
            (
                (dir == 't' && ['|', 'F', '7', 'S'].includes(nextPipe) && ['|', 'L', 'J', 'S'].includes(currPipe)) ||
                (dir == 'l' && ['-', 'F', 'L', 'S'].includes(nextPipe) && ['-', 'J', '7', 'S'].includes(currPipe)) ||
                (dir == 'r' && ['-', 'J', '7', 'S'].includes(nextPipe) && ['-', 'F', 'L', 'S'].includes(currPipe)) ||
                (dir == 'b' && ['|', 'L', 'J', 'S'].includes(nextPipe) && ['|', 'F', '7', 'S'].includes(currPipe))
            ) && [x, y].toString() != beforePipeCoor.toString() //prevent backtracking
            ) {
                length++;
                pathTaken.push([x, y]);

                // if loop back to pipe S
                if ([x, y].toString() == pipeS.toString()) {
                    break outerLoop;
                }

                beforePipeCoor = currPipeCoor;
                currPipeCoor = [x, y];
                break;
        }
    }
} while (1);

console.log(length / 2);

//p2
//find all points that lies in polygon
var total = 0;
for (const [x, pipeX] of map.entries()) {
    for (const [y,] of pipeX.entries()) {
        //if point lies on polygon, continue
        if (JSON.stringify(pathTaken).indexOf(JSON.stringify([x, y])) != -1) {
            continue;
        }

        var inside = false;
        for (var i = 0, j = pathTaken.length - 1; i < pathTaken.length; j = i++) {
            var xi = pathTaken[i][0]
            var yi = pathTaken[i][1];
            var xj = pathTaken[j][0]
            var yj = pathTaken[j][1];
            
            if (((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
        }
        
        if (inside) {
            total++;
        }
    }
}

console.log(total)