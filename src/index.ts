import { formatMatrixToString, transpose } from '@umatch/utils/array';
import { pickRandom } from '@umatch/utils/math';

const HEIGHT = 15;
const WIDTH = 23;
const BLOCKS = 200;
const COLORS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Board = number[][];
type Cell = {
  x: number;
  y: number;
  color: number;
};

function makeBoard(): Board {
  // we use an array of columns as it is more intuitive to access,
  // however it must be transposed before printing
  const board = Array.from({ length: WIDTH }, () =>
    Array.from({ length: HEIGHT }, () => 0),
  );

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
    for (let i = y + 2; i < HEIGHT; i++) {
      if (board[x][i] === 0) {
        freeCellsToPair.push({ x, y: i });
      } else {
        break;
      }
    }
    // walk down
    for (let i = y - 2; i >= 0; i--) {
      if (board[x][i] === 0) {
        freeCellsToPair.push({ x, y: i });
      } else {
        break;
      }
    }
    // walk right
    for (let i = x + 2; i < WIDTH; i++) {
      if (board[i][y] === 0) {
        freeCellsToPair.push({ x: i, y });
      } else {
        break;
      }
    }
    // walk left
    for (let i = x - 2; i >= 0; i--) {
      if (board[i][y] === 0) {
        freeCellsToPair.push({ x: i, y });
      } else {
        break;
      }
    }
    if (freeCellsToPair.length === 0) continue;

    const color = pickRandom(COLORS);
    const pairCell = pickRandom(freeCellsToPair);
    const { x: x2, y: y2 } = pairCell;
    board[x][y] = color;
    board[x2][y2] = color;

    blockCount += 2;
    boardHasChanged = true;
  }
  return board;
}

function printBoard(board: Board) {
  console.log(formatMatrixToString(transpose(board)));
}

function convertBoardToCells(board: Board): Array<Cell> {
  const cells: Array<Cell> = [];
  for (let x = 0; x < board.length; x += 1) {
    const column = board[x];
    for (let y = 0; y < column.length; y += 1) {
      cells.push({ x, y, color: column[y] });
    }
  }
  return cells;
}

const board = makeBoard();
printBoard(board);
