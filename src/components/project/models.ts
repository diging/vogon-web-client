export interface IText {
  id: number;
  title: string;
  added: string;
  repository_id: number;
  repository_source_id: number;
}

export interface IProject {
  id?: number;
  name: string;
  description?: string;
  created?: string;
  quadriga_id?: string;
  ownedBy?: number;
  texts?: Text[] | number[];
}
