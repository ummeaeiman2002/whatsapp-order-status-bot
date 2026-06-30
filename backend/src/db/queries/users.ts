import { getStore } from '../client';
import { User } from '../../types';

export function getUserById(id: string): User | undefined {
  return getStore().users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getStore().users.find((u) => u.email === email);
}

export function getAllUsers(): User[] {
  return [...getStore().users];
}
