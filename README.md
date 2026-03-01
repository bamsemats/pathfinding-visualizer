# Pathfinding Visualizer - Bento Edition

A sleek, high-performance pathfinding visualizer built with **React** and **Vite**. This application allows users to explore various pathfinding algorithms on a 2D grid, generate mazes, and analyze the efficiency of different search strategies.

![Pathfinding Visualizer Preview](public/path-location-svgrepo-com.svg) *(Replace with an actual screenshot or GIF)*

## 🚀 Live Demo
Check out the live version here: [https://bamsemats.github.io/pathfinding-visualizer/](https://bamsemats.github.io/pathfinding-visualizer/)

## ✨ Features
- **Interactive Grid:** Click and drag to draw walls, move the start and end nodes.
- **Multiple Algorithms:** Compare the performance and behavior of different search algorithms.
- **Maze Generation:** Create complex layouts using recursive division or random wall placement.
- **Performance Metrics:** Real-time tracking of visited nodes, path length, and execution time (logic vs. visual).
- **Adjustable Speed:** Control the visualization speed from slow to fast.
- **Responsive & Modern UI:** Designed with a clean "Bento" aesthetic using Vanilla CSS and Framer Motion.

## 🧠 Algorithms Included
- **Dijkstra's Algorithm:** The father of pathfinding; guarantees the shortest path.
- **A* Search:** An informed search algorithm that uses heuristics to find the shortest path efficiently.
- **Breadth-First Search (BFS):** An unweighted algorithm that guarantees the shortest path.

## 🏗️ Maze Generation
- **Recursive Division:** Generates a structured, wall-based maze using a recursive approach.
- **Random Walls:** Spawns walls randomly across the grid for quick testing.

## 🛠️ Tech Stack
- **React 19:** For building the user interface.
- **Vite:** Next-generation frontend tooling for fast development.
- **Lucide React:** Beautifully simple icons.
- **Framer Motion:** For smooth animations and transitions.
- **Vanilla CSS:** Custom styling for the "Bento" look and grid system.

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/bamsemats/pathfinding-visualizer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd pathfinding-visualizer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production
To create an optimized production build:
```bash
npm run build
```

## 📜 License
This project is open-source and available under the MIT License.

---
Built with ❤️ by [Mats](https://github.com/bamsemats)
