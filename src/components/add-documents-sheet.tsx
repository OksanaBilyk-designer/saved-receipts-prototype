import { Pressable, StyleSheet, View } from 'react-native';

import CameraIcon from '@/assets/figma/claim/sheet-camera.svg';
import FolderIcon from '@/assets/figma/claim/sheet-folder.svg';
import GalleryIcon from '@/assets/figma/claim/sheet-gallery.svg';
import ReceiptIcon from '@/assets/figma/claim/sheet-receipt.svg';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';

export type AddDocumentsSheetProps = {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onViewGallery: () => void;
  onBrowseFiles: () => void;
  /**
   * Optional "Saved Receipts" tile. When provided, the sheet shows a fourth
   * tile that lets the user pick from already-saved receipts (used by the
   * attach-receipt-to-claim Upload Document flow). Omitted on the upload flow
   * where saving a new receipt is the goal.
   */
  onSavedReceipts?: () => void;
};

type IconComponent = React.FC<{ width?: number; height?: number }>;

/**
 * "Add Documents" bottom sheet, based on Figma node 889:4847 (Take Photo /
 * View Gallery / Browse Files). An optional "Saved Receipts" tile is added for
 * the attach-receipt-to-claim flow, laid out as a 2x2 grid, styled to match the
 * same Figma tile (tertiary-hover background, 100px tall, bold 14 label).
 */
export function AddDocumentsSheet({
  visible,
  onClose,
  onTakePhoto,
  onViewGallery,
  onBrowseFiles,
  onSavedReceipts,
}: AddDocumentsSheetProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlayContainer}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <AppText variant="body1Bold16" style={styles.title}>
          Add Documents
        </AppText>

        <View style={styles.row}>
          <SheetOption label="Take Photo" Icon={CameraIcon} onPress={onTakePhoto} />
          <SheetOption label="View Gallery" Icon={GalleryIcon} onPress={onViewGallery} />
        </View>
        <View style={styles.row}>
          <SheetOption label="Browse Files" Icon={FolderIcon} onPress={onBrowseFiles} />
          {/*
            When the "Saved Receipts" tile is present we show a 2x2 grid; when
            it is absent (the upload flow) Browse Files spans the full width on
            its own row, matching Figma node 889:4847.
          */}
          {onSavedReceipts && (
            <SheetOption label="Saved Receipts" Icon={ReceiptIcon} onPress={onSavedReceipts} />
          )}
        </View>
      </View>
    </View>
  );
}

function SheetOption({
  label,
  Icon,
  onPress,
}: {
  label: string;
  Icon: IconComponent;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, styles.buttonFilled, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <Icon width={24} height={24} />
      <AppText variant="body2Bold14" style={styles.buttonLabel}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlayPopupBg,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.canvas,
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    paddingTop: Spacing.xxl,
    paddingBottom: 48,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    alignItems: 'center',
  },
  handle: {
    position: 'absolute',
    top: Spacing.sm,
    width: 48,
    height: 5,
    borderRadius: Radius.pill,
    backgroundColor: Colors.border1,
  },
  title: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 100,
    borderRadius: Radius.md,
  },
  buttonFilled: {
    backgroundColor: Colors.accentContainer, // tertiary default-hover #e8f0fe
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 17,
    paddingHorizontal: Spacing.xl,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonLabel: {
    textAlign: 'center',
  },
});
