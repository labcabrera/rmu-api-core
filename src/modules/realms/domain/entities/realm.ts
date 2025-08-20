export interface Realm {
  id: string;
  name: string;
  description: string | undefined;
  owner: string;
  createdAt: Date;
  updatedAt: Date | undefined;
}
