import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Animated, Text, Dimensions } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();
  }, [blinkAnim]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.titleContainer}>
          <ThemedText type="title">Geotagging App</ThemedText>
        </View>

      <ThemedView style={styles.cardWhatIs}>
        <ThemedText type="subtitle" style={styles.cardTitle}>What is this app?</ThemedText>
        <View style={styles.separator} />
        <ThemedText style={styles.cardContent}>
          This is a geotagging application that allows you to capture photos and overlay them with location details, user notes, and timestamps. Perfect for documenting sites, inspections, or personal adventures with precise geographic information.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>How to use:</ThemedText>
        <View style={styles.separator} />
        <ThemedText style={styles.cardContent}>
          1. Navigate to the Camera tab to access the camera view.
        </ThemedText>
        <ThemedText style={styles.cardContent}>
          2. Tap "Capture" to take a photo. The app will automatically fetch your current location.
        </ThemedText>
        <ThemedText style={styles.cardContent}>
          3. Add a note (optional) to describe the photo, such as "150mm pipe" or any relevant details.
        </ThemedText>
        <ThemedText style={styles.cardContent}>
          4. Review the overlay showing latitude, longitude, altitude, accuracy, time, and your note.
        </ThemedText>
        <ThemedText style={styles.cardContent}>
          5. Tap "Save Photo" to save the image with the overlay to your gallery in the "Geotagged" album.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.cardFeatures}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Features:</ThemedText>
        <View style={styles.separator} />
        <ThemedText style={styles.cardContent}>
          - Real-time location tracking with high accuracy.
        </ThemedText>
        <ThemedText style={styles.cardContent}>
          - Customizable notes for each photo.
        </ThemedText>
        <ThemedText style={styles.cardContent}>
          - Automatic timestamp overlay.
        </ThemedText>
        <ThemedText style={styles.cardContent}>
          - Saves to a dedicated album for easy access.
        </ThemedText>
      </ThemedView>

        <ThemedView style={styles.cardPermissions}>
          <ThemedText type="subtitle" style={styles.cardTitle}>Permissions:</ThemedText>
          <View style={styles.separator} />
          <ThemedText style={styles.cardContent}>
            Ensure camera and location permissions are granted for full functionality. The app will prompt you if needed.
          </ThemedText>
        </ThemedView>
      </ScrollView>

      <Animated.View style={[styles.arrowContainer, { opacity: blinkAnim }]}>
        <Text style={styles.arrow}>↓</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: 'rgba(173, 216, 230, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
    borderWidth: 0,
    borderColor: 'transparent',
  },
  cardWhatIs: {
    backgroundColor: 'rgba(135, 206, 250, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
    borderWidth: 0,
    borderColor: 'transparent',
  },
  cardFeatures: {
    backgroundColor: 'rgba(144, 238, 144, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
    borderWidth: 0,
    borderColor: 'transparent',
  },
  cardPermissions: {
    backgroundColor: 'rgba(255, 182, 193, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  scrollView: {
    flex: 1,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 20,
    left: Dimensions.get('window').width / 2 - 15, // Middle of the layout
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 6,
  },
  arrow: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 16,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
    color: '#000', // Default to black, will be overridden by theme if needed
  },
});
