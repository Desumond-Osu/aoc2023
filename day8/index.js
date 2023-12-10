const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__dirname.split('\\').pop()}.txt`, 'utf8').split('\r\n');

const input = file[0].split('');
var routes = {};
file.splice(2).forEach(str => {
    var [dest, path] = str.slice(0, -1).split(' = (');
    routes[dest] = path.split(', ');
})

//p1
var pointer = 'AAA';
var steps = 0;
do {
    for (const dir of input) {
        var index = (dir == 'L') ? 0 : 1;
        pointer = routes[pointer][index];
        steps++;
        if (pointer == 'ZZZ') break;
    }
} while (pointer != 'ZZZ');

console.log(steps);

//p2
var pointerArr = Object.keys(routes).filter(route => route.match(/.*A$/));
var stepArr = [];
for (var pointer of pointerArr) {
    var steps = 0;
    do {
        for (const dir of input) {
            var index = (dir == 'L') ? 0 : 1;
            pointer = routes[pointer][index];
            steps++;
            if (pointer.match(/.*Z$/)) break;
        }
    } while (!pointer.match(/.*Z$/));
    stepArr.push(steps);
}

console.log(stepArr.reduce((acc, val) => (acc * val) / (function gcd(a, b) { 
    return b === 0 ? a : gcd(b, a % b);
})(acc, val), 1));