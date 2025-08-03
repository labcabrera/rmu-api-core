export interface SkillCategory {
  id: string;
  bonus: string[];
}

export interface SkillCategoryCreateRequest {
  id: string;
  bonus: string[];
}

export interface SkillCategoryUpdateRequest {
  bonus?: string[];
}

export interface PaginatedSkillCategoriesResponse {
  content: SkillCategory[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
  };
}
