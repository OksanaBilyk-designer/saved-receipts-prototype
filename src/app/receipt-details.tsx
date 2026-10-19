import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/data/app-state';
import { claimsPendingDocumentation } from '@/data/mock-data';

/**
 * Receipt Details screen.
 *
 * Opened by tapping a receipt on the Saved Receipts list. Shows the receipt
 * photo + details (Type / Name), a "Linked Claims" row reflecting the claim
 * this receipt is associated with (if any), and an "Associate with Claim"
 * button that opens the existing Associate With Claims screen in
 * associate-existing-receipt mode.
 */
export default function ReceiptDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { receiptId } = useLocalSearchParams<{ receiptId: string }>();
  const { receipts } = useAppState();

  const receipt = receiptId ? receipts.find((r) => r.id === receiptId) : undefined;

  if (!receipt) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <View style={styles.headerRow}>
            <IconButton icon="back" onPress={() => router.back()} />
            <AppText variant="body1Bold16" color={Colors.textTitle}>
              Receipt
            </AppText>
          </View>
        </View>
        <View style={styles.centered}>
          <AppText variant="body2Regular14" color={Colors.textSecondary}>
            This receipt could not be found.
          </AppText>
        </View>
      </View>
    );
  }

  const associatedClaimIds = receipt.associatedClaimIds ?? [];
  const associatedClaim =
    associatedClaimIds.length > 0
      ? claimsPendingDocumentation.find((c) => c.id === associatedClaimIds[0])
      : undefined;

  const openAssociate = () => {
    router.push({ pathname: '/associate-claim', params: { receiptId: receipt.id } });
  };

  return (
    <View style={styles.root}>
      {/* Header: back + file name + (visual) delete */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerRow}>
          <IconButton icon="back" onPress={() => router.back()} />
          <AppText variant="body1Bold16" color={Colors.textTitle} style={styles.headerTitle}>
            {receipt.name}
          </AppText>
          {/* Visual-only delete affordance (kept consistent with the mock). */}
          <View style={styles.trashBtn} pointerEvents="none">
            <Text style={styles.trashGlyph} allowFontScaling={false}>
              🗑
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Preview card with visual-only expand glyph (reused pattern). */}
        <View style={styles.previewCard}>
          {receipt.image ? (
            <Image source={receipt.image} style={styles.previewImage} resizeMode="contain" />
          ) : (
            <View style={styles.previewPage}>
              <View style={styles.previewPaper} />
            </View>
          )}
          <View style={styles.expandBtn} pointerEvents="none">
            <Text style={styles.expandGlyph} allowFontScaling={false}>
              ⤢
            </Text>
          </View>
        </View>

        {/* Thumbnail (single page) */}
        <View style={styles.thumbnailStrip}>
          <View style={styles.thumbnail}>
            {receipt.image ? (
              <Image source={receipt.image} style={styles.thumbnailImage} resizeMode="cover" />
            ) : null}
            <View style={styles.thumbnailBadge}>
              <AppText variant="captionMedium12" color={Colors.textOnColor}>
                1
              </AppText>
            </View>
          </View>
        </View>

        {/* Linked Claims row — reflects the associated claim, if any. */}
        <View style={styles.linkedCard}>
          <View style={styles.linkedRow}>
            <View style={{ flex: 1 }}>
              <AppText variant="body1Regular16" color={Colors.textTitle}>
                Linked Claims
              </AppText>
              {associatedClaim && (
                <AppText
                  variant="captionMedium12"
                  color={Colors.textSecondary}
                  numberOfLines={1}
                  style={{ marginTop: 2 }}
                >
                  {associatedClaim.providerName} · {associatedClaim.amount}
                </AppText>
              )}
            </View>
            <Text style={styles.chevron} allowFontScaling={false}>
              ›
            </Text>
          </View>
        </View>

        {/* Type / Name details card */}
        <View style={styles.detailsCard}>
          <View style={styles.fieldGroup}>
            <AppText variant="body1Bold16" color={Colors.textTitle}>
              Type
            </AppText>
            <AppText variant="body1Regular16" color={Colors.textBody}>
              {receipt.type}
            </AppText>
          </View>

          <View style={styles.fieldDivider} />

          <View style={styles.fieldGroup}>
            <View style={styles.nameHeaderRow}>
              <AppText variant="body1Bold16" color={Colors.textTitle}>
                Name
              </AppText>
              {/* Visual-only edit affordance. */}
              <Text style={styles.editGlyph} allowFontScaling={false}>
                ✎
              </Text>
            </View>
            <AppText variant="body1Regular16" color={Colors.textBody} numberOfLines={1}>
              {receipt.name}
            </AppText>
          </View>
        </View>
      </ScrollView>

      {/* Primary action */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <AppButton label="Associate with Claim" variant="primary" onPress={openAssociate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.module },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    backgroundColor: Colors.canvas,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    boxShadow: '0px 6px 15px rgba(0,0,0,0.04)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
  },
  trashBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashGlyph: {
    fontSize: 20,
    lineHeight: 24,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  previewCard: {
    height: 360,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  previewImage: {
    flex: 1,
    width: '100%',
    borderRadius: Radius.md,
  },
  previewPage: {
    flex: 1,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPaper: {
    width: '55%',
    height: '80%',
    borderRadius: 6,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border1,
  },
  expandBtn: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border1,
    backgroundColor: Colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandGlyph: {
    fontSize: 20,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  thumbnailStrip: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.accentActive,
    backgroundColor: Colors.canvas,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailBadge: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  linkedCard: {
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  linkedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  chevron: {
    fontSize: 24,
    lineHeight: 24,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  fieldGroup: {
    gap: Spacing.xs,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: Colors.border2,
  },
  nameHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editGlyph: {
    fontSize: 18,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  actionBar: {
    backgroundColor: Colors.canvas,
    borderTopWidth: 1,
    borderTopColor: Colors.border2,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
});
