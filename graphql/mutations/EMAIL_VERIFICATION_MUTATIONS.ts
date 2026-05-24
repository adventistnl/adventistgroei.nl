import { gql } from "@apollo/client";

export const SEND_EMAIL_VERIFICATION_CODE = gql`
  mutation SendEmailVerificationCode($email: String!, $userName: String, $language: String) {
    sendEmailVerificationCode(input: { email: $email, userName: $userName, language: $language }) {
      success
      message
      error
    }
  }
`;

export const VERIFY_EMAIL_REGISTRATION_CODE = gql`
  mutation VerifyEmailRegistrationCode($email: String!, $code: String!) {
    verifyEmailRegistrationCode(input: { email: $email, code: $code }) {
      success
      message
      error
    }
  }
`;

export const CHECK_EMAIL_AVAILABILITY = gql`
  query CheckEmailAvailability($email: String!) {
    checkEmailAvailability(email: $email) {
      success
      message
      error
    }
  }
`;
