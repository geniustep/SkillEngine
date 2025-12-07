export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  publishedCourses: number;
  totalInstructors: number;
  activeInstructors: number;
  totalSessions: number;
  upcomingSessions: number;
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  completionRate: number;
}

export interface EnrollmentTrend {
  date: string;
  count: number;
  newEnrollments: number;
  completions: number;
}

export interface CourseAnalytics {
  courseId: string;
  courseName: string;
  enrollments: number;
  completions: number;
  averageProgress: number;
  averageRating: number;
  revenue: number;
  engagementRate: number;
}

export interface StudentAnalytics {
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  completionRate: number;
  enrollmentTrend: EnrollmentTrend[];
  topCourses: CourseAnalytics[];
}

export interface RevenueAnalytics {
  total: number;
  byMonth: MonthlyRevenue[];
  byCourse: CourseRevenue[];
  growth: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  enrollments: number;
}

export interface CourseRevenue {
  courseId: string;
  courseName: string;
  revenue: number;
  enrollments: number;
}

export interface SessionAnalytics {
  totalSessions: number;
  completedSessions: number;
  averageAttendance: number;
  averageDuration: number;
  byInstructor: InstructorSessionStats[];
}

export interface InstructorSessionStats {
  instructorId: string;
  instructorName: string;
  sessionsCount: number;
  averageAttendance: number;
  rating: number;
}
