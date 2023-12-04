const fs = require('fs');
const file = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n');

//p1
var total = 0;
var limit = {'red' : 12, 'green' : 13, 'blue' : 14};
file.forEach(line => {
    var pass = 1;
    var row = line.substr(5).split(':');
    row[1].split(';').forEach(r => {
        r.split(',').forEach(s => {
            var num = s.trim().split(' ');
            if (num[0] > limit[num[1]]) {
                pass = 0;
            }
        })
    })
    if (pass) {
        total += parseInt(row[0]);
    }
});

console.log(total);

//p2
var total = 0;
file.forEach(line => {
    var max = {'red' : 0, 'green' : 0, 'blue' : 0};
    line.substr(5).split(':')[1].replaceAll(';', ',').split(',').forEach(r => {
        var f = r.trim().split(' ')
        if (f[0] > max[f[1]]) {
            max[f[1]] = parseInt(f[0]);
        }
    });

    total += max['red'] * max['green'] * max['blue'];
});

console.log(total);