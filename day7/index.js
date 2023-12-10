const fs = require('node:fs');
const file = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\r\n');

//p1
const cardMap = {'2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, 'T': 9, 'J': 10, 'Q': 11, 'K': 12, 'A': 13};
for (const part of [1, 2]) {
    //p2 (set value of J lower than value of 2)
    if (part == 2) {
        cardMap['J'] = 0;
    }

    var rankedHands = [[], [], [], [], [], [], []];
    file.forEach(line => {
        var [hand, bid] = line.split(' ');
        var cardValue = [];
        hand.split('').forEach(card => cardValue.push(cardMap[card]));

        var cards = hand.split('');

        //p2 (replace all 'J's with highest occurring card)
        if (part == 2 && cards.includes('J')) {
            const cardCounts = cards.filter((card) => card != 'J').reduce((acc, card) => {
                acc[card] = (acc[card] || 0) + 1;
                return acc;
            }, {0: 0});

            cards = cards.map((card) => (card == 'J' ? Object.entries(cardCounts).sort((a, b) => b[1] - a[1])[0][0] : card));
        }

        cards = cards.sort().join('');

        const patterns = [
            /(.)\1{4}/,                          // 5 of a kind
            /(.)\1{3}/,                          // 4 of a kind
            /(.)\1{2}(.)\2{1}|(.)\3{1}(.)\4{2}/, // full house
            /.*(.)\1{2}.*/,                      // 3 of a kind
            /.*(.)\1{1}.*(.)\2{1}.*/,            // 2 pairs
            /.*(.)\1{1}.*/,                      // 1 pair
            /.*/,                                // high card
        ];

        //categorizing hand types
        for (let i = 0; i < patterns.length; i++) {
            if (cards.match(patterns[i])) {
                rankedHands[i].push([hand, cardValue, bid]);
                break;
            }
        }
    })

    //order by 1st element, then 2nd element and so on so the first is highest rank and last is lowest rank
    rankedHands.forEach(rankedCards => {
        rankedCards.sort((a, b) => (b[1][0] - a[1][0] || b[1][1] - a[1][1] || b[1][2] - a[1][2] || b[1][3] - a[1][3] || b[1][4] - a[1][4]));
    })

    var rank = file.length;
    var total = 0;
    rankedHands.forEach(rankedCards => {
        rankedCards.forEach(([,,bid]) => {
            total += +bid * rank--;
        })
    })

    console.log(total);
}