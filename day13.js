const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__filename.split('\\').pop().split('.')[0]}.txt`, 'utf8').split(/\n\s*\n/);

const patterns = file.map(pattern => pattern.trim().split('\r\n'));

function rotateC(arr) {
    return arr[0].split('').map((_, index) => arr.map(row => row[index]).reverse().join(''));
}

function smudgeIndex(p1, p2) {
    if (!p1 || !p2) return -1;
    for (let i = 0; i < p1.length; i++) {
        if (p1[i] != p2[i]) {
            if (p1.substring(i+1) == p2.substring(i+1)) return i;
            return -1;
        }
    }
    return -1;
}

//p1
var total = 0;
patterns.forEach(pattern => {
    for (const type of ['horizontal', 'vertical']) {
        if (type == 'vertical') {
            pattern = rotateC(pattern);
        }

        outerLoop: for (let i = 0; i < pattern.length - 1; i++) {
            if (pattern[i] != pattern[i+1]) continue;
            for (let j = i - 1, k = i + 2; j >= 0; j--, k++) {
                if (pattern[k] && pattern[j] != pattern[k]) continue outerLoop;
            }
            total += type == 'horizontal' ? (i+1) * 100 : i + 1;
        }
    }
})
console.log(total);

//p2 - find new reflection line value ONLY (ignore the other axis)
var total = 0;
for (var pattern of patterns) {
    var check = 0;
    for (const type of ['horizontal', 'vertical']) {
        if (type == 'vertical') {
            pattern = rotateC(pattern);
        }

        outerLoop: for (let i = 0; i < pattern.length - 1; i++) {
            // !(if patterns are equal or have one smudge)
            if (pattern[i] != pattern[i+1] && smudgeIndex(pattern[i], pattern[i+1]) == -1) continue;

            // if patterns have one smudge, set hasSmudge = 1
            var hasSmudge = smudgeIndex(pattern[i], pattern[i+1]) != -1 ? 1 : 0;

            for (let j = i - 1, k = i + 2; j >= 0; j--, k++) {
                // if new patterns has one smudge and hasSmudge = 0, then set hasSmudge = 1
                if (smudgeIndex(pattern[k], pattern[j]) != -1 && hasSmudge == 0) {
                    hasSmudge = 1;
                    continue;
                }

                // if patterns are not equal
                if (pattern[k] && pattern[j] != pattern[k]) continue outerLoop;
            }

            // if this reflection does not have a smudge after the loop
            if (hasSmudge == 0) continue;

            total += type == 'horizontal' ? (i+1) * 100 : i + 1;
            check = 1;
            break;
        }
        if (check == 1) break;
    }
}
console.log(total);