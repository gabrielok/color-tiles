import { formatMatrixToString } from '@umatch/utils/array';
import { pickRandom } from '@umatch/utils/math';

const HEIGHT = 15;
const WIDTH = 23;
const BLOCKS = 200;

type Board = {
  x: { [column: number]: Array<number> }; // an array of x-coordinates for each y-coordinate
  y: { [row: number]: Array<number> }; // an array of y-coordinates for each x-coordinate
};
type Cell = {
  x: number;
  y: number;
  color: number;
};

function makeBoard(): Board {
  const board = {
    x: Object.fromEntries(
      Array.from({ length: HEIGHT }, (_, i) => [
        i,
        Array.from({ length: WIDTH }, () => 0),
      ]),
    ),
    y: Object.fromEntries(
      Array.from({ length: WIDTH }, (_, i) => [
        i,
        Array.from({ length: HEIGHT }, () => 0),
      ]),
    ),
  };

  let blockCount = 0;
  let cells = convertBoardToCells(board);
  let freeCells = cells.filter((cell) => cell.color === 0);
  let boardHasChanged = false;
  while (blockCount < BLOCKS) {
    if (boardHasChanged) {
      cells = convertBoardToCells(board);
      freeCells = cells.filter((cell) => cell.color === 0);
      boardHasChanged = false;
    }

    const randomCell = pickRandom(freeCells);
    const { x, y } = randomCell;
    const freeCellsToPair = [];
    // walk up
    for (let i = y + 1; i < HEIGHT; i++) {
      if (board.x[i][x] === 0) {
        freeCellsToPair.push({ x, y: i });
      } else {
        break;
      }
    }
    // walk down
    for (let i = y - 1; i >= 0; i--) {
      if (board.x[i][x] === 0) {
        freeCellsToPair.push({ x, y: i });
      } else {
        break;
      }
    }
    // walk right
    for (let i = x + 1; i < WIDTH; i++) {
      if (board.y[i][y] === 0) {
        freeCellsToPair.push({ x: i, y });
      } else {
        break;
      }
    }
    // walk left
    for (let i = x - 1; i >= 0; i--) {
      if (board.y[i][y] === 0) {
        freeCellsToPair.push({ x: i, y });
      } else {
        break;
      }
    }
    if (freeCellsToPair.length === 0) continue;

    const color = pickRandom([1, 2, 3, 4, 5]);
    const pairCell = pickRandom(freeCellsToPair);
    const { x: x2, y: y2 } = pairCell;
    board.x[y][x] = color;
    board.y[x][y] = color;
    board.x[y2][x2] = color;
    board.y[x2][y2] = color;

    blockCount += 2;
    boardHasChanged = true;
  }
  return board;
}

function printBoard(board: Board) {
  const boardMatrix = Array.from({ length: HEIGHT }, (_, i) => {
    return Array.from({ length: WIDTH }, (__, j) => {
      return board.x[i][j] || board.y[j][i];
    });
  });
  console.log(formatMatrixToString(boardMatrix));
}

function convertBoardToCells(board: Board): Array<Cell> {
  const cells: Array<Cell> = [];
  for (const entry of Object.entries(board.x)) {
    const [y, row] = entry;
    row.forEach((color, index) => {
      cells.push({ x: index, y: Number(y), color });
    });
  }
  return cells;
}

const board = makeBoard();
printBoard(board);
