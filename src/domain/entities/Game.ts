export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  stat1?: string;
  stat2?: string;
  stat3?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
}

export interface CharacterSize {
  id: string;
  name: string;
  description?: string;
}

export interface ArmorType {
  id: string;
  name: string;
  description?: string;
}
