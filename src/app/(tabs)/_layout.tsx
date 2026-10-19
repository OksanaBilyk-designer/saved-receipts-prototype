import { Tabs } from 'expo-router';

import { MobileTabBar } from '@/components/mobile-tab-bar';

/**
 * Bottom tab navigator. The visible bar is rendered from the Figma
 * Mobile Navigation SVG via MobileTabBar. The "claims" screen is kept
 * registered (it backs the More Options entry point) but hidden from the bar.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <MobileTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="claims" options={{ title: 'Claims' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
    </Tabs>
  );
}
