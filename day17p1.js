//inspiration from https://www.reddit.com/r/adventofcode/comments/18luw6q/2023_day_17_a_longform_tutorial_on_day_17/

const fs = require('node:fs');
const file = fs.readFileSync(`inputs/${__filename.split('/').pop().split('.')[0].split('p')[0]}.txt`, 'utf8').split('\n');

const map = file.map(line => line = line.split('').map(Number));

const [h, w] = [map.length, map[0].length];

const [endX, endY] = [h - 1, w - 1];

const stateQueuesByCost = new Map();
const seenCostByState = new Map();

function moveAndAddState(cost, [x, y], [dx, dy], distance) {
  [x, y] = [x + dx, y + dy];

  if (x < 0 || x >= w || y < 0 || y >= h) {
    return;
  }

  const newCost = cost + map[x][y];

  if (x == endX && y == endY) {
    console.log(newCost);
    process.exit(0);
  }

  const state = `${x},${y},${dx},${dy},${distance}`;

  if (!seenCostByState.has(state)) {
    if (!stateQueuesByCost.has(newCost)) {
      stateQueuesByCost.set(newCost, []);
    }
    stateQueuesByCost.get(newCost).push({ x, y, dx, dy, distance });

    seenCostByState.set(state, newCost);
  }
}

moveAndAddState(0, [0, 0], [1, 0], 1);
moveAndAddState(0, [0, 0], [0, 1], 1);

while (1) {
  const currentCost = Math.min(...stateQueuesByCost.keys());

  const nextStates = stateQueuesByCost.get(currentCost);
  stateQueuesByCost.delete(currentCost);

  for (const state of nextStates) {
    const { x, y, dx, dy, distance } = state;

    moveAndAddState(currentCost, [x, y], [dy, -dx], 1);
    moveAndAddState(currentCost, [x, y], [-dy, dx], 1);

    if (distance < 3) {
      moveAndAddState(currentCost, [x, y], [dx, dy], distance + 1);
    }
  }
}