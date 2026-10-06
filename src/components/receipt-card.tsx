import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { Receipt } from '@/data/types';

export type ReceiptCardProps = {
  receipt: Receipt;
  onPress?: () => void;
};

/** Matches the "My Documents / LMN Card" Figma component, reused for receipts. */
export function ReceiptCard({ receipt, onPress }: ReceiptCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, receipt.highlighted && styles.cardHighlighted]}
    >
      <View style={[styles.thumbnail, { backgroundColor: receipt.thumbnailColor }]}>
        <View style={styles.thumbnailInner} />
      </View>
      <View style={styles.textBlock}>
        <AppText variant="body1Regular16" numberOfLines={1}>
          {receipt.name}
        </AppText>
        <View style={styles.metaRow}>
          <AppText variant="captionMedium12" color={Colors.textSecondary}>
            {receipt.date}
          </AppText>
          <AppText variant="captionMedium12" color={Colors.textSecondary}>
            {' · '}
            {receipt.merchant}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

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
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailInner: {
    width: 32,
    height: 42,
    borderRadius: 4,
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
  },
});
