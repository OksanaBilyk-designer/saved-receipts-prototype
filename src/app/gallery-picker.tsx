import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/button';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/data/app-state';
import { galleryPhotos } from '@/data/mock-data';

const NUM_COLUMNS = 3;

/**
 * Gallery Picker (Requirement 4).
 * Native-style photo picker with search affordance and "Select Photos" action.
 */
export default function GalleryPickerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { uploadDraft, startUpload, replaceDraftFile } = useAppState();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = galleryPhotos.filter((p) =>
    p.label.toLowerCase().includes(query.toLowerCase()),
  );

  const confirmSelection = () => {
    const photo = galleryPhotos.find((p) => p.id === selectedId) ?? galleryPhotos[0];
    // If an upload is already in progress, this was opened via "Change File" (Req 5.5/5.6):
    // replace the file in place instead of starting a brand new draft.
    if (uploadDraft) {
      replaceDraftFile(`${photo.label}.jpg`, photo.color);
    } else {
      startUpload(`${photo.label}.jpg`, photo.color);
    }
    router.replace('/upload-receipt');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.cancel}>
          <AppText variant="body1Regular16" color={Colors.textAccent}>
            Cancel
          </AppText>
        </Pressable>
        <AppText variant="body1Bold16">Gallery</AppText>
        <View style={{ width: 64 }} />
      </View>

      <View style={styles.searchBar}>
        <AppText color={Colors.textSecondary}>⌕</AppText>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search photos"
          placeholderTextColor={Colors.textSecondary}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => {
          const selected = item.id === selectedId;
          return (
            <Pressable
              onPress={() => setSelectedId(item.id)}
              style={[styles.photo, { backgroundColor: item.color }, selected && styles.photoSelected]}
            >
              {selected && (
                <View style={styles.checkBadge}>
                  <AppText variant="captionMedium12" color={Colors.textOnColor}>
                    ✓
                  </AppText>
                </View>
              )}
              <AppText
                variant="captionMedium12"
                color={Colors.textSecondary}
                numberOfLines={1}
                style={styles.photoLabel}
              >
                {item.label}
              </AppText>
            </Pressable>
          );
        }}
      />

      <View style={styles.actionBar}>
        <AppButton
          label="Select Photos"
          disabled={!selectedId}
          onPress={confirmSelection}
        />
      </View>
    </View>
  );
}

const PHOTO_SIZE = 110;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.canvas },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  cancel: { width: 64 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.module,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textBody },
  grid: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 140,
    gap: Spacing.sm,
  },
  gridRow: {
    gap: Spacing.sm,
  },
  photo: {
    // Flex-based sizing (rather than a hardcoded screen-width calculation)
    // so this adapts correctly whether rendered full-bleed on a real phone
    // or inside the fixed-width desktop phone frame.
    flex: 1 / NUM_COLUMNS,
    height: PHOTO_SIZE,
    borderRadius: Radius.sm,
    justifyContent: 'flex-end',
    padding: Spacing.xs,
    overflow: 'hidden',
  },
  photoSelected: {
    borderWidth: 3,
    borderColor: Colors.accentActive,
  },
  checkBadge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accentActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoLabel: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 4,
    paddingHorizontal: 4,
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
