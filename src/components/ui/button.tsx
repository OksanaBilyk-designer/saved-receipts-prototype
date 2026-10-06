import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

import { AppText } from './text';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link';

export type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
};

/**
 * Button matching the "Mobile Buttons" component from the Figma design system.
 * Variants mirror the Figma variants: Primary / Secondary / Tertiary / Link.
 */
export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  testID,
}: AppButtonProps) {
  return (
    <Pressable
      testID={testID}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'primary' && disabled && styles.primaryDisabled,
        variant === 'secondary' && styles.secondary,
        variant === 'tertiary' && styles.tertiary,
        variant === 'link' && styles.link,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <AppText
        variant="body2Bold14"
        color={
          variant === 'primary'
            ? disabled
              ? Colors.textDisabled
              : Colors.textOnColor
            : variant === 'secondary'
              ? Colors.textAccent
              : variant === 'link'
                ? Colors.textAccent
                : Colors.textBody
        }
      >
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
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: Colors.buttonPrimaryDefault,
  },
  primaryDisabled: {
    backgroundColor: Colors.buttonPrimaryDisabled,
  },
  secondary: {
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.buttonSecondaryBorder,
  },
  tertiary: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingHorizontal: 0,
  },
  pressed: {
    opacity: 0.8,
  },
});
