import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/data/app-state';

/**
 * Select_Document_Page (attach-receipt-to-claim Requirement 5), updated for
 * multi-select browsing.
 *
 * Shows a full-size preview of a single Saved_Receipt with the filename in the
 * header. Previous/Next controls page through all Saved_Receipts with an
 * "X of N" counter. The bottom action shows "Select" when the previewed
 * receipt is not selected and "Deselect" when it is; tapping it toggles the
 * selection and returns to the Select_Saved_Receipt_Page. A visual-only expand
 * icon sits in the preview corner. Built from Figma node 919:5957.
 */
export default function SelectDocumentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { receiptId } = useLocalSearchParams<{ claimId: string; receiptId: string }>();
  const { receipts, toggleReceiptSelected, isReceiptSelected } = useAppState();

  // Track which receipt is on screen locally so Prev/Next can page without
  // leaving this screen. Seed from the receipt the user tapped.
  const initialIndex = Math.max(
    0,
    receipts.findIndex((r) => r.id === receiptId),
  );
  const [index, setIndex] = useState(initialIndex);

  const receipt = receipts[index];

  // Req 5.6: if the preview can't be loaded, show an error + a Back action.
  if (!receipt) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <View style={styles.headerRow}>
            <IconButton icon="back" onPress={() => router.back()} />
            <AppText variant="body1Bold16" color={Colors.textTitle}>
              Select Document
            </AppText>
          </View>
        </View>
        <View style={styles.previewWrap}>
          <AppText variant="body2Regular14" color={Colors.textSecondary}>
            This preview could not be loaded.
          </AppText>
        </View>
        <View style={[styles.actionBar, { paddingBottom: insets.bottom + Spacing.xl }]}>
          <AppButton label="Back" variant="secondary" onPress={() => router.back()} style={{ flex: 1 }} />
        </View>
      </View>
    );
  }

  const selected = isReceiptSelected(receipt.id);
  const hasPrev = index > 0;
  const hasNext = index < receipts.length - 1;

  const goPrev = () => {
    if (hasPrev) setIndex((i) => i - 1);
  };
  const goNext = () => {
    if (hasNext) setIndex((i) => i + 1);
  };

  // Req 5.5: back arrow returns without changing the selection.
  const handleBack = () => router.back();

  // Select / Deselect toggles this receipt's selection and returns to the list.
  const handleToggle = () => {
    toggleReceiptSelected(receipt.id);
    router.back();
  };

  return (
    <View style={styles.root}>
      {/* Header shows the previewed file's name (Req 5.2). */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerRow}>
          <IconButton icon="back" onPress={handleBack} />
          <AppText variant="body1Bold16" color={Colors.textTitle} numberOfLines={1}>
            {receipt.name}
          </AppText>
        </View>
      </View>

      {/* Full-size document preview (Req 5.1) */}
      <View style={styles.previewWrap}>
        <View style={styles.previewCard}>
          {receipt.image ? (
            <Image source={receipt.image} style={styles.previewImage} resizeMode="contain" />
          ) : (
            <View style={styles.previewPage}>
              <View style={styles.previewPaper} />
            </View>
          )}
          {/* Visual-only expand affordance (no behaviour, per spec). */}
          <View style={styles.expandBtn} pointerEvents="none">
            <ExpandGlyph />
          </View>
        </View>
      </View>

      {/* Previous / Next pager with an "X of N" counter. */}
      <View style={styles.pager}>
        <Pressable
          onPress={goPrev}
          disabled={!hasPrev}
          style={[styles.pagerBtn, !hasPrev && styles.pagerBtnDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Previous receipt"
          accessibilityState={{ disabled: !hasPrev }}
          hitSlop={8}
        >
          <Text style={[styles.pagerArrow, { color: hasPrev ? Colors.textTitle : Colors.textDisabled }]}>
            ‹
          </Text>
        </Pressable>
        <AppText variant="body2Regular14" color={Colors.textSecondary}>
          {index + 1} of {receipts.length}
        </AppText>
        <Pressable
          onPress={goNext}
          disabled={!hasNext}
          style={[styles.pagerBtn, !hasNext && styles.pagerBtnDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Next receipt"
          accessibilityState={{ disabled: !hasNext }}
          hitSlop={8}
        >
          <Text style={[styles.pagerArrow, { color: hasNext ? Colors.textTitle : Colors.textDisabled }]}>
            ›
          </Text>
        </Pressable>
      </View>

      {/* Bottom action bar: Close + Select/Deselect (Req 5.3 / 6.3). */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <AppButton label="Close" variant="secondary" onPress={handleBack} style={{ flex: 1 }} />
        <AppButton
          label={selected ? 'Deselect' : 'Select'}
          variant="primary"
          onPress={handleToggle}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

/** Diagonal expand glyph drawn with Views (no new asset). */
function ExpandGlyph() {
  return (
    <Text style={styles.expandGlyph} allowFontScaling={false}>
      ⤢
    </Text>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.module },
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
    gap: 2,
  },
  previewWrap: {
    flex: 1,
    padding: Spacing.xl,
  },
  previewCard: {
    flex: 1,
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
    right: Spacing.md,
    bottom: Spacing.md,
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
  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
  },
  pagerBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border1,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 1px 3px rgba(0,0,0,0.08)',
  },
  pagerBtnDisabled: {
    opacity: 0.5,
  },
  pagerArrow: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '600',
  },
  actionBar: {
    backgroundColor: Colors.canvas,
    borderTopWidth: 1,
    borderTopColor: Colors.border2,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
