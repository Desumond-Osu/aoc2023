const fs = require('node:fs');

//p1
fs.readFile('day1/input.txt', 'utf-8', (err, data) => {
    let total = 0;
    data.split('\n').forEach(line => {
        var numbers = line.replace(/[^0-9]/g,"");
        total += +`${numbers[0]}${numbers.at(-1)}`;
    });

    console.log(total);
});

//p2
fs.readFile('day1/input.txt', 'utf-8', (err, data) => {
    let total = 0;
    const numMap = {
        'one': '1',
        'two': '2',
        'three': '3',
        'four' : '4',
        'five' : '5',
        'six' : '6',
        'seven' : '7',
        'eight' : '8',
        'nine' : '9',
    };

    data.split('\n').forEach(line => {
        Object.keys(numMap).forEach(key => line = line.replaceAll(key, key + numMap[key] + key));
        var numbers = line.replace(/[^0-9]/g, "");
        total += +`${numbers[0]}${numbers.at(-1)}`;
    });

    console.log(total);
});