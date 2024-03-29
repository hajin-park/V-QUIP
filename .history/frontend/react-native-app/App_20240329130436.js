import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Camera } from 'expo-camera';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCameraPress = () => {
    if (hasPermission) {
      navigation.navigate('CameraScreen');
    } else {
      alert('Camera permission not granted!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gesture Recognition Software v0.1</Text>
      <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

const CameraScreen = () => {
  const [cameraRef, setCameraRef] = useState(null);

  const handleCameraFlip = () => {
    if (cameraRef) {
      cameraRef.flipAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCameraRef(ref)}
      />
      <TouchableOpacity style={styles.cameraFlipButton} onPress={handleCameraFlip}>
        <Text style={styles.buttonText}>Flip</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cameraButton: {
    padding: 20,
    backgroundColor: 'skyblue',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraFlipButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    right: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
});
