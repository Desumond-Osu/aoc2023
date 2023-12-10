const fs = require('node:fs');
const file = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\r\n');

var total = [0, 0]; //p1, p2
file.forEach(dataset => {
    var dataArr = [];
    dataset = dataset.split(' ').map(data => data = +data);
    dataArr.push(dataset);

    do {
        dataset = dataset.slice(1).map((num, i) => num - dataset[i]);
        dataArr.push(dataset);
    } while (!dataset.every(data => data == 0));
    
    var tempP1 = 0;
    var tempP2 = 0;
    //loop from bottom to top
    for (var i = dataArr.length - 1; i >= 0; i--) {
        tempP1 += dataArr[i].at(-1); //p1
        tempP2 = dataArr[i][0] - tempP2; //p2
    }
    total = [total[0] + tempP1, total[1] + tempP2];
})

console.log(total);