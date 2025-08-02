export interface ArmorType {
  id: number;
  name: string;
}

export interface ArmorTypeCreateRequest {
  name: string;
}

export interface ArmorTypeUpdateRequest {
  name?: string;
}
