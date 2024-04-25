import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const handleOptionClick = (option) => {
    // Handle click event for the selected option
    console.log(`Option ${option} clicked`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gesture Recognition Software v0.1</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Current Models</Text>
        <Text style={styles.infoText}>MediaPipe, YOLO_NAS, Tensorflow</Text>
        <Text style={styles.infoText}>Current Features</Text>
        <Text style={styles.infoText}>................</Text>
        <Text style={styles.infoText}>................</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.box} onPress={() => handleOptionClick(1)}>
            <Text style={styles.text}>Option 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box} onPress={() => handleOptionClick(2)}>
            <Text style={styles.text}>Option 2</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.box} onPress={() => handleOptionClick(3)}>
            <Text style={styles.text}>Option 3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box} onPress={() => handleOptionClick(4)}>
            <Text style={styles.text}>Option 4</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.box} onPress={() => handleOptionClick(3)}>
            <Text style={styles.text}>Option 5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box} onPress={() => handleOptionClick(4)}>
            <Text style={styles.text}>Option 6</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 7,
    marginBottom: 10,
    textAlign: 'center',
  },
  infoBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: '#ADD8E6', // Light blue color
    borderRadius: 10, // Rounded edges
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
  },
});

import React, { useState, useRef } from 'react';
import { View, StyleSheet, Switch, Text } from 'react-native';
import { Camera } from 'expo-camera';

const CameraScreen = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);

  const handleCameraToggle = () => {
    setIsCameraOn((prev) => !prev);
  };

  const handleRecordingToggle = () => {
    setIsRecording((prev) => !prev);
  };

  const handleCameraFlip = async () => {
    if (cameraRef.current) {
      await cameraRef.current.flipAsync();
    }
  };

  return (
    <View style={styles.container}>
      {isCameraOn && (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ref={cameraRef}
        />
      )}
      <View style={styles.controls}>
        <View style={styles.switchContainer}>
          <Text>Camera: </Text>
          <Switch value={isCameraOn} onValueChange={handleCameraToggle} />
        </View>
        <View style={styles.switchContainer}>
          <Text>Recording: </Text>
          <Switch value={isRecording} onValueChange={handleRecordingToggle} />
        </View>
        <View style={styles.flipButtonContainer}>
          <Text style={styles.flipButtonText} onPress={handleCameraFlip}>
            Flip
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flipButtonContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  flipButtonText: {
    color: 'white',
  },
});

export default CameraScreen;

