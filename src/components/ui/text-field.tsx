import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { Colors, Radius } from '@/constants/theme';

export type AppTextFieldProps = TextInputProps;

/** Text input matching the "Mobile Field" Figma component. */
export function AppTextField(props: AppTextFieldProps) {
  return (
    <TextInput
      placeholderTextColor={Colors.textSecondary}
      style={styles.input}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border1,
    backgroundColor: Colors.canvas,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.textBody,
  },
});
