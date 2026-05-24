/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: VerifyEmailRegistrationCode
// ====================================================

export interface VerifyEmailRegistrationCode_verifyEmailRegistrationCode {
  __typename: "EmailVerificationResponse";
  success: boolean;
  message: string | null;
  error: string | null;
}

export interface VerifyEmailRegistrationCode {
  verifyEmailRegistrationCode: VerifyEmailRegistrationCode_verifyEmailRegistrationCode;
}

export interface VerifyEmailRegistrationCodeVariables {
  email: string;
  code: string;
}
