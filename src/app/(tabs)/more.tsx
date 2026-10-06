import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';

type MoreOption = { label: string; onPress: () => void };

/**
 * More tab. Requirement 1: lists options including "My Documents",
 * which navigates to the My Documents page.
 */
export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const options: MoreOption[] = [
    { label: 'My Documents', onPress: () => router.push('/my-documents') },
    { label: 'Account Settings', onPress: () => {} },
    { label: 'Notifications', onPress: () => {} },
    { label: 'Help & Support', onPress: () => {} },
    { label: 'Sign Out', onPress: () => {} },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top + Spacing.xl }]}>
      <AppText variant="h2Bold24" style={{ marginBottom: Spacing.lg }}>
        More
      </AppText>
      <View style={styles.list}>
        {options.map((option) => (
          <Pressable key={option.label} onPress={option.onPress} style={styles.row}>
            <AppText variant="body1Regular16">{option.label}</AppText>
            <AppText variant="body1Regular16" color={Colors.textDisabled}>
              ›
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.module, paddingHorizontal: Spacing.lg },
  list: {
    backgroundColor: Colors.canvas,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border2,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border2,
  },
});
