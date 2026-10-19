import { Pressable, StyleSheet, View } from 'react-native';

import TxDentalIcon from '@/assets/figma/claim/tx-dental.svg';
import TxOtherIcon from '@/assets/figma/claim/tx-other.svg';
import TxTransferIcon from '@/assets/figma/claim/tx-transfer.svg';
import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { Expense, ExpenseTile } from '@/data/types';

const TILE_BG: Record<ExpenseTile, string> = {
  dental: Colors.dental, // #176af6
  other: Colors.txOther, // #ff9d0a
  transfer: Colors.txNonClaimBg, // #e5e9f0
};

const TILE_ICON: Record<ExpenseTile, React.FC<{ width?: number; height?: number }>> = {
  dental: TxDentalIcon,
  other: TxOtherIcon,
  transfer: TxTransferIcon,
};

export type ExpenseCardProps = {
  expense: Expense;
  /** True when the backing Claim is a Claim_Needing_Documentation. */
  actionRequired: boolean;
  onPress: () => void;
};

/**
 * A single Expense_Entry on the Home_Page Expenses_List, built 1:1 from the
 * Figma "Mobile Transaction Cards" (node 889:5545). Shows the category tile +
 * icon, label, date, amount, and — only when the backing Claim is a
 * Claim_Needing_Documentation — the orange Action_Required_Indicator
 * (Requirement 1.2 / 1.3).
 */
export function ExpenseCard({ expense, actionRequired, onPress }: ExpenseCardProps) {
  const Icon = TILE_ICON[expense.tile];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${expense.label}, ${expense.amount}, ${expense.date}${
        actionRequired ? ', Action Required' : ''
      }`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.commonInfo}>
        <View style={[styles.tile, { backgroundColor: TILE_BG[expense.tile] }]}>
          <Icon width={24} height={24} />
        </View>
        <View style={styles.nameDate}>
          <AppText variant="body1Regular16" numberOfLines={1}>
            {expense.label}
          </AppText>
          <AppText variant="captionMedium12" color={Colors.textSecondary}>
            {expense.date}
          </AppText>
        </View>
      </View>

      <View style={styles.amountStatus}>
        <AppText variant="body1Bold16" style={styles.amount}>
          {expense.amount}
        </AppText>
        {actionRequired && (
          <AppText variant="captionMedium12" color={Colors.actionRequired} style={styles.amount}>
            Action Required
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg, // 16
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border2, // #eef1f4
    borderRadius: Radius.md, // 8
  },
  pressed: {
    backgroundColor: Colors.module,
  },
  commonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md, // 12
    flex: 1,
  },
  tile: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameDate: {
    gap: 2,
    flex: 1,
  },
  amountStatus: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  amount: {
    textAlign: 'right',
  },
});
