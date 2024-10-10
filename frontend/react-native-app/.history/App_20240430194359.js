import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Modal } from 'react-native';

const SettingsModalContent = ({ darkMode, setDarkMode }) => {
  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  return (
    <View>
      {/* Dark Mode Switch */}
      <View style={styles.darkModeSwitchContainer}>
        <Text style={[styles.darkModeText, darkMode && styles.darkText]}>
          Dark Mode
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDarkMode}
          value={darkMode}
        />
      </View>
    </View>
  );
};


export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(false);

  const handleOptionClick = (option) => {
    if (option === 'About') {
      setModalContent('Gesture Recognition Software v.21\n---------------------Purpose-------------------\nEducational Polling Software\n---------------Current Models----------------\nMediaPipe, YOLO_NAS, TensorFlow\n--------------------Features---------------------\n----------------Head of Project---------------\n Professor Santosh Chandrasekhar\n-------------------Developers-------------------\nAditya, Arvind, Hajin\n--------------------------------------------------------');
      setModalVisible(true);
    }
    else if (option === 'Settings'){
      setModalContent(
        <SettingsModalContent darkMode={darkMode} setDarkMode={setDarkMode} />
      );
      setModalVisible(true);
    }
  };
  useEffect(() => {
    setModalContent(<SettingsModalContent darkMode={darkMode} setDarkMode={setDarkMode} />);
  }, [darkMode]);

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <Text style={[styles.title, darkMode && styles.darkText]}>Gesture Recognition Software v0.2</Text>
      <View style={styles.infoBox}>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>React & Python</Text>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>UC Merced</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.box, styles.boxAbout, darkMode && styles.darkBox]} onPress={() => handleOptionClick('About')}>
          <Text style={[styles.text, darkMode && styles.darkText]}>About this App</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, styles.boxSettings, darkMode && styles.darkBox]} onPress={() => handleOptionClick('Settings')}>
          <Text style={[styles.text, darkMode && styles.darkText]}>Settings</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.box2}>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>Graph</Text>
      </View>
      
      <View style={styles.boxsp}>
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.gridText}>LHC:</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridText}>RHC:</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridText}>BLHC:</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridText}>BRHC:</Text>
          </View>
        </View>
      </View>


      <View style={styles.content}>
        <Text style={[styles.infoText, darkMode && styles.darkText]}>UC Merced</Text>
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
    flex: 1,
    height: 100,
    backgroundColor: '#ADD8E6', // Light blue color
    borderRadius: 10, // Rounded edges
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  box2: {
    height: 350,
    backgroundColor: '#ADD8E6', // Light blue color
    borderRadius: 10, // Rounded edges
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  boxAbout: {
    backgroundColor: '#880000', // Light red color
  },
  boxSettings: {
    backgroundColor: '#444444', // Light gray color
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
    width: '80%',
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
  boxsp: {
    backgroundColor: '#ADDAFF', // Light blue color
    width: '100%',
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 0,
    borderColor: '#000000',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  gridItem: {
    width: '50%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});