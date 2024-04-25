import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Modal, TextInput } from 'react-native';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleOptionClick = (option) => {
    if (option === 'About') {
      setModalContent('Current Models\nMediaPipe, YOLO_NAS, TensorFlow');
      setModalVisible(true);
    } else if (option === 'Settings') {
      setModalContent('Here are the settings...');
      setModalVisible(true);
    } else {
      // Handle click event for other options
      console.log(`Function ${option} clicked`);
    }
  };

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <Text style={[styles.title, darkMode && styles.darkText]}>Gesture Recognition Software v0.1</Text>
      <View style={styles.infoBox}>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>React & Python</Text>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>UC Merced</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.box3, darkMode && styles.darkBox]} onPress={() => handleOptionClick('About')}>
          <Text style={[styles.text, darkMode && styles.darkText]}>About this App</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.infoText, darkMode && styles.darkText]}></Text>
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
        <Text style={[styles.infoText, darkMode && styles.darkText]}></Text>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.box2, darkMode && styles.darkBox]} onPress={() => handleOptionClick('Settings')}>
            <Text style={[styles.text, darkMode && styles.darkText]}>Settings</Text>
          </TouchableOpacity>   
        </View>
      </View>
      {/* Modal for About/Settings */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, darkMode && styles.darkBox]}>
            <Text style={[styles.modalText, darkMode && styles.darkText]}>{modalContent}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Dark Mode Switch */}
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
    height: 80,
    backgroundColor: '#ABDFA9', // Light blue color
    borderRadius: 10, // Rounded edges
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
  },
  darkBox: {
    backgroundColor: '#2d2d2d', // Dark gray color
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: 330,
    height: 330,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
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
