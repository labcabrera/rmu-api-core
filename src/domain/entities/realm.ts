export interface Realm {
  id: string;
  name: string;
  description?: string;
  owner: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRealmRequest {
  id: string;
  name: string;
  description?: string;
}

export interface UpdateRealmRequest {
  name?: string;
  description?: string;
}
