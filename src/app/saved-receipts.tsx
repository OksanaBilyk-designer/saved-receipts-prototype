import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddDocumentsSheet } from '@/components/add-documents-sheet';
import { ReceiptCard } from '@/components/receipt-card';
import { AppButton } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Snackbar } from '@/components/ui/snackbar';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/data/app-state';

/**
 * Saved Receipts page (Requirement 3).
 * Dynamic header count, search affordance, most-recent-first list,
 * and a pinned full-width "Upload Receipt" button.
 */
export default function SavedReceiptsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { receipts, snackbarVisible, dismissSnackbar } = useAppState();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  const goToGalleryPicker = () => {
    setSheetVisible(false);
    router.push('/gallery-picker');
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return receipts;
    const q = query.toLowerCase();
    return receipts.filter(
      (r) => r.name.toLowerCase().includes(q) || r.merchant.toLowerCase().includes(q),
    );
  }, [receipts, query]);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {/*
              Always return to My Documents (the parent). router.back() is
              unreliable here because the upload flow replaces the route below.
            */}
            <IconButton
              icon="back"
              color={Colors.textTitle}
              onPress={() => router.replace('/my-documents')}
            />
            <AppText variant="h3Bold20" color={Colors.textTitle}>
              Saved Receipt: {receipts.length}
            </AppText>
          </View>
          {/* Search affordance: an icon that toggles the search field. */}
          <IconButton
            icon="search"
            color={Colors.textTitle}
            onPress={() => setSearchOpen((v) => !v)}
          />
        </View>

        {searchOpen && (
          <View style={styles.searchBar}>
            <AppText color={Colors.textSecondary}>⌕</AppText>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search saved receipts"
              placeholderTextColor={Colors.textSecondary}
              style={styles.searchInput}
              autoFocus
            />
          </View>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ReceiptCard
            receipt={item}
            onPress={() =>
              router.push({ pathname: '/receipt-details', params: { receiptId: item.id } })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
      />

      <View style={styles.actionBar}>
        <AppButton label="Upload Receipt" onPress={() => setSheetVisible(true)} />
      </View>

      <Snackbar
        visible={snackbarVisible}
        boldPrefix="Receipt"
        message="was added."
        onHide={dismissSnackbar}
      />

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
    backgroundColor: Colors.canvas,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    gap: Spacing.md,
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
    gap: Spacing.xs,
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.module,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: Colors.textBody,
    fontSize: 14,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 120,
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
  },
});
