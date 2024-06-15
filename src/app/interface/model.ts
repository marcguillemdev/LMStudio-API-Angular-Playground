export interface Model {
  id: string;
  object: string;
  owned_by: string;
  permission: Permission[];
}

export interface Permission { }

export interface LMStudioModels {
  data: Model[];
  object: string;
}
