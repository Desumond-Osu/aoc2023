const fs = require('node:fs');
var [workflows, partList] = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js').split('p')[0]}.txt`), 'utf8').split(/\n\s*\n/);

workflows = workflows.split(/\r?\n/).reduce((acc, workflow) => {
    var [name, rules] = workflow.split(/[{}]/).slice(0, -1);
    rules = rules.split(',').map(rule => rule.split(':'));
    acc[name] = rules;
    return acc;
}, {});

partList = partList.split(/\r?\n/).map(parts => {
    parts = parts.split(/[{}]/)[1].split(',');
    total = parts.reduce((acc, part) => acc + +part.split('=')[1], 0);
    return [parts, total];
});

//p1
var total = 0;
partList.forEach(parts => {
    (function rec(parts, name) {
        for (const part of parts[0]) {
            eval(part);
        }
        for (const rule of workflows[name]) {
            if (rule.length == 1 || eval(rule[0])) {
                if (rule.at(-1) == 'R') {
                    return;
                }
                if (rule.at(-1) == 'A') {
                    total += parts[1];
                    return;
                }
                rec(parts, rule.at(-1));
                return;
            }
        }
    })(parts, 'in');
})

console.log(total);

//p2
const inequalities = [];

function swapSign(rule) {
    return rule.replace(/(<=?|>=?)/, match => {
        switch (match) {
            case '<': return '>=';
            case '<=': return '>';
            case '>': return '<=';
            case '>=': return '<';
        }
    });
}

(function rec(name, history) {
    if (name == 'R') {
        return;
    }

    if (name == 'A') {
        inequalities.push(history);
        return;
    }

    for (const rule of workflows[name]) {
        if (rule.length == 1) {
            rec(rule[0], history);
        }

        if (rule.length == 2) {
            let newHistory = [...history, rule[0]];
            rec(rule[1], newHistory);
            history.push(swapSign(rule[0]));
            continue;
        }
    }
})('in', []);

function parse(inequality) {
    let match = inequality.match(/^([a-z])([<>]=?)(\d+)$/);
    if (!match) {
        return null;
    }
    
    let [_, rating, sign, value] = match;
    value = +value;

    switch (sign) {
        case '<' : return [rating,         1, value - 1];
        case '<=': return [rating,         1,     value];
        case '>' : return [rating, value + 1,      4000];
        case '>=': return [rating,     value,      4000];
        default  : return null;
    }
}

function calc(inequalities) {
    let ranges = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] };

    for (let inequality of inequalities) {
        let parsed = parse(inequality);

        if (!parsed) {
            continue;
        };

        let [rating, min, max] = parsed;
        
        ranges[rating] = [Math.max(ranges[rating][0], min), Math.min(ranges[rating][1], max)];

        if (ranges[rating][0] > ranges[rating][1]) {
            return 0;
        }
    }

    return Object.values(ranges).reduce((acc, [min, max]) => acc * (max - min + 1), 1);
}

console.log(inequalities.map(calc).reduce((acc, val) => acc + val, 0));