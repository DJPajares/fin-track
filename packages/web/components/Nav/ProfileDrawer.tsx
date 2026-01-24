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
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import CustomDrawer from '../shared/CustomDrawer';

import { deleteAccount, updateProfile } from '../../services/auth';
import { useAppSelector } from '../../lib/hooks/use-redux';
import {
  logoutSuccess,
  updateUserProfile,
} from '../../lib/redux/feature/auth/authSlice';

type ProfileDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ProfileDrawer = ({ open, onOpenChange }: ProfileDrawerProps) => {
  const t = useTranslations();
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
    if (!user?.name && !user?.email) return 'U';
    const source = user?.name || user?.email || '';
    return source
      .split(/\s+/)
      .map((chunk) => chunk.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user?.email, user?.name]);

  const handleProfileSave = async () => {
    setProfileError('');
    setProfileSuccess('');

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setProfileError(t('Profile.error.passwordMismatch'));
        return;
      }

      if (!currentPassword) {
        setProfileError(t('Profile.error.currentPasswordRequired'));
        return;
      }

      if (newPassword.length < 8) {
        setProfileError(t('Profile.error.passwordTooShort'));
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
        // Dispatch the updated user to Redux to update app-wide state
        dispatch(updateUserProfile(updatedUser));
      }

      setProfileSuccess(t('Profile.success'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Close the dialog after successful save
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        t('Profile.error.generic');

      setProfileError(message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    setProfileError('');
    setProfileSuccess('');

    if (!currentPassword) {
      setProfileError(t('Profile.error.currentPasswordRequired'));
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
        t('Profile.error.deleteGeneric');

      setProfileError(message);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <CustomDrawer
      open={open}
      onOpenChange={(value) => {
        const nextOpen = typeof value === 'function' ? value(open) : value;
        onOpenChange(nextOpen);
      }}
      title={t('Profile.title')}
      description={t('Profile.description')}
      okButtonLabel={
        isUpdatingProfile ? t('Profile.saving') : t('Common.button.save')
      }
      cancelButtonLabel={t('Common.button.cancel')}
      handleSubmit={handleProfileSave}
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3 text-white shadow-sm ring-1 ring-white/10">
          <Avatar className="h-11 w-11 ring-2 ring-white/20">
            <AvatarFallback className="bg-white/10 text-sm font-semibold uppercase">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-base font-semibold">{user?.name || 'User'}</p>
            <p className="text-sm text-slate-200/80">
              {user?.email || t('Profile.email')}
            </p>
          </div>
        </div>

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

        <section className="bg-card/60 space-y-4 rounded-2xl border p-4 shadow-sm">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="profile-name">
                {t('Profile.name')}
              </FieldLabel>
              <Input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t('Profile.name')}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="profile-email">
                {t('Profile.email')}
              </FieldLabel>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('Profile.email')}
              />
            </Field>
          </FieldGroup>
        </section>

        <section className="bg-card/60 space-y-4 rounded-2xl border p-4 shadow-sm">
          <div className="space-y-1">
            <p className="text-foreground text-sm font-semibold">
              {t('Profile.newPassword')}
            </p>
            <p className="text-muted-foreground text-sm">
              {t('Profile.currentPasswordHint')}
            </p>
          </div>

          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="current-password">
                {t('Profile.currentPassword')}
              </FieldLabel>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder={t('Profile.currentPasswordPlaceholder')}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="new-password">
                {t('Profile.newPassword')}
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
                {t('Profile.confirmPassword')}
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

        <p className="text-muted-foreground text-sm leading-relaxed">
          {t('Profile.currentPasswordHint')}
        </p>

        <Separator />

        <div className="border-destructive/30 bg-destructive/5 flex flex-col gap-4 rounded-2xl border p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-destructive text-sm font-semibold">
                {t('Profile.delete.title')}
              </p>
              <p className="text-muted-foreground text-sm">
                {t('Profile.delete.description')}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  {t('Profile.delete.button')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t('Profile.delete.confirmTitle')}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('Profile.delete.confirmDescription')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t('Profile.delete.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount}
                  >
                    {isDeletingAccount
                      ? t('Profile.delete.loading')
                      : t('Profile.delete.confirmAction')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="border-destructive/40 text-destructive/80 rounded-lg border border-dashed bg-white/60 px-4 py-3 text-sm">
            {t('Profile.currentPasswordPlaceholder')}
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

export default ProfileDrawer;
