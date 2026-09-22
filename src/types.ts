export interface GenerationNodeData extends Record<string, unknown> {
  label: string;
  prompt: string;
  imageUrl: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

export interface User {
  name: string;
  email: string;
}
