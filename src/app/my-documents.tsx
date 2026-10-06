import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DocumentFolderCard } from '@/components/document-folder-card';
import { IconButton } from '@/components/ui/icon-button';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/data/app-state';

/**
 * My Documents page (Requirement 2).
 * Lists document folders including Saved Receipts, LMNs, Statements, Tax Forms,
 * and provides the Add Docs floating action button -> Add Document Sheet.
 */
export default function MyDocumentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { receipts } = useAppState();
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerTopRow}>
          <IconButton icon="back" color={Colors.textOnColor} onPress={() => router.back()} />
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
            onPress={() => router.push('/saved-receipts')}
          />
          <DocumentFolderCard
            title="Letters of Medical..."
            fileCountLabel="2 files"
            tintColor={Colors.lmnTint}
          />
        </View>
        <View style={styles.row}>
          <DocumentFolderCard
            title="Statements"
            fileCountLabel="2 files"
            tintColor={Colors.statementsTint}
          />
          <DocumentFolderCard
            title="Tax Forms"
            fileCountLabel="2 files"
            tintColor={Colors.taxFormsTint}
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

      {sheetVisible && (
        <AddDocumentSheet
          onClose={() => setSheetVisible(false)}
          onSelectReceipt={() => {
            setSheetVisible(false);
            router.push('/gallery-picker');
          }}
        />
      )}
    </View>
  );
}

function AddDocumentSheet({
  onClose,
  onSelectReceipt,
}: {
  onClose: () => void;
  onSelectReceipt: () => void;
}) {
  const options = [
    { label: 'Receipt', onPress: onSelectReceipt },
    { label: 'Letter of Medical Necessity', onPress: onClose },
    { label: 'Statement', onPress: onClose },
    { label: 'Tax Form', onPress: onClose },
  ];

  return (
    <View style={styles.sheetOverlay}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <AppText variant="body1Bold16" style={{ marginBottom: Spacing.md }}>
          Add a document
        </AppText>
        {options.map((option) => (
          <Pressable key={option.label} onPress={option.onPress} style={styles.sheetRow}>
            <AppText variant="body1Regular16">{option.label}</AppText>
          </Pressable>
        ))}
      </View>
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
  sheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 22, 33, 0.5)',
  },
  sheet: {
    backgroundColor: Colors.canvas,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: 48,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  sheetRow: {
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border2,
  },
});
