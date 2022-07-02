import React from 'react';
import { getBezierPath, Position } from 'react-flow-renderer';

interface Props {
  id: string;
  sourceX: number;
  sourceY: number;
  sourcePosition: Position;
  targetX: number;
  targetY: number;
  targetPosition: Position;
  style?: React.CSSProperties;
  data?: {
    text: string;
  };
  markerEnd?: string;
}

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data, markerEnd }: Props) {
  const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: '12px', color: 'white' }}
          fill="white"
          startOffset="50%"
          textAnchor="middle"
        >
          {data?.text || ''}
        </textPath>
      </text>
    </>
  );
}