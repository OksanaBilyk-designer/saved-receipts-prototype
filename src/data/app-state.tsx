import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { initialReceipts } from './mock-data';
import type { DocumentType, Receipt } from './types';

export type UploadDraft = {
  fileName: string;
  thumbnailColor: string;
  type: DocumentType | null;
  documentName: string;
};

type AppState = {
  receipts: Receipt[];
  uploadDraft: UploadDraft | null;
  lastSavedReceiptId: string | null;
  snackbarVisible: boolean;

  startUpload: (fileName: string, thumbnailColor: string) => void;
  updateDraftType: (type: DocumentType) => void;
  updateDraftName: (name: string) => void;
  replaceDraftFile: (fileName: string, thumbnailColor: string) => void;
  discardUpload: () => void;
  saveReceiptAndAssociate: (claimId: string | null) => void;
  dismissSnackbar: () => void;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts);
  const [uploadDraft, setUploadDraft] = useState<UploadDraft | null>(null);
  const [lastSavedReceiptId, setLastSavedReceiptId] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const startUpload = useCallback((fileName: string, thumbnailColor: string) => {
    setUploadDraft({ fileName, thumbnailColor, type: null, documentName: '' });
  }, []);

  const updateDraftType = useCallback((type: DocumentType) => {
    setUploadDraft((prev) => (prev ? { ...prev, type } : prev));
  }, []);

  const updateDraftName = useCallback((name: string) => {
    setUploadDraft((prev) => (prev ? { ...prev, documentName: name } : prev));
  }, []);

  const replaceDraftFile = useCallback((fileName: string, thumbnailColor: string) => {
    setUploadDraft((prev) => (prev ? { ...prev, fileName, thumbnailColor } : prev));
  }, []);

  const discardUpload = useCallback(() => {
    setUploadDraft(null);
  }, []);

  const saveReceiptAndAssociate = useCallback(
    (claimId: string | null) => {
      setUploadDraft((prev) => {
        if (!prev || !prev.type) return prev;

        const newReceipt: Receipt = {
          id: `r-${Date.now()}`,
          name: prev.documentName,
          type: prev.type,
          merchant: prev.documentName,
          date: new Date().toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
          }),
          thumbnailColor: prev.thumbnailColor,
          highlighted: true,
        };

        setReceipts((current) => [newReceipt, ...current.map((r) => ({ ...r, highlighted: false }))]);
        setLastSavedReceiptId(newReceipt.id);
        setSnackbarVisible(true);

        return null;
      });
      // claimId is accepted for API completeness (association is faked / not persisted elsewhere)
      void claimId;
    },
    [],
  );

  const dismissSnackbar = useCallback(() => {
    setSnackbarVisible(false);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      receipts,
      uploadDraft,
      lastSavedReceiptId,
      snackbarVisible,
      startUpload,
      updateDraftType,
      updateDraftName,
      replaceDraftFile,
      discardUpload,
      saveReceiptAndAssociate,
      dismissSnackbar,
    }),
    [
      receipts,
      uploadDraft,
      lastSavedReceiptId,
      snackbarVisible,
      startUpload,
      updateDraftType,
      updateDraftName,
      replaceDraftFile,
      discardUpload,
      saveReceiptAndAssociate,
      dismissSnackbar,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
