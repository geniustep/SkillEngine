import { BaseEntity } from './common.types';

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';
export type TenantStatus = 'active' | 'suspended' | 'cancelled';

export interface Tenant extends BaseEntity {
  name: string;
  slug: string;
  logo?: string;
  domain?: string;
  settings: TenantSettings;
  subscription: SubscriptionTier;
  status: TenantStatus;
  ownerId: string;
  metadata?: Record<string, unknown>;
}

export interface TenantSettings {
  general: GeneralSettings;
  branding: BrandingSettings;
  integrations: IntegrationSettings;
  features: FeatureFlags;
  localization: LocalizationSettings;
  notifications: NotificationSettings;
}

export interface GeneralSettings {
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
}

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  favicon?: string;
  customCss?: string;
}

export interface IntegrationSettings {
  odoo?: OdooIntegration;
  livePlatform?: LivePlatformIntegration;
  storage?: StorageIntegration;
  email?: EmailIntegration;
  sms?: SmsIntegration;
}

export interface OdooIntegration {
  enabled: boolean;
  url: string;
  apiKey?: string;
  database?: string;
  syncEnabled: boolean;
  lastSyncAt?: string;
}

export interface LivePlatformIntegration {
  provider: 'daily' | 'bbb' | 'zoom' | 'teams';
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
}

export interface StorageIntegration {
  provider: 'minio' | 's3' | 'cloudinary';
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface EmailIntegration {
  provider: 'smtp' | 'sendgrid' | 'mailgun';
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface SmsIntegration {
  provider: 'twilio' | 'vonage';
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface FeatureFlags {
  realTime: boolean;
  analytics: boolean;
  advancedAnalytics: boolean;
  multiInstructor: boolean;
  whiteLabel: boolean;
  customDomain: boolean;
  sso: boolean;
}

export interface LocalizationSettings {
  defaultLanguage: string;
  supportedLanguages: string[];
  rtl: boolean;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
}
