import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RNCamera } from 'react-native-camera';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const handleOptionClick = (option) => {
    // Handle click event for the selected option
    console.log(`Option ${option} clicked`);
    // Navigate to camera screen or perform camera action here
    // For example:
    navigation.navigate('CameraScreen', { option });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gesture Recognition Software v0.1</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Current PipeLine:</Text>
        <Text style={styles.infoText}>MediaPipe</Text>
        <Text style={styles.infoText}>YOLOv8</Text>
        <Text style={styles.infoText}>PoseEstimation</Text>
        <Text style={styles.infoText}>Working System</Text>
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
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const CameraScreen = ({ route }) => {
  const { option } = route.params;

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }}
      />
      <Text style={styles.optionText}>You selected Option {option}</Text>
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
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#FFFFFF',
    padding: 10,
  },
});
