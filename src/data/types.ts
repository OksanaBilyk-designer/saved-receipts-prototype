export type DocumentType = 'Receipt' | 'Letter of Medical Necessity';

export type Receipt = {
  id: string;
  name: string;
  type: DocumentType;
  merchant: string;
  date: string; // display string, e.g. "10/10/25"
  thumbnailColor: string;
  highlighted?: boolean;
};

export type ClaimPendingDocumentation = {
  id: string;
  providerName: string;
  serviceType: 'Medical' | 'Pharmacy' | 'Dental' | 'Vision';
  amount: string;
  date: string;
};
