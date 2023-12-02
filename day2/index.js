const fs = require('node:fs');

//p1
fs.readFile('day2/input.txt', 'utf-8', (err, data) => {
    let total = 0;
    data.split('\n').forEach(line => {
        var pass = 1;
        var row = line.substr(5).split(':');
        row[1].split(';').forEach(r => {
            r.split(',').forEach(s => {
                var num = s.trim().split(' ');
                switch (num[1]) {
                    case 'red':
                        if (num[0] > 12) 
                            pass = 0; 
                        break;
                    case 'green':
                        if (num[0] > 13) 
                            pass = 0; 
                        break;
                    case 'blue':
                        if (num[0] > 14) 
                            pass = 0; 
                        break;
                }
            })
        })
        if (pass) {
            total += parseInt(row[0]);
        }
    });

    console.log(total);
});

//p2
fs.readFile('day2/input.txt', 'utf-8', (err, data) => {
    let total = 0;
    data.split('\n').forEach(line => {
        var max = {
            'red' : 0,
            'green' : 0,
            'blue' : 0,
        };
        line.substr(5).split(':')[1].replaceAll(';', ',').split(',').forEach(r => {
            var f = r.trim().split(' ')
            if (f[0] > max[f[1]]) {
                max[f[1]] = parseInt(f[0]);
            }
        });

        total += max['red'] * max['green'] * max['blue'];
    });

    console.log(total);
});