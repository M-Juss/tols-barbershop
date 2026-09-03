import { publicFetch, authFetch } from "@/lib/api";

export type AuthUser = {
  id: number;
  fullname: string;
  email: string;
  contact_number: string;
  role: string;
  image?: string | null;
  created_at?: string;
  permissions?: string[] | null;
};

export type LoginResponse = {
  success: boolean;
  message?: string;
  data: {
    user: AuthUser;
  };
};

export type AuthActionResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
};

type ValidateResetPasswordTokenResponse = {
  success: boolean;
  message?: string;
  data: {
    valid: boolean;
  };
};

type CurrentUserResponse = {
  success: boolean;
  message?: string;
  data: AuthUser;
};

export const loginRequest = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  return publicFetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const logoutRequest = async (pushEndpoint?: string) => {
  return authFetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
    method: "POST",
    body: pushEndpoint
      ? JSON.stringify({ push_endpoint: pushEndpoint })
      : undefined,
  });
};

export const getCurrentUserRequest = async (): Promise<CurrentUserResponse> => {
  return publicFetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
};

export const forgotPasswordRequest = async (data: {
  email: string;
}): Promise<AuthActionResponse> => {
  return publicFetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const validateResetPasswordTokenRequest = async (
  data: {
    email: string;
    token: string;
  },
  signal?: AbortSignal,
): Promise<ValidateResetPasswordTokenResponse> => {
  return publicFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reset-password/validate-token`,
    {
      method: "POST",
      body: JSON.stringify(data),
      signal,
      cache: "no-store",
      referrerPolicy: "no-referrer",
    },
  );
};

export const resetPasswordRequest = async (data: {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthActionResponse> => {
  return publicFetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
    referrerPolicy: "no-referrer",
  });
};
