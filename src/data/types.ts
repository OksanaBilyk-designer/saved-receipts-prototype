export type DocumentType = 'Receipt' | 'Letter of Medical Necessity';

export type Receipt = {
  id: string;
  name: string;
  type: DocumentType;
  merchant: string;
  date: string; // display string, e.g. "10/10/25"
  /** Optional date range shown under the name, e.g. "10/10/25 - 10/12/25". */
  dateRange?: string;
  /** Fallback tint (kept for backward compat / newly uploaded receipts). */
  thumbnailColor: string;
  /** Realistic receipt photo (require(...) source) shown as the thumbnail. */
  image?: number;
  highlighted?: boolean;
  /**
   * Ids of the Claim_Pending_Documentation records this receipt is associated
   * with (via the Associate With Claim screen). Empty/undefined when the
   * receipt is saved without associating it to any claim. The Saved Receipts
   * list shows a "Claims: N" badge based on this count.
   */
  associatedClaimIds?: string[];
};

export type ClaimPendingDocumentation = {
  id: string;
  providerName: string;
  serviceType: 'Medical' | 'Pharmacy' | 'Dental' | 'Vision';
  amount: string;
  date: string;
};

export type ServiceCategory = 'Medical' | 'Pharmacy' | 'Dental' | 'Vision' | 'Other' | 'Transfer';

/**
 * Visual treatment for an Expense_Entry's category tile, taken from the Figma
 * "Mobile Transaction Cards" (node 889:5544): a tile background color + which
 * exported glyph to render.
 */
export type ExpenseTile = 'dental' | 'other' | 'transfer';

/**
 * An Expense_Entry on the Home_Page. Each entry is backed by a Claim; the
 * `claimId` links to the claim detail shown on the Activity_Details_Page.
 */
export type Expense = {
  id: string;
  label: string;
  amount: string;
  date: string; // display string, e.g. "April 14"
  month: string; // group header, e.g. "April"
  category: ServiceCategory;
  /** Category tile style matching the Figma transaction card. */
  tile: ExpenseTile;
  claimId: string;
};

export type ClaimStatus = 'needs-documentation' | 'processing';

/**
 * A Claim shown on the Activity_Details_Page. While `status` is
 * 'needs-documentation' it is a Claim_Needing_Documentation (orange "Action
 * Required" on Home, "Needs help" tracker). After a document is attached it
 * becomes 'processing'.
 */
export type Claim = {
  id: string;
  providerName: string;
  dependantName: string; // e.g. "Linda Smith"
  dependantRelationship: string; // e.g. "(Spouse, 45 years)"
  category: ServiceCategory;
  referenceNumber: string;
  paidAmount: string;
  requestedAmount: string;
  approvedAmount: string;
  serviceDate: string;
  serviceProvided: string;
  invoice: string;
  /** Payment method tag shown on the claim card. Flips when the claim processes. */
  paymentTag: string;
  /** Label for the hero amount row — changes with payment method. */
  paidAmountLabel: string;
  requestedAmountLabel: string;
  serviceDateLabel: string;
  status: ClaimStatus;
  /** The documentation request message addressed to the user. */
  requestFirstName: string;
  trackerDate: string; // e.g. "Mar 2"
  activityDate: string; // e.g. "2 March 2025"
  /**
   * The representative receipt id attached to this claim (the first one), kept
   * for backward compatibility with consumers that expect a single id.
   */
  attachedReceiptId?: string;
  /** All receipt ids attached to this claim (Activity Details shows each). */
  attachedReceiptIds?: string[];
};
