import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null); // <-- no TS type here to avoid the “value used as type” error

  useEffect(() => {
    if (permission && !permission.granted) {
      // prompt once if not granted
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Checking camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission is required.</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const result = await cameraRef.current.takePictureAsync();
      setPhotoUri(result?.uri ?? null);
    } catch (e) {
      console.warn(e);
    }
  };

  // Show preview after capture
  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        <Button title="Retake" onPress={() => setPhotoUri(null)} />
      </View>
    );
  }

  // Live camera
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
  preview: { flex: 1, resizeMode: "contain" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
