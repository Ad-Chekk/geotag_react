import { useLocation } from "@/hooks/LocationContent";
import * as Location from "expo-location";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

export default function MapScreen() {
  const { location, setLocation } = useLocation();

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        altitude: loc.coords.altitude ?? null,
        accuracy: loc.coords.accuracy ?? null,
      });
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Something went wrong while fetching location.");
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <View style={styles.textContainer}>
          <Text style={styles.text}>Latitude: {location.latitude}</Text>
          <Text style={styles.text}>Longitude: {location.longitude}</Text>
          <Text style={styles.text}>Altitude: {location.altitude ?? "N/A"}</Text>
          <Text style={styles.text}>Accuracy: {location.accuracy ?? "N/A"} meters</Text>
        </View>
      ) : (
        <Text style={styles.infoText}>Press the button to get your location</Text>
      )}

      {/* Floating Button at Bottom Center */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={getLocation}>
          <Text style={styles.buttonText}>Get Current Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1E1E1E", // dark background for modern look
  },
  textContainer: {
    marginBottom: 100, // leave space for floating button
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 6,
  },
  infoText: {
    marginTop: 20,
    fontStyle: "italic",
    color: "gray",
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    paddingHorizontal: 28,
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
});
