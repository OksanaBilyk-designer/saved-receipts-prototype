import { Text as RNText, type TextProps, type TextStyle } from 'react-native';

import { Colors, Typography } from '@/constants/theme';

type Variant = keyof typeof Typography;

export type AppTextProps = TextProps & {
  variant?: Variant;
  color?: string;
};

/**
 * Fixed-style text primitive matching the Figma type scale.
 * The design has a single fixed look (no dark mode), so this
 * intentionally does not adapt to system theme.
 */
export function AppText({ variant = 'body1Regular16', color, style, ...rest }: AppTextProps) {
  const typeStyle = Typography[variant] as TextStyle;
  return (
    <RNText
      style={[{ color: color ?? Colors.textBody, fontFamily: 'System' }, typeStyle, style]}
      {...rest}
    />
  );
}
