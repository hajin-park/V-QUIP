import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import { Slider } from '@react-native-community/slider';

const App = () => {
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [slider1Value, setSlider1Value] = useState(0);
  const [slider2Value, setSlider2Value] = useState(0);
  const [slider3Value, setSlider3Value] = useState(0);
  const [slider4Value, setSlider4Value] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Open Modal 1" onPress={() => setModalVisible1(true)} />
        <Button title="Open Modal 2" onPress={() => setModalVisible2(true)} />
      </View>

      {/* Modal 1 with default close button */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => setModalVisible1(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Modal 1 Content</Text>
            <Button title="Close" onPress={() => setModalVisible1(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal 2 with sliders */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => setModalVisible2(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Slider 1: {slider1Value}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              onValueChange={(value) => setSlider1Value(value)}
            />

            <Text style={styles.modalText}>Slider 2: {slider2Value}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              onValueChange={(value) => setSlider2Value(value)}
            />

            <Text style={styles.modalText}>Slider 3: {slider3Value}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              onValueChange={(value) => setSlider3Value(value)}
            />

            <Text style={styles.modalText}>Slider 4: {slider4Value}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              onValueChange={(value) => setSlider4Value(value)}
            />

            <Button title="Close" onPress={() => setModalVisible2(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  slider: {
    width: 200,
    height: 40,
    marginBottom: 10,
  },
});

export default App;
