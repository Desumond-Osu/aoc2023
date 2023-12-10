const fs = require('node:fs');
const data = fs.readFileSync(`inputs/${__dirname.split('\\').pop()}.txt`, 'utf8').split(/\n\s*\n/);

const seeds = data[0].trim().split(' ').slice(1).map(Number);
const maps = data.slice(1).map(map => map.trim().split('\n').slice(1).map(row => row.split(' ').map(Number)));

//p1
var location;
seeds.forEach(seed => {
    maps.forEach(map => {
        for (const m of map) {
            if (seed >= m[1] && seed < m[1] + m[2]) {
                seed = m[0] + (seed - m[1]);
                break;
            }
        }
    })
    if (!location || location > seed) {
        location = seed;
    }
});

console.log(location);

//p2 
const seedRanges = [];
for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push([seeds[i], seeds[i + 1]]);
}
var location = '';
seedRanges.forEach(([start, length]) => {
    for (let i = 0; i < length; i++) {
        var seed = start + i;
        maps.forEach(map => {
            for (const m of map) {
                if (seed >= m[1] && seed < m[1] + m[2]) {
                    seed = m[0] + (seed - m[1]);
                    break;
                }
            }
        })

        if (!location || location > seed) {
            location = seed;
            console.log(`seed: ${start + i}, location: ${location}`);
        }
    }
});