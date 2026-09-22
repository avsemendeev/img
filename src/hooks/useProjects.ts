import { useState, useEffect, useCallback } from 'react';
import type { Project } from '../types';

const STORAGE_KEY = 'ai-canvas-projects';

function createDefaultProject(): Omit<Project, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: 'Новый проект',
    nodes: [
      {
        id: 'text-1',
        type: 'text',
        position: { x: 100, y: 200 },
        data: {
          label: 'Текст #1',
          text: '',
        },
      },
      {
        id: 'gen-1',
        type: 'generation',
        position: { x: 500, y: 150 },
        data: {
          label: 'Генерация #1',
          prompt: '',
          imageUrl: '',
          status: 'idle',
        },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'text-1',
        target: 'gen-1',
        type: 'smoothstep',
        animated: true,
      },
    ],
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProjects(parsed);
        if (parsed.length > 0) {
          setCurrentProjectId(parsed[0].id);
        }
      } else {
        const defaultProject = createDefaultProject();
        const newProject: Project = {
          ...defaultProject,
          id: `project-${Date.now()}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setProjects([newProject]);
        setCurrentProjectId(newProject.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([newProject]));
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveProjects = useCallback((updatedProjects: Project[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
    } catch (error) {
      console.error('Ошибка сохранения проектов:', error);
    }
  }, []);

  const updateCurrentProject = useCallback((nodes: any[], edges: any[]) => {
    if (!currentProjectId) return;

    setProjects((prev) => {
      const updated = prev.map((p) =>
        p.id === currentProjectId
          ? { ...p, nodes, edges, updatedAt: Date.now() }
          : p
      );
      saveProjects(updated);
      return updated;
    });
  }, [currentProjectId, saveProjects]);

  const createProject = useCallback((name: string) => {
    const newProject: Project = {
      ...createDefaultProject(),
      name,
      id: `project-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setProjects((prev) => {
      const updated = [...prev, newProject];
      saveProjects(updated);
      return updated;
    });

    setCurrentProjectId(newProject.id);
    return newProject;
  }, [saveProjects]);

  const switchProject = useCallback((projectId: string) => {
    setCurrentProjectId(projectId);
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      saveProjects(updated);

      if (projectId === currentProjectId && updated.length > 0) {
        setCurrentProjectId(updated[0].id);
      } else if (updated.length === 0) {
        const defaultProject = createDefaultProject();
        const newProject: Project = {
          ...defaultProject,
          id: `project-${Date.now()}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        saveProjects([newProject]);
        setCurrentProjectId(newProject.id);
      }

      return updated;
    });
  }, [currentProjectId, saveProjects]);

  const renameProject = useCallback((projectId: string, newName: string) => {
    setProjects((prev) => {
      const updated = prev.map((p) =>
        p.id === projectId ? { ...p, name: newName, updatedAt: Date.now() } : p
      );
      saveProjects(updated);
      return updated;
    });
  }, [saveProjects]);

  const currentProject = projects.find((p) => p.id === currentProjectId) || null;

  return {
    projects,
    currentProject,
    currentProjectId,
    isLoaded,
    updateCurrentProject,
    createProject,
    switchProject,
    deleteProject,
    renameProject,
  };
}
