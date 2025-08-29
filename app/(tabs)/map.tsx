// map.tsx
import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";

export default function MapScreen() {
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getLocation = async () => {
    // Ask for permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({});
    setCoords(location.coords);
  };

  return (
    <View style={styles.container}>
      <Button title="Get Current Location" onPress={getLocation} />

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      {coords && (
        <View style={styles.infoBox}>
          <Text>Latitude: {coords.latitude}</Text>
          <Text>Longitude: {coords.longitude}</Text>
          <Text>Altitude: {coords.altitude ?? "N/A"}</Text>
          <Text>Accuracy: {coords.accuracy} meters</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoBox: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  error: {
    marginTop: 10,
    color: "red",
  },
});
