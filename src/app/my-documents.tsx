import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddDocumentsSheet } from '@/components/add-documents-sheet';
import { DocumentFolderCard } from '@/components/document-folder-card';
import { IconButton } from '@/components/ui/icon-button';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/data/app-state';

/**
 * My Documents page (Requirement 2).
 * Lists document folders including Saved Receipts, LMNs, Statements, Tax Forms,
 * and provides the Add Docs floating action button -> Add Documents bottom sheet
 * (Figma node 889:4847).
 */
export default function MyDocumentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { receipts } = useAppState();
  const [sheetVisible, setSheetVisible] = useState(false);

  const goToGalleryPicker = () => {
    setSheetVisible(false);
    router.push('/gallery-picker');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerTopRow}>
          {/*
            Always return to the More Options screen (the parent). router.back()
            is unreliable: when the user reaches My Documents via the Saved
            Receipts back arrow (which replaces the route), the previous stack
            entry is no longer More, so an explicit navigate is used instead.
          */}
          <IconButton
            icon="back"
            color={Colors.textOnColor}
            onPress={() => router.replace('/more')}
          />
          <View style={{ width: 40 }} />
        </View>
        <AppText variant="h2Bold24" color={Colors.textOnColor} style={{ marginTop: Spacing.md }}>
          My Documents
        </AppText>
        <AppText
          variant="body2Regular14"
          color="rgba(255,255,255,0.5)"
          style={{ marginTop: Spacing.xs }}
        >
          Keep your important documents in one secure and easy-to-access place
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <DocumentFolderCard
            title="Saved Receipts"
            fileCountLabel={`${receipts.length} file${receipts.length === 1 ? '' : 's'}`}
            tintColor={Colors.receiptsTint}
            thumbnail={require('@/assets/figma/folders/receipt-thumb.jpeg')}
            onPress={() => router.push('/saved-receipts')}
          />
          <DocumentFolderCard
            title="Letters of Medical..."
            fileCountLabel="2 files"
            tintColor={Colors.lmnTint}
            previewLabel="Medical"
            previewLabelColor="#7a5cff"
          />
        </View>
        <View style={styles.row}>
          <DocumentFolderCard
            title="Statements"
            fileCountLabel="2 files"
            tintColor={Colors.statementsTint}
            previewLabel="Statements"
            previewLabelColor="#87b219"
          />
          <DocumentFolderCard
            title="Tax Forms"
            fileCountLabel="2 files"
            tintColor={Colors.taxFormsTint}
            previewLabel="Tax Forms"
            previewLabelColor="#b21978"
          />
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => setSheetVisible(true)}>
        <AppText variant="body1Regular16" color={Colors.textOnColor} style={{ fontSize: 20 }}>
          +
        </AppText>
        <AppText variant="captionMedium12" color={Colors.textOnColor}>
          Add Docs
        </AppText>
      </Pressable>

      <AddDocumentsSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onTakePhoto={goToGalleryPicker}
        onViewGallery={goToGalleryPicker}
        onBrowseFiles={goToGalleryPicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.module },
  header: {
    backgroundColor: Colors.darkBackground,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: Radius.md,
    borderBottomRightRadius: Radius.md,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: 48,
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    backgroundColor: Colors.darkBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
