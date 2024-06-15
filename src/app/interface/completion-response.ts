
export interface LMStudioCompletionResponse {
  choices: LMStudioCompletionChoice[];
  created: number;
  id: string;
  model: string;
  object: string;
  owner: string;
  usage: LMStudioCompletionUsage;
}

export interface LMStudioCompletionUsage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}

export interface LMStudioCompletionChoice {
  finish_reason: string;
  index: number;
  message: LMStudioCompletionChoiceMessage;
}

export interface LMStudioCompletionChoiceMessage {
  content: string;
  role: string;
}
