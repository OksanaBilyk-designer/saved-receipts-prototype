import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { initialClaims, initialExpenses, initialReceipts } from './mock-data';
import type { Claim, DocumentType, Expense, Receipt } from './types';

export type UploadDraft = {
  fileName: string;
  thumbnailColor: string;
  /** The selected photo (require(...) source) shown in the preview + strip. */
  image?: number;
  type: DocumentType | null;
  documentName: string;
};

type AppState = {
  receipts: Receipt[];
  /** Home_Page Expenses_List. */
  expenses: Expense[];
  /** Claims backing the Expenses_List, keyed via Expense.claimId. */
  claims: Claim[];
  uploadDraft: UploadDraft | null;
  lastSavedReceiptId: string | null;
  snackbarVisible: boolean;

  /** Look up a Claim by its id (used by the Activity_Details_Page). */
  getClaimById: (claimId: string) => Claim | undefined;

  /**
   * The claim id that should show the "Document added…" Confirmation_Snackbar
   * on the Activity_Details_Page after a successful attach (Req 8.3), or null.
   */
  attachConfirmationClaimId: string | null;
  /**
   * Attach one or more Saved_Receipts to a Claim (Req 7): records the attached
   * receipt(s), flips the claim out of needs-documentation to processing, and
   * arms the confirmation snackbar for that claim. The first id is kept as the
   * representative attachedReceiptId shown on the Activity_Details_Page.
   * Returns true on success.
   */
  attachReceiptsToClaim: (claimId: string, receiptIds: string[]) => boolean;
  /** Clear the attach confirmation snackbar flag once shown. */
  dismissAttachConfirmation: () => void;

  /**
   * Associate an existing Saved_Receipt with a Claim_Pending_Documentation
   * from the Receipt Details screen. Records the claim id on the receipt so
   * the details screen can show the linked claim. Returns true on success.
   */
  associateClaimWithReceipt: (receiptId: string, claimId: string) => boolean;

  /** The Selected_Documents on the Select_Saved_Receipt_Page (receipt ids). */
  selectedReceiptIds: string[];
  /** Toggle a receipt's membership in the selection (checkbox / preview). */
  toggleReceiptSelected: (receiptId: string) => void;
  /** True if the given receipt is currently selected. */
  isReceiptSelected: (receiptId: string) => boolean;
  /** Clear the whole selection (the header "Clear" action / Close). */
  clearSelectedReceipts: () => void;

  startUpload: (fileName: string, thumbnailColor: string, image?: number) => void;
  updateDraftType: (type: DocumentType) => void;
  updateDraftName: (name: string) => void;
  replaceDraftFile: (fileName: string, thumbnailColor: string, image?: number) => void;
  discardUpload: () => void;
  saveReceiptAndAssociate: (claimId: string | null) => void;
  dismissSnackbar: () => void;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts);
  const [expenses] = useState<Expense[]>(initialExpenses);
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [attachConfirmationClaimId, setAttachConfirmationClaimId] = useState<string | null>(null);
  const [selectedReceiptIds, setSelectedReceiptIds] = useState<string[]>([]);
  const [uploadDraft, setUploadDraft] = useState<UploadDraft | null>(null);
  const [lastSavedReceiptId, setLastSavedReceiptId] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const startUpload = useCallback((fileName: string, thumbnailColor: string, image?: number) => {
    // Type defaults to "Receipt" (the common case); the user can switch it.
    setUploadDraft({ fileName, thumbnailColor, image, type: 'Receipt', documentName: '' });
  }, []);

  const updateDraftType = useCallback((type: DocumentType) => {
    setUploadDraft((prev) => (prev ? { ...prev, type } : prev));
  }, []);

  const updateDraftName = useCallback((name: string) => {
    setUploadDraft((prev) => (prev ? { ...prev, documentName: name } : prev));
  }, []);

  const replaceDraftFile = useCallback(
    (fileName: string, thumbnailColor: string, image?: number) => {
      setUploadDraft((prev) => (prev ? { ...prev, fileName, thumbnailColor, image } : prev));
    },
    [],
  );

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
          image: prev.image,
          highlighted: true,
          // Record the association when a claim was selected (optional). This is
          // the real link: the saved receipt remembers its claim. A null claimId
          // means the receipt is saved without being associated to any claim.
          associatedClaimIds: claimId ? [claimId] : [],
        };

        setReceipts((current) => [newReceipt, ...current.map((r) => ({ ...r, highlighted: false }))]);
        setLastSavedReceiptId(newReceipt.id);
        setSnackbarVisible(true);

        return null;
      });
    },
    [],
  );

  const dismissSnackbar = useCallback(() => {
    setSnackbarVisible(false);
  }, []);

  const getClaimById = useCallback(
    (claimId: string) => claims.find((c) => c.id === claimId),
    [claims],
  );

  const toggleReceiptSelected = useCallback((receiptId: string) => {
    setSelectedReceiptIds((current) =>
      current.includes(receiptId)
        ? current.filter((id) => id !== receiptId)
        : [...current, receiptId],
    );
  }, []);

  const isReceiptSelected = useCallback(
    (receiptId: string) => selectedReceiptIds.includes(receiptId),
    [selectedReceiptIds],
  );

  const clearSelectedReceipts = useCallback(() => {
    setSelectedReceiptIds([]);
  }, []);

  const associateClaimWithReceipt = useCallback((receiptId: string, claimId: string) => {
    let ok = false;
    setReceipts((current) =>
      current.map((r) => {
        if (r.id !== receiptId) return r;
        ok = true;
        // Append the claim (deduped) so the "Claims: N" count grows as more
        // claims are associated with the same receipt.
        const existing = r.associatedClaimIds ?? [];
        if (existing.includes(claimId)) return r;
        return { ...r, associatedClaimIds: [...existing, claimId] };
      }),
    );
    return ok;
  }, []);

  const attachReceiptsToClaim = useCallback((claimId: string, receiptIds: string[]) => {
    if (receiptIds.length === 0) return false;
    let ok = false;
    setClaims((current) =>
      current.map((c) => {
        if (c.id !== claimId) return c;
        ok = true;
        // Req 7.2 / 8.1 / 8.2 / 9.3: no longer needs documentation -> processing,
        // with the receipt(s) recorded as attached. The first selected receipt
        // is kept as the representative attachment shown on Activity Details.
        return {
          ...c,
          status: 'processing',
          attachedReceiptId: receiptIds[0],
        };
      }),
    );
    if (ok) setAttachConfirmationClaimId(claimId);
    return ok;
  }, []);

  const dismissAttachConfirmation = useCallback(() => {
    setAttachConfirmationClaimId(null);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      receipts,
      expenses,
      claims,
      uploadDraft,
      lastSavedReceiptId,
      snackbarVisible,
      getClaimById,
      attachConfirmationClaimId,
      attachReceiptsToClaim,
      dismissAttachConfirmation,
      associateClaimWithReceipt,
      selectedReceiptIds,
      toggleReceiptSelected,
      isReceiptSelected,
      clearSelectedReceipts,
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
      expenses,
      claims,
      uploadDraft,
      lastSavedReceiptId,
      snackbarVisible,
      getClaimById,
      attachConfirmationClaimId,
      attachReceiptsToClaim,
      dismissAttachConfirmation,
      associateClaimWithReceipt,
      selectedReceiptIds,
      toggleReceiptSelected,
      isReceiptSelected,
      clearSelectedReceipts,
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
