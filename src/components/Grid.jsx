import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import Node from './Node';
import { dijkstra, getNodesInShortestPathOrder as getDijkstraPath } from '../algorithms/dijkstra';
import { astar, getNodesInShortestPathOrder as getAStarPath } from '../algorithms/astar';
import { bfs, getNodesInShortestPathOrder as getBFSPath } from '../algorithms/bfs';
import { recursiveDivisionMaze } from '../algorithms/mazeRecursiveDivision';
import { randomMaze } from '../algorithms/mazeRandom';
import './Grid.css';

const Grid = forwardRef(({ onAlgorithmComplete, speed = 'medium' }, ref) => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [dimensions, setDimensions] = useState({ rows: 20, cols: 50 });
  const [startNode, setStartNode] = useState([10, 15]);
  const [endNode, setEndNode] = useState([10, 35]);

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
    const calculateDimensions = () => {
      const nodeSize = window.innerWidth <= 600 ? 20 : 25;
      const width = window.innerWidth - 40; // 20px padding on each side
      const height = window.innerHeight - (window.innerWidth <= 768 ? 400 : 250); // Larger offset for stacked header on mobile
      
      const cols = Math.max(15, Math.floor(width / nodeSize));
      const rows = Math.max(10, Math.floor(height / nodeSize));
      
      const startR = Math.floor(rows / 2);
      const startC = Math.floor(cols / 4);
      const endR = Math.floor(rows / 2);
      const endC = Math.floor((cols / 4) * 3);

      setDimensions({ rows, cols });
      setStartNode([startR, startC]);
      setEndNode([endR, endC]);
      
      return { rows, cols, startR, startC, endR, endC };
    };

    const { rows, cols, startR, startC, endR, endC } = calculateDimensions();
    const initialGrid = getInitialGrid(rows, cols, startR, startC, endR, endC);
    setGrid(initialGrid);

    const handleResize = () => {
      if (isVisualizing) return;
      const { rows, cols, startR, startC, endR, endC } = calculateDimensions();
      setGrid(getInitialGrid(rows, cols, startR, startC, endR, endC));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateMaze = (type) => {
    if (isVisualizing) return;
    clearGrid();
    setIsVisualizing(true);
    const wallsInOrder = type === 'recursive' 
      ? (() => {
          const walls = [];
          recursiveDivisionMaze(grid, 2, dimensions.rows - 3, 2, dimensions.cols - 3, "horizontal", false, walls);
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
    
    const start = newGrid[startNode[0]][startNode[1]];
    const finish = newGrid[endNode[0]][endNode[1]];
    
    const startTime = performance.now();
    let visitedNodesInOrder;
    if (algo === 'dijkstra') {
      visitedNodesInOrder = dijkstra(newGrid, start, finish);
    } else if (algo === 'astar') {
      visitedNodesInOrder = astar(newGrid, start, finish);
    } else if (algo === 'bfs') {
      visitedNodesInOrder = bfs(newGrid, start, finish);
    }
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    const nodesInShortestPathOrder = getDijkstraPath(finish);
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
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.classList.add('node-visited');
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
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.classList.add('node-path');
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
    const initialGrid = getInitialGrid(dimensions.rows, dimensions.cols, startNode[0], startNode[1], endNode[0], endNode[1]);
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

  const handleTouchMove = (e) => {
    if (!mouseIsPressed || isVisualizing) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.id.startsWith('node-')) {
      const [, row, col] = element.id.split('-').map(Number);
      const node = grid[row][col];
      if (!node.isWall && !node.isStart && !node.isEnd) {
        const newGrid = getNewGridWithWallToggled(grid, row, col, true);
        setGrid(newGrid);
      }
    }
  };

  const handleMouseUp = useCallback(() => {
    setMouseIsPressed(false);
  }, []);

  return (
    <div className="grid" onTouchMove={handleTouchMove}>
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

const getInitialGrid = (rows, cols, startR, startC, endR, endC) => {
  const grid = [];
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(col, row, startR, startC, endR, endC));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, startR, startC, endR, endC) => {
  return {
    col,
    row,
    isStart: row === startR && col === startC,
    isEnd: row === endR && col === endC,
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
