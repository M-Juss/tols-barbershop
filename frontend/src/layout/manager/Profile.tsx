"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Save, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { InputWithLabel } from "@/components/common/InputWithLabel";
import { PasswordInputWithLabel } from "@/components/common/PasswordInputWithLabel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ChangePasswordForm } from "@/forms/ChangePasswordForm";
import { useRateLimit } from "@/hooks/useRateLimit";
import {
  normalizeEmail,
  sanitizeString,
} from "@/lib/sanitizer";
import {
  changePasswordRequest,
  updateAccountInformationRequest,
} from "@/services/shared/auth.api";
import {
  accountInformationSchema,
  type AccountInformationSchemaFormValues,
  type ChangePasswordSchemaFormValues,
} from "@/validations/user.validation";

export function Profile() {
  const { user, refreshUser } = useAuth();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const profileRateLimit = useRateLimit({
    maxAttempts: 5,
    cooldownMinutes: 1,
    storageKey: "staff_profile_update_rate_limit",
  });
  const passwordRateLimit = useRateLimit({
    maxAttempts: 5,
    cooldownMinutes: 1,
    storageKey: "staff_password_update_rate_limit",
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AccountInformationSchemaFormValues>({
    resolver: zodResolver(accountInformationSchema),
    defaultValues: {
      fullname: "",
      email: "",
      contact_number: "",
      current_password: "",
    },
  });
  const email = useWatch({ control, name: "email", defaultValue: "" });
  const emailChanged =
    user !== null && normalizeEmail(email) !== normalizeEmail(user.email);

  useEffect(() => {
    if (!user) return;

    reset({
      fullname: sanitizeString(user.fullname),
      email: normalizeEmail(user.email),
      contact_number: user.contact_number ?? "",
      current_password: "",
    });
  }, [reset, user]);

  const updateInformation = async (
    data: AccountInformationSchemaFormValues,
  ) => {
    if (emailChanged && !data.current_password) {
      setError("current_password", {
        message: "Current password is required to change your email",
      });
      return;
    }

    if (!profileRateLimit.attempt()) return;

    try {
      const response = await updateAccountInformationRequest({
        fullname: sanitizeString(data.fullname),
        email: normalizeEmail(data.email),
        ...(user?.role === "manager"
          ? {}
          : { contact_number: data.contact_number }),
        ...(emailChanged
          ? { current_password: data.current_password }
          : {}),
      });

      await refreshUser();
      reset({
        fullname: sanitizeString(response.data.fullname),
        email: normalizeEmail(response.data.email),
        contact_number: response.data.contact_number ?? "",
        current_password: "",
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update profile",
      );
    }
  };

  const updatePassword = async (data: ChangePasswordSchemaFormValues) => {
    if (!passwordRateLimit.attempt()) return false;

    try {
      await changePasswordRequest(data);
      toast.success("Password updated successfully");
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update password",
      );
      return false;
    }
  };

  return (
    <div className="min-h-full bg-slate-100 p-4 font-sans sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Update your staff credentials and account security.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
          <form
            onSubmit={handleSubmit(updateInformation)}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-primary">
                <UserRound className="size-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  Account Information
                </h2>
                <p className="text-sm text-gray-500">
                  Keep your staff details up to date.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <InputWithLabel
                  id="fullname"
                  label="Full Name"
                  autoComplete="name"
                  maxLength={255}
                  aria-invalid={Boolean(errors.fullname)}
                  {...register("fullname")}
                />
                {errors.fullname && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              <div>
                <InputWithLabel
                  id="email"
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  maxLength={255}
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {user?.role !== "manager" && (
                <div>
                  <InputWithLabel
                    id="contact_number"
                    label="Contact Number"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={11}
                    placeholder="09XXXXXXXXX"
                    aria-invalid={Boolean(errors.contact_number)}
                    {...register("contact_number")}
                  />
                  {errors.contact_number && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.contact_number.message}
                    </p>
                  )}
                </div>
              )}

              {emailChanged && (
                <div className="sm:col-span-2">
                  <PasswordInputWithLabel
                    id="current_password"
                    label="Current Password"
                    placeholder="Required to change your email"
                    autoComplete="current-password"
                    maxLength={255}
                    aria-invalid={Boolean(errors.current_password)}
                    {...register("current_password")}
                  />
                  {errors.current_password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.current_password.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="size-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>

          <section className="h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <h2 className="mt-4 font-bold text-gray-900">Password</h2>
            <p className="mt-1 text-sm text-gray-500">
              Use your current password to set a new one.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-5 w-full"
              onClick={() => setChangePasswordOpen(true)}
            >
              <KeyRound className="size-4" />
              Change Password
            </Button>
          </section>
        </div>
      </div>

      <ChangePasswordForm
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSubmit={updatePassword}
      />
    </div>
  );
}
