import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type DropSpec = { left: number; size: number; duration: number; delay: number; opacity: number };

function RainDrop({ spec }: { spec: DropSpec }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(spec.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: spec.duration,
          useNativeDriver: true,
        }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, spec]);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-60, SCREEN_H + 60] });
  return (
    <Animated.View
      style={[
        styles.drop,
        {
          left: spec.left,
          height: spec.size,
          opacity: spec.opacity,
          transform: [{ translateY }, { rotate: '12deg' }],
        },
      ]}
    />
  );
}

/**
 * Flashy full-screen activation animation shown when Rain / Glove Mode is
 * switched ON: rain falls across the screen, a glove badge pulses inside a
 * glowing ring, and a shimmering loader bar fills before the overlay fades.
 */
export function RainGloveOverlay({ visible }: { visible: boolean }) {
  const fade = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const load = useRef(new Animated.Value(0)).current;

  const drops = useMemo<DropSpec[]>(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: (SCREEN_W / 22) * i + ((i * 37) % 14),
        size: 14 + ((i * 13) % 18),
        duration: 650 + ((i * 97) % 500),
        delay: (i * 83) % 600,
        opacity: 0.35 + ((i * 7) % 50) / 100,
      })),
    [],
  );

  useEffect(() => {
    if (!visible) return;
    fade.setValue(0);
    load.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    Animated.timing(load, { toValue: 1, duration: 1650, useNativeDriver: false }).start();
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.22, duration: 420, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 420, useNativeDriver: true }),
      ]),
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [visible, fade, load, pulse]);

  if (!visible) return null;

  const barWidth = load.interpolate({ inputRange: [0, 1], outputRange: ['4%', '100%'] });

  return (
    <Animated.View style={[styles.overlay, { opacity: fade }]} pointerEvents="none">
      <LinearGradient colors={['rgba(4,30,46,0.88)', 'rgba(6,45,32,0.92)']} style={styles.fill}>
        {drops.map((d, i) => (
          <RainDrop key={i} spec={d} />
        ))}

        <View style={styles.center}>
          <Animated.View style={[styles.gloveRing, { transform: [{ scale: pulse }] }]}>
            <Text style={styles.gloveEmoji}>🧤</Text>
            <Text style={styles.cloudEmoji}>🌧️</Text>
          </Animated.View>
          <Text style={styles.title}>RAIN / GLOVE MODE</Text>
          <Text style={styles.sub}>Activating big buttons for wet hands…</Text>

          <View style={styles.loaderTrack}>
            <Animated.View style={[styles.loaderFillWrap, { width: barWidth }]}>
              <LinearGradient
                colors={['#2dd4bf', '#a3e635', '#bef264']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loaderFill}
              />
            </Animated.View>
          </View>
          <Text style={styles.dropsText}>💧 💧 💧</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 50, elevation: 50 },
  fill: { flex: 1, overflow: 'hidden' },
  drop: {
    position: 'absolute',
    top: 0,
    width: 3,
    borderRadius: 2,
    backgroundColor: '#7dd3fc',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  gloveRing: {
    width: 196,
    height: 196,
    borderRadius: 98,
    backgroundColor: 'rgba(163,230,53,0.14)',
    borderWidth: 3,
    borderColor: '#a3e635',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a3e635',
    shadowOpacity: 0.8,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  gloveEmoji: { fontSize: 96 },
  cloudEmoji: { fontSize: 40, marginTop: -10 },
  title: {
    color: '#f0fdf4',
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 26,
    textAlign: 'center',
  },
  sub: { color: '#bae6fd', fontSize: 16, marginTop: 8, textAlign: 'center', lineHeight: 22 },
  loaderTrack: {
    width: '82%',
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginTop: 30,
    overflow: 'hidden',
  },
  loaderFillWrap: { height: '100%' },
  loaderFill: { flex: 1, borderRadius: 7 },
  dropsText: { fontSize: 18, marginTop: 18, letterSpacing: 6 },
});
