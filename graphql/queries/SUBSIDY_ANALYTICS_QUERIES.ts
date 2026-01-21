import { gql } from "@apollo/client";

export const GET_SUBSIDY_ANALYTICS = gql`
  query GetSubsidyAnalytics($institutionId: String) {
    subsidyKPIs(institutionId: $institutionId) {
      totalRequests
      pendingRequests
      inReviewRequests
      approvedRequests
      rejectedRequests
      totalRequested
      totalApproved
      approvalRate
    }

    subsidyByDepartment(institutionId: $institutionId) {
      month
      department
      amount
    }

    subsidyByMonth(institutionId: $institutionId) {
      month
      approved
      pending
      rejected
      quarter
    }

    subsidyByStatus(institutionId: $institutionId) {
      status
      count
      fill
    }
  }
`;
