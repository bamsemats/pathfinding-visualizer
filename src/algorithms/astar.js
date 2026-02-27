// Performs A* search algorithm; returns all nodes in the order in which they were visited.
// Also makes nodes point back to their previous node, allowing us to compute the shortest path.
export function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.totalCost = 0; // f = g + h
  const openSet = [startNode];
  
  while (!!openSet.length) {
    sortNodesByTotalCost(openSet);
    const closestNode = openSet.shift();
    
    if (closestNode.isWall) continue;
    
    // If we've already visited this node, we skip it.
    if (closestNode.isVisited) continue;
    
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    
    if (closestNode === finishNode) return visitedNodesInOrder;
    
    const neighbors = getUnvisitedNeighbors(closestNode, grid);
    for (const neighbor of neighbors) {
      const gScore = closestNode.distance + 1;
      if (gScore < neighbor.distance) {
        neighbor.previousNode = closestNode;
        neighbor.distance = gScore;
        neighbor.totalCost = gScore + manhattanDistance(neighbor, finishNode);
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  return visitedNodesInOrder;
}

function manhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function sortNodesByTotalCost(openSet) {
  openSet.sort((nodeA, nodeB) => nodeA.totalCost - nodeB.totalCost);
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Backtracks from the finishNode to find the shortest path.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
