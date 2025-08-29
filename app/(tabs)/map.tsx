import { View, Button, Text } from "react-native";
import * as Location from "expo-location";
import { useLocation } from "@/hooks/LocationContent";

export default function MapScreen() {
  const { location, setLocation } = useLocation();

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      altitude: loc.coords.altitude,
      accuracy: loc.coords.accuracy,
    });
  };

  return (
    <View>
      <Button title="Get Current Location" onPress={getLocation} />

      {location && (
        <View>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
          <Text>Altitude: {location.altitude ?? "N/A"}</Text>
          <Text>Accuracy: {location.accuracy ?? "N/A"}</Text>
        </View>
      )}
    </View>
  );
}
