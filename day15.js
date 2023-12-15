const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__filename.split('\\').pop().split('.')[0]}.txt`, 'utf8').split(',');

//p1
var total = file.reduce((acc, val) => {
    return acc + val.split('').reduce((charAcc, charVal) => ((charAcc + charVal.charCodeAt(0)) * 17) % 256, 0)
}, 0)
console.log(total);

//p2
var boxes = {};
file.forEach(lens => {
    if (lens.includes('=')) {
        const [label, focal] = lens.split('=');
        boxIndex = label.split('').reduce((charAcc, charVal) => (charAcc + charVal.charCodeAt(0)) * 17 % 256, 0);

        if (!boxes[boxIndex]) {
            boxes[boxIndex] = [];
        }

        if (boxes[boxIndex].flat().join('').includes(label)) {
            boxes[boxIndex] = boxes[boxIndex].map(box => {
                if (box.includes(label)) {
                    return `${label} ${focal}`;
                }
                return box;
            })
        } else {
            boxes[boxIndex].push(`${label} ${focal}`);
        }
    } else {
        const label = lens.split('-')[0];
        boxIndex = label.split('').reduce((charAcc, charVal) => (charAcc + charVal.charCodeAt(0)) * 17 % 256, 0);
        if (boxes[boxIndex]) {
            boxes[boxIndex] = boxes[boxIndex].filter(value => !value.includes(label));
        }
    }
})

var total = Object.entries(boxes).reduce((acc, [boxIndex, boxRow]) => {
    return acc + boxRow.reduce((power, lens, slotIndex) => power + ((+boxIndex + 1) * (slotIndex + 1) * +lens.split(' ')[1]), 0)
}, 0)
console.log(total);