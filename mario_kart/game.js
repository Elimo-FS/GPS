var _a;
var fs1 = require('fs');
var NodeUnit = /** @class */ (function () {
    function NodeUnit(x, y) {
        this.y = "".concat(y);
        this.x = "".concat(x);
        this.links = [];
    }
    return NodeUnit;
}());
var mapName = process.argv[2];
var simpleMap = fs1.readFileSync("../maps/".concat(mapName), 'utf-8');
var maze = simpleMap.split(' ');
// Tableaux 
var graphNode = [];
var queue = [];
// Entrée et sortie  du maze
var start = new NodeUnit(0, 0);
var end = new NodeUnit(0, 0);
for (var y = 0; y < maze.length; y += 1) {
    graphNode.push([]);
    for (var x = 0; x < maze[y].length; x += 1) {
        if (maze[y][x] !== 'o') {
            switch (maze[y][x]) {
                case 'S':
                    graphNode[y][x] = new NodeUnit(x, y);
                    start = graphNode[y][x];
                    queue.push(start);
                    break;
                case 'E':
                    graphNode[y][x] = new NodeUnit(x, y);
                    end = graphNode[y][x];
                    break;
                case '.':
                    graphNode[y][x] = new NodeUnit(x, y);
                    break;
                default:
            }
            if (x !== 0 && maze[y][x - 1] !== 'o') {
                graphNode[y][x].links.push(graphNode[y][x - 1]);
                graphNode[y][x - 1].links.push(graphNode[y][x]);
            }
            if (y !== 0 && maze[y - 1][x] !== 'o') {
                graphNode[y][x].links.push(graphNode[y - 1][x]);
                graphNode[y - 1][x].links.push(graphNode[y][x]);
            }
        }
    }
}
var pathes = new Map();
var visited = new Set();
pathes.set(start, []);
// Gestion d'erreurs
var countE = 0;
var countS = 0;
if (simpleMap.indexOf('S') === -1) {
    console.error("\x1b[1;31m/!\\\x1b[0m \x1b[1mIl n'y a pas de S\x1b[0m \x1b[1;31m/!\\\x1b[0m");
    process.exit();
}
if (simpleMap.indexOf('E') === -1) {
    console.error("\x1b[31;1m/!\\\x1b[0m \x1b[1mIl n'y a pas de E\x1b[0m \x1b[31;1m/!\\\x1b[0m");
    process.exit();
}
for (var _i = 0, simpleMap_1 = simpleMap; _i < simpleMap_1.length; _i++) {
    var element = simpleMap_1[_i];
    if (element === 'E') {
        countE++;
    }
    if (element === 'S') {
        countS++;
    }
}
if (countE > 1 || countE > 1) {
    console.log('Vous avez trop de start ou de end');
    console.log("je vais quand même chercher le E le plus proche");
    console.log("même si ça ne fait pas partie de l'énnoncé...");
}
while (queue.length >= 0) {
    var current = queue.shift();
    if (current === end) {
        (_a = pathes.get(end)) === null || _a === void 0 ? void 0 : _a.push("".concat(end.y, ":").concat(end.x));
        console.log(pathes.get(end).join(' '));
        break;
    }
    if (current === undefined) {
        console.log("\x1b[1;31m/!\\\x1b[0m \x1b[1mIl n'y a pas d'issue...\x1b[0m \x1b[1;31m/!\\\x1b[0m");
        break;
    }
    for (var _b = 0, _c = current.links; _b < _c.length; _b++) {
        var neighbor = _c[_b];
        visited.add(current);
        if (!visited.has(neighbor)) {
            queue.push(neighbor);
        }
        pathes.set(neighbor, pathes.get(current).concat(["".concat(current.y, ":").concat(current.x)]));
    }
}
