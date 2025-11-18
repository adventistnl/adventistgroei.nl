/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendForgotPasswordCode
// ====================================================

export interface SendForgotPasswordCode_sendForgotPasswordCode {
  __typename: "ForgotPasswordResponse";
  success: boolean;
  message: string | null;
  error: string | null;
}

export interface SendForgotPasswordCode {
  sendForgotPasswordCode: SendForgotPasswordCode_sendForgotPasswordCode;
}

export interface SendForgotPasswordCodeVariables {
  email: string;
}
