const fs = require('fs');
const data = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\n\s*\n/);

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
// var small = [];
// for (const [index, map] of maps.reverse().entries()) {
//     if (small.length == 0) {
//         small.push(map.sort((a, b) => a[0] - b[0])[0]);
//         continue;
//     }

//     var tempMaps = [];
//     for (const m of map) {
//         for (const n of small[index - 1]) {
            
//         }
//     }
// }

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
            console.log(location);
        }
    }
});