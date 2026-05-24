import { useMutation, useLazyQuery } from "@apollo/client/react";
import {
  SEND_EMAIL_VERIFICATION_CODE,
  VERIFY_EMAIL_REGISTRATION_CODE,
  CHECK_EMAIL_AVAILABILITY,
} from "@/graphql/mutations/EMAIL_VERIFICATION_MUTATIONS";

interface SendEmailVerificationCodeVariables {
  email: string;
  userName?: string;
  language?: string;
}

interface SendEmailVerificationCodeResponse {
  sendEmailVerificationCode: {
    success: boolean;
    message: string | null;
    error: string | null;
  };
}

interface VerifyEmailRegistrationCodeVariables {
  email: string;
  code: string;
}

interface VerifyEmailRegistrationCodeResponse {
  verifyEmailRegistrationCode: {
    success: boolean;
    message: string | null;
    error: string | null;
  };
}

interface CheckEmailAvailabilityResponse {
  checkEmailAvailability: {
    success: boolean;
    message: string | null;
    error: string | null;
  };
}

export function useSendEmailVerificationCodeMutation() {
  return useMutation<SendEmailVerificationCodeResponse, SendEmailVerificationCodeVariables>(
    SEND_EMAIL_VERIFICATION_CODE
  );
}

export function useVerifyEmailRegistrationCodeMutation() {
  return useMutation<VerifyEmailRegistrationCodeResponse, VerifyEmailRegistrationCodeVariables>(
    VERIFY_EMAIL_REGISTRATION_CODE
  );
}

export function useCheckEmailAvailability() {
  return useLazyQuery<CheckEmailAvailabilityResponse, { email: string }>(
    CHECK_EMAIL_AVAILABILITY,
    { fetchPolicy: "network-only" }
  );
}
