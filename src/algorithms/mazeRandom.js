// Random Maze Generation
// Returns an array of nodes to be turned into walls.
export function randomMaze(grid) {
  const wallsInOrder = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const node = grid[row][col];
      if (node.isStart || node.isEnd) continue;
      if (Math.random() < 0.3) {
        wallsInOrder.push(node);
      }
    }
  }
  // Shuffle to make animation look more "random"
  return wallsInOrder.sort(() => Math.random() - 0.5);
}
