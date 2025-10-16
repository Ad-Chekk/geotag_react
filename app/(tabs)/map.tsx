import { useLocation } from "@/hooks/LocationContent";
import * as Location from "expo-location";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Your current location data</ThemedText>
        <View style={styles.separator} />
        {location ? (
          <View style={styles.locationData}>
            <ThemedText style={styles.cardContent}>Latitude: {location.latitude}</ThemedText>
            <ThemedText style={styles.cardContent}>Longitude: {location.longitude}</ThemedText>
            <ThemedText style={styles.cardContent}>Altitude: {location.altitude ?? "N/A"}</ThemedText>
            <ThemedText style={styles.cardContent}>Accuracy: {location.accuracy ?? "N/A"} meters</ThemedText>
          </View>
        ) : (
          <ThemedText style={styles.cardContent}>Location data will appear here</ThemedText>
        )}
      </ThemedView>

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
    padding: 10,
    backgroundColor: "#3a3a3aff", // dark background for modern look
  },
  card: {
    backgroundColor: '#232329ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
    borderWidth: 0,
    borderColor: 'transparent',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  yellowBox: {
    width: 250,
    height: 120,
    backgroundColor: '#7586ddff',
    borderWidth: 2,
    borderColor: '#85f5ffff',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationData: {
    alignItems: 'center',
  },
  locationText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  placeholderText: {
    color: 'gray',
    fontSize: 14,
    fontStyle: 'italic',
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
