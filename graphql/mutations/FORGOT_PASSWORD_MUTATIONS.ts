import { gql } from "@apollo/client";

export const SEND_FORGOT_PASSWORD_CODE = gql`
  mutation SendForgotPasswordCode($email: String!) {
    sendForgotPasswordCode(input: { email: $email }) {
      success
      message
      error
    }
  }
`;

export const VERIFY_FORGOT_PASSWORD_CODE = gql`
  mutation VerifyForgotPasswordCode($email: String!, $code: String!) {
    verifyForgotPasswordCode(input: { email: $email, code: $code }) {
      success
      message
      error
      resetToken
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword(
    $email: String!
    $code: String!
    $newPassword: String!
    $resetToken: String!
  ) {
    resetPassword(
      input: {
        email: $email
        code: $code
        newPassword: $newPassword
        resetToken: $resetToken
      }
    ) {
      success
      message
      error
    }
  }
`;
