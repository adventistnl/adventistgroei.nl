/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CheckEmailAvailability
// ====================================================

export interface CheckEmailAvailability_checkEmailAvailability {
  __typename: "EmailVerificationResponse";
  success: boolean;
  message: string | null;
  error: string | null;
}

export interface CheckEmailAvailability {
  checkEmailAvailability: CheckEmailAvailability_checkEmailAvailability;
}

export interface CheckEmailAvailabilityVariables {
  email: string;
}
