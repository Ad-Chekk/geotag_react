// camera.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import type { Camera as CameraType } from "expo-camera";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/native";
import { useLocation } from "@/hooks/LocationContent"; // <-- adjust path if needed

export default function CameraScreen() {
  // camera permission helper from expo-camera
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

 const cameraRef = useRef<CameraView | null>(null);
 // camera ref (avoid "value used as type" TS error)
  const viewShotRef = useRef<any>(null); // viewshot ref
  const { location } = useLocation(); // from your LocationContent context

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // request camera permission on mount (if not granted)
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  // Take picture
  const takePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert("Camera not ready");
      return;
    }
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.8, skipProcessing: false });
      setPhotoUri(result.uri);
    } catch (e) {
      console.warn("takePhoto error", e);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  // Save viewshot (image + overlay) to gallery
  const savePhotoWithOverlay = async () => {
    if (!viewShotRef.current) {
      Alert.alert("Error", "Preview not ready");
      return;
    }

    try {
      setIsSaving(true);

      // Request media library permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Allow media library access to save photos.");
        setIsSaving(false);
        return;
      }

      // capture the view (image + overlays)
      const uri: string = await viewShotRef.current.capture?.({
        format: "jpg",
        quality: 0.9,
      });

      if (!uri) throw new Error("Failed to capture view");

      // create asset and optionally create an album (ignore error if album exists)
      const asset = await MediaLibrary.createAssetAsync(uri);
      try {
        if (Platform.OS === "android" || Platform.OS === "ios") {
          await MediaLibrary.createAlbumAsync("Geotagged", asset, false);
        }
      } catch (err) {
        // album probably exists — that's fine
      }

      Alert.alert("Saved", "Photo with overlay saved to gallery.");
      // optional: clear preview
      setPhotoUri(null);
      setNote("");
    } catch (err) {
      console.warn("save error", err);
      Alert.alert("Error", "Could not save photo. See console.");
    } finally {
      setIsSaving(false);
    }
  };

  // If camera permission not yet resolved
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Checking camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission is required.</Text>
        <Button title="Grant camera permission" onPress={requestPermission} />
      </View>
    );
  }

  // Pause camera when screen is not focused (prevents the "failed to capture image" issue)
  if (!isFocused) {
    return (
      <View style={styles.center}>
        <Text>Camera paused</Text>
      </View>
    );
  }

  // If a photo exists, show the preview with overlay (ViewShot wraps the preview)
  if (photoUri) {
    const timestamp = new Date().toLocaleString();

    return (
      <View style={styles.container}>
        <ViewShot ref={viewShotRef} style={styles.previewWrap}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />

          {/* Overlay box bottom-left */}
          <View style={styles.overlayBox}>
            {/* Location block */}
            <Text style={styles.overlayText}>
              Lat: {location?.latitude?.toFixed(6) ?? "N/A"}
            </Text>
            <Text style={styles.overlayText}>
              Lon: {location?.longitude?.toFixed(6) ?? "N/A"}
            </Text>
            <Text style={styles.overlayText}>
              Alt: {location?.altitude != null ? location.altitude.toFixed(1) + " m" : "N/A"}
            </Text>
            <Text style={styles.overlayText}>
              Acc: {location?.accuracy != null ? location.accuracy + " m" : "N/A"}
            </Text>

            {/* Timestamp */}
            <Text style={[styles.overlayText, { marginTop: 6 }]}>Time: {timestamp}</Text>

            {/* Note */}
            <Text style={[styles.overlayText, { marginTop: 6 }]}>Note: {note || "-"}</Text>
          </View>
        </ViewShot>

        {/* Note input and buttons */}
        <View style={styles.controls}>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Enter note (e.g., 150mm pipe)"
            style={styles.input}
          />

          <View style={styles.btnRow}>
            <Button title="Retake" onPress={() => setPhotoUri(null)} />
            <View style={{ width: 12 }} />
            <Button title={isSaving ? "Saving..." : "Save Photo"} onPress={savePhotoWithOverlay} disabled={isSaving} />
          </View>
        </View>
      </View>
    );
  }

  // Default camera view
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.captureBar}>
        <Button title="Capture" onPress={takePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  captureBar: { position: "absolute", bottom: 30, alignSelf: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  previewWrap: { width: "100%", height: "70%", backgroundColor: "#000", position: "relative" },
  previewImage: { width: "100%", height: "100%", resizeMode: "cover" },

  overlayBox: {
    position: "absolute",
    left: 12,
    bottom: 12,
    backgroundColor: "rgba(60,60,60,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    maxWidth: "70%",
  },
  overlayText: { color: "#fff", fontSize: 12, lineHeight: 16 },

  controls: { padding: 12, backgroundColor: "#fff" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8, marginBottom: 8 },
  btnRow: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center" },
});
