import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { ClaimPendingDocumentation } from '@/data/types';

const SERVICE_TILE_COLOR: Record<ClaimPendingDocumentation['serviceType'], string> = {
  Medical: Colors.medical,
  Pharmacy: Colors.pharmacy,
  Dental: Colors.dental,
  Vision: Colors.vision,
};

export type ClaimRowProps = {
  claim: ClaimPendingDocumentation;
  selected: boolean;
  onSelect: () => void;
};

/** Matches the claim row used on the "Associate With Claim" page, with a radio control. */
export function ClaimRow({ claim, selected, onSelect }: ClaimRowProps) {
  return (
    <Pressable onPress={onSelect} style={styles.card}>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
      <View style={[styles.tile, { backgroundColor: SERVICE_TILE_COLOR[claim.serviceType] }]} />
      <View style={styles.textBlock}>
        <AppText variant="body1Regular16" numberOfLines={1}>
          {claim.providerName}
        </AppText>
        <AppText variant="captionMedium12" color={Colors.textSecondary} numberOfLines={1}>
          {claim.serviceType} services
        </AppText>
      </View>
      <View style={styles.amountBlock}>
        <AppText variant="body1Bold16">{claim.amount}</AppText>
        <AppText variant="captionMedium12" color={Colors.textSecondary}>
          {claim.date}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.canvas,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.accentActive,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: Colors.accentActive,
  },
  tile: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  amountBlock: {
    alignItems: 'flex-end',
    gap: 2,
  },
});
