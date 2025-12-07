import { z } from 'zod';

export const userFormSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  firstName: z.string().min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل'),
  lastName: z.string().min(2, 'الاسم الأخير يجب أن يكون حرفين على الأقل'),
  phone: z.string().optional(),
  role: z.enum(['student', 'instructor', 'admin'], {
    required_error: 'يرجى اختيار دور المستخدم',
  }),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  bio: z.string().optional(),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل').optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
