import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClaimRow } from '@/components/claim-row';
import { AppButton } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { AppText } from '@/components/ui/text';
import { Colors, Spacing } from '@/constants/theme';
import { useAppState } from '@/data/app-state';
import { claimsPendingDocumentation } from '@/data/mock-data';

/**
 * Associate With Claim page (Requirement 6 & 7).
 * Lists Claim_Pending_Documentation records with single-select.
 *
 * Three entry modes:
 * - New-upload flow (no params): Save persists the just-uploaded receipt to
 *   Saved Receipts (associated to the selected claim, if any) and returns to
 *   the list.
 * - Existing-receipt flow (receiptId param, from Receipt Details): Save
 *   associates the selected claim with that existing receipt, then navigates to
 *   the full-page "Claim Sent for Review!" confirmation screen.
 * - Multi-select flow (from=saved-receipts): Save associates the selected
 *   claim with EVERY currently-selected receipt, clears the selection, then
 *   shows the confirmation screen.
 *
 * Both actions are always enabled; Back returns without saving.
 */
export default function AssociateClaimScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { receiptId, from } = useLocalSearchParams<{ receiptId?: string; from?: string }>();
  const {
    saveReceiptAndAssociate,
    associateClaimWithReceipt,
    selectedReceiptIds,
    clearSelectedReceipts,
  } = useAppState();
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  const isMultiSelect = from === 'saved-receipts';

  // Save behaviour depends on how this screen was reached.
  const handleSave = () => {
    if (isMultiSelect) {
      // Multi-select flow: associate the chosen claim with every selected
      // receipt, then clear the selection and confirm.
      if (selectedClaimId) {
        selectedReceiptIds.forEach((id) => associateClaimWithReceipt(id, selectedClaimId));
      }
      clearSelectedReceipts();
      router.replace({
        pathname: '/claim-confirmation',
        params: selectedClaimId ? { claimId: selectedClaimId } : {},
      });
      return;
    }

    if (receiptId) {
      // Existing-receipt flow: record the association, then show the full-page
      // confirmation screen (passing the claim so it can show the summary).
      if (selectedClaimId) {
        associateClaimWithReceipt(receiptId, selectedClaimId);
      }
      router.replace({
        pathname: '/claim-confirmation',
        params: selectedClaimId ? { claimId: selectedClaimId } : {},
      });
      return;
    }

    // New-upload flow: persist the draft receipt and return to the list.
    saveReceiptAndAssociate(selectedClaimId);
    router.dismissAll();
    router.replace('/saved-receipts');
  };

  // Back: return to the previous screen without saving anything.
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
        <IconButton icon="back" onPress={handleBack} />
        <AppText variant="body1Bold16" style={{ flex: 1 }}>
          Associate With Claim
        </AppText>
      </View>

      <AppText variant="body2Regular14" color={Colors.textBody} style={styles.intro}>
        These claims are pending documentation. Linking your Receipt now can help speed up
        processing.
      </AppText>

      <FlatList
        data={claimsPendingDocumentation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        renderItem={({ item }) => (
          <ClaimRow
            claim={item}
            selected={selectedClaimId === item.id}
            onSelect={() =>
              setSelectedClaimId((current) => (current === item.id ? null : item.id))
            }
          />
        )}
        ListEmptyComponent={
          <AppText variant="body2Regular14" color={Colors.textSecondary}>
            You have no claims pending documentation.
          </AppText>
        }
      />

      <View style={styles.actionBar}>
        {/* Back: return without saving. Always enabled. */}
        <AppButton
          label="Back"
          variant="secondary"
          onPress={handleBack}
          style={{ flex: 1 }}
        />
        {/* Save: always enabled; saves with or without an associated claim. */}
        <AppButton
          label="Save"
          variant="primary"
          onPress={handleSave}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.canvas },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  intro: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 140,
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.canvas,
    borderTopWidth: 1,
    borderTopColor: Colors.border2,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 48,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
