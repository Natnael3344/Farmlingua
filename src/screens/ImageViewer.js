// screens/ImageViewer.js
import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native'; // ✅ Added Text
import { SafeAreaView } from 'react-native-safe-area-context'; // Recommended for full screen views

const ImageViewer = ({ route, navigation }) => {
  // Add safety check in case params are undefined
  const image = route.params?.image;

  if (!image) {
    return (
      <View style={styles.container}>
        <Text style={styles.closeText}>Error: No image provided</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    padding: 20,
    zIndex: 1, // Ensure button is clickable above image if they overlap
    alignSelf: 'flex-start',
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '80%', // Adjusted to leave room for button
    resizeMode: 'contain',
  },
});

export default ImageViewer;