export interface CharacterSize {
  id: string;
  index: number;
  name: string;
  hitMultiplier: number;
}

export interface CharacterSizeCreateRequest {
  id: string;
  index: number;
  name: string;
  hitMultiplier: number;
}

export interface CharacterSizeUpdateRequest {
  index?: number;
  name?: string;
  hitMultiplier?: number;
}

export interface AttackEffects {
  hitMultiplier: number;
  criticalTypeModifier: number;
}
