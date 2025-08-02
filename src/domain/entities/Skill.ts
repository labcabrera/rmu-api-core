export interface Skill {
  id: string;
  categoryId: string;
  bonus: string[];
  specializations: string[] | null;
}

export interface SkillCreateRequest {
  id: string;
  categoryId: string;
  bonus: string[];
  specializations: string[] | null;
}

export interface SkillUpdateRequest {
  categoryId?: string;
  bonus?: string[];
  specializations?: string[] | null;
}

export interface PaginatedSkillsResponse {
  content: Skill[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
  };
}
