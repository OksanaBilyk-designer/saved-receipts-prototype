import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/text';
import { Colors, Spacing } from '@/constants/theme';

/** Claims tab — faked/minimal placeholder, out of scope for this prototype. */
export default function ClaimsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + Spacing.xl }]}>
      <AppText variant="h2Bold24">Claims</AppText>
      <AppText variant="body2Regular14" color={Colors.textSecondary} style={{ marginTop: Spacing.sm }}>
        Not part of this prototype.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.canvas, paddingHorizontal: Spacing.xl },
});
