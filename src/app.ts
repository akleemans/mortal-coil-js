enum State {
    waiting,
    initialized,
    running
}

enum Direction { L = 'L', R = 'R', U = 'U', D = 'D'}

class Cell {
    constructor(
        public idx: number,
        public x: number,
        public y: number,
    ) {
    }

    public visited: boolean = false;
    public edges: Map<Direction, Cell | undefined> = new Map();
    public color: string | undefined;

    public getNeighbor(direction: Direction): Cell | undefined {
        return this.edges.get(direction);
    }

    public setNeighbor(direction: Direction, cell: Cell | undefined): void {
        this.edges.set(direction, cell);
    }
}

const cells: Cell[] = [];

let state: State = State.waiting;

let w = 45;
let h = 30;
const cellSize = 30;

/* P5 callbacks */
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    frameRate(10);
    loadLevel();
    const myCanvas = createCanvas(w * cellSize, h * cellSize);
    myCanvas.parent('canvasDiv');
    state = State.initialized;
}

function draw() {
    if (state >= State.initialized) {
        drawOnCanvas();
    }
}


const getCoords = (idx: number): { x: number, y: number } => {
    const x = idx % w;
    const y = (idx - x) / w;
    return {x, y};
}

const drawOnCanvas = (): void => {
    fill('black');
    square(0, 0, Math.max(w, h)*cellSize);
    for (let cell of cells) {
        let color = 'black';// = (node ? (node.visited ? 'green' : 'white') : 'black');
        if (cell) {
            if (cell.color) {
                color = cell.color;
            } else {
                color = cell.visited ? 'green' : 'white';
            }
        }
        fill(color);
        square(cell.x * cellSize, cell.y * cellSize, cellSize);
    }
}

const toggleRun = (): void => {
    state = State.running;
    setTimeout(() => bruteForce());
    // state = (state === State.running) ? State.waiting : State.running;
};

const reset = (): void => {
    cells.forEach(cell => cell.visited = false);
}

const level22 = {
    width: 11,
    height: 10,
    boardStr: "................X...X...XX...X.........X.....XXX....XX......X..........X....X.....X.XX.......X...X............"
};

const level52 = {
    width: 20,
        height: 20,
        boardStr: "XXXXXXXX...X....XXXXXX.....X.X....X.XXXX.....X......X...X.....X....XX....X..X...X...XX.XXXXX....XX.....XXX.......XX......X...X.X.................X....X...X....X......X.....X...XX.X.XXXX..............X.....X.........X...X..XX.....X..X....X....XX........X.X..XX...X..XXXXXX.....XXX.XXX.XXX..XXX.X..X.......XXX....X...X..XX...XXXX.X..XX..X.X........X...XX...X........X..X...X.X....X...XXXX...X...X..X..."
};

const loadLevel = (): void => {
    // TODO parametrize
    const level = level52;
    w = level.width
    h = level.height
    let idx = 0;
    for (let i = 0; i < level.height * level.width; i++) {
        if (level.boardStr[i] === '.') {
            const coords = getCoords(i);
            cells.push(new Cell(idx++, coords.x, coords.y));
        }
    }

    // Initialize edges
    for (const cell of cells) {
        cell.setNeighbor(Direction.U, cells.find(c => c.x == cell.x && c.y == cell.y - 1));
        cell.setNeighbor(Direction.D, cells.find(c => c.x == cell.x && c.y == cell.y + 1));
        cell.setNeighbor(Direction.L, cells.find(c => c.x == cell.x - 1 && c.y == cell.y));
        cell.setNeighbor(Direction.R, cells.find(c => c.x == cell.x + 1 && c.y == cell.y));
    }
    console.log('Initialized grid:', cells);
}


const allNodesVisited = (): boolean => {
    return cells.every(c => c.visited)
};

const move = (cell: Cell, direction: Direction): Cell => {
    let nextCell: Cell | undefined = cell
    let currentCell: Cell
    while (nextCell != null) {
        currentCell = nextCell
        currentCell.visited = true
        nextCell = currentCell.getNeighbor(direction)
        if (nextCell != undefined && nextCell.visited) {
            break
        }
    }
    return currentCell
};

const moveBack = (wrongCell: Cell, lastCell: Cell, lastMove: Direction): void => {
    let cell: Cell = wrongCell
    while (cell != lastCell) {
        cell.visited = false
        let backDirection = reverseDir.get(lastMove)
        cell = cell.edges.get(backDirection)!
    }
    cell.visited = false
};

const reverseDir = new Map<Direction, Direction>([
    [Direction.D, Direction.U],
    [Direction.U, Direction.D],
    [Direction.L, Direction.R],
    [Direction.R, Direction.L],
]);

const bruteForce = () => {
    console.log('Starting brute force...');
    let solution;
    for (const cell of cells) {
        // cell.color = 'red';
        let path = "";
        let pathCells = [cell];
        let lastMove: Direction | undefined = undefined;

        while (true) {
            let currentCell = pathCells[pathCells.length - 1]
            let candidates = currentCell.edges

            let nextDirection: Direction | undefined
            for (let [direction, candidate] of candidates) {
                if (path.length > 0 && direction === reverseDir.get(path[path.length - 1] as Direction)) {
                    continue;
                } else if (candidate != null && !candidate.visited && !lastMove) {
                    nextDirection = direction;
                    break;
                } else if (lastMove == direction) {
                    lastMove = null;
                }
            }

            if (nextDirection == null) {
                if (allNodesVisited()) {
                    solution = {path, x: cell.x, y: cell.y};
                    console.log('Solution found!', solution);
                    break;
                } else {
                    if (pathCells.length == 1) {
                        break;
                    }
                    // Rollback
                    lastMove = path[path.length - 1] as Direction;
                    path = path.slice(0, -1)
                    const wrongCell = pathCells.pop();
                    moveBack(wrongCell, pathCells[pathCells.length - 1], lastMove);
                }
            } else {
                path += nextDirection.toString()
                let nextCell = move(currentCell, nextDirection);
                pathCells.push(nextCell);
            }
        }
        if (solution) {
            break;
        }
    }
}

