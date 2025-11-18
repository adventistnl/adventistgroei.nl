/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: VerifyForgotPasswordCode
// ====================================================

export interface VerifyForgotPasswordCode_verifyForgotPasswordCode {
  __typename: "ForgotPasswordResponse";
  success: boolean;
  message: string | null;
  error: string | null;
  resetToken: string | null;
}

export interface VerifyForgotPasswordCode {
  verifyForgotPasswordCode: VerifyForgotPasswordCode_verifyForgotPasswordCode;
}

export interface VerifyForgotPasswordCodeVariables {
  email: string;
  code: string;
}
