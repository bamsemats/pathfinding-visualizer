import React, { useRef, useState } from 'react';
import Grid from './components/Grid';
import { Play, Trash2, Zap, Search, Grid3X3, RefreshCcw, ChevronDown } from 'lucide-react';
import './App.css';

function App() {
  const gridRef = useRef();
  const [speed, setSpeed] = useState('medium');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [results, setResults] = useState({
    dijkstra: null,
    astar: null,
    bfs: null
  });

  const handleAlgorithmComplete = (algo, stats) => {
    setResults(prev => ({
      ...prev,
      [algo]: stats
    }));
  };

  const clearResults = () => {
    setResults({
      dijkstra: null,
      astar: null,
      bfs: null
    });
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <h1>Pathfinding Visualizer</h1>
          <p className="subtitle">Bento Edition</p>
        </div>
        <div className="instructions">
          <p>Click and drag on the grid to <span>draw walls</span>. Select an algorithm to start the visualization.</p>
        </div>
        
        <div className="settings">
          <label>Speed:</label>
          <select value={speed} onChange={(e) => setSpeed(e.target.value)} className="speed-select">
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
        </div>

        <div className="controls">
          <div className={`dropdown ${dropdownOpen ? 'active' : ''}`}>
            <button className="btn btn-warning" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <Grid3X3 size={16} />
              Mazes
              <ChevronDown size={14} />
            </button>
            <div className="dropdown-content">
              <button onClick={() => { gridRef.current.generateRecursiveMaze(); clearResults(); setDropdownOpen(false); }}>Recursive Division</button>
              <button onClick={() => { gridRef.current.generateRandomMaze(); clearResults(); setDropdownOpen(false); }}>Random Walls</button>
            </div>
          </div>
          
          <div className="divider"></div>
          <div className="algo-control-container">
            <div className="algo-control">
              <button className="btn btn-primary" onClick={() => gridRef.current.visualizeDijkstra()}>
                <Play size={16} />
                Dijkstra
              </button>
              {results.dijkstra && (
                <div className={`algo-result ${results.dijkstra.success ? 'success' : 'failure'}`}>
                  {results.dijkstra.success ? (
                    <>
                      <span>Visited: {results.dijkstra.visitedNodes}</span>
                      <span>Path: {results.dijkstra.pathLength}</span>
                    </>
                  ) : (
                    <span className="error">No path!</span>
                  )}
                  <div className="time-metrics">
                    <span>Logic: {results.dijkstra.executionTime}ms</span>
                    <span>Visual: {results.dijkstra.visualTime}s</span>
                  </div>
                </div>
              )}
            </div>

            <div className="algo-control">
              <button className="btn btn-secondary" onClick={() => gridRef.current.visualizeAStar()}>
                <Zap size={16} />
                A* Search
              </button>
              {results.astar && (
                <div className={`algo-result ${results.astar.success ? 'success' : 'failure'}`}>
                  {results.astar.success ? (
                    <>
                      <span>Visited: {results.astar.visitedNodes}</span>
                      <span>Path: {results.astar.pathLength}</span>
                    </>
                  ) : (
                    <span className="error">No path!</span>
                  )}
                  <div className="time-metrics">
                    <span>Logic: {results.astar.executionTime}ms</span>
                    <span>Visual: {results.astar.visualTime}s</span>
                  </div>
                </div>
              )}
            </div>

            <div className="algo-control">
              <button className="btn btn-info" onClick={() => gridRef.current.visualizeBFS()}>
                <Search size={16} />
                BFS
              </button>
              {results.bfs && (
                <div className={`algo-result ${results.bfs.success ? 'success' : 'failure'}`}>
                  {results.bfs.success ? (
                    <>
                      <span>Visited: {results.bfs.visitedNodes}</span>
                      <span>Path: {results.bfs.pathLength}</span>
                    </>
                  ) : (
                    <span className="error">No path!</span>
                  )}
                  <div className="time-metrics">
                    <span>Logic: {results.bfs.executionTime}ms</span>
                    <span>Visual: {results.bfs.visualTime}s</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="divider"></div>

          <button className="btn btn-outline" onClick={() => gridRef.current.clearPath()}>
            <RefreshCcw size={16} />
            Reset Path
          </button>
          
          <button className="btn btn-outline" onClick={() => { gridRef.current.clearGrid(); clearResults(); }}>
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
      </header>
      <main className="main-content">
        <div className="grid-container">
          <Grid ref={gridRef} onAlgorithmComplete={handleAlgorithmComplete} speed={speed} />
        </div>
        <div className="legend">
          <div className="legend-item"><div className="node node-start"></div> Start</div>
          <div className="legend-item"><div className="node node-end"></div> End</div>
          <div className="legend-item"><div className="node node-wall"></div> Wall</div>
          <div className="legend-item"><div className="node node-visited" style={{animation: 'none', backgroundColor: 'rgba(0, 190, 218, 0.75)'}}></div> Visited</div>
          <div className="legend-item"><div className="node node-path" style={{animation: 'none', backgroundColor: '#f0e68c'}}></div> Path</div>
        </div>
      </main>
    </div>
  );
}

export default App;
