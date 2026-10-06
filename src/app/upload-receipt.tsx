import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { AppText } from '@/components/ui/text';
import { AppTextField } from '@/components/ui/text-field';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/data/app-state';
import type { DocumentType } from '@/data/types';

const DOCUMENT_TYPES: DocumentType[] = ['Receipt', 'Letter of Medical Necessity'];

/**
 * Upload New Receipt page (Requirement 5).
 * File card w/ Change File, preview + thumbnail strip, type chip group,
 * document name field, Save (disabled until valid) / Close.
 */
export default function UploadReceiptScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { uploadDraft, updateDraftType, updateDraftName, discardUpload } = useAppState();

  // Guard: if there's no draft (e.g. deep nav), bounce back.
  useEffect(() => {
    if (!uploadDraft) {
      router.back();
    }
  }, [uploadDraft, router]);

  if (!uploadDraft) return null;

  const canSave = Boolean(uploadDraft.type) && uploadDraft.documentName.trim().length > 0;

  const handleClose = () => {
    // Requirement 5.12: discard the in-progress upload and return to Saved Receipts.
    // dismissAll() pops every modal screen (gallery-picker, upload-receipt) off the
    // stack regardless of how it was reached, then replace() lands cleanly on
    // Saved Receipts rather than relying on a fixed number of back() calls.
    discardUpload();
    router.dismissAll();
    router.replace('/saved-receipts');
  };

  const handleChangeFile = () => {
    router.replace('/gallery-picker');
  };

  const handleSave = () => {
    if (!canSave) return;
    router.push('/associate-claim');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
        <IconButton icon="close" onPress={handleClose} />
        <AppText variant="body1Bold16">Upload New Receipt</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.fileCard}>
          <View style={styles.fileCardLeft}>
            <View style={styles.fileIcon}>
              <AppText>📄</AppText>
            </View>
            <AppText variant="body2Regular14" numberOfLines={1} style={{ flex: 1 }}>
              {uploadDraft.fileName}
            </AppText>
          </View>
          <AppButton label="Change File" variant="link" onPress={handleChangeFile} />
        </View>

        <View style={styles.preview}>
          <View style={[styles.previewArea, { backgroundColor: uploadDraft.thumbnailColor }]}>
            <View style={styles.previewPaper} />
          </View>
          <View style={styles.thumbnailStrip}>
            <View style={[styles.thumbnail, { backgroundColor: uploadDraft.thumbnailColor }]}>
              <View style={styles.thumbnailBadge}>
                <AppText variant="captionMedium12" color={Colors.textOnColor}>
                  1
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.fieldGroup}>
            <AppText variant="body1Bold16">
              <AppText variant="body1Bold16" color={Colors.danger}>
                *{' '}
              </AppText>
              Type
            </AppText>
            <View style={styles.chipRow}>
              {DOCUMENT_TYPES.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  selected={uploadDraft.type === type}
                  onPress={() => updateDraftType(type)}
                  style={{ flex: type === 'Receipt' ? 0 : 1 }}
                />
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <AppText variant="body1Bold16">
              <AppText variant="body1Bold16" color={Colors.danger}>
                *{' '}
              </AppText>
              Document name
            </AppText>
            <AppTextField
              value={uploadDraft.documentName}
              onChangeText={updateDraftName}
              placeholder="Enter document name"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <AppButton label="Close" variant="secondary" onPress={handleClose} style={{ flex: 1 }} />
        <AppButton
          label="Save"
          variant="primary"
          disabled={!canSave}
          onPress={handleSave}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.module },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.canvas,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 140,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border1,
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
  fileCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    gap: Spacing.md,
  },
  previewArea: {
    height: 300,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPaper: {
    width: 160,
    height: 220,
    borderRadius: 8,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border1,
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 2,
  },
  thumbnailBadge: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  fieldGroup: {
    gap: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.canvas,
    borderTopWidth: 1,
    borderTopColor: Colors.border2,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 48,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
