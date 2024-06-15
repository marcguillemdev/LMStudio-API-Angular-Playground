export interface LMStudioCompletionInput {
  messages: CompletionInputMessage[];
  model: string;
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  stream?: boolean;
  stop?: string | string[];
  structured?: CompletionStructuredMessage;
}

export interface CompletionStructuredMessage {
  type: string;
}

export interface CompletionInputMessage {
  role: string;
  content: string;
}
