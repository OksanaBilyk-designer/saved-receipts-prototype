import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AddFileIcon from '@/assets/figma/claim/add-file.svg';
import CloudUploadIcon from '@/assets/figma/claim/cloud-upload-white.svg';
import DentalIcon from '@/assets/figma/claim/dental-icon.svg';
import InfoIcon from '@/assets/figma/claim/info-icon.svg';
import NeedsHelpIcon from '@/assets/figma/claim/needs-help.svg';
import ProcessingIcon from '@/assets/figma/claim/processing-icon.svg';
import { AddDocumentsSheet } from '@/components/add-documents-sheet';
import { IconButton } from '@/components/ui/icon-button';
import { Snackbar } from '@/components/ui/snackbar';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/data/app-state';
import type { Claim } from '@/data/types';

/** The five pieces of information requested in the Documentation_Request_Message. */
const REQUIRED_INFO = [
  'Amount',
  'Date of Service',
  'Service description',
  'Who the service was for',
  'Name of the provider and/or merchant',
];

/**
 * Activity_Details_Page (attach-receipt-to-claim Requirement 2).
 *
 * Shows the claim status (Needs_Help_Status while the Claim is a
 * Claim_Needing_Documentation, otherwise Processing_Status), the
 * Add_A_File_Button (or an attached-document thumbnail), the full claim
 * details, a "Show Payment Details" button, and the Activities_Section.
 *
 * Built to match Figma nodes 889:5359 (Needs help) and the Processing variant.
 */
export default function ActivityDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { claimId } = useLocalSearchParams<{ claimId: string }>();
  const {
    getClaimById,
    receipts,
    attachConfirmationClaimId,
    dismissAttachConfirmation,
  } = useAppState();
  const [navError, setNavError] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const claim = claimId ? getClaimById(claimId) : undefined;

  // Requirement 1.5 safety net: if we somehow landed here without a resolvable
  // claim, show an error with a way back rather than a blank screen.
  if (!claim) {
    return (
      <View style={[styles.root, styles.centered, { paddingTop: insets.top + Spacing.xl }]}>
        <AppText variant="body1Bold16">This activity could not be loaded.</AppText>
        <AppText
          variant="body2Regular14"
          color={Colors.textAccent}
          style={{ marginTop: Spacing.md }}
          onPress={() => router.back()}
        >
          Go back
        </AppText>
      </View>
    );
  }

  const needsDocs = claim.status === 'needs-documentation';
  const hasAttachment = Boolean(claim.attachedReceiptId);
  const attachedReceipt = claim.attachedReceiptId
    ? receipts.find((r) => r.id === claim.attachedReceiptId)
    : undefined;
  const showConfirmation = attachConfirmationClaimId === claim.id;

  // Req 3.3: tapping Upload Document opens the Add Documents bottom sheet.
  const openUploadSheet = () => {
    setNavError(null);
    setSheetVisible(true);
  };

  // From the sheet's "Saved Receipts" tile -> the Select_Saved_Receipt_Page.
  const goToSavedReceipts = () => {
    setSheetVisible(false);
    try {
      router.push({ pathname: '/select-saved-receipt', params: { claimId: claim.id } });
    } catch {
      // Req 3.4: on failure stay here and show an error.
      setNavError("We couldn't open your saved receipts. Please try again.");
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <IconButton icon="back" onPress={() => router.back()} />
        <AppText variant="body1Bold16" style={styles.headerTitle}>
          Activity details
        </AppText>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Status tracker (Needs help / Processing) */}
        <View style={styles.trackerCard}>
          <View style={styles.trackerRow}>
            <View style={styles.trackerDateCol}>
              <AppText variant="captionMedium12" color={Colors.textSecondary}>
                {claim.trackerDate.split(' ')[0]}
              </AppText>
              <AppText variant="body1Bold16" color={Colors.textSecondary}>
                {claim.trackerDate.split(' ')[1]}
              </AppText>
            </View>
            <View
              style={[
                styles.statusPill,
                needsDocs ? styles.statusPillWarning : styles.statusPillProcessing,
              ]}
            >
              {needsDocs ? (
                <NeedsHelpIcon width={24} height={24} />
              ) : (
                <ProcessingIcon width={24} height={24} />
              )}
              <AppText variant="body1Regular16">
                {needsDocs ? 'Needs help' : 'Processing'}
              </AppText>
            </View>
          </View>
          <View style={styles.trackerDivider} />
        </View>

        {/* Attached document thumbnail OR Add a File button (Req 2.3/2.4, 8.2) */}
        {hasAttachment ? (
          <View style={styles.docThumb}>
            <View style={styles.docThumbBadge}>
              <AppText variant="captionMedium12" color={Colors.textOnColor}>
                1
              </AppText>
            </View>
            <View
              style={[
                styles.docThumbInner,
                attachedReceipt && { backgroundColor: attachedReceipt.thumbnailColor },
              ]}
            />
          </View>
        ) : (
          <View style={styles.addFileButton}>
            <AddFileIcon width={24} height={24} />
            <AppText variant="captionMedium12" color={Colors.textAccent} style={styles.addFileLabel}>
              Add a File
            </AppText>
          </View>
        )}

        {/* Claim card */}
        <ClaimCard claim={claim} />

        {/* Activities section (Req 2.7) */}
        <AppText variant="body1Bold16" style={styles.activitiesHeading}>
          Activities
        </AppText>
        <View style={styles.activityDateRow}>
          <AppText variant="body2Regular14" color={Colors.textSecondary}>
            {claim.activityDate}
          </AppText>
          <View style={styles.activityDateLine} />
        </View>

        {/* Documentation Request Message + Upload Document button (Req 3) */}
        {needsDocs && (
          <View style={styles.notification}>
            <View style={styles.notificationLine} />
            <View style={styles.notificationContent}>
              <NeedsHelpIcon width={24} height={24} />
              <View style={styles.notificationText}>
                <AppText variant="body1Bold16" color={Colors.textTitle}>
                  Hi {claim.requestFirstName}. We&rsquo;ll need some more details on your end to
                  process your request for {claim.paymentTag.toLowerCase()}. Please provide a
                  detailed receipt or document with the following information:
                </AppText>
                <View style={styles.bulletList}>
                  {REQUIRED_INFO.map((item) => (
                    <View key={item} style={styles.bulletRow}>
                      <AppText variant="body2Regular14" color={Colors.textBody}>
                        {'\u2022'}
                      </AppText>
                      <AppText
                        variant="body2Regular14"
                        color={Colors.textBody}
                        style={styles.bulletText}
                      >
                        {item}
                      </AppText>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Upload_Document_Button (Req 3.2 / 3.3) */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Upload Document"
              onPress={openUploadSheet}
              style={({ pressed }) => [styles.uploadButton, pressed && styles.uploadButtonPressed]}
            >
              <AppText variant="body2Bold14" color={Colors.textOnColor}>
                Upload Document
              </AppText>
              <CloudUploadIcon width={20} height={20} />
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Add Documents bottom sheet opened by Upload Document (Req 3.3). */}
      <AddDocumentsSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onTakePhoto={() => setSheetVisible(false)}
        onViewGallery={() => setSheetVisible(false)}
        onBrowseFiles={() => setSheetVisible(false)}
        onSavedReceipts={goToSavedReceipts}
      />

      {/* Confirmation_Snackbar after a successful attach (Req 8.3) */}
      <Snackbar
        visible={showConfirmation}
        boldPrefix="Document added."
        message="The claim is about to be processed."
        onHide={dismissAttachConfirmation}
        dark
      />

      {navError && (
        <View style={styles.errorBanner}>
          <AppText variant="body2Regular14" color={Colors.textOnColor}>
            {navError}
          </AppText>
        </View>
      )}
    </View>
  );
}

/** The claim detail card shared by both status variants. */
function ClaimCard({ claim }: { claim: Claim }) {
  return (
    <View style={styles.claimCard}>
      <View style={styles.claimHeaderRow}>
        <View style={styles.categoryTile}>
          <DentalIcon width={28} height={28} />
        </View>
        <View style={styles.claimHeaderText}>
          <AppText variant="h3Bold20">{claim.providerName}</AppText>
          <AppText variant="body2Regular14" color={Colors.textSecondary}>
            {claim.dependantName}{' '}
            <AppText variant="body2Regular14" color={Colors.textSecondary}>
              {claim.dependantRelationship}
            </AppText>
          </AppText>
        </View>
        <InfoIcon width={24} height={24} />
      </View>

      <View style={styles.tagRow}>
        <View style={styles.tag}>
          <AppText variant="captionMedium12" color={Colors.textBody}>
            {claim.paymentTag}
          </AppText>
        </View>
        <AppText variant="body2Regular14" color={Colors.textSecondary}>
          {claim.referenceNumber}
        </AppText>
      </View>

      <View style={styles.claimDivider} />

      {/* Hero paid amount */}
      <View style={styles.heroRow}>
        <AppText variant="body1Regular16" color={Colors.textSecondary}>
          {claim.paidAmountLabel}
        </AppText>
        <AppText variant="h1Bold32" color={Colors.textAccent}>
          {claim.paidAmount}
        </AppText>
      </View>

      <DetailRow label={claim.requestedAmountLabel} value={claim.requestedAmount} />
      <DetailRow label="Approved amount" value={claim.approvedAmount} />
      <DetailRow label={claim.serviceDateLabel} value={claim.serviceDate} />
      <DetailRow label="Service provided" value={claim.serviceProvided} />
      <DetailRow label="Invoice" value={claim.invoice} />

      <View style={styles.showPaymentButton}>
        <AppText variant="body2Bold14" color={Colors.textBody}>
          Show Payment Details
        </AppText>
      </View>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <AppText variant="body1Regular16" color={Colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant="body1Bold16">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.module },
  centered: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.canvas,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },

  // Status tracker
  trackerCard: {
    backgroundColor: Colors.canvas,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  trackerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  trackerDateCol: {
    width: 32,
  },
  statusPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
  },
  statusPillWarning: {
    backgroundColor: Colors.warningContainer,
  },
  statusPillProcessing: {
    backgroundColor: Colors.accentContainer,
  },
  trackerDivider: {
    height: 4,
    width: 40,
    alignSelf: 'center',
    borderRadius: Radius.pill,
    backgroundColor: Colors.border1,
    marginTop: Spacing.md,
  },

  // Add a File / attached thumbnail
  addFileButton: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border1,
    backgroundColor: Colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  addFileLabel: {
    textAlign: 'center',
  },
  docThumb: {
    width: 72,
    height: 86,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border1,
    backgroundColor: Colors.canvas,
    padding: Spacing.xs,
  },
  docThumbBadge: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    backgroundColor: Colors.textTitle,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  docThumbInner: {
    flex: 1,
    borderRadius: Radius.sm,
    backgroundColor: Colors.module,
  },

  // Claim card
  claimCard: {
    backgroundColor: Colors.canvas,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  claimHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  categoryTile: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.dental,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimHeaderText: {
    flex: 1,
    gap: 2,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  tag: {
    backgroundColor: Colors.legendTag,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  claimDivider: {
    height: 1,
    backgroundColor: Colors.border2,
    marginVertical: Spacing.lg,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  showPaymentButton: {
    marginTop: Spacing.lg,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Activities
  activitiesHeading: {
    fontSize: 18,
    marginTop: Spacing.sm,
  },
  activityDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  activityDateLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border1,
  },

  // Documentation Request Message (Mobile Notification, Figma 889:5373)
  notification: {
    backgroundColor: Colors.warningContainer, // #fef9eb
    borderWidth: 1,
    borderColor: Colors.warningBorder, // #fdecc0
    borderRadius: Radius.lg, // 12
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
    overflow: 'hidden',
  },
  notificationLine: {
    height: 2,
    borderRadius: Radius.lg,
    backgroundColor: Colors.warning, // #f9c134
    marginHorizontal: -Spacing.lg,
  },
  notificationContent: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  notificationText: {
    flex: 1,
    gap: Spacing.sm,
  },
  bulletList: {
    gap: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  bulletText: {
    flex: 1,
  },
  uploadButton: {
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.buttonPrimaryDefault,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  uploadButtonPressed: {
    backgroundColor: Colors.buttonPrimaryActive,
  },
  errorBanner: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: 110,
    backgroundColor: Colors.danger,
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
});
