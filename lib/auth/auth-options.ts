import { AuthOptions, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { Role, RoleValue } from '@/lib/constants/roles';

interface ExtendedUser {
  id: string;
  role?: RoleValue;
  permissions?: string[];
  tenantId?: string;
}

// Check if Keycloak is configured
const isKeycloakConfigured = !!(
  process.env.KEYCLOAK_URL &&
  process.env.KEYCLOAK_CLIENT_ID &&
  process.env.KEYCLOAK_CLIENT_SECRET
);

// Build providers array
const providers = [];

// Always add Credentials provider for local auth
providers.push(
  CredentialsProvider({
    id: 'credentials',
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials): Promise<User | null> {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
      }

      try {
        // Call backend API for authentication (use internal URL for server-side calls)
        const apiUrl = process.env.INTERNAL_API_URL || 'http://skillengine-api:8000/api/v1';
        console.log('Auth: Calling API at', apiUrl);
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error?.message || 'بيانات الاعتماد غير صحيحة');
        }

        // Return user data for NextAuth session
        return {
          id: data.data.user.id,
          email: data.data.user.email,
          name: `${data.data.user.firstName} ${data.data.user.lastName}`,
          role: data.data.user.role as RoleValue,
          permissions: [],
          tenantId: data.data.user.tenantId,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        } as User & { accessToken: string; refreshToken: string };
      } catch (error) {
        console.error('Auth error:', error);
        throw new Error(error instanceof Error ? error.message : 'فشل تسجيل الدخول');
      }
    },
  })
);

// Add Keycloak provider only if configured
if (isKeycloakConfigured) {
  providers.push(
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID || '',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
      issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
    })
  );
}

export const authOptions: AuthOptions = {
  providers,
  callbacks: {
    jwt({ token, user, account }): JWT {
      // Initial sign in
      if (user) {
        const extendedUser = user as ExtendedUser & {
          accessToken?: string;
          refreshToken?: string;
        };
        return {
          ...token,
          id: extendedUser.id,
          role: extendedUser.role || Role.VIEWER,
          permissions: extendedUser.permissions || [],
          tenantId: extendedUser.tenantId || '',
          accessToken: extendedUser.accessToken || account?.access_token,
          refreshToken: extendedUser.refreshToken || account?.refresh_token,
          accessTokenExpires: account?.expires_at
            ? account.expires_at * 1000
            : Date.now() + 15 * 60 * 1000, // 15 minutes default
        };
      }

      // Return previous token if the access token has not expired yet
      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      // Access token has expired, try to update it
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id || '';
        session.user.role = token.role || Role.VIEWER;
        session.user.permissions = token.permissions || [];
        session.user.tenantId = token.tenantId || '';
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
