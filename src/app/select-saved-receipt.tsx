import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CheckmarkIcon from '@/assets/figma/claim/checkmark.svg';
import { AppButton } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/data/app-state';
import type { Receipt } from '@/data/types';

type ViewMode = 'grid' | 'list';

/**
 * Select_Saved_Receipt_Page (attach-receipt-to-claim Requirements 4 & 6),
 * updated for multi-select.
 *
 * Header "Select Saved Receipts" + back, with a "Clear" action. Below it an
 * "X of N selected" counter and a grid/list view toggle. Each Saved_Receipt
 * carries a checkbox (>=44x44 tap target) that toggles its selection; tapping
 * the receipt image opens its full preview. A bottom action bar has "Close"
 * and "Submit" — Submit attaches every selected receipt to the Claim.
 * Built from Figma node 919:5887.
 */
export default function SelectSavedReceiptScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { claimId } = useLocalSearchParams<{ claimId: string }>();
  const {
    receipts,
    selectedReceiptIds,
    toggleReceiptSelected,
    isReceiptSelected,
    clearSelectedReceipts,
    attachReceiptsToClaim,
  } = useAppState();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCount = selectedReceiptIds.length;

  const openPreview = (receiptId: string) => {
    router.push({ pathname: '/select-document', params: { claimId: claimId ?? '', receiptId } });
  };

  // Req 4.6: Close returns to the Activity_Details_Page without attaching.
  const handleClose = () => {
    clearSelectedReceipts();
    router.back();
  };

  // Req 7: Submit attaches every Selected_Document to the Claim.
  const handleSubmit = () => {
    if (selectedCount === 0 || !claimId) return;
    setSubmitting(true); // Req 7.3: disable Submit while in progress.
    setError(null);
    const ok = attachReceiptsToClaim(claimId, selectedReceiptIds);
    if (!ok) {
      // Req 7.4: on failure, keep the user here with the selection intact.
      setSubmitting(false);
      setError("We couldn't attach the document. Please try again.");
      return;
    }
    clearSelectedReceipts();
    router.back(); // Req 7.2: return to the Activity_Details_Page.
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <IconButton icon="back" onPress={handleClose} />
            <AppText variant="body1Bold16" color={Colors.textTitle}>
              Select Saved Receipts
            </AppText>
          </View>
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
      </View>

      {/* Counter + view toggle */}
      <View style={styles.subBar}>
        <AppText variant="body2Bold14" color={Colors.textSecondary}>
          {selectedCount} of {receipts.length} selected
        </AppText>
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </View>

      {viewMode === 'grid' ? (
        <ScrollView contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {receipts.map((receipt) => (
              <ReceiptGridCard
                key={receipt.id}
                receipt={receipt}
                selected={isReceiptSelected(receipt.id)}
                onToggle={() => toggleReceiptSelected(receipt.id)}
                onOpenPreview={() => openPreview(receipt.id)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {receipts.map((receipt) => (
            <ReceiptListRow
              key={receipt.id}
              receipt={receipt}
              selected={isReceiptSelected(receipt.id)}
              onToggle={() => toggleReceiptSelected(receipt.id)}
              onOpenPreview={() => openPreview(receipt.id)}
            />
          ))}
        </ScrollView>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <AppText variant="body2Regular14" color={Colors.textOnColor}>
            {error}
          </AppText>
        </View>
      )}

      {/* Bottom action bar (Req 4.4) */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <AppButton label="Close" variant="secondary" onPress={handleClose} style={styles.actionBtn} />
        <AppButton
          label="Submit"
          variant="primary"
          disabled={selectedCount === 0 || submitting} // Req 4.5 / 6.2 / 7.3
          onPress={handleSubmit}
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
}

/**
 * Grid/list view toggle. Icons are drawn with plain Views (no new assets) to
 * match the segmented control in the design — a 2x2 grid glyph and a list glyph.
 */
function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <View style={styles.toggle}>
      <Pressable
        onPress={() => onChange('grid')}
        style={[styles.toggleBtn, mode === 'grid' && styles.toggleBtnActive]}
        accessibilityRole="button"
        accessibilityLabel="Grid view"
        accessibilityState={{ selected: mode === 'grid' }}
      >
        <GridGlyph active={mode === 'grid'} />
      </Pressable>
      <Pressable
        onPress={() => onChange('list')}
        style={[styles.toggleBtn, mode === 'list' && styles.toggleBtnActive]}
        accessibilityRole="button"
        accessibilityLabel="List view"
        accessibilityState={{ selected: mode === 'list' }}
      >
        <ListGlyph active={mode === 'list'} />
      </Pressable>
    </View>
  );
}

function GridGlyph({ active }: { active: boolean }) {
  const color = active ? Colors.textTitle : Colors.textSecondary;
  return (
    <View style={styles.gridGlyph}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={[styles.gridGlyphCell, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

function ListGlyph({ active }: { active: boolean }) {
  const color = active ? Colors.textTitle : Colors.textSecondary;
  return (
    <View style={styles.listGlyph}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.listGlyphRow}>
          <View style={[styles.listGlyphDot, { backgroundColor: color }]} />
          <View style={[styles.listGlyphLine, { backgroundColor: color }]} />
        </View>
      ))}
    </View>
  );
}

/** Checkbox with a >=44x44 tap target (Req: accessible touch target). */
function Checkbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={styles.checkboxHit}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <CheckmarkIcon width={16} height={16} />}
      </View>
    </Pressable>
  );
}

/** Large receipt card for the grid view: tappable image + corner checkbox. */
function ReceiptGridCard({
  receipt,
  selected,
  onToggle,
  onOpenPreview,
}: {
  receipt: Receipt;
  selected: boolean;
  onToggle: () => void;
  onOpenPreview: () => void;
}) {
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <Pressable
        onPress={onOpenPreview}
        style={styles.cardImageWrap}
        accessibilityRole="imagebutton"
        accessibilityLabel={`Preview ${receipt.name}`}
      >
        {receipt.image ? (
          <Image source={receipt.image} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.picPaper} />
        )}
      </Pressable>
      <View style={styles.cardCheckbox}>
        <Checkbox
          checked={selected}
          onToggle={onToggle}
          label={`Select ${receipt.name}`}
        />
      </View>
    </View>
  );
}

/** List row: thumbnail + filename + date range + trailing checkbox. */
function ReceiptListRow({
  receipt,
  selected,
  onToggle,
  onOpenPreview,
}: {
  receipt: Receipt;
  selected: boolean;
  onToggle: () => void;
  onOpenPreview: () => void;
}) {
  return (
    <View style={[styles.row, selected && styles.rowSelected]}>
      <Pressable
        onPress={onOpenPreview}
        style={styles.rowThumb}
        accessibilityRole="imagebutton"
        accessibilityLabel={`Preview ${receipt.name}`}
      >
        {receipt.image ? (
          <Image source={receipt.image} style={styles.rowThumbImage} resizeMode="cover" />
        ) : (
          <View style={styles.picPaper} />
        )}
      </Pressable>
      <View style={styles.rowText}>
        <AppText variant="body1Regular16" color={Colors.textTitle} numberOfLines={1}>
          {receipt.name}
        </AppText>
        {receipt.dateRange && (
          <AppText variant="body2Regular14" color={Colors.textSecondary}>
            {receipt.dateRange}
          </AppText>
        )}
      </View>
      <Checkbox checked={selected} onToggle={onToggle} label={`Select ${receipt.name}`} />
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
    boxShadow: '0px 6px 15px rgba(0,0,0,0.04)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexShrink: 1,
  },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },

  // View toggle (segmented control)
  toggle: {
    flexDirection: 'row',
    backgroundColor: Colors.module,
    borderRadius: Radius.md,
    padding: 3,
    gap: 3,
    borderWidth: 1,
    borderColor: Colors.border1,
  },
  toggleBtn: {
    width: 36,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: Colors.canvas,
    boxShadow: '0px 1px 3px rgba(0,0,0,0.12)',
  },
  gridGlyph: {
    width: 16,
    height: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  gridGlyphCell: {
    width: 7,
    height: 7,
    borderRadius: 1.5,
  },
  listGlyph: {
    width: 16,
    height: 16,
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  listGlyphRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  listGlyphDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  listGlyphLine: {
    flex: 1,
    height: 2,
    borderRadius: 1,
  },

  // Grid view
  gridContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 130,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  card: {
    // Three columns within the phone frame width.
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
  cardCheckbox: {
    position: 'absolute',
    top: 0,
    right: 0,
  },

  // List view
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 130,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.canvas,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border1,
    padding: Spacing.md,
  },
  rowSelected: {
    borderWidth: 2,
    borderColor: Colors.accentActive,
  },
  rowThumb: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border1,
    overflow: 'hidden',
    backgroundColor: Colors.canvas,
  },
  rowThumbImage: {
    width: '100%',
    height: '100%',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },

  picPaper: {
    flex: 1,
    margin: '12%',
    borderRadius: 4,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border1,
  },

  // Checkbox
  checkboxHit: {
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

  errorBanner: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: 130,
    backgroundColor: Colors.danger,
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
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
