import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

const ACTIVE = '#176AF6';
const INACTIVE = '#0F1621';

type NavState = {
  index: number;
  routes: { key: string; name: string }[];
};

type TabBarProps = {
  state: NavState;
  navigation: { navigate: (name: string) => void };
};

type IconProps = { color: string };

/** Original, simple vector glyphs matching the shapes in the Figma nav. */
function HomeIcon({ color }: IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-8.5Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function AccountsIcon({ color }: IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={6} width={18} height={12} rx={2} stroke={color} strokeWidth={2} />
      <Path d="M16 10h2v4h-2a2 2 0 0 1 0-4Z" fill={color} />
    </Svg>
  );
}

function CardsIcon({ color }: IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={6} width={18} height={12} rx={2} stroke={color} strokeWidth={2} />
      <Path d="M7 14h4" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Rect x={15} y={12.5} width={3} height={3} rx={0.5} fill={color} />
    </Svg>
  );
}

function MoreIcon({ color }: IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={4} width={7} height={7} rx={1.5} stroke={color} strokeWidth={2} />
      <Rect x={13} y={4} width={7} height={7} rx={3.5} stroke={color} strokeWidth={2} />
      <Rect x={4} y={13} width={7} height={7} rx={3.5} stroke={color} strokeWidth={2} />
      <Rect x={13} y={13} width={7} height={7} rx={1.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

/** Dollar-coin glyph for the raised center FAB (white on blue). */
function MoneyIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"
        fill="#ffffff"
        opacity={0.18}
      />
      <Path
        d="M12 7v10M9.5 9.2c0-1 1.1-1.7 2.5-1.7s2.5.7 2.5 1.7-1.1 1.5-2.5 1.5-2.5.6-2.5 1.6 1.1 1.7 2.5 1.7 2.5-.7 2.5-1.7"
        stroke="#ffffff"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Bottom navigation with per-item icons + labels so the active tab can be
 * highlighted in blue while the rest stay black. Replaces the previous baked
 * SVG (whose colors were fixed). Keeps the white background and raised center
 * "Use My Money" FAB. Routing: Home -> index, More -> more. "Accounts",
 * "Use My Money" and "Cards" are visual-only placeholders for this prototype.
 */
export function MobileTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  // Map which tab is active from the router state. The registered routes are
  // index (Home), claims, more. Home is active when index route is focused;
  // More is active when the more route is focused.
  const activeRouteName = state.routes[state.index]?.name ?? 'index';
  const isHome = activeRouteName === 'index';
  const isMore = activeRouteName === 'more';

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.row}>
        <NavItem
          label="Home"
          active={isHome}
          onPress={() => navigation.navigate('index')}
          renderIcon={(c) => <HomeIcon color={c} />}
        />
        <NavItem
          label="Accounts"
          active={false}
          renderIcon={(c) => <AccountsIcon color={c} />}
        />

        {/* Center raised FAB */}
        <View style={styles.centerSlot}>
          <View style={styles.fab}>
            <MoneyIcon />
          </View>
          <Text style={styles.centerLabel}>Use My{'\n'}Money</Text>
        </View>

        <NavItem label="Cards" active={false} renderIcon={(c) => <CardsIcon color={c} />} />
        <NavItem
          label="More"
          active={isMore}
          onPress={() => navigation.navigate('more')}
          renderIcon={(c) => <MoreIcon color={c} />}
        />
      </View>
    </View>
  );
}

function NavItem({
  label,
  active,
  onPress,
  renderIcon,
}: {
  label: string;
  active: boolean;
  onPress?: () => void;
  renderIcon: (color: string) => React.ReactNode;
}) {
  const color = active ? ACTIVE : INACTIVE;
  return (
    <Pressable style={styles.item} onPress={onPress}>
      {renderIcon(color)}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eef1f4',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ACTIVE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    boxShadow: '0px 6px 12px rgba(23, 106, 246, 0.4)',
    elevation: 6,
  },
  centerLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: INACTIVE,
    textAlign: 'center',
    marginTop: 2,
  },
});
