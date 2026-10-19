import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import { AppText } from '@/components/ui/text';
import { Colors, Radius, Spacing } from '@/constants/theme';

/**
 * More Options page (Figma node 889:4048).
 * Three option cards (My Documents, Settings, Help Center) + contact info.
 * Per request, only "My Documents" is clickable; Settings and Help Center are
 * visual-only. Navigation bar is provided by the tabs layout (not recreated).
 */
export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xl }]}>
        <AppText variant="body1Bold16">More Options</AppText>
      </View>

      <View style={styles.body}>
        {/* Option cards */}
        <View style={styles.cards}>
          <OptionCard
            icon={<DocumentIcon />}
            title="My Documents"
            subtitle="Keep your important documents in one secure and easy-to-access place"
            onPress={() => router.push('/my-documents')}
          />
          <OptionCard
            icon={<SettingsIcon />}
            title="Settings"
            subtitle="Quick access to settings, previously in bottom navigation"
          />
          <OptionCard
            icon={<HelpIcon />}
            title="Help Center"
            subtitle="Explore guides and troubleshooting steps"
          />
        </View>

        {/* Contact info */}
        <View style={styles.contact}>
          <ContactRow icon={<PhoneIcon />} text="+1344593344" copyable />
          <ContactRow icon={<MailIcon />} text="support123412412@mail.com" copyable />
          <ContactRow icon={<ClockIcon />} text="weekdays, 9 AM–6 PM" />
        </View>
      </View>
    </View>
  );
}

function OptionCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
      android_disableSound={!onPress}
    >
      <View style={styles.cardIcon}>{icon}</View>
      <View style={styles.cardText}>
        <AppText variant="body1Regular16">{title}</AppText>
        <AppText variant="body2Regular14" color={Colors.textSecondary} style={styles.cardSubtitle}>
          {subtitle}
        </AppText>
      </View>
    </Pressable>
  );
}

function ContactRow({
  icon,
  text,
  copyable,
}: {
  icon: React.ReactNode;
  text: string;
  copyable?: boolean;
}) {
  return (
    <View style={styles.contactRow}>
      <View style={styles.contactIcon}>{icon}</View>
      <AppText variant="body2Regular14" style={styles.contactText}>
        {text}
      </AppText>
      {copyable ? <CopyIcon /> : null}
    </View>
  );
}

/* --- Original, simple vector glyphs (not from any proprietary icon set) --- */

function DocumentIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={3} width={14} height={18} rx={2} stroke={Colors.textBody} strokeWidth={2} />
      <Path
        d="M8.5 8h7M8.5 12h7M8.5 16h4"
        stroke={Colors.textBody}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function SettingsIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke={Colors.textBody}
        strokeWidth={2}
      />
      <Path
        d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.07-.4.1-.8.1-1.2Z"
        stroke={Colors.textBody}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HelpIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 4h6v6M20 4l-8 8"
        stroke={Colors.textBody}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"
        stroke={Colors.textBody}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 6a2 2 0 0 1 2-2Z"
        stroke={Colors.textBody}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MailIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={5} width={18} height={14} rx={2} stroke={Colors.textBody} strokeWidth={2} />
      <Path d="m4 7 8 6 8-6" stroke={Colors.textBody} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

function ClockIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke={Colors.textBody} strokeWidth={2} />
      <Path d="M12 7v5l3 2" stroke={Colors.textBody} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function CopyIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x={9} y={9} width={11} height={11} rx={2} stroke={Colors.textSecondary} strokeWidth={2} />
      <Path
        d="M5 15V5a2 2 0 0 1 2-2h8"
        stroke={Colors.textSecondary}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.module },
  header: {
    backgroundColor: Colors.canvas,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  cards: {
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.canvas,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border2,
    padding: Spacing.lg,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.module,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
  cardSubtitle: {
    marginTop: 2,
  },
  contact: {
    gap: 0,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border2,
  },
  contactIcon: {
    width: 24,
    alignItems: 'center',
  },
  contactText: {
    flex: 1,
  },
});
