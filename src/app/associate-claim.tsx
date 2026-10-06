import { useRouter } from 'expo-router';
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
 * Lists Claim_Pending_Documentation records with single-select radio,
 * Skip always available, Submit enabled only once a claim is selected.
 * Saving (Submit or Skip) returns to Saved Receipts with confirmation.
 */
export default function AssociateClaimScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { saveReceiptAndAssociate } = useAppState();
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  const finishAndReturn = (claimId: string | null) => {
    saveReceiptAndAssociate(claimId);
    router.dismissAll();
    router.replace('/saved-receipts');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
        <IconButton icon="back" onPress={() => router.back()} />
        <AppText variant="body1Bold16" style={{ flex: 1 }}>
          Associate With Claim (Optional)
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
        <AppButton
          label="Skip"
          variant="secondary"
          onPress={() => finishAndReturn(null)}
          style={{ flex: 1 }}
        />
        <AppButton
          label="Submit"
          variant="primary"
          disabled={!selectedClaimId}
          onPress={() => finishAndReturn(selectedClaimId)}
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
