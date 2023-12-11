const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__filename.split('\\').pop().split('.')[0]}.txt`, 'utf8').split('\r\n');

const space = file.map(row => row.split(''));
const nonGalaxies = [[], []]; //x, y
for (let i = 0; i < space.length; i++) {
    if (space[i].indexOf('#') == -1) {
        nonGalaxies[0].push(i);
    }
}

for (let j = 0; j < space[0].length; j++) {
    const column = space.map(row => row[j]);
    if (column.indexOf('#') == -1) {
        nonGalaxies[1].push(j);
    }
}

const galaxies = [];
space.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
        if (col == '#') {
            galaxies.push([rowIndex, colIndex]);
        }
    })
})

const dupes = [1, 999999]; //p1, p2
dupes.forEach(dupe => {
    var total = 0;
    for (let i = 0; i < galaxies.length - 1; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            const [galaxy1, galaxy2] = [galaxies[i], galaxies[j]];
            const [smallX, bigX] = [Math.min(galaxy1[0], galaxy2[0]), Math.max(galaxy1[0], galaxy2[0])];
            const [smallY, bigY] = [Math.min(galaxy1[1], galaxy2[1]), Math.max(galaxy1[1], galaxy2[1])];

            total += nonGalaxies[0].filter(nonX => smallX < nonX && nonX < bigX).length * dupe;
            total += nonGalaxies[1].filter(nonY => smallY < nonY && nonY < bigY).length * dupe;
            total += Math.abs(galaxy1[0] - galaxy2[0]) + Math.abs(galaxy1[1] - galaxy2[1]);
        }
    }

    console.log(total);
})