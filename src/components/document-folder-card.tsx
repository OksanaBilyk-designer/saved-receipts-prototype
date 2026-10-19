import type { ImageSourcePropType } from 'react-native';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';

export type DocumentFolderCardProps = {
  title: string;
  fileCountLabel: string;
  tintColor: string;
  onPress?: () => void;
  /** Optional photo thumbnail (e.g. the receipt image). */
  thumbnail?: ImageSourcePropType;
  /** Optional styled label shown inside the preview card (e.g. "Statements"). */
  previewLabel?: string;
  previewLabelColor?: string;
};

/** Matches the "My Documents / Folders" Figma component. */
export function DocumentFolderCard({
  title,
  fileCountLabel,
  tintColor,
  onPress,
  thumbnail,
  previewLabel,
  previewLabelColor,
}: DocumentFolderCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={[styles.preview, { backgroundColor: tintColor }]}>
        <View style={styles.previewPaper}>
          {thumbnail ? (
            <Image source={thumbnail} style={styles.thumbnail} resizeMode="cover" />
          ) : previewLabel ? (
            <View style={styles.labelPaper}>
              <AppText
                variant="captionMedium12"
                color={previewLabelColor ?? Colors.textBody}
                style={styles.previewLabel}
                numberOfLines={1}
              >
                {previewLabel}
              </AppText>
              <View style={styles.previewLine} />
              <View style={[styles.previewLine, { width: '70%' }]} />
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.textBlock}>
        <AppText variant="body2Regular14" numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="captionMedium12" color={Colors.textDisabled}>
          {fileCountLabel}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  preview: {
    height: 98,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPaper: {
    width: 56,
    height: 72,
    borderRadius: 6,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border1,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  labelPaper: {
    flex: 1,
    padding: 6,
    gap: 4,
  },
  previewLabel: {
    fontSize: 9,
    fontWeight: '600',
  },
  previewLine: {
    height: 4,
    width: '55%',
    borderRadius: 2,
    backgroundColor: Colors.border1,
  },
  textBlock: {
    gap: 2,
  },
});
