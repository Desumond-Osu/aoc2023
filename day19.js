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
