const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__filename.split('\\').pop().split('.')[0]}.txt`, 'utf8').split('\r\n');
const tileMap = file.map(row => row.split(''));

const path = { 'u': [-1, 0], 'l': [0, -1], 'd': [1, 0], 'r': [0, 1] };
const energizedTilesArr = [];

function traverse([x, y], dir) {
    const energizedTiles = [];
    (function rec([x, y], [dirX, dirY]) {
        if (typeof tileMap[x] == "undefined" || typeof tileMap[x][y] == "undefined") {
            return;
        }
        if (energizedTiles.includes(`${x},${y} ${dirX},${dirY}`)) {
            return;
        }

        energizedTiles.push(`${x},${y} ${dirX},${dirY}`);

        switch (tileMap[x][y]) {
            case '/':
                [dirX, dirY] = [-dirX, -dirY];
            case '\\':
                [dirX, dirY] = [dirY, dirX];
                break;
            case '-':
                if (dirY == 0) {
                    rec([x, y - 1], path['l']);
                    rec([x, y + 1], path['r']);
                    return;
                }
                break;
            case '|':
                if (dirX == 0) {
                    rec([x - 1, y], path['u']);
                    rec([x + 1, y], path['d']);
                    return;
                }
        }
        rec([x+dirX, y+dirY], [dirX, dirY]);
    })([x, y], path[dir])
    energizedTilesArr.push([...new Set(energizedTiles.map(tile => tile.split(' ')[0]))].length);
}

for (let x = 0; x < tileMap.length; x++) {
    traverse([x, 0], 'r'); //p1[0]
    traverse([x, tileMap[0].length - 1], 'l');
}
for (let y = 0; y < tileMap[0].length; y++) {
    traverse([0, y], 'd');
    traverse([tileMap.length - 1, y], 'u');
}
console.log(energizedTilesArr[0]); //p1
console.log(Math.max(...energizedTilesArr)); //p2