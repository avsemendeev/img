import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="group"
        >
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-6 h-6 rounded-full bg-white border border-[var(--color-border)] shadow-sm flex items-center justify-center hover:bg-red-50 hover:border-red-200 cursor-pointer"
            title="Удалить связь"
            onClick={() => {
              // Удаляем связь через ReactFlow store
              const event = new CustomEvent('delete-edge', { detail: id });
              window.dispatchEvent(event);
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--color-text-secondary)] group-hover:text-red-600"
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
