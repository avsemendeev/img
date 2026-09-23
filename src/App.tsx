import { useCallback, useState, useEffect } from 'react';
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
import { TextNode } from './components/TextNode';
import { CustomEdge } from './components/CustomEdge';
import { TopBar } from './components/TopBar';
import { AuthScreen } from './components/AuthScreen';
import { HelpPanel } from './components/HelpPanel';
import { useProjects } from './hooks/useProjects';
import { useAuth } from './hooks/useAuth';

const nodeTypes = {
  generation: GenerationNode,
  text: TextNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export default function App() {
  const {
    projects,
    currentProject,
    currentProjectId,
    isLoaded,
    updateCurrentProject,
    createProject,
    switchProject,
    deleteProject,
    renameProject,
  } = useProjects();

  const { user, isLoading: isAuthLoading, error: authError, login, logout } = useAuth();

  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [saveTimeout, setSaveTimeout] = useState<any>(null);

  // Load current project data
  useEffect(() => {
    if (currentProject && isLoaded) {
      setNodes(currentProject.nodes || []);
      setEdges(currentProject.edges || []);
    }
  }, [currentProjectId, isLoaded]);

  // Auto-save with debounce
  const scheduleSave = useCallback(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    const timeout = setTimeout(() => {
      updateCurrentProject(nodes, edges);
    }, 500);
    setSaveTimeout(timeout);
  }, [nodes, edges, updateCurrentProject, saveTimeout]);

  // Save on any changes
  useEffect(() => {
    if (isLoaded && currentProjectId) {
      scheduleSave();
    }
  }, [nodes, edges, isLoaded, currentProjectId]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'custom' }, eds)),
    [setEdges]
  );



  const onAddNode = useCallback((type: 'text' | 'generation') => {
    const id = `${type}-${Date.now()}`;
    const nodeDataObj = type === 'text'
      ? {
          label: `Текст #${nodes.filter((n) => n.type === 'text').length + 1}`,
          text: '',
        }
      : {
          label: `Генерация #${nodes.filter((n) => n.type === 'generation').length + 1}`,
          prompt: '',
          imageUrl: '',
          status: 'idle',
        };
    
    const newNode = {
      id,
      type,
      position: {
        x: Math.random() * 500 + 50,
        y: Math.random() * 400 + 50,
      },
       nodeDataObj,
    } as unknown as Node;
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);

  // Загрузка авторизации
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--color-surface-secondary)]">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-indigo-500 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Не авторизован — показываем экран входа
  if (!user) {
    return <AuthScreen isLoading={isAuthLoading} error={authError} />;
  }

  // Загрузка проектов
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--color-surface-secondary)]">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-indigo-500 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Авторизован — показываем канвас
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        user={user}
        projects={projects}
        currentProjectId={currentProjectId}
        onLogout={logout}
        onAddNode={onAddNode}
        onSwitchProject={switchProject}
        onCreateProject={createProject}
        onDeleteProject={deleteProject}
        onRenameProject={renameProject}
      />

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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
    </div>
  );
}
