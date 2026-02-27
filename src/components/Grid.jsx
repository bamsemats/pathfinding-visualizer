import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import Node from './Node';
import { dijkstra, getNodesInShortestPathOrder as getDijkstraPath } from '../algorithms/dijkstra';
import { astar, getNodesInShortestPathOrder as getAStarPath } from '../algorithms/astar';
import { bfs, getNodesInShortestPathOrder as getBFSPath } from '../algorithms/bfs';
import { recursiveDivisionMaze } from '../algorithms/mazeRecursiveDivision';
import { randomMaze } from '../algorithms/mazeRandom';
import './Grid.css';

const DEFAULT_START_NODE = [10, 15];
const DEFAULT_END_NODE = [10, 35];
const ROWS = 20;
const COLS = 50;

const Grid = forwardRef(({ onAlgorithmComplete, speed = 'medium' }, ref) => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);

  // Speed mapping (Visited delay, Path delay)
  const speedMap = {
    fast: [2, 10],
    medium: [10, 50],
    slow: [50, 100]
  };

  const [vDelay, pDelay] = speedMap[speed];

  useImperativeHandle(ref, () => ({
    visualizeDijkstra: () => visualizeAlgorithm('dijkstra'),
    visualizeAStar: () => visualizeAlgorithm('astar'),
    visualizeBFS: () => visualizeAlgorithm('bfs'),
    generateRecursiveMaze: () => generateMaze('recursive'),
    generateRandomMaze: () => generateMaze('random'),
    clearGrid: () => clearGrid(),
    clearPath: () => clearPath(),
  }));

  useEffect(() => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
  }, []);

  const generateMaze = (type) => {
    if (isVisualizing) return;
    clearGrid();
    setIsVisualizing(true);
    const wallsInOrder = type === 'recursive' 
      ? (() => {
          const walls = [];
          recursiveDivisionMaze(grid, 2, ROWS - 3, 2, COLS - 3, "horizontal", false, walls);
          return walls;
        })()
      : randomMaze(grid);
    animateMaze(wallsInOrder, type);
  };

  const animateMaze = (wallsInOrder, type) => {
    const mazeDelay = type === 'random' ? 5 : 10;
    for (let i = 0; i < wallsInOrder.length; i++) {
      setTimeout(() => {
        const node = wallsInOrder[i];
        setGrid(prevGrid => {
          const newGrid = prevGrid.slice();
          const newNode = { ...newGrid[node.row][node.col], isWall: true };
          newGrid[node.row][node.col] = newNode;
          return newGrid;
        });
        if (i === wallsInOrder.length - 1) {
          setIsVisualizing(false);
        }
      }, mazeDelay * i);
    }
  };

  const visualizeAlgorithm = (algo) => {
    if (isVisualizing) return;
    clearPath();
    setIsVisualizing(true);
    
    const newGrid = grid.map(row => row.map(node => ({
      ...node,
      distance: Infinity,
      isVisited: false,
      isPath: false,
      previousNode: null,
      totalCost: Infinity,
    })));
    
    const startNode = newGrid[DEFAULT_START_NODE[0]][DEFAULT_START_NODE[1]];
    const finishNode = newGrid[DEFAULT_END_NODE[0]][DEFAULT_END_NODE[1]];
    
    const startTime = performance.now();
    let visitedNodesInOrder;
    if (algo === 'dijkstra') {
      visitedNodesInOrder = dijkstra(newGrid, startNode, finishNode);
    } else if (algo === 'astar') {
      visitedNodesInOrder = astar(newGrid, startNode, finishNode);
    } else if (algo === 'bfs') {
      visitedNodesInOrder = bfs(newGrid, startNode, finishNode);
    }
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    const nodesInShortestPathOrder = getDijkstraPath(finishNode);
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, algo, executionTime);
  };

  const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder, algo, executionTime) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder, visitedNodesInOrder.length, algo, executionTime);
        }, vDelay * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-visited');
      }, vDelay * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder, visitedCount, algo, executionTime) => {
    const isSuccess = nodesInShortestPathOrder.length > 1 && nodesInShortestPathOrder[0].isStart;
    const visualTime = (visitedCount * vDelay + (isSuccess ? nodesInShortestPathOrder.length * pDelay : 0)) / 1000;

    if (!isSuccess) {
      setIsVisualizing(false);
      if (onAlgorithmComplete) {
        onAlgorithmComplete(algo, {
          visitedNodes: visitedCount,
          pathLength: 0,
          executionTime: executionTime.toFixed(4),
          visualTime: visualTime.toFixed(2),
          success: false
        });
      }
      return;
    }

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-path');
        if (i === nodesInShortestPathOrder.length - 1) {
          setIsVisualizing(false);
          if (onAlgorithmComplete) {
            onAlgorithmComplete(algo, {
              visitedNodes: visitedCount,
              pathLength: nodesInShortestPathOrder.length,
              executionTime: executionTime.toFixed(4),
              visualTime: visualTime.toFixed(2),
              success: true
            });
          }
        }
      }, pDelay * i);
    }
  };

  const clearGrid = () => {
    if (isVisualizing) return;
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
    clearDOMClasses(initialGrid);
  };

  const clearPath = () => {
    if (isVisualizing) return;
    const newGrid = grid.map(row => row.map(node => ({
      ...node,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      totalCost: Infinity,
      previousNode: null,
    })));
    setGrid(newGrid);
    clearDOMClasses(newGrid);
  };

  const clearDOMClasses = (currentGrid) => {
    for (const row of currentGrid) {
      for (const node of row) {
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) {
          el.classList.remove('node-visited');
          el.classList.remove('node-path');
        }
      }
    }
  }

  const handleMouseDown = useCallback((row, col) => {
    if (isVisualizing) return;
    const node = grid[row][col];
    if (node.isStart || node.isEnd) return;
    
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  }, [grid, isVisualizing]);

  const handleMouseEnter = useCallback((row, col) => {
    if (!mouseIsPressed || isVisualizing) return;
    const node = grid[row][col];
    if (node.isStart || node.isEnd) return;
    
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  }, [grid, mouseIsPressed, isVisualizing]);

  const handleMouseUp = useCallback(() => {
    setMouseIsPressed(false);
  }, []);

  return (
    <div className="grid">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="grid-row">
          {row.map((node, nodeIdx) => {
            const { row, col, isStart, isEnd, isWall, isVisited, isPath } = node;
            return (
              <Node
                key={`${rowIdx}-${nodeIdx}`}
                row={row}
                col={col}
                isStart={isStart}
                isEnd={isEnd}
                isWall={isWall}
                isVisited={isVisited}
                isPath={isPath}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
});

// --- Helper Functions ---

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < COLS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === DEFAULT_START_NODE[0] && col === DEFAULT_START_NODE[1],
    isEnd: row === DEFAULT_END_NODE[0] && col === DEFAULT_END_NODE[1],
    distance: Infinity,
    isVisited: false,
    isWall: false,
    isPath: false,
    previousNode: null,
    totalCost: Infinity,
  };
};

const getNewGridWithWallToggled = (grid, row, col, isWallValue) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: isWallValue !== undefined ? isWallValue : !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

export default Grid;
