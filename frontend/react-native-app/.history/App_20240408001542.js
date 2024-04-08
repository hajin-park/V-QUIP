import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleOptionClick = (option) => {
    // Handle click event for the selected option
    console.log(`Function ${option} clicked`);
  };

  return (
    //Header
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <Text style={[styles.title, darkMode && styles.darkText]}>Gesture Recognition Software v0.1</Text>
      <View style={styles.infoBox}>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>Current Models</Text>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>MediaPipe, YOLO_NAS, Tensorflow</Text>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>Current Features</Text>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>................</Text>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>................</Text>
      </View>
      //Settings
      <View style={styles.row}>
          <TouchableOpacity style={[styles.box3, darkMode && styles.darkBox]} onPress={() => handleOptionClick(6)}>
            <Text style={[styles.text, darkMode && styles.darkText]}>About this App</Text>
          </TouchableOpacity>
        </View>
      //Boxes
      <View style={styles.content}>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.box, darkMode && styles.darkBox]} onPress={() => handleOptionClick(1)}>
            <Text style={[styles.text, darkMode && styles.darkText]}>Function 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.box, darkMode && styles.darkBox]} onPress={() => handleOptionClick(2)}>
            <Text style={[styles.text, darkMode && styles.darkText]}>Function 2</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.box, darkMode && styles.darkBox]} onPress={() => handleOptionClick(3)}>
            <Text style={[styles.text, darkMode && styles.darkText]}>Function 3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.box, darkMode && styles.darkBox]} onPress={() => handleOptionClick(4)}>
            <Text style={[styles.text, darkMode && styles.darkText]}>Function 4</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.box, darkMode && styles.darkBox]} onPress={() => handleOptionClick(5)}>
            <Text style={[styles.text, darkMode && styles.darkText]}>Function 5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.box, darkMode && styles.darkBox]} onPress={() => handleOptionClick(6)}>
            <Text style={[styles.text, darkMode && styles.darkText]}>Function 6</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Settings and About This App boxes */}
      <View style={styles.row}>
          <TouchableOpacity style={[styles.box2, darkMode && styles.darkBox]} onPress={() => handleOptionClick(5)}>
            <Text style={[styles.text, darkMode && styles.darkText]}>Settings</Text>
          </TouchableOpacity>   
      </View>
      
      <View style={styles.darkModeSwitchContainer}>
        <Text style={[styles.darkModeText, darkMode && styles.darkText]}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setDarkMode(!darkMode)}
          value={darkMode}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  darkText: {
    color: '#ffffff',
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  box: {
    width: 160,
    height: 100,
    backgroundColor: '#ADD8E6', // Light blue color
    borderRadius: 10, // Rounded edges
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  box2: {
    width: 330,
    height: 100,
    backgroundColor: '#8e8e8e', // Light blue color
    borderRadius: 10, // Rounded edges
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  box3: {
    width: 330,
    height: 100,
    backgroundColor: '#ABDFA9', // Light blue color
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
  darkBox: {
    backgroundColor: '#2d2d2d', // Dark gray color
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  horizontalBox: {
    width: '70%',
    height: 80,
    backgroundColor: '#ADD8E6', // Light blue color
    borderRadius: 10, // Rounded edges
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkModeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkModeText: {
    marginRight: 10,
    color: '#000000',
  },
});
