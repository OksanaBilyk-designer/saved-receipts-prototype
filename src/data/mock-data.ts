import type { ClaimPendingDocumentation, Receipt } from './types';

/** Realistic seed data for the Saved Receipts prototype. No backend involved. */
export const initialReceipts: Receipt[] = [
  {
    id: 'r-1',
    name: 'CVS Pharmacy_Receipt.jpg',
    type: 'Receipt',
    merchant: 'CVS Pharmacy',
    date: '10/02/26',
    thumbnailColor: '#f2f8f9',
  },
  {
    id: 'r-2',
    name: 'Dental 2025_LMN.pdf',
    type: 'Letter of Medical Necessity',
    merchant: 'Bright Smile Dental',
    date: '09/21/26',
    thumbnailColor: '#f3f2f9',
  },
  {
    id: 'r-3',
    name: 'Walgreens_Receipt.jpg',
    type: 'Receipt',
    merchant: 'Walgreens',
    date: '09/14/26',
    thumbnailColor: '#f2f8f9',
  },
  {
    id: 'r-4',
    name: 'Vision Center_Receipt.pdf',
    type: 'Receipt',
    merchant: 'ClearView Vision Center',
    date: '08/30/26',
    thumbnailColor: '#f2f8f9',
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

export type GalleryPhoto = {
  id: string;
  label: string;
  sizeLabel: string;
  color: string;
};

/** Fake gallery photos shown in the Gallery Picker. */
export const galleryPhotos: GalleryPhoto[] = [
  { id: 'p-1', label: 'Receipt 1', sizeLabel: '2.4 MB', color: '#dbe4ff' },
  { id: 'p-2', label: 'Receipt 2', sizeLabel: '1.8 MB', color: '#ffe3d1' },
  { id: 'p-3', label: 'IMG_0912', sizeLabel: '3.1 MB', color: '#d8f2e4' },
  { id: 'p-4', label: 'IMG_0913', sizeLabel: '2.9 MB', color: '#fde2e4' },
  { id: 'p-5', label: 'Pharmacy receipt', sizeLabel: '1.2 MB', color: '#e4d8f2' },
  { id: 'p-6', label: 'IMG_0920', sizeLabel: '2.2 MB', color: '#fff3cd' },
  { id: 'p-7', label: 'IMG_0921', sizeLabel: '1.9 MB', color: '#cdefff' },
  { id: 'p-8', label: 'Dental invoice', sizeLabel: '2.6 MB', color: '#e8f0fe' },
  { id: 'p-9', label: 'IMG_0930', sizeLabel: '3.4 MB', color: '#f2f8f9' },
];
