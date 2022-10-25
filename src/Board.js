import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=3, ncols=3, chanceLightStartsOn=0.50 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++){
      let row = [];
      for (let x = 0; x < ncols; x++){
        row.push(Math.random() < chanceLightStartsOn);
      };
      initialBoard.push(row);
    };
    return initialBoard;
  };

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };
      
      let boardCopy = [...oldBoard];
      flipCell(y, x, boardCopy) // current pos
      flipCell(y-1, x, boardCopy) // top
      flipCell(y+1, x, boardCopy) // bottom
      flipCell(y, x+1, boardCopy) // right
      flipCell(y, x-1, boardCopy) // left

      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (board.every(r => r.every(c => c))) {
    return <div>You win!</div>;
  }

  function renderBoard (board) {
    return board.map((r, idxY) => (
      <div>{r.map((c, idxX) => <Cell flipCellsAroundMe={() => flipCellsAround(`${idxY}-${idxX}`)} key={`${idxY}-${idxX}`} isLit={c}/>)}</div>
    ));
  }

  return <table><tbody>{renderBoard(board)}</tbody></table>;
}

export default Board;
