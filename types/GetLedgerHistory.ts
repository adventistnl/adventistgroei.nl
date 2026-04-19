/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LedgerHistoryFilterInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetLedgerHistory
// ====================================================

export interface GetLedgerHistory_ledgerHistory_items {
  __typename: "LedgerHistoryEntry";
  id: string;
  date: any;
  description: string;
  amount: number;
  type: string;
  category: string;
  entityName: string | null;
  relatedEntity: string | null;
  createdBy: string | null;
}

export interface GetLedgerHistory_ledgerHistory_pageInfo {
  __typename: "LedgerHistoryPageInfo";
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetLedgerHistory_ledgerHistory {
  __typename: "LedgerHistoryPaginatedResponse";
  items: GetLedgerHistory_ledgerHistory_items[];
  totalCount: number;
  pageInfo: GetLedgerHistory_ledgerHistory_pageInfo;
}

export interface GetLedgerHistory {
  ledgerHistory: GetLedgerHistory_ledgerHistory;
}

export interface GetLedgerHistoryVariables {
  filters: LedgerHistoryFilterInput;
}
