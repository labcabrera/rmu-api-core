export interface RealmProps {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}
