import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PaidCheckIcon from '@/assets/figma/claim/paid-check.svg';
import { AppButton } from '@/components/ui/button';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { claimsPendingDocumentation } from '@/data/mock-data';
import type { ClaimPendingDocumentation } from '@/data/types';

const SERVICE_TILE_COLOR: Record<ClaimPendingDocumentation['serviceType'], string> = {
  Medical: Colors.medical,
  Pharmacy: Colors.pharmacy,
  Dental: Colors.dental,
  Vision: Colors.vision,
};

/**
 * Claim Sent confirmation — a full-page screen (not a modal/bottom sheet),
 * following the prototype's routed full-page layout.
 *
 * Reached after Save on the Associate With Claim screen (existing-receipt
 * flow). Shows a dark teal-green hero with a success check, title + subtitle,
 * and a summary of the associated claim. "Got It!" navigates to Saved Receipts.
 */
export default function ClaimConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { claimId } = useLocalSearchParams<{ claimId?: string }>();

  const claim = claimId
    ? claimsPendingDocumentation.find((c) => c.id === claimId) ?? null
    : null;

  // "Got It!" lands on the Saved Receipts list (with the association applied).
  const handleGotIt = () => {
    router.dismissAll();
    router.replace('/saved-receipts');
  };

  return (
    <View style={styles.root}>
      {/* Dark green hero fills the top of the page */}
      <View style={[styles.hero, { paddingTop: insets.top + Spacing.xxl * 2 }]}>
        <View style={styles.checkWrap}>
          <PaidCheckIcon width={56} height={56} />
        </View>
        <AppText variant="h2Bold24" color={Colors.textOnColor} style={styles.title}>
          Claim Sent for Review!
        </AppText>
        <AppText variant="body1Regular16" color={Colors.textOnColor} style={styles.subtitle}>
          Receipts in review process
        </AppText>

        {/* Associated claim summary — straddles the hero's bottom edge */}
        {claim && (
          <View style={styles.claimCard}>
            <View style={[styles.tile, { backgroundColor: SERVICE_TILE_COLOR[claim.serviceType] }]} />
            <View style={styles.claimText}>
              <AppText variant="body1Regular16" color={Colors.textTitle} numberOfLines={1}>
                {claim.providerName}
              </AppText>
              <AppText variant="captionMedium12" color={Colors.textSecondary} numberOfLines={1}>
                {claim.serviceType} services and...
              </AppText>
            </View>
            <View style={styles.claimAmount}>
              <AppText variant="body1Bold16" color={Colors.textTitle}>
                {claim.amount}
              </AppText>
              <AppText variant="captionMedium12" color={Colors.textSecondary}>
                {claim.date}
              </AppText>
            </View>
          </View>
        )}
      </View>

      {/* Remaining page body (light canvas), matching the mock */}
      <View style={styles.body} />

      {/* Bottom action bar */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <AppButton label="Got It!" variant="primary" onPress={handleGotIt} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.module },
  hero: {
    backgroundColor: Colors.confirmationHero,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl + Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  checkWrap: {
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: Spacing.xs,
    opacity: 0.9,
  },
  claimCard: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.canvas,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    // Pull the card down so it straddles the hero's bottom edge like the mock.
    marginBottom: -(Spacing.xxl + Spacing.xl + Spacing.lg),
    marginTop: Spacing.xl,
    boxShadow: '0px 6px 15px rgba(0,0,0,0.12)',
  },
  tile: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
  },
  claimText: {
    flex: 1,
    gap: 2,
  },
  claimAmount: {
    alignItems: 'flex-end',
    gap: 2,
  },
  body: {
    flex: 1,
  },
  actionBar: {
    backgroundColor: Colors.canvas,
    borderTopWidth: 1,
    borderTopColor: Colors.border2,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
});
