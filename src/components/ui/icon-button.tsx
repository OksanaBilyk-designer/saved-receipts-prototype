import { Pressable, StyleSheet, Text } from 'react-native';

export type IconButtonProps = {
  icon: 'back' | 'close' | 'plus' | 'search';
  onPress?: () => void;
  color?: string;
  size?: number;
};

/**
 * Minimal glyph-based icon button. The Figma design uses SVG icons from its
 * asset pipeline; since this is a from-scratch Expo prototype we render
 * simple text glyphs so there is zero dependency on external icon packages
 * while keeping tap targets and placement identical to the design.
 */
export function IconButton({ icon, onPress, color = '#0f1621', size = 24 }: IconButtonProps) {
  const glyph = { back: '‹', close: '×', plus: '+', search: '⌕' }[icon];
  return (
    <Pressable onPress={onPress} style={styles.hitbox} hitSlop={8}>
      <Text style={{ color, fontSize: size, lineHeight: size + 2, fontWeight: '600' }}>{glyph}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitbox: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
