// Recursive Division Maze Generation Algorithm
// Returns the nodes that should become walls in the order they should be animated.
export function recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls, wallsInOrder) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }

  if (!surroundingWalls) {
    for (const row of grid) {
      for (const node of row) {
        if (
          node.row === 0 ||
          node.row === grid.length - 1 ||
          node.col === 0 ||
          node.col === grid[0].length - 1
        ) {
          if (!node.isStart && !node.isEnd) {
            wallsInOrder.push(node);
          }
        }
      }
    }
    surroundingWalls = true;
  }

  if (orientation === "horizontal") {
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let colRandomGap = possibleCols[randomColIndex];

    for (const row of grid) {
      for (const node of row) {
        if (
          node.row === currentRow &&
          node.col !== colRandomGap &&
          node.col >= colStart - 1 &&
          node.col <= colEnd + 1
        ) {
          if (!node.isStart && !node.isEnd) {
            wallsInOrder.push(node);
          }
        }
      }
    }

    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursiveDivisionMaze(grid, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls, wallsInOrder);
    } else {
      recursiveDivisionMaze(grid, rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls, wallsInOrder);
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveDivisionMaze(grid, currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls, wallsInOrder);
    } else {
      recursiveDivisionMaze(grid, currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls, wallsInOrder);
    }
  } else {
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let currentCol = possibleCols[randomColIndex];
    let rowRandomGap = possibleRows[randomRowIndex];

    for (const row of grid) {
      for (const node of row) {
        if (
          node.col === currentCol &&
          node.row !== rowRandomGap &&
          node.row >= rowStart - 1 &&
          node.row <= rowEnd + 1
        ) {
          if (!node.isStart && !node.isEnd) {
            wallsInOrder.push(node);
          }
        }
      }
    }

    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls, wallsInOrder);
    } else {
      recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls, wallsInOrder);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivisionMaze(grid, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls, wallsInOrder);
    } else {
      recursiveDivisionMaze(grid, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls, wallsInOrder);
    }
  }
}
