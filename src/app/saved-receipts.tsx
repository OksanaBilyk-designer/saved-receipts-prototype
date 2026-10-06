import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
        <View style={styles.headerTopRow}>
          <IconButton icon="back" color={Colors.textOnColor} onPress={() => router.back()} />
        </View>
        <AppText variant="h2Bold24" color={Colors.textOnColor} style={{ marginTop: Spacing.md }}>
          Saved Receipt: {receipts.length}
        </AppText>

        <View style={styles.searchBar}>
          <AppText color={Colors.textSecondary}>⌕</AppText>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search saved receipts"
            placeholderTextColor={Colors.textSecondary}
            style={styles.searchInput}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <ReceiptCard receipt={item} />}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
      />

      <View style={styles.actionBar}>
        <AppButton label="Upload Receipt" onPress={() => router.push('/gallery-picker')} />
      </View>

      <Snackbar
        visible={snackbarVisible}
        boldPrefix="Receipt"
        message="was added."
        onHide={dismissSnackbar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.module },
  header: {
    backgroundColor: Colors.darkBackground,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.md,
    borderBottomRightRadius: Radius.md,
    gap: Spacing.md,
  },
  headerTopRow: {
    flexDirection: 'row',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: Colors.textOnColor,
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
