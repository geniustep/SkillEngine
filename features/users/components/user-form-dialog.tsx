'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { userFormSchema, type UserFormValues } from '../schemas/users.schema';
import { useCreateUser, useUpdateUser } from '../hooks/use-user-mutations';
import type { User } from '@/lib/types/user.types';
import { useEffect } from 'react';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
}: UserFormDialogProps) {
  const isEditing = !!user;
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'student',
      status: 'active',
      bio: '',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('email', user.email);
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('phone', user.phone || '');
      setValue('role', user.role);
      setValue('status', user.status);
      setValue('bio', user.bio || '');
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const onSubmit = (data: UserFormValues) => {
    if (isEditing && user) {
      updateUser(
        { id: user.id, input: data },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
          },
        }
      );
    } else {
      createUser(data, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      });
    }
  };

  const role = watch('role');
  const status = watch('status');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'قم بتحديث معلومات المستخدم'
              : 'أضف مستخدم جديد إلى النظام'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">الاسم الأول *</Label>
              <Input
                id="firstName"
                placeholder="أدخل الاسم الأول"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">الاسم الأخير *</Label>
              <Input
                id="lastName"
                placeholder="أدخل الاسم الأخير"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@domain.com"
              {...register('email')}
              disabled={isEditing}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+966 XXX XXX XXX"
              {...register('phone')}
            />
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الدور *</Label>
              <Select value={role} onValueChange={(value) => setValue('role', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">طالب</SelectItem>
                  <SelectItem value="instructor">مدرب</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                value={status}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="suspended">موقوف</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">نبذة</Label>
            <Textarea
              id="bio"
              placeholder="نبذة عن المستخدم (اختياري)"
              rows={3}
              {...register('bio')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? 'جاري الحفظ...'
                : isEditing
                  ? 'تحديث'
                  : 'إضافة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
