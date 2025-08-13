const fs = require('node:fs');
let input = fs.readFileSync(require('path').join(__dirname, 'inputs', `${require('path').basename(__filename, '.js').split('p')[0]}.txt`), 'utf8').trim().split(/\r?\n/).map(row => row.split(' -> ').map(val => val.trim().split(', ')));

let modules = {}
input.forEach(([l, r]) => {
  let name = l[0].trim(), type = 'broadcaster'
  if (name.startsWith('%')) { type = 'flipflop'; name = name.slice(1) }
  else if (name.startsWith('&')) { type = 'conjunction'; name = name.slice(1) }
  modules[name] = modules[name] || { type, outputs: [], inputs: [], state: false, memory: {} }
  modules[name].outputs.push(...r)
})
Object.entries(modules).forEach(([n, m]) => {
  m.outputs.forEach(o => {
    modules[o] = modules[o] || { type: 'placeholder', outputs: [], inputs: [], state: false, memory: {} }
    modules[o].inputs.push(n)
  })
})
Object.values(modules).forEach(m => {
  if (m.type == 'conjunction') m.inputs.forEach(i => m.memory[i] = 'low')
})

// % are either on or off, and is initially off, low pulse + off = on + output high, low pulse + on = off + output low
// & starts with remembering all inputs as low, if any one input is low, then output high, else ouput low
// button send low pulse to broadcast

//p1
const totalPulses = { high: 0, low: 0 }

for (let i = 0; i < 1000; i++) {
  let order = [['broadcaster', null, 'low']];

  while (order.length > 0) {
    let [moduleName, prevModuleName, pulseStrength] = order.shift();
    totalPulses[pulseStrength]++;
    let module = modules[moduleName];

    switch (module.type) {
      case 'broadcaster':
        order.push(...module.outputs.map(newModuleName => [newModuleName, moduleName, pulseStrength]));
        continue;
      case 'conjunction':
        module.memory[prevModuleName] = pulseStrength;
        const allHigh = Object.values(module.memory).every(v => v == 'high');
        order.push(...module.outputs.map(newModuleName => [newModuleName, moduleName, allHigh ? 'low' : 'high']));
        continue;
      case 'flipflop':
        if (pulseStrength == 'high') {
          continue;
        }
        module.state = !module.state;
        order.push(...module.outputs.map(newModuleName => [newModuleName, moduleName, !module.state ? 'high' : 'low']));
        continue;
    }
  }
}

console.log(totalPulses.high * totalPulses.low);

//p2
function gcd(a, b) { return b ? gcd(b, a % b) : a; }
function lcm(a, b) { return (a * b) / gcd(a, b); }

let modulesCopy = JSON.parse(JSON.stringify(modules));

// find the module that outputs to rx
const rxParent = Object.entries(modulesCopy).find(([_, m]) => (m.outputs || []).includes('rx'))[0];
const inputsToParent = modulesCopy[rxParent].inputs.slice();

// record rxParent high pulse inputs
const hits = Object.fromEntries(inputsToParent.map(i => [i, []]));

let presses = 0;

while (true) {
  presses++;
  let order = [['broadcaster', null, 'low']];

  while (order.length) {
    let [moduleName, prevModuleName, pulseStrength] = order.shift();
    const module = modulesCopy[moduleName];

    // if input to rxParent is high
    if (moduleName == rxParent && prevModuleName && hits[prevModuleName] && pulseStrength == 'high') {
      const arr = hits[prevModuleName];
      if (arr[arr.length - 1] != presses) {
        arr.push(presses); // avoid dupe in same press
      }
    }

    switch (module.type) {
      case 'broadcaster':
        order.push(...module.outputs.map(newModuleName => [newModuleName, moduleName, pulseStrength]));
        break;
      case 'conjunction':
        module.memory[prevModuleName] = pulseStrength;
        const allHigh = Object.values(module.memory).every(v => v == 'high');
        order.push(...module.outputs.map(newModuleName => [newModuleName, moduleName, allHigh ? 'low' : 'high']));
        continue;
      case 'flipflop':
        if (pulseStrength == 'high') {
          continue;
        }
        module.state = !module.state;
        order.push(...module.outputs.map(newModuleName => [newModuleName, moduleName, !module.state ? 'high' : 'low']));
        continue;
    }
  }

  // stop when every input has at least two HIGH hits -> compute periods
  if (inputsToParent.every(i => hits[i].length >= 2)) {
    break;
  }
}

// diff between first two hits for each input
const periods = inputsToParent.map(i => hits[i][1] - hits[i][0]);

console.log(periods.reduce((a, b) => lcm(a, b)));