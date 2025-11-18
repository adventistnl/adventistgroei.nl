/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetEntityDistribution
// ====================================================

export interface GetEntityDistribution_entityDistribution {
  __typename: "EntityDistribution";
  name: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface GetEntityDistribution {
  entityDistribution: GetEntityDistribution_entityDistribution[];
}

export interface GetEntityDistributionVariables {
  year: number;
}
