import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      {/* Невидимая широкая область для hover */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="react-flow__edge-interaction"
      />
      
      {/* Видимая линия связи */}
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      
      {/* Кнопка удаления */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="edgebutton-container"
        >
          <button
            onClick={onEdgeClick}
            className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 shadow-lg flex items-center justify-center hover:bg-red-50 hover:border-red-400 cursor-pointer transition-all duration-200 hover:scale-110"
            title="Удалить связь"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600 hover:text-red-600"
            >
              <circle cx="6" cy="6" r="3" />
              <path d="M8.12 8.12L12 12" />
              <path d="M20 4L8.12 15.88" />
              <circle cx="6" cy="18" r="3" />
              <path d="M14.8 14.8L20 20" />
            </svg>
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
