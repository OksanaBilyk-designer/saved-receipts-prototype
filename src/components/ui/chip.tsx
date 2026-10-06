import { Pressable, StyleSheet } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

import { AppText } from './text';

export type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: object;
};

/** Selectable chip matching the "Mobile Chips" Figma component. */
export function Chip({ label, selected, onPress, style }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, selected ? styles.selected : styles.unselected, style]}
    >
      <AppText variant="body2Regular14" color={selected ? Colors.textAccent : Colors.textBody}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  selected: {
    backgroundColor: Colors.accentContainer,
  },
  unselected: {
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border1,
  },
});
