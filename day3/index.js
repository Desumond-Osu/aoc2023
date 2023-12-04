const fs = require('fs');
const file = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n');

//p1
var numList = [];
var symList = [];
file.forEach((line, y) => {
    for (const nums of line.trim().matchAll(/\d+/g)) {
        numList.push([nums[0], [nums.index, y]]);
    }

    for (const syms of line.trim().matchAll(/[^\d.]/g)) {
        symList.push([syms[0], [syms.index, y]]);
    }
});

var ans = numList.filter(num => {
    const [nx, ny] = num[1];
    for (const sym of symList) {
        const [sx, sy] = sym[1];
        if (Math.abs(ny - sy) > 1) continue;
        if (sx < nx - 1 || sx > nx + num[0].length) continue;
        return true;
    }
    return false;
}).reduce((a, n) => a + +n[0], 0);

console.log(ans);

//p2
var numList = [];
var gearList = [];
file.forEach((line, y) => {
    for (const nums of line.trim().matchAll(/\d+/g)) {
        numList.push([nums[0], [nums.index, y]]);
    }

    for (const gears of line.trim().matchAll(/\*/g)) {
        gearList.push([gears[0], [gears.index, y]]);
    }
});

var total = 0;
gearList.forEach(gear => {
    const [sx, sy] = gear[1];
    var temp;
    for (const num of numList) {
        const [nx, ny] = num[1];
        if (Math.abs(ny - sy) > 1) continue;
        if (sx < nx - 1 || sx > nx + num[0].length) continue;
        if (!temp) {
            temp = num[0];
            continue;
        }
        total += temp * num[0];
    }
})

console.log(total);