import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStateProvider } from '@/data/app-state';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="my-documents"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="saved-receipts"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="gallery-picker"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="upload-receipt"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="associate-claim"
            options={{ animation: 'slide_from_right' }}
          />
        </Stack>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
