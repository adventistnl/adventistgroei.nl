import { useMutation } from "@apollo/client/react";
import {
  SEND_FORGOT_PASSWORD_CODE,
  VERIFY_FORGOT_PASSWORD_CODE,
  RESET_PASSWORD,
} from "@/graphql/mutations/FORGOT_PASSWORD_MUTATIONS";

interface SendCodeInput {
  email: string;
}

interface SendCodeResponse {
  sendForgotPasswordCode: {
    success: boolean;
    message: string | null;
    error: string | null;
  };
}

interface VerifyCodeInput {
  email: string;
  code: string;
}

interface VerifyCodeResponse {
  verifyForgotPasswordCode: {
    success: boolean;
    message: string | null;
    error: string | null;
    resetToken: string | null;
  };
}

interface ResetPasswordInput {
  email: string;
  code: string;
  newPassword: string;
  resetToken: string;
}

interface ResetPasswordResponse {
  resetPassword: {
    success: boolean;
    message: string | null;
    error: string | null;
  };
}

export function useSendForgotPasswordCodeMutation(
  options?: useMutation.Options<SendCodeResponse, SendCodeInput>
): useMutation.ResultTuple<SendCodeResponse, SendCodeInput> {
  return useMutation<SendCodeResponse, SendCodeInput>(
    SEND_FORGOT_PASSWORD_CODE,
    options
  );
}

export function useVerifyForgotPasswordCodeMutation(
  options?: useMutation.Options<VerifyCodeResponse, VerifyCodeInput>
): useMutation.ResultTuple<VerifyCodeResponse, VerifyCodeInput> {
  return useMutation<VerifyCodeResponse, VerifyCodeInput>(
    VERIFY_FORGOT_PASSWORD_CODE,
    options
  );
}

export function useResetPasswordMutation(
  options?: useMutation.Options<ResetPasswordResponse, ResetPasswordInput>
): useMutation.ResultTuple<ResetPasswordResponse, ResetPasswordInput> {
  return useMutation<ResetPasswordResponse, ResetPasswordInput>(
    RESET_PASSWORD,
    options
  );
}
