export interface LMStudioCompletionStreamResponse {
  data: LMStudioCompletionStreamResponseData;
}

export interface LMStudioCompletionStreamResponseData {
  id: string;
  object: string;
  model: string;
  created: number;
  choices: LMStudioCompletionStreamChoice[];
}

export interface LMStudioCompletionStreamChoice {
  finish_reason: string;
  index: number;
  delta: LMStudioCompletionChoiceMessage;
}

export interface LMStudioCompletionChoiceMessage {
  content: string;
  role: string;
}
