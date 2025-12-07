import { BaseEntity } from './common.types';

export type UserRole = 'student' | 'instructor' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  bio?: string;
  lastLoginAt?: string;
  emailVerifiedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  password?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  status?: UserStatus;
}
