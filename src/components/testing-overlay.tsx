import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/text';

/* ==========================================================================
   Usability-testing overlay — ported from admin-fe's testing-template
   (public/banking-balance/testing-overlay.js|css) to a React Native component.
   Flow: welcome -> task 1 -> SEQ rating -> task 2 -> SEQ rating -> UMUX -> thanks.
   Self-contained colors to match the original (not the prototype's tokens).
   ========================================================================== */

const C = {
  yellow: '#FFE992',
  green: '#D6F5E0',
  primary: '#3D5AFE',
  primaryHover: '#2f4ae0',
  ink: '#1a1a1a',
  white: '#ffffff',
  backdrop: 'rgba(15, 23, 42, 0.55)',
  ratingBorder: 'rgba(0,0,0,0.15)',
  checkGreen: '#16a34a',
};

const WELCOME = {
  title: 'Welcome!',
  body:
    "Imagine you're a user who captures photos of receipts in the app and saves them for existing or future claims. " +
    'You have a couple of tasks to complete. Please think aloud as you go.',
};

type Task = {
  intro: string;
  prompt: string;
  details: { label: string; value: string }[];
  note?: string;
};

const TASKS: Task[] = [
  {
    intro:
      'You have receipts that you use regularly for your expenses. You want to save a receipt so you can quickly add it to a claim in the future without having to upload it again.',
    prompt: 'Find a way to save the receipt for future use:',
    details: [{ label: 'Receipt details', value: 'Amazon one medical, $199' }],
    note: "For now, you don't need to attach the receipt to any claim.",
  },
  {
    intro:
      "Actually, you've just remembered that you need to attach the receipt you saved to a claim.",
    prompt: 'Find a way to attach the saved receipt to the claim:',
    details: [
      { label: 'Provider', value: 'Dr. van Nostrand' },
      { label: 'Amount', value: '$199' },
    ],
  },
];

const UMUX_QUESTIONS = [
  "This prototype's capabilities meet my requirements.",
  'This prototype is easy to use.',
];

type Stage =
  | { kind: 'welcome' }
  | { kind: 'task'; index: number }
  | { kind: 'rate'; index: number }
  | { kind: 'umux' }
  | { kind: 'thanks' };

const SCALE = [1, 2, 3, 4, 5, 6, 7];

export function TestingOverlay() {
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState<Stage>({ kind: 'welcome' });
  const [collapsed, setCollapsed] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [umuxCap, setUmuxCap] = useState<number | null>(null);
  const [umuxEasy, setUmuxEasy] = useState<number | null>(null);

  const startTask = (i: number) => {
    setRating(null);
    setStage({ kind: 'task', index: i });
  };

  // Show the Task 1 card automatically; the user collapses it to the pin
  // themselves (via ✕ or the backdrop) when they want to work in the prototype.
  const handleStart = () => {
    startTask(0);
  };

  const markComplete = (i: number) => {
    setRating(null);
    setStage({ kind: 'rate', index: i });
  };

  const submitRating = () => {
    if (rating === null || stage.kind !== 'rate') return;
    const next = stage.index + 1;
    setRating(null);
    if (next >= TASKS.length) {
      setStage({ kind: 'umux' });
    } else {
      // Show the next task card expanded (user collapses it themselves to work).
      startTask(next);
    }
  };

  const submitUmux = () => {
    if (umuxCap && umuxEasy) setStage({ kind: 'thanks' });
  };

  const isThanks = stage.kind === 'thanks';

  // ---- Collapsed: show only the pin top-right -----------------------------
  if (collapsed) {
    return (
      <View style={styles.root} pointerEvents="box-none">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reopen testing panel"
          onPress={() => setCollapsed(false)}
          style={[styles.pin, isThanks && styles.pinGreen, { top: insets.top + 12 }]}
        >
          <View style={styles.pinLines}>
            <View style={styles.pinLine} />
            <View style={styles.pinLine} />
            <View style={styles.pinLine} />
          </View>
        </Pressable>
      </View>
    );
  }

  // ---- Expanded panel -----------------------------------------------------
  return (
    <View style={styles.root} pointerEvents="box-none">
      <Pressable
        style={styles.backdrop}
        onPress={() => {
          if (stage.kind === 'welcome') handleStart();
          else setCollapsed(true);
        }}
      />
      <View
        style={[
          styles.panel,
          isThanks ? styles.panelGreen : styles.panelYellow,
          stage.kind === 'umux' && styles.panelWide,
          { top: insets.top + 12 },
        ]}
      >
        {/* Minimize (X) — top-right */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Minimize panel"
          onPress={() => {
            if (stage.kind === 'welcome') handleStart();
            else setCollapsed(true);
          }}
          style={styles.close}
          hitSlop={8}
        >
          <AppText style={styles.closeGlyph}>✕</AppText>
        </Pressable>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.panelContent}
        >
          {stage.kind === 'welcome' && (
            <>
              <AppText style={styles.emoji}>👋</AppText>
              <AppText style={styles.title}>{WELCOME.title}</AppText>
              <AppText style={styles.body}>{WELCOME.body}</AppText>
              <PrimaryButton label="Start Testing" onPress={handleStart} />
            </>
          )}

          {stage.kind === 'task' && (
            <>
              <Badge n={stage.index + 1} />
              <AppText style={styles.body}>{TASKS[stage.index].intro}</AppText>
              <AppText style={styles.bodyBold}>Task {stage.index + 1}</AppText>
              <AppText style={styles.body}>Think out loud as you go.</AppText>
              <AppText style={styles.body}>{TASKS[stage.index].prompt}</AppText>
              <View style={styles.details}>
                {TASKS[stage.index].details.map((d) => (
                  <AppText key={d.label} style={styles.detailLine}>
                    <AppText style={styles.detailLabel}>{d.label}: </AppText>
                    {d.value}
                  </AppText>
                ))}
              </View>
              {TASKS[stage.index].note && (
                <AppText style={styles.body}>{TASKS[stage.index].note}</AppText>
              )}
              <SecondaryButton
                label="Finished? Rate Experience"
                onPress={() => markComplete(stage.index)}
              />
            </>
          )}

          {stage.kind === 'rate' && (
            <>
              <Badge n={stage.index + 1} />
              <AppText style={styles.question}>
                How easy or difficult was it to complete this task?
              </AppText>
              <View style={styles.ratingLabels}>
                <AppText style={styles.ratingLabelText}>Very Difficult</AppText>
                <AppText style={styles.ratingLabelText}>Very Easy</AppText>
              </View>
              <RatingScale value={rating} onPick={setRating} />
              <PrimaryButton
                label={rating === null ? 'Choose Grade' : 'Submit'}
                disabled={rating === null}
                onPress={submitRating}
              />
            </>
          )}

          {stage.kind === 'umux' && (
            <>
              <AppText style={[styles.title, styles.titleSmall]}>
                A couple quick questions
              </AppText>
              <View style={styles.umuxItem}>
                <AppText style={styles.umuxPrompt}>{UMUX_QUESTIONS[0]}</AppText>
                <RatingScale value={umuxCap} onPick={setUmuxCap} />
              </View>
              <View style={styles.umuxItem}>
                <AppText style={styles.umuxPrompt}>{UMUX_QUESTIONS[1]}</AppText>
                <RatingScale value={umuxEasy} onPick={setUmuxEasy} />
              </View>
              <PrimaryButton
                label="Submit"
                disabled={!(umuxCap && umuxEasy)}
                onPress={submitUmux}
              />
            </>
          )}

          {stage.kind === 'thanks' && (
            <>
              <View style={styles.checkCircle}>
                <AppText style={styles.checkGlyph}>✓</AppText>
              </View>
              <AppText style={[styles.title, styles.center]}>
                Thank you for your participation!
              </AppText>
              <AppText style={styles.subtitle}>Your feedback has been recorded.</AppText>
              <PrimaryButton label="Close" onPress={() => setCollapsed(true)} />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <View style={styles.badge}>
      <AppText style={styles.badgeText}>{n}</AppText>
    </View>
  );
}

function RatingScale({
  value,
  onPick,
}: {
  value: number | null;
  onPick: (n: number) => void;
}) {
  return (
    <View style={styles.ratingScale}>
      {SCALE.map((n) => {
        const active = value === n;
        return (
          <Pressable
            key={n}
            accessibilityRole="button"
            accessibilityLabel={`Rating ${n}`}
            onPress={() => onPick(n)}
            style={[styles.ratingBtn, active && styles.ratingBtnActive]}
          >
            <AppText style={[styles.ratingBtnText, active && styles.ratingBtnTextActive]}>
              {n}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btnPrimary,
        disabled && styles.btnPrimaryDisabled,
        pressed && !disabled && styles.btnPrimaryPressed,
      ]}
    >
      <AppText style={styles.btnPrimaryText}>{label}</AppText>
    </Pressable>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.btnSecondary, pressed && styles.btnSecondaryPressed]}
    >
      <AppText style={styles.btnSecondaryText}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.backdrop,
  },
  panel: {
    position: 'absolute',
    right: 16,
    left: 16,
    maxWidth: 360,
    alignSelf: 'flex-end',
    borderRadius: 8,
    padding: 20,
    boxShadow: '0px 10px 30px rgba(15, 23, 42, 0.18)',
    maxHeight: '85%',
  },
  panelYellow: { backgroundColor: C.yellow },
  panelGreen: { backgroundColor: C.green },
  panelWide: { maxWidth: 380 },
  panelContent: {
    paddingTop: 8,
  },
  close: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  closeGlyph: { fontSize: 16, color: C.ink, fontWeight: '700' },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeText: { color: C.white, fontWeight: '600', fontSize: 13 },
  emoji: { fontSize: 36, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: C.ink, marginBottom: 8 },
  titleSmall: { fontSize: 18 },
  body: { fontSize: 15, lineHeight: 21, color: C.ink, marginBottom: 16 },
  bodyBold: { fontSize: 15, lineHeight: 21, color: C.ink, fontWeight: '700', marginBottom: 6 },
  details: {
    marginBottom: 16,
    gap: 2,
  },
  detailLine: { fontSize: 15, lineHeight: 21, color: C.ink },
  detailLabel: { fontWeight: '700' },
  question: { fontSize: 15, fontWeight: '600', color: C.ink, marginVertical: 12 },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ratingLabelText: { fontSize: 12, fontWeight: '500', color: C.ink },
  ratingScale: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  ratingBtn: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: C.ratingBorder,
    borderRadius: 6,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBtnActive: { backgroundColor: C.ink, borderColor: C.ink },
  ratingBtnText: { fontSize: 14, fontWeight: '600', color: C.ink },
  ratingBtnTextActive: { color: C.white },
  umuxItem: { marginBottom: 18 },
  umuxPrompt: { fontSize: 14, fontWeight: '500', color: C.ink, marginBottom: 8, lineHeight: 20 },
  btnPrimary: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryPressed: { backgroundColor: C.primaryHover },
  btnPrimaryDisabled: { backgroundColor: 'rgba(61, 90, 254, 0.35)' },
  btnPrimaryText: { color: C.white, fontSize: 15, fontWeight: '600' },
  btnSecondary: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.ratingBorder,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnSecondaryPressed: { backgroundColor: 'rgba(255,255,255,0.9)' },
  btnSecondaryText: { color: C.ink, fontSize: 14, fontWeight: '500' },
  center: { textAlign: 'center' },
  subtitle: { fontSize: 14, color: C.ink, textAlign: 'center', marginTop: 12, marginBottom: 4 },
  checkCircle: {
    width: 56,
    height: 56,
    borderWidth: 3,
    borderColor: C.checkGreen,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  checkGlyph: { fontSize: 28, color: C.checkGreen, fontWeight: '700' },
  pin: {
    position: 'absolute',
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: C.yellow,
    borderWidth: 2,
    borderColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 6px 18px rgba(15, 23, 42, 0.18)',
  },
  pinGreen: { backgroundColor: C.green },
  pinLines: { gap: 3 },
  pinLine: { width: 16, height: 2, borderRadius: 2, backgroundColor: C.ink },
});
