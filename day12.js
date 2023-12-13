const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__filename.split('\\').pop().split('.')[0]}.txt`, 'utf8').split('\r\n');

const rows = file.map(row => [row.split(' ')[0], row.split(' ')[1].split(',').map(num => Number(num))]);

for (const part of [1, 2]) {
    var total = 0;
    var cache = {};
    rows.forEach(row => {
        if (part == 2) {
            row = [Array(5).fill(row[0]).join('?'), Array(5).fill(row[1]).flat()];
        }
        total += (function rec(spring, arr, subTotal) {
            if (cache[spring.toString() + arr.toString()]) {
                return cache[spring.toString() + arr.toString()];
            }
            outerLoop: for (var i = 0; i < spring.length - arr.reduce((acc, val) => acc + val, 0) - arr.length + 2; i++) {
                if (spring.substring(0, i).includes('#')) {
                    return subTotal;
                }

                var j = i + arr[0];

                if (spring[i - 1] == '#' || spring[j] == '#') {
                    continue;
                }

                if (spring.substring(i, j).includes('.')) {
                    continue outerLoop;
                }

                if (arr.length > 1) {
                    subTotal += rec(spring.substring(j + 1), arr.slice(1), 0);
                    continue;
                }
                
                var springSplit = spring.slice(0, i) + spring.slice(j);
                if (springSplit.includes('#')) {
                    continue;
                }
                subTotal++;
            }
            cache[spring.toString() + arr.toString()] = subTotal;
            return subTotal;
        })(row[0], row[1], 0)
    })

    console.log(total);
}