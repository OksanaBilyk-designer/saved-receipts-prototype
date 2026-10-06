import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';

export type DocumentFolderCardProps = {
  title: string;
  fileCountLabel: string;
  tintColor: string;
  onPress?: () => void;
};

/** Matches the "My Documents / Folders" Figma component. */
export function DocumentFolderCard({ title, fileCountLabel, tintColor, onPress }: DocumentFolderCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={[styles.preview, { backgroundColor: tintColor }]}>
        <View style={styles.previewPaper} />
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
  },
  textBlock: {
    gap: 2,
  },
});
