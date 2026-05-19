export interface ChatMessage {
  id: number;
  userId: string;
  conversationId: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCallResults: Array<{
    tool: string;
    status: string;
    result: any;
    error?: string;
    execution_time_ms?: number;
  }> | null;
}