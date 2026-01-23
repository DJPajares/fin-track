'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useTranslations } from 'next-intl';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';

import { deleteAccount, updateProfile } from '../../services/auth';
import { useAppSelector } from '../../lib/hooks/use-redux';
import {
  logoutSuccess,
  updateUserProfile,
} from '../../lib/redux/feature/auth/authSlice';

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  const t = useTranslations('Profile');
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (open) {
      setName(user?.name || '');
      setEmail(user?.email || '');
    } else {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setProfileError('');
      setProfileSuccess('');
    }
  }, [open, user?.email, user?.name]);

  const initials = useMemo(() => {
    if (!name && !email) return 'U';
    const source = name || email || '';
    return source
      .split(/\s+/)
      .map((chunk) => chunk.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [name, email]);

  const handleProfileSave = async () => {
    setProfileError('');
    setProfileSuccess('');

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setProfileError(t('error.passwordMismatch'));
        return;
      }

      if (!currentPassword) {
        setProfileError(t('error.currentPasswordRequired'));
        return;
      }

      if (newPassword.length < 8) {
        setProfileError(t('error.passwordTooShort'));
        return;
      }
    }

    setIsUpdatingProfile(true);

    try {
      const updatedUser = await updateProfile({
        name: name?.trim() || '',
        email: email?.trim(),
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      if (updatedUser) {
        dispatch(updateUserProfile(updatedUser));
      }

      setProfileSuccess(t('success'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        t('error.generic');

      setProfileError(message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    setProfileError('');
    setProfileSuccess('');

    if (!currentPassword) {
      setProfileError(t('error.currentPasswordRequired'));
      onOpenChange(true);
      return;
    }

    setIsDeletingAccount(true);

    try {
      await deleteAccount({ currentPassword });
      dispatch(logoutSuccess());
      router.push('/auth');
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        t('error.deleteGeneric');

      setProfileError(message);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh] w-full max-w-[90vw] overflow-y-auto border-0 p-0 shadow-2xl sm:max-w-2xl"
      >
        <div className="bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-5 text-slate-50 sm:p-6">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {t('title')}
            </DialogTitle>
            <DialogDescription className="text-slate-200/80">
              {t('description')}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10 sm:mt-6 sm:p-4">
            <Avatar className="h-11 w-11 ring-2 ring-white/20">
              <AvatarFallback className="bg-white/10 text-sm font-semibold text-white uppercase">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-base font-semibold text-white">
                {user?.name || 'User'}
              </p>
              <p className="text-sm text-slate-200/80">
                {user?.email || t('email')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background space-y-6 p-4 sm:p-6 md:p-8">
          {profileError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {profileError}
            </div>
          )}

          {profileSuccess && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              {profileSuccess}
            </div>
          )}

          <div className="grid gap-4 sm:gap-6 md:grid-cols-[1.15fr_0.85fr]">
            <section className="bg-card/60 rounded-2xl border p-4 shadow-sm sm:p-5">
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="profile-name">{t('name')}</FieldLabel>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={t('name')}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="profile-email">{t('email')}</FieldLabel>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t('email')}
                  />
                </Field>
              </FieldGroup>
            </section>

            <section className="bg-card/60 rounded-2xl border p-4 shadow-sm sm:p-5">
              <div className="mb-4 space-y-1">
                <p className="text-foreground text-sm font-semibold">
                  {t('newPassword')}
                </p>
                <p className="text-muted-foreground text-sm">
                  {t('currentPasswordHint')}
                </p>
              </div>

              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="current-password">
                    {t('currentPassword')}
                  </FieldLabel>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder={t('currentPasswordPlaceholder')}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="new-password">
                    {t('newPassword')}
                  </FieldLabel>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    {t('confirmPassword')}
                  </FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </Field>
              </FieldGroup>
            </section>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-muted-foreground text-sm leading-relaxed">
              {t('currentPasswordHint')}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                {t('cancel')}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={isUpdatingProfile}
                    className="w-full sm:w-auto"
                  >
                    {isUpdatingProfile ? t('saving') : t('save')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('saveConfirmTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('saveConfirmDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleProfileSave}
                      disabled={isUpdatingProfile}
                    >
                      {isUpdatingProfile ? t('saving') : t('saveConfirmAction')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <Separator />

          <div className="border-destructive/30 bg-destructive/5 flex flex-col gap-4 rounded-2xl border p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-destructive text-sm font-semibold">
                  {t('delete.title')}
                </p>
                <p className="text-muted-foreground text-sm">
                  {t('delete.description')}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    {t('delete.button')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t('delete.confirmTitle')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('delete.confirmDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('delete.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                    >
                      {isDeletingAccount
                        ? t('delete.loading')
                        : t('delete.confirmAction')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="border-destructive/40 text-destructive/80 rounded-lg border border-dashed bg-white/60 px-4 py-3 text-sm">
              {t('currentPasswordPlaceholder')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
