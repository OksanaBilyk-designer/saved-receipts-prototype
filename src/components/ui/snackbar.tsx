import { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

import { AppText } from './text';

export type SnackbarProps = {
  visible: boolean;
  boldPrefix: string;
  message: string;
  onHide: () => void;
  durationMs?: number;
};

/** Green success snackbar matching the Figma "Snackbar" component. */
export function Snackbar({ visible, boldPrefix, message, onHide, durationMs = 2600 }: SnackbarProps) {
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) return;

    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
        onHide();
      });
    }, durationMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.container, { opacity }]}>
      <AppText variant="body2Regular14" color={Colors.textOnColor}>
        <AppText variant="body2Bold14" color={Colors.textOnColor}>
          {boldPrefix}
        </AppText>{' '}
        {message}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: 110,
    backgroundColor: Colors.success,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    zIndex: 100,
  },
});
