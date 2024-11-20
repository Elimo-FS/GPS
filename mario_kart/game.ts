const fs1 = require('fs');

class NodeUnit {
  y: string;

  x: string;

  links: NodeUnit[];

  constructor(x: number, y:number) {
    this.y = `${y}`;
    this.x = `${x}`;
    this.links = [];
  }
}

const mapName: string = process.argv[2];
const simpleMap: string = fs1.readFileSync(`../maps/${mapName}`, 'utf-8')
const maze: string[] = simpleMap.split('\n');

// Tableaux 
const graphNode: NodeUnit[][] = [];
const queue: NodeUnit[] = [];
console.log(maze)
// Entrée et sortie  du maze
let start: NodeUnit = new NodeUnit(0, 0);
let end: NodeUnit = new NodeUnit(0, 0);

// Gestion d'erreurs
let countE: number = 0;
let countS: number = 0;
if (simpleMap.indexOf('S') === -1) {
    console.error("\x1b[1;31m/!\\\x1b[0m \x1b[1mIl n'y a pas de S\x1b[0m \x1b[1;31m/!\\\x1b[0m");
    process.exit();
}
if (simpleMap.indexOf('E') === -1) {
    console.error("\x1b[31;1m/!\\\x1b[0m \x1b[1mIl n'y a pas de E\x1b[0m \x1b[31;1m/!\\\x1b[0m");
    process.exit();
}
for (let element of simpleMap){
  if (element === 'E'){
    countE++
  }
  if (element === 'S'){
    countS++
  }
}
if (countE > 1 || countE > 1) {
  console.error('Vous avez trop de start ou de end')
}

for (let y = 0; y < maze.length; y += 1) {
  graphNode.push([]);
  for (let x = 0; x < maze[y].length; x += 1) {
    if (maze[y][x] !== 'o') {
      const newNode = graphNode[y][x] = new NodeUnit(x, y);
        if (maze[y][x] === '.' || maze[y][x] === 'S' || maze[y][x] === 'E'){
          graphNode[y][x] = newNode;
          if (maze[y][x] === 'S'){
                start = graphNode[y][x];
                queue.push(start);
          } 
          if (maze[y][x] === 'E'){
            end = graphNode[y][x];
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
}
const pathes: Map<NodeUnit, string[] | undefined> = new Map();
const visited: Set<NodeUnit> = new Set();
pathes.set(start, []);

while (queue.length >= 0) {
  const current: NodeUnit | undefined = queue.shift()!;
  if (current === end) {
    pathes.get(end)?.push(`${end!.y}:${end!.x}`);
    console.log(pathes.get(end)!.join(' '));
    break;
  }
  if (current === undefined){
    console.error("\x1b[1;31m/!\\\x1b[0m \x1b[1mIl n'y a pas d'issue...\x1b[0m \x1b[1;31m/!\\\x1b[0m");
    break;
  }
  for (const neighbor of current!.links) {
    visited.add(current!);

    if (!visited.has(neighbor)) {
      queue.push(neighbor);
    }
    pathes.set(neighbor, pathes.get(current)!.concat([`${current.y}:${current.x}`]));
  }
}
