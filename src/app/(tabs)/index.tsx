import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';

/**
 * Home tab — faked/minimal. The Saved Receipts spec does not define this
 * screen's behavior, so it exists only to give the prototype a realistic
 * entry point and is not part of the tested flow.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xl }]}>
        <AppText variant="captionMedium12" color="rgba(255,255,255,0.6)">
          Good afternoon
        </AppText>
        <AppText variant="h2Bold24" color={Colors.textOnColor}>
          Jordan Avery
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <AppText variant="captionMedium12" color={Colors.textSecondary}>
            HSA Balance
          </AppText>
          <AppText variant="h2Bold24">$2,418.52</AppText>
        </View>

        <View style={styles.card}>
          <AppText variant="body1Bold16">Recent Activity</AppText>
          <AppText variant="body2Regular14" color={Colors.textSecondary} style={{ marginTop: Spacing.xs }}>
            Dental cleaning · $320.00 · pending documentation
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.module },
  header: {
    backgroundColor: Colors.darkBackground,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    gap: Spacing.xs,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.canvas,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border2,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
});
