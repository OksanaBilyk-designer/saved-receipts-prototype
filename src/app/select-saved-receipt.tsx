import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CheckmarkIcon from '@/assets/figma/claim/checkmark.svg';
import { AppButton } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/data/app-state';
import type { DocumentType, Receipt } from '@/data/types';

/**
 * Select a Document (Activity Details -> Add Documents -> Saved Receipts).
 *
 * Grid document picker: "Receipts" / "Letters of Medical Necessity" tabs
 * (filtered by the real Receipt.type, counts from data), a "Display used
 * receipts" toggle + Clear, a grid of receipt thumbnails each with a corner
 * checkbox, "Already attached" tiles that can't be re-selected, and a
 * Close / Submit action bar. Submit attaches the selected receipts to the
 * current activity's claim. Built from Figma node 919:5887.
 */
export default function SelectSavedReceiptScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { claimId } = useLocalSearchParams<{ claimId?: string }>();
  const {
    receipts,
    selectedReceiptIds,
    toggleReceiptSelected,
    isReceiptSelected,
    clearSelectedReceipts,
    attachReceiptsToClaim,
    getClaimById,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<DocumentType>('Receipt');
  const [showUsed, setShowUsed] = useState(false);

  // Receipts already attached to this activity can't be selected again.
  const attachedIds = useMemo(() => {
    const claim = claimId ? getClaimById(claimId) : undefined;
    return new Set(claim?.attachedReceiptIds ?? []);
  }, [claimId, getClaimById]);

  const receiptCount = receipts.filter((r) => r.type === 'Receipt').length;
  const lmnCount = receipts.filter((r) => r.type === 'Letter of Medical Necessity').length;

  const visible = useMemo(
    () =>
      receipts.filter(
        (r) => r.type === activeTab && (showUsed || !attachedIds.has(r.id)),
      ),
    [receipts, activeTab, showUsed, attachedIds],
  );

  const selectedCount = selectedReceiptIds.length;

  // Tapping a receipt image opens the full preview, paging within the current
  // tab's visible set (so Prev/Next stay consistent with what's on screen).
  const openPreview = (id: string) => {
    router.push({
      pathname: '/select-document',
      params: { receiptId: id, ids: visible.map((r) => r.id).join(',') },
    });
  };

  const handleClose = () => {
    clearSelectedReceipts();
    router.back();
  };

  const handleSubmit = () => {
    if (selectedCount === 0 || !claimId) return;
    attachReceiptsToClaim(claimId, selectedReceiptIds);
    clearSelectedReceipts();
    router.back();
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerRow}>
          <IconButton icon="back" onPress={handleClose} />
          <AppText variant="body1Bold16" color={Colors.textTitle}>
            Select a Document
          </AppText>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Tab
            label={`Receipts (${receiptCount})`}
            active={activeTab === 'Receipt'}
            onPress={() => setActiveTab('Receipt')}
          />
          <Tab
            label={`Letters of Medical Necessity (${lmnCount})`}
            active={activeTab === 'Letter of Medical Necessity'}
            onPress={() => setActiveTab('Letter of Medical Necessity')}
          />
        </View>
      </View>

      {/* Display used receipts toggle + Clear */}
      <View style={styles.subBar}>
        <Pressable
          style={styles.toggleRow}
          onPress={() => setShowUsed((v) => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: showUsed }}
          accessibilityLabel="Display used receipts"
        >
          <View style={[styles.toggleBox, showUsed && styles.toggleBoxChecked]}>
            {showUsed && <CheckmarkIcon width={16} height={16} />}
          </View>
          <AppText variant="body1Regular16" color={Colors.textTitle}>
            Display used receipts
          </AppText>
        </Pressable>
        <Pressable
          onPress={clearSelectedReceipts}
          disabled={selectedCount === 0}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear selection"
        >
          <AppText
            variant="body1Bold16"
            color={selectedCount === 0 ? Colors.textDisabled : Colors.textAccent}
          >
            Clear
          </AppText>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {visible.map((receipt) => (
            <ReceiptGridCard
              key={receipt.id}
              receipt={receipt}
              selected={isReceiptSelected(receipt.id)}
              attached={attachedIds.has(receipt.id)}
              onToggle={() => toggleReceiptSelected(receipt.id)}
              onOpen={() => openPreview(receipt.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <AppButton label="Close" variant="secondary" onPress={handleClose} style={styles.actionBtn} />
        <AppButton
          label="Submit"
          variant="primary"
          disabled={selectedCount === 0}
          onPress={handleSubmit}
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
}

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
    >
      <AppText
        variant="body2Bold14"
        color={active ? Colors.textTitle : Colors.textAccent}
        numberOfLines={2}
        style={styles.tabLabel}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

/** Grid tile. Tapping the image opens the full preview; the corner checkbox
 *  toggles selection (the two actions are separate so previewing never
 *  accidentally selects). Already-attached tiles are dimmed, badged, and can't
 *  be selected (but can still be opened to preview). */
function ReceiptGridCard({
  receipt,
  selected,
  attached,
  onToggle,
  onOpen,
}: {
  receipt: Receipt;
  selected: boolean;
  attached: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const checked = attached || selected;
  return (
    <View style={[styles.card, selected && styles.cardSelected, attached && styles.cardAttached]}>
      {/* Image opens the preview. */}
      <Pressable
        onPress={onOpen}
        style={styles.cardImageWrap}
        accessibilityRole="imagebutton"
        accessibilityLabel={`Open ${receipt.name}`}
      >
        {receipt.image ? (
          <Image source={receipt.image} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.picPaper} />
        )}
      </Pressable>

      {/* Corner checkbox toggles selection (disabled when already attached). */}
      <Pressable
        onPress={attached ? undefined : onToggle}
        disabled={attached}
        style={styles.checkboxHit}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled: attached }}
        accessibilityLabel={`Select ${receipt.name}`}
      >
        <View
          style={[styles.checkbox, checked && styles.checkboxChecked, attached && styles.checkboxAttached]}
        >
          {checked && <CheckmarkIcon width={16} height={16} />}
        </View>
      </Pressable>

      {attached && (
        <View style={styles.attachedBadge}>
          <AppText variant="captionMedium12" color={Colors.textTitle}>
            Already attached
          </AppText>
        </View>
      )}
    </View>
  );
}

const CARD_GAP = Spacing.md;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.module },
  header: {
    backgroundColor: Colors.canvas,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    gap: Spacing.lg,
    boxShadow: '0px 6px 15px rgba(0,0,0,0.04)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  tabs: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.module,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border1,
    boxShadow: '0px 1px 3px rgba(0,0,0,0.08)',
  },
  tabLabel: {
    textAlign: 'center',
  },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 1,
  },
  toggleBox: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBoxChecked: {
    backgroundColor: Colors.accentActive,
    borderColor: Colors.accentActive,
  },
  gridContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 130,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  card: {
    width: '31%',
    aspectRatio: 0.72,
    borderRadius: Radius.lg,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border1,
    padding: Spacing.sm,
    overflow: 'hidden',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.accentActive,
  },
  cardAttached: {
    opacity: 0.6,
  },
  cardImageWrap: {
    flex: 1,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.canvas,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  picPaper: {
    flex: 1,
    margin: '12%',
    borderRadius: 4,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border1,
  },
  checkboxHit: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.accentActive,
    borderColor: Colors.accentActive,
  },
  checkboxAttached: {
    backgroundColor: Colors.border,
    borderColor: Colors.border,
  },
  attachedBadge: {
    position: 'absolute',
    left: Spacing.sm,
    right: Spacing.sm,
    bottom: Spacing.sm,
    backgroundColor: Colors.canvas,
    borderRadius: Radius.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    boxShadow: '0px 1px 3px rgba(0,0,0,0.12)',
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
  actionBtn: {
    flex: 1,
  },
});
