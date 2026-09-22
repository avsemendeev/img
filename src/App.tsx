import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Connection,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { GenerationNode } from './components/GenerationNode';
import { TopBar } from './components/TopBar';
import { AuthModal } from './components/AuthModal';
import { HelpPanel } from './components/HelpPanel';
import type { GenerationNodeData } from './types';

const nodeTypes = {
  generation: GenerationNode,
};

const initialNodes: Node<GenerationNodeData>[] = [
  {
    id: '1',
    type: 'generation',
    position: { x: 200, y: 100 },
    data: {
      label: 'Генерация #1',
      prompt: '',
      imageUrl: '',
      status: 'idle',
    },
  },
  {
    id: '2',
    type: 'generation',
    position: { x: 600, y: 300 },
    data: {
      label: 'Генерация #2',
      prompt: '',
      imageUrl: '',
      status: 'idle',
    },
  },
  {
    id: '3',
    type: 'generation',
    position: { x: 200, y: 500 },
    data: {
      label: 'Генерация #3',
      prompt: '',
      imageUrl: '',
      status: 'idle',
    },
  },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onAddNode = useCallback(() => {
    const id = `${Date.now()}`;
    const newNode: Node<GenerationNodeData> = {
      id,
      type: 'generation',
      position: {
        x: Math.random() * 500 + 50,
        y: Math.random() * 400 + 50,
      },
      data: {
        label: `Генерация #${nodes.length + 1}`,
        prompt: '',
        imageUrl: '',
        status: 'idle',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        user={user}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onAddNode={onAddNode}
      />

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[var(--color-surface-secondary)]"
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="#d1d1d6"
          />
          <Controls
            position="bottom-right"
            showInteractive={false}
          />
        </ReactFlow>

        {/* Help Panel */}
        <HelpPanel />

        {/* Node Counter */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-white/80 backdrop-blur-xl border border-[var(--color-border)] rounded-lg shadow-sm">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            {nodes.length} {nodes.length === 1 ? 'узел' : nodes.length < 5 ? 'узла' : 'узлов'}
          </span>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
