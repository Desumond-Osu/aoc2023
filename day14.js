const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__filename.split('\\').pop().split('.')[0]}.txt`, 'utf8').split('\r\n');

function rotateC(arr) {
    return arr[0].split('').map((_, index) => arr.map(row => row[index]).reverse().join(''));
}

function rotateCounterC(arr) {
    return arr[0].split('').map((_, index) => arr.map(row => row[row.length - 1 - index]).join(''));
}

function pullOToLeft(platform) {
    return platform.map(row => row.split('#').map(part => Array(part.length).fill('.').fill('O', 0, (part.match(/O/g) || []).length).join('')).join('#'))
}

//p1
var platform = rotateCounterC(file);
platform = pullOToLeft(platform);
platform = rotateC(platform);
console.log(platform.reduce((acc, val, index) => acc + (val.match(/O/g) || []).length * (platform[0].length - index), 0));


//p2
var platform = rotateC(rotateC(file)); //rotate 180
const log = [];
const cycles = 1000000000;
for (let cycle = 0; cycle < cycles; cycle++) {
    for (let rotation = 0; rotation < 4; rotation++) {
        platform = rotateC(platform);
        platform = pullOToLeft(platform);
    }

    //check if same platform exist in log
    const logIndex = log.indexOf(platform.toString());
    if (logIndex != -1) {
        platform = log[logIndex + (((cycles - 1) - logIndex) % (cycle - logIndex))].split(',');
        break;
    }

    log.push(platform.toString());
}
platform = rotateC(rotateC(platform)); //rotate 180
console.log(platform.reduce((acc, val, index) => acc + (val.match(/O/g) || []).length * (platform[0].length - index), 0));