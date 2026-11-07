import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const COLORS = {
  bgDeep: '#04150f',
  bg: '#06231a',
  card: 'rgba(255,255,255,0.08)',
  cardBorder: 'rgba(255,255,255,0.16)',
  text: '#f0fdf4',
  muted: '#a7c4b5',
  lime: '#a3e635',
  teal: '#2dd4bf',
  danger: '#f87171',
};

/** Glossy gradient card with a soft top highlight, like the web prototype. */
export function GlossyCard({
  children,
  gradient,
  style,
  onPress,
}: {
  children: React.ReactNode;
  gradient?: [string, string];
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  const inner = (
    <>
      <View style={styles.highlight} />
      {children}
    </>
  );
  if (gradient) {
    const card = (
      <LinearGradient colors={gradient} style={[styles.card, style]}>
        {inner}
      </LinearGradient>
    );
    return onPress ? (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {card}
      </Pressable>
    ) : (
      card
    );
  }
  const card = <View style={[styles.card, styles.plainCard, style]}>{inner}</View>;
  return onPress ? (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {card}
    </Pressable>
  ) : (
    card
  );
}

export function BigButton({
  title,
  onPress,
  glove,
  variant = 'primary',
}: {
  title: string;
  onPress: () => void;
  glove: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
}) {
  const pad = glove ? 20 : 14;
  const font = glove ? 19 : 16;
  if (variant === 'primary') {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        <LinearGradient
          colors={['#bef264', '#65a30d']}
          style={[styles.btn, { paddingVertical: pad }]}
        >
          <View style={styles.highlight} />
          <Text style={[styles.btnTextDark, { fontSize: font }]}>{title}</Text>
        </LinearGradient>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        variant === 'danger' ? styles.btnDanger : styles.btnGhost,
        { paddingVertical: pad },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          variant === 'danger' ? styles.btnTextDanger : styles.btnTextLight,
          { fontSize: font },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  glove,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  glove: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        { paddingVertical: glove ? 12 : 8, paddingHorizontal: glove ? 18 : 14 },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected, { fontSize: glove ? 17 : 14 }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  plainCard: { backgroundColor: COLORS.card },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  pressed: { opacity: 0.82 },
  btn: {
    borderRadius: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  btnGhost: { backgroundColor: 'rgba(255,255,255,0.08)' },
  btnDanger: { backgroundColor: 'rgba(248,113,113,0.14)', borderColor: 'rgba(248,113,113,0.5)' },
  btnTextDark: { color: '#1a2e05', fontWeight: '800' },
  btnTextLight: { color: COLORS.text, fontWeight: '700' },
  btnTextDanger: { color: COLORS.danger, fontWeight: '700' },
  chip: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  chipText: { color: COLORS.text },
  chipTextSelected: { color: '#1a2e05', fontWeight: '700' },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 22,
    marginBottom: 10,
  },
});
