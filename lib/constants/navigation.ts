import {
  LayoutDashboard,
  Users,
  BookOpen,
  Video,
  GraduationCap,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  Activity,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';
import { routes } from './routes';
import { Permission } from './permissions';

export interface NavItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  permission?: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: routes.dashboard,
    icon: LayoutDashboard,
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    permission: Permission.ANALYTICS_VIEW,
    children: [
      {
        title: 'Overview',
        href: routes.analytics.root,
      },
      {
        title: 'Students',
        href: routes.analytics.students,
      },
      {
        title: 'Courses',
        href: routes.analytics.courses,
      },
      {
        title: 'Revenue',
        href: routes.analytics.revenue,
      },
      {
        title: 'Live Sessions',
        href: routes.analytics.live,
      },
    ],
  },
  {
    title: 'Users',
    href: routes.users.root,
    icon: Users,
    permission: Permission.USERS_VIEW,
  },
  {
    title: 'Courses',
    href: routes.courses.root,
    icon: BookOpen,
    permission: Permission.COURSES_VIEW,
  },
  {
    title: 'Sessions',
    href: routes.sessions.root,
    icon: Video,
    permission: Permission.SESSIONS_VIEW,
  },
  {
    title: 'Instructors',
    href: routes.instructors.root,
    icon: GraduationCap,
    permission: Permission.INSTRUCTORS_VIEW,
  },
  {
    title: 'Content',
    icon: FileText,
    permission: Permission.CONTENT_VIEW,
    children: [
      {
        title: 'Videos',
        href: routes.content.videos,
      },
      {
        title: 'Documents',
        href: routes.content.documents,
      },
      {
        title: 'Quizzes',
        href: routes.content.quizzes,
      },
      {
        title: 'Library',
        href: routes.content.library,
      },
    ],
  },
  {
    title: 'Communications',
    icon: MessageSquare,
    children: [
      {
        title: 'Announcements',
        href: routes.communications.announcements,
      },
      {
        title: 'Notifications',
        href: routes.communications.notifications,
      },
      {
        title: 'Email Campaigns',
        href: routes.communications.emailCampaigns,
      },
      {
        title: 'Templates',
        href: routes.communications.templates,
      },
    ],
  },
  {
    title: 'Reports',
    href: routes.reports.root,
    icon: BarChart3,
    permission: Permission.REPORTS_VIEW,
  },
  {
    title: 'Settings',
    href: routes.settings.root,
    icon: Settings,
    permission: Permission.SETTINGS_VIEW,
  },
  {
    title: 'System',
    icon: Activity,
    permission: Permission.SYSTEM_HEALTH,
    children: [
      {
        title: 'Health',
        href: routes.system.health,
      },
      {
        title: 'Logs',
        href: routes.system.logs,
      },
      {
        title: 'Audit',
        href: routes.system.audit,
      },
      {
        title: 'Backups',
        href: routes.system.backups,
      },
      {
        title: 'Maintenance',
        href: routes.system.maintenance,
      },
    ],
  },
  {
    title: 'Support',
    icon: HelpCircle,
    children: [
      {
        title: 'Tickets',
        href: routes.support.tickets,
      },
      {
        title: 'FAQ',
        href: routes.support.faq,
      },
      {
        title: 'Documentation',
        href: routes.support.documentation,
      },
    ],
  },
];
