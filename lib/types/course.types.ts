import { BaseEntity } from './common.types';
import { User } from './user.types';

export type CourseStatus = 'draft' | 'published' | 'archived';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course extends BaseEntity {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  status: CourseStatus;
  level: CourseLevel;
  duration: number; // in hours
  price?: number;
  instructorId: string;
  instructor?: User;
  categoryId?: string;
  category?: Category;
  modules: Module[];
  enrollmentCount?: number;
  rating?: number;
  tags?: string[];
  requirements?: string[];
  learningObjectives?: string[];
  publishedAt?: string;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
}

export interface Module extends BaseEntity {
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
  duration?: number;
}

export type LessonType = 'video' | 'document' | 'quiz' | 'live' | 'assignment';

export interface Lesson extends BaseEntity {
  moduleId: string;
  title: string;
  description?: string;
  type: LessonType;
  content?: string;
  videoUrl?: string;
  duration?: number; // in minutes
  order: number;
  isPreview?: boolean;
  resources?: Resource[];
}

export interface Resource extends BaseEntity {
  lessonId: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'file';
  url: string;
  size?: number;
}

export interface CreateCourseInput {
  title: string;
  description: string;
  shortDescription?: string;
  level: CourseLevel;
  duration: number;
  price?: number;
  instructorId: string;
  categoryId?: string;
  tags?: string[];
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  level?: CourseLevel;
  duration?: number;
  price?: number;
  categoryId?: string;
  tags?: string[];
  status?: CourseStatus;
}
