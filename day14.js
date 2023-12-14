const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__filename.split('\\').pop().split('.')[0]}.txt`, 'utf8').split('\r\n');

function rotateC(arr) {
    return arr[0].split('').map((_, index) => arr.map(row => row[index]).reverse().join(''));
}

function rotateCounterC(arr) {
    return arr[0].split('').map((_, index) => arr.map(row => row[row.length - 1 - index]).join(''));
}

function pullOToLeft(arr) {
    return arr.map(row => row.split('#').map(part => {
        const lenO = (part.match(/O/g) || []).length;
        return 'O'.repeat(lenO) + '.'.repeat(part.length - lenO);
    }).join('#'))
}

function getTotalO(arr) {
    return arr.reduce((acc, val, index) => acc + (val.match(/O/g) || []).length * (arr[0].length - index), 0);
}

//p1
console.log(getTotalO(rotateC(pullOToLeft(rotateCounterC(file)))));

//p2
var platform = rotateC(rotateC(file));
const log = [], cycles = 1000000000;
for (let cycle = 0; cycle < cycles; cycle++) {
    for (let rotation = 0; rotation < 4; rotation++) {
        platform = pullOToLeft(rotateC(platform));
    }

    const logIndex = log.indexOf(platform.join(','));
    if (logIndex != -1) {
        platform = log[logIndex + (((cycles - 1) - logIndex) % (cycle - logIndex))].split(',');
        break;
    }
    log.push(platform.join(','));
}
console.log(getTotalO(rotateC(rotateC(platform))));