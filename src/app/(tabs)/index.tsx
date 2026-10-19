import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';

import HomePageSvg from '@/assets/figma/home-page.svg';
import { ExpenseCard } from '@/components/expense-card';
import { AppText } from '@/components/ui/text';
import { Colors, Spacing } from '@/constants/theme';
import { useAppState } from '@/data/app-state';

// The Figma Home export is a 375x812 artboard. We crop it just above the
// Expenses section and render that list as real, interactive native cards
// below, so the Expenses_List is always visible and tappable (the previous
// invisible-overlay approach left the rows below the fold / unscrollable).
const ARTBOARD_WIDTH = 375;
const ARTBOARD_HEIGHT = 812;
// Height (in artboard units) of the portion we keep from the SVG: everything
// from the top through the HSA banner (incl. its scroll-dot indicator),
// stopping just above the "Expenses" title which we render natively below.
const SVG_CROP_HEIGHT = 724;
const CROP_ASPECT = ARTBOARD_WIDTH / SVG_CROP_HEIGHT;

/**
 * Home screen (attach-receipt-to-claim Requirement 1).
 *
 * The decorative upper area (header, account cards, HSA banner) is rendered
 * from the Figma SVG export, cropped just above the Expenses section. The
 * Expenses_List itself is rendered as native ExpenseCard components built 1:1
 * from Figma node 889:5544, so each Expense_Entry is a real, visible, tappable
 * row that opens the Activity_Details_Page for its Claim.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { expenses, getClaimById } = useAppState();
  const [navError, setNavError] = useState<string | null>(null);
  const [svgWidth, setSvgWidth] = useState(0);

  const onSvgLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w && w !== svgWidth) setSvgWidth(w);
  };
  const svgHeight = svgWidth > 0 ? svgWidth / CROP_ASPECT : undefined;

  const openActivityDetails = (claimId: string) => {
    setNavError(null);
    const claim = getClaimById(claimId);
    // Requirement 1.5: on failure, stay on Home and show an error.
    if (!claim) {
      setNavError("We couldn't open this activity. Please try again.");
      return;
    }
    try {
      router.push({ pathname: '/activity-details', params: { claimId } });
    } catch {
      setNavError("We couldn't open this activity. Please try again.");
    }
  };

  // Group expenses by month, preserving order (Requirement 1.1).
  const months = expenses.reduce<string[]>((acc, e) => {
    if (!acc.includes(e.month)) acc.push(e.month);
    return acc;
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative upper area from the Figma export, cropped above Expenses. */}
        <View
          style={[styles.svgWrapper, { height: svgHeight }]}
          onLayout={onSvgLayout}
          pointerEvents="none"
        >
          <HomePageSvg
            width="100%"
            height="100%"
            viewBox={`0 0 ${ARTBOARD_WIDTH} ${SVG_CROP_HEIGHT}`}
            preserveAspectRatio="xMidYMin meet"
          />
        </View>

        {/* Expenses_List — real native cards (Requirement 1). */}
        <View style={styles.expenses}>
          <AppText variant="body1Bold16" style={styles.expensesTitle}>
            Expenses
          </AppText>
          {months.map((month) => (
            <View key={month} style={styles.monthGroup}>
              <AppText variant="captionMedium12" color={Colors.textSecondary}>
                {month}
              </AppText>
              <View style={styles.cards}>
                {expenses
                  .filter((e) => e.month === month)
                  .map((expense) => {
                    const claim = getClaimById(expense.claimId);
                    return (
                      <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        actionRequired={claim?.status === 'needs-documentation'}
                        onPress={() => openActivityDetails(expense.claimId)}
                      />
                    );
                  })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {navError && (
        <View style={styles.errorBanner}>
          <AppText variant="body2Regular14" color={Colors.textOnColor}>
            {navError}
          </AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.module },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  svgWrapper: {
    width: '100%',
    aspectRatio: CROP_ASPECT,
    backgroundColor: Colors.darkBackground,
  },
  expenses: {
    paddingHorizontal: Spacing.xl, // 24, matches Figma container inset
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  expensesTitle: {
    marginBottom: Spacing.xs,
  },
  monthGroup: {
    gap: Spacing.sm,
  },
  cards: {
    gap: Spacing.sm,
  },
  errorBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 110,
    backgroundColor: Colors.danger,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
});
