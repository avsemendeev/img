export interface GenerationNodeData extends Record<string, unknown> {
  label: string;
  prompt: string;
  imageUrl: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

export interface TextNodeData extends Record<string, unknown> {
  label: string;
  text: string;
}

export interface User {
  name: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
  createdAt: number;
  updatedAt: number;
}
