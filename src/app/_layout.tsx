import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TestingOverlay } from '@/components/testing-overlay';
import { AppStateProvider } from '@/data/app-state';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="activity-details"
            options={{ animation: 'slide_from_right' }}
          />

          <Stack.Screen
            name="my-documents"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="saved-receipts"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="receipt-details"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="select-saved-receipt"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="select-document"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="claim-confirmation"
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
        {/* Usability-testing wrapper overlaid on every screen (ported from
            admin-fe). Starts with the welcome, then guides through Task 1,
            SEQ rating, Task 2, SEQ rating, and the UMUX questions. */}
        <TestingOverlay />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
