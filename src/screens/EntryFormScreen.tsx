import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { GLOW_COLOURS } from '../templates';
import type { FieldEntry, TemplateDef } from '../types';
import { BigButton, COLORS, Chip, GlossyCard } from '../components/ui';
import { newId } from '../storage';

export function EntryFormScreen({
  template,
  glove,
  onSave,
  onCancel,
}: {
  template: TemplateDef;
  glove: boolean;
  onSave: (entry: FieldEntry) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [values, setValues] = useState<Record<string, string>>({ brightness: '3' });
  const [notes, setNotes] = useState('');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLabel, setLocationLabel] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const setValue = (k: string, v: string) => setValues((prev) => ({ ...prev, [k]: v }));
  const labelSize = glove ? 18 : 15;
  const inputSize = glove ? 18 : 15;

  async function useLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location off', 'Permission was not given. You can still type the place name below.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      if (!locationLabel) {
        setLocationLabel(
          `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        );
      }
    } catch {
      Alert.alert('Location unavailable', 'GPS did not respond (common under thick canopy). Type the place name instead.');
    }
  }

  async function attachPhoto(fromCamera: boolean) {
    try {
      const perm = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Photo off', 'Permission was not given, so no photo was attached.');
        return;
      }
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Photo unavailable', 'The camera / photo library did not open on this device.');
    }
  }

  async function toggleVoiceRecording() {
    try {
      if (recording) {
        const rec = recordingRef.current;
        recordingRef.current = null;
        setRecording(false);
        if (rec) {
          await rec.stopAndUnloadAsync();
          setVoiceUri(rec.getURI());
        }
        return;
      }
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Microphone off', 'Permission was not given, so the voice note was not recorded. You can type notes instead.');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = rec;
      setRecording(true);
    } catch {
      setRecording(false);
      Alert.alert('Voice note unavailable', 'Recording did not start on this device. You can type notes instead.');
    }
  }

  async function playVoice() {
    if (!voiceUri) return;
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: voiceUri });
      await sound.playAsync();
    } catch {
      Alert.alert('Playback unavailable', 'The voice note could not be played on this device.');
    }
  }

  function save() {
    const trimmed = title.trim();
    if (!trimmed) {
      Alert.alert('Add a title', 'Give this finding a short title so you can find it later.');
      return;
    }
    onSave({
      id: newId(),
      templateKey: template.key,
      notebookKey: template.defaultNotebook,
      title: trimmed,
      values,
      notes: notes.trim(),
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
      locationLabel: locationLabel.trim(),
      photoUri,
      voiceUri,
      starred: false,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.heading}>
        {template.icon} {template.title}
      </Text>
      <Text style={styles.auto}>
        🕒 {new Date().toLocaleString()} · auto-filled, saved offline on this phone
      </Text>

      <Text style={[styles.label, { fontSize: labelSize }]}>Title *</Text>
      <TextInput
        style={[styles.input, { fontSize: inputSize }]}
        placeholder="Short name for this finding"
        placeholderTextColor={COLORS.muted}
        value={title}
        onChangeText={setTitle}
      />

      {template.fields.map((f) => (
        <View key={f.key}>
          <Text style={[styles.label, { fontSize: labelSize }]}>{f.label}</Text>
          {f.type === 'text' && (
            <TextInput
              style={[styles.input, { fontSize: inputSize }]}
              placeholder={f.placeholder}
              placeholderTextColor={COLORS.muted}
              value={values[f.key] ?? ''}
              onChangeText={(v) => setValue(f.key, v)}
            />
          )}
          {f.type === 'multiline' && (
            <TextInput
              style={[styles.input, styles.multiline, { fontSize: inputSize }]}
              placeholder={f.placeholder}
              placeholderTextColor={COLORS.muted}
              value={values[f.key] ?? ''}
              onChangeText={(v) => setValue(f.key, v)}
              multiline
            />
          )}
          {f.type === 'chips' && (
            <View style={styles.chipRow}>
              {(f.options ?? []).map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  glove={glove}
                  selected={values[f.key] === opt}
                  onPress={() => setValue(f.key, opt)}
                />
              ))}
            </View>
          )}
          {f.type === 'glowColour' && (
            <View style={styles.chipRow}>
              {GLOW_COLOURS.map((c) => {
                const selected = values[f.key] === c.name;
                return (
                  <Pressable
                    key={c.name}
                    onPress={() => setValue(f.key, c.name)}
                    style={[styles.swatchWrap, selected && styles.swatchSelected]}
                  >
                    <View style={[styles.swatch, { backgroundColor: c.hex }]} />
                    <Text style={styles.swatchLabel}>{c.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
          {f.type === 'brightness' && (
            <View style={styles.chipRow}>
              {['1', '2', '3', '4', '5'].map((n) => (
                <Chip
                  key={n}
                  label={`${n}${n === '1' ? ' faint' : n === '5' ? ' bright' : ''}`}
                  glove={glove}
                  selected={(values[f.key] ?? '3') === n}
                  onPress={() => setValue(f.key, n)}
                />
              ))}
            </View>
          )}
        </View>
      ))}

      <Text style={[styles.label, { fontSize: labelSize }]}>Location</Text>
      <BigButton title="📍 Use my location (GPS)" glove={glove} variant="ghost" onPress={useLocation} />
      {coords ? (
        <Text style={styles.okText}>
          GPS saved: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
        </Text>
      ) : null}
      <TextInput
        style={[styles.input, { fontSize: inputSize, marginTop: 8 }]}
        placeholder="Or type the place — e.g. trail marker 4, near stream"
        placeholderTextColor={COLORS.muted}
        value={locationLabel}
        onChangeText={setLocationLabel}
      />

      <Text style={[styles.label, { fontSize: labelSize }]}>Photo</Text>
      <View style={styles.buttonRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <BigButton title="📷 Take photo" glove={glove} variant="ghost" onPress={() => attachPhoto(true)} />
        </View>
        <View style={{ flex: 1 }}>
          <BigButton title="🖼️ Pick photo" glove={glove} variant="ghost" onPress={() => attachPhoto(false)} />
        </View>
      </View>
      {photoUri ? <Image source={{ uri: photoUri }} style={styles.photo} /> : null}

      <Text style={[styles.label, { fontSize: labelSize }]}>Voice note (real recording, stored on phone)</Text>
      <BigButton
        title={recording ? '⏹️ Stop recording' : voiceUri ? '🎙️ Re-record voice note' : '🎙️ Record voice note'}
        glove={glove}
        variant="ghost"
        onPress={toggleVoiceRecording}
      />
      {voiceUri && !recording ? (
        <View style={{ marginTop: 8 }}>
          <BigButton title="▶️ Play voice note" glove={glove} variant="ghost" onPress={playVoice} />
        </View>
      ) : null}

      <Text style={[styles.label, { fontSize: labelSize }]}>Extra notes</Text>
      <TextInput
        style={[styles.input, styles.multiline, { fontSize: inputSize }]}
        placeholder="Anything else worth remembering…"
        placeholderTextColor={COLORS.muted}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <GlossyCard style={{ marginTop: 20 }}>
        <BigButton title="💾 Save offline" glove={glove} onPress={save} />
        <View style={{ height: 10 }} />
        <BigButton title="Cancel" glove={glove} variant="ghost" onPress={onCancel} />
      </GlossyCard>
      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16 },
  heading: { color: COLORS.text, fontSize: 24, fontWeight: '900' },
  auto: { color: COLORS.muted, fontSize: 13, marginTop: 6, marginBottom: 6 },
  label: { color: COLORS.text, fontWeight: '700', marginTop: 18, marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 14,
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  multiline: { minHeight: 84, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  swatchWrap: {
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
    padding: 6,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: { borderColor: COLORS.lime },
  swatch: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  swatchLabel: { color: COLORS.text, fontSize: 12, marginTop: 4 },
  okText: { color: COLORS.lime, fontSize: 13, marginTop: 8 },
  buttonRow: { flexDirection: 'row' },
  photo: { width: '100%', height: 220, borderRadius: 16, marginTop: 12 },
});
