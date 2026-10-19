import type { Claim, ClaimPendingDocumentation, Expense, Receipt } from './types';

/**
 * Realistic seed data for the Saved Receipts prototype. No backend involved.
 *
 * Six Saved_Receipts populate the Select_Saved_Receipt_Page grid/list. They
 * reuse the receipt photos already bundled in assets/figma/folders (no new
 * image files): the Amazon One Medical letter, and the Giant Rx pharmacy
 * receipts in their various crops. r-1 stays first (it's the one the rest of
 * the flow references as the Dental LMN).
 */
export const initialReceipts: Receipt[] = [
  {
    id: 'r-1',
    name: 'Dental 2025_LMN.pdf',
    type: 'Letter of Medical Necessity',
    merchant: 'Bright Smile Dental',
    date: '10/10/25',
    dateRange: '10/10/25 - 10/12/25',
    thumbnailColor: '#f3f2f9',
    image: require('@/assets/figma/folders/receipt-thumb.jpeg'),
  },
  {
    id: 'r-2',
    name: '2026_Receipt.pdf',
    type: 'Receipt',
    merchant: 'Taller Drugs',
    date: '10/10/25',
    dateRange: '10/10/25 - 10/12/25',
    thumbnailColor: '#f2f8f9',
    image: require('@/assets/figma/folders/receipt-3.jpeg'),
  },
  {
    id: 'r-3',
    name: 'Amazon_Receipt.pdf',
    type: 'Receipt',
    merchant: 'Amazon One Medical',
    date: '10/10/25',
    dateRange: '10/10/25 - 10/12/25',
    thumbnailColor: '#ffffff',
    image: require('@/assets/figma/folders/receipt-1.jpeg'),
  },
  {
    id: 'r-4',
    name: 'Pharmacy_Receipt.pdf',
    type: 'Receipt',
    merchant: 'Giant Rx',
    date: '10/10/25',
    dateRange: '10/10/25 - 10/12/25',
    thumbnailColor: '#f2f8f9',
    image: require('@/assets/figma/folders/receipt-2.jpeg'),
  },
  {
    id: 'r-5',
    name: 'Vision_Receipt.pdf',
    type: 'Receipt',
    merchant: 'Giant Rx',
    date: '10/10/25',
    dateRange: '10/10/25 - 10/12/25',
    thumbnailColor: '#f2f8f9',
    image: require('@/assets/figma/folders/receipt-thumb.jpeg'),
  },
  {
    id: 'r-6',
    name: 'Medical_Receipt.pdf',
    type: 'Receipt',
    merchant: 'Amazon One Medical',
    date: '10/10/25',
    dateRange: '10/10/25 - 10/12/25',
    thumbnailColor: '#ffffff',
    image: require('@/assets/figma/folders/receipt-1.jpeg'),
  },
];

export const claimsPendingDocumentation: ClaimPendingDocumentation[] = [
  {
    id: 'c-1',
    providerName: 'Dr. Sage Alder',
    serviceType: 'Medical',
    amount: '$150.00',
    date: '04/01/26',
  },
  {
    id: 'c-2',
    providerName: 'Metro Pharmacy',
    serviceType: 'Pharmacy',
    amount: '$42.50',
    date: '03/28/26',
  },
  {
    id: 'c-3',
    providerName: 'Bright Smile Dental',
    serviceType: 'Dental',
    amount: '$320.00',
    date: '03/15/26',
  },
  {
    id: 'c-4',
    providerName: 'ClearView Vision Center',
    serviceType: 'Vision',
    amount: '$95.00',
    date: '02/27/26',
  },
];

/**
 * Home_Page Expenses_List. Ordered as shown in the Figma Home design
 * (node 889:5496): the Dental entry is the Claim_Needing_Documentation and
 * carries the Action_Required_Indicator.
 */
export const initialExpenses: Expense[] = [
  {
    id: 'e-1',
    label: 'Dental',
    amount: '$199.00',
    date: 'April 14',
    month: 'April',
    category: 'Dental',
    tile: 'dental',
    claimId: 'claim-1',
  },
  {
    id: 'e-2',
    label: 'Other',
    amount: '$10.00',
    date: 'April 1',
    month: 'April',
    category: 'Other',
    tile: 'other',
    claimId: 'claim-2',
  },
  {
    id: 'e-3',
    label: 'Transfer of as...',
    amount: '$89.00',
    date: 'April 1',
    month: 'April',
    category: 'Transfer',
    tile: 'transfer',
    claimId: 'claim-3',
  },
];

/**
 * Claims backing the Expenses_List. Only claim-1 (Dental, Dr. van Nostrand)
 * is a Claim_Needing_Documentation — matching the "Needs help" Activity
 * Details design (node 889:5359). The others are already Processing, so they
 * have no documentation request.
 */
export const initialClaims: Claim[] = [
  {
    id: 'claim-1',
    providerName: 'Dr. van Nostrand',
    dependantName: 'Linda Smith',
    dependantRelationship: '(Spouse, 45 years)',
    category: 'Dental',
    referenceNumber: '#1233-2353-53',
    paidAmount: '$199.00',
    requestedAmount: '$199.00',
    approvedAmount: '$199.00',
    serviceDate: '10/07/20',
    serviceProvided: 'Dental',
    invoice: '1234141',
    paymentTag: 'Reimburse Me',
    paidAmountLabel: 'Paid amount',
    requestedAmountLabel: 'Requested amount',
    serviceDateLabel: 'Service date',
    status: 'needs-documentation',
    requestFirstName: 'Michelle',
    trackerDate: 'Mar 2',
    activityDate: '2 March 2025',
  },
  {
    id: 'claim-2',
    providerName: 'Walgreens',
    dependantName: 'Michelle Smith',
    dependantRelationship: '(Self)',
    category: 'Other',
    referenceNumber: '#1233-2353-61',
    paidAmount: '$10.00',
    requestedAmount: '$10.00',
    approvedAmount: '$10.00',
    serviceDate: '04/01/26',
    serviceProvided: 'Other',
    invoice: '1234201',
    paymentTag: 'Card Swipe',
    paidAmountLabel: 'Paid amount',
    requestedAmountLabel: 'Card swiped amount',
    serviceDateLabel: 'Card swipe date',
    status: 'processing',
    requestFirstName: 'Michelle',
    trackerDate: 'Mar 2',
    activityDate: '2 March 2025',
  },
  {
    id: 'claim-3',
    providerName: 'HSA Transfer',
    dependantName: 'Michelle Smith',
    dependantRelationship: '(Self)',
    category: 'Transfer',
    referenceNumber: '#1233-2353-74',
    paidAmount: '$89.00',
    requestedAmount: '$89.00',
    approvedAmount: '$89.00',
    serviceDate: '04/01/26',
    serviceProvided: 'Transfer of assets',
    invoice: '1234233',
    paymentTag: 'Card Swipe',
    paidAmountLabel: 'Paid amount',
    requestedAmountLabel: 'Card swiped amount',
    serviceDateLabel: 'Card swipe date',
    status: 'processing',
    requestFirstName: 'Michelle',
    trackerDate: 'Mar 2',
    activityDate: '2 March 2025',
  },
];

export type GalleryPhoto = {
  id: string;
  label: string;
  sizeLabel: string;
  color: string;
  /** Realistic photo (require(...) source) shown in the picker grid. */
  image: number;
  /**
   * When true, show the whole image (contain, white bg) rather than cropping —
   * used for the Amazon receipt so the full receipt is visible.
   */
  contain?: boolean;
};

/**
 * Gallery Picker photos: one Amazon receipt (shown uncropped) plus two personal
 * photos (a dog and a mountain). No other receipts/documents.
 */
export const galleryPhotos: GalleryPhoto[] = [
  {
    id: 'p-1',
    label: 'Receipt 1',
    sizeLabel: '2.4 MB',
    color: '#ffffff',
    image: require('@/assets/figma/folders/receipt-1.jpeg'),
    contain: true,
  },
  {
    id: 'p-2',
    label: 'IMG_0912',
    sizeLabel: '3.1 MB',
    color: '#d8f2e4',
    image: require('@/assets/figma/folders/photo-dog.webp'),
  },
  {
    id: 'p-3',
    label: 'IMG_0913',
    sizeLabel: '2.9 MB',
    color: '#cdefff',
    image: require('@/assets/figma/folders/photo-mountain.jpg'),
  },
];
