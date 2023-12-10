const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__dirname.split('\\').pop()}.txt`, 'utf8').split('\n');
const line = file.map(line => line.trim().split(/\s+/).slice(1).map(Number));

//p1
const pairs = line[0].map((_, i) => line.map(p => p[i]));
var total = pairs.reduce((acc, [time, dist]) => {
    var points = 0;
    for (var i = 1; i <= time; i++) {
        if ((time - i) * i > dist) {
            points++;
        }
    }
    return acc * points;
}, 1)
console.log(total);

//p2
const [time, dist] = [parseInt(line[0].join(''), 10), parseInt(line[1].join(''), 10)]
var total = 0;
for (var i = 1; i <= time; i++) {
    if ((time - i) * i > dist) {
        total++;
    }
}
console.log(total);