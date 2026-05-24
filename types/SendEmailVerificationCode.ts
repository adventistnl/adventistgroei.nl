/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendEmailVerificationCode
// ====================================================

export interface SendEmailVerificationCode_sendEmailVerificationCode {
  __typename: "EmailVerificationResponse";
  success: boolean;
  message: string | null;
  error: string | null;
}

export interface SendEmailVerificationCode {
  sendEmailVerificationCode: SendEmailVerificationCode_sendEmailVerificationCode;
}

export interface SendEmailVerificationCodeVariables {
  email: string;
  userName?: string | null;
  language?: string | null;
}
