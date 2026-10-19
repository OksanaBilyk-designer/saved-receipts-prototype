import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const confirmSelection = () => {
    const photo = galleryPhotos.find((p) => p.id === selectedId) ?? galleryPhotos[0];
    // If an upload is already in progress, this was opened via "Change File" (Req 5.5/5.6):
    // replace the file in place instead of starting a brand new draft.
    if (uploadDraft) {
      replaceDraftFile(`${photo.label}.jpg`, photo.color, photo.image);
    } else {
      startUpload(`${photo.label}.jpg`, photo.color, photo.image);
    }
    router.replace('/upload-receipt');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
        <AppText variant="body1Bold16">Gallery</AppText>
      </View>

      <FlatList
        data={galleryPhotos}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => {
          const selected = item.id === selectedId;
          return (
            <Pressable
              onPress={() => setSelectedId(item.id)}
              style={[
                styles.photo,
                item.contain && styles.photoContainBg,
                selected && styles.photoSelected,
              ]}
            >
              <Image
                source={item.image}
                style={[styles.photoImage, item.contain && styles.photoImageContain]}
                resizeMode={item.contain ? 'contain' : 'cover'}
              />
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
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
    backgroundColor: Colors.module,
    borderWidth: 1,
    borderColor: Colors.border1,
  },
  photoImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  photoImageContain: {
    // Inset the contained (receipt) image so the whole thing fits inside the
    // tile with padding, and leave clear space for the label at the bottom.
    top: Spacing.xs,
    left: Spacing.xs,
    right: Spacing.xs,
    bottom: 24,
    width: undefined,
    height: undefined,
  },
  photoContainBg: {
    backgroundColor: Colors.canvas,
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
    alignSelf: 'flex-start',
    maxWidth: '100%',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    overflow: 'hidden',
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
