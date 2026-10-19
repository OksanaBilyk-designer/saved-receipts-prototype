import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { Receipt } from '@/data/types';

export type ReceiptCardProps = {
  receipt: Receipt;
  onPress?: () => void;
};

/**
 * Saved receipt row: a realistic receipt photo thumbnail + file name and date
 * range. Matches the "My Documents / LMN Card" Figma component — the thumbnail
 * is the real uploaded receipt image (no colored tint block).
 */
export function ReceiptCard({ receipt, onPress }: ReceiptCardProps) {
  const claimCount = receipt.associatedClaimIds?.length ?? 0;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, receipt.highlighted && styles.cardHighlighted]}
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
          {/* "Claims: N" badge — shown only when the receipt has associated
              claims. Reflects the current association count dynamically. */}
          {claimCount > 0 && (
            <View style={styles.claimsBadge}>
              <AppText variant="captionMedium12" color={Colors.textBody}>
                Claims: {claimCount}
              </AppText>
            </View>
          )}
        </View>
      </View>
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
});
