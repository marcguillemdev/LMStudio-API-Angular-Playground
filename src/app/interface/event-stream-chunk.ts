
export interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
}

export interface Choice {
  index: number;
  delta: Message
  finish_reason: string | null;
}

export interface Message {
  role: string;
  content: string;
}
