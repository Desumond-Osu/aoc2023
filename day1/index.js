const fs = require('fs');
const file = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n');

//p1
var total = 0;
file.forEach(line => {
    var numbers = line.replace(/[^0-9]/g,"");
    total += +`${numbers[0]}${numbers.at(-1)}`;
});

console.log(total);

//p2
var total = 0;
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

file.forEach(line => {
    Object.keys(numMap).forEach(key => line = line.replaceAll(key, key + numMap[key] + key));
    var numbers = line.replace(/[^0-9]/g, "");
    total += +`${numbers[0]}${numbers.at(-1)}`;
});

console.log(total);