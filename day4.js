const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__filename.split('\\').pop().split('.')[0]}.txt`, 'utf8').split('\n');

//p1
var total = 0;
file.forEach(line => {
    var row = line.split(':')[1].trim().split('|');
    var winNumList = row[0].trim().split(/\s+/);
    var numList = row[1].trim().split(/\s+/);

    var points = numList.reduce((points, num) => points + (winNumList.includes(num) ? 1 : 0), 0);
    total += points == 0 ? 0 : Math.pow(2, points - 1);
});

console.log(total);

//p2
var winList = [];
file.forEach(line => {
    var row = line.split(':');
    var cardNum = row[0].trim().split(/\s+/)[1];
    winList[cardNum] = (winList[cardNum] ?? 0) + 1;

    var cards = row[1].trim().split('|');
    var winNumList = cards[0].trim().split(/\s+/);
    var numList = cards[1].trim().split(/\s+/);

    var cardCount = numList.filter(element => winNumList.includes(element)).length;

    const tempCardNum = cardNum;
    for (var i = 0; i < cardCount; i++) {
        winList[++cardNum] = (winList[cardNum] ?? 0) + winList[tempCardNum];
    }
});

console.log(winList.reduce((acc, cards) => acc + cards, 0));