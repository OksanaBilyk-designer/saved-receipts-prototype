import { Image, Pressable, StyleSheet, View } from 'react-native';

import CheckmarkIcon from '@/assets/figma/claim/checkmark.svg';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { Receipt } from '@/data/types';

export type ReceiptCardProps = {
  receipt: Receipt;
  onPress?: () => void;
  /** When true, show a selection checkbox on the right (multi-select mode). */
  selectable?: boolean;
  /** Whether this receipt is currently selected. */
  selected?: boolean;
  /** Toggle selection — fired by the checkbox only, never by the card body. */
  onToggleSelect?: () => void;
  /**
   * When true, the receipt is already attached to the current activity: the
   * checkbox is shown checked + disabled (not toggleable) and an "Already
   * attached" badge replaces the claims badge. The card body still opens it.
   */
  disabled?: boolean;
};

/**
 * Saved receipt row: a realistic receipt photo thumbnail + file name and date
 * range. Matches the "My Documents / LMN Card" Figma component — the thumbnail
 * is the real uploaded receipt image (no colored tint block).
 *
 * In multi-select mode (selectable) a checkbox is shown on the right. Tapping
 * the checkbox toggles selection; tapping the rest of the card still opens the
 * receipt (the checkbox has its own >=44x44 tap target so the two don't clash).
 */
export function ReceiptCard({
  receipt,
  onPress,
  selectable = false,
  selected = false,
  onToggleSelect,
  disabled = false,
}: ReceiptCardProps) {
  const claimCount = receipt.associatedClaimIds?.length ?? 0;
  // A disabled (already-attached) card always reads as checked.
  const checked = disabled || selected;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        receipt.highlighted && styles.cardHighlighted,
        checked && styles.cardSelected,
        disabled && styles.cardDisabled,
      ]}
    >
      <View style={styles.thumbnail}>
        {receipt.image ? (
          <Image source={receipt.image} style={styles.thumbnailImage} resizeMode="cover" />
        ) : (
          // Fallback for newly uploaded receipts with no photo yet: a neutral
          // paper placeholder (no colorful background).
          <View style={styles.thumbnailPlaceholder}>
            <View style={styles.thumbnailPaper} />
          </View>
        )}
      </View>
      <View style={styles.textBlock}>
        <AppText variant="body1Regular16" numberOfLines={1}>
          {receipt.name}
        </AppText>
        <View style={styles.metaRow}>
          <AppText variant="captionMedium12" color={Colors.textSecondary} numberOfLines={1}>
            {receipt.dateRange ?? receipt.date}
          </AppText>
          {/* "Already attached" takes priority; otherwise the "Claims: N"
              badge is shown when the receipt has associated claims. */}
          {disabled ? (
            <View style={styles.claimsBadge}>
              <AppText variant="captionMedium12" color={Colors.textSecondary}>
                Already attached
              </AppText>
            </View>
          ) : (
            claimCount > 0 && (
              <View style={styles.claimsBadge}>
                <AppText variant="captionMedium12" color={Colors.textBody}>
                  Claims: {claimCount}
                </AppText>
              </View>
            )
          )}
        </View>
      </View>

      {selectable && (
        <Pressable
          onPress={disabled ? undefined : onToggleSelect}
          disabled={disabled}
          style={styles.checkboxHit}
          accessibilityRole="checkbox"
          accessibilityState={{ checked, disabled }}
          accessibilityLabel={`Select ${receipt.name}`}
        >
          <View
            style={[
              styles.checkbox,
              checked && styles.checkboxChecked,
              disabled && styles.checkboxDisabled,
            ]}
          >
            {checked && <CheckmarkIcon width={16} height={16} />}
          </View>
        </Pressable>
      )}
    </Pressable>
  );
}

const THUMB = 56;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.canvas,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border2,
  },
  cardHighlighted: {
    borderWidth: 2,
    borderColor: Colors.accentActive,
    boxShadow: `0px 6px 8px ${Colors.accentActive}80`,
    elevation: 4,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.accentActive,
  },
  cardDisabled: {
    opacity: 0.6,
    borderColor: Colors.border1,
  },
  thumbnail: {
    width: THUMB,
    height: THUMB,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border1,
    overflow: 'hidden',
    backgroundColor: Colors.canvas,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.canvas,
  },
  thumbnailPaper: {
    width: 28,
    height: 38,
    borderRadius: 3,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border1,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.xs / 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  claimsBadge: {
    backgroundColor: Colors.module,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  checkboxHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    // Pull the oversized tap target toward the edge so the visible box still
    // sits where the mock shows it without adding card width.
    marginRight: -Spacing.xs,
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
  checkboxDisabled: {
    // Already-attached: keep the checked fill but mute it so it reads as locked.
    backgroundColor: Colors.border,
    borderColor: Colors.border,
  },
});
