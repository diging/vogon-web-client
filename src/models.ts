import Vue from 'vue';

export type VForm = Vue & { validate: () => boolean; };

export interface IPaginatedResult<T> {
  count: number;
  next?: number;
  previous?: number;
  results: T[];
}

export interface IUser {
  id: number;
  username: string;
}
