// camera.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as ExpoLocation from "expo-location";
import { useIsFocused } from "@react-navigation/native";
import { useLocation } from "@/hooks/LocationContent";
import { MaterialIcons } from "@expo/vector-icons";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  const cameraRef = useRef<CameraView | null>(null);
  const viewShotRef = useRef<any>(null);

  const { location, setLocation } = useLocation();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const updateLocation = async () => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Location access denied.");
        return;
      }
      const pos = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Highest,
      });

      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        altitude: pos.coords.altitude,
        accuracy: pos.coords.accuracy,
      });
    } catch (err) {
      console.warn("location error", err);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert("Camera not ready");
      return;
    }
    try {
      await updateLocation();

      const result = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      setPhotoUri(result.uri);
    } catch (e) {
      console.warn("takePhoto error", e);
      Alert.alert("Error", "Failed to take photo");
    }
  };

 const savePhotoWithOverlay = async () => {
  if (!viewShotRef.current) {
    Alert.alert("Error", "Preview not ready");
    return;
  }

  try {
    setIsSaving(true);

    // Capture the view with overlay
    const uri: string = await viewShotRef.current.capture?.({
      format: "jpg",
      quality: 0.9,
    });

    if (!uri) {
      throw new Error("Failed to capture view");
    }

    // Try to save directly - this will prompt for permission if needed
    const asset = await MediaLibrary.createAssetAsync(uri);
    
    // Try to create or add to album
    try {
      const album = await MediaLibrary.getAlbumAsync("Geotagged");
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync("Geotagged", asset, false);
      }
    } catch (albumErr) {
      console.log("Album handling:", albumErr);
    }

    Alert.alert("Saved", "Photo with overlay saved to gallery.");
    setPhotoUri(null);
    setNote("");
  } catch (err) {
    console.error("save error", err);
    
    // Check if it's a permission error
    if (err instanceof Error && err.message.includes("permission")) {
      Alert.alert(
        "Permission required", 
        "Please grant media library access in your device settings."
      );
    } else {
      Alert.alert(
        "Error", 
        `Could not save photo: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  } finally {
    setIsSaving(false);
  }
};;

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
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isFocused) {
    return (
      <View style={styles.center}>
        <Text>Camera paused</Text>
      </View>
    );
  }

  if (photoUri) {
    const timestamp = new Date().toLocaleString();

    return (
      <View style={styles.container}>
        <ViewShot ref={viewShotRef} style={styles.previewWrap}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />

          <View style={styles.overlayBox}>
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

            <Text style={[styles.overlayText, { marginTop: 6 }]}>
              Time: {timestamp}
            </Text>
            <Text style={[styles.overlayText, { marginTop: 6 }]}>
              Note: {note || "-"}
            </Text>
          </View>
        </ViewShot>

        <View style={styles.controls}>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Enter note (e.g., 150mm pipe)"
            style={styles.input}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 8 }]} onPress={() => setPhotoUri(null)}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { flex: 1, backgroundColor: "#28A745" }]}
              onPress={savePhotoWithOverlay}
              disabled={isSaving}
            >
              <Text style={styles.buttonText}>
                {isSaving ? "Saving..." : "Save Photo"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <MaterialIcons name="camera" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
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
  btnRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  // New modern button styles
  buttonWrapper: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
