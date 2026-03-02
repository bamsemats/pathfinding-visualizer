import { memo } from 'react';
import { motion } from 'framer-motion';
import './Node.css';

const Node = ({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  isVisited,
  isPath,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const extraClassName = isStart
    ? 'node-start'
    : isEnd
    ? 'node-end'
    : isWall
    ? 'node-wall'
    : isPath
    ? 'node-path'
    : isVisited
    ? 'node-visited'
    : '';

  return (
    <motion.div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      onTouchStart={() => onMouseDown(row, col)}
      onTouchEnd={() => onMouseUp()}
      initial={false}
      animate={{
        scale: isWall ? [0.6, 1.1, 1] : 1,
        transition: { duration: 0.3 }
      }}
    />
  );
};

export default memo(Node);
