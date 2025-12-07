import { DefaultSession } from 'next-auth';
import { RoleValue } from '@/lib/constants/roles';

export interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  permissions: string[];
  tenantId: string;
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser & DefaultSession['user'];
    accessToken?: string;
    error?: string;
  }

  interface User extends ExtendedUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: RoleValue;
    permissions: string[];
    tenantId: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
