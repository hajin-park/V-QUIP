import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet, Slider } from '@react-native-community/slider';

const SettingsModalContent = ({ slider1Value, slider2Value, slider3Value, slider4Value, setSlider1Value, setSlider2Value, setSlider3Value, setSlider4Value }) => {
  return (
    <View>
      <Text style={styles.modalText}>Slider 1: {slider1Value}</Text>
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onValueChange={(value) => setSlider1Value(value)}
      />
      <Text style={styles.modalText}>Slider 2: {slider2Value}</Text>
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onValueChange={(value) => setSlider2Value(value)}
      />
      <Text style={styles.modalText}>Slider 3: {slider3Value}</Text>
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onValueChange={(value) => setSlider3Value(value)}
      />
      <Text style={styles.modalText}>Slider 4: {slider4Value}</Text>
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onValueChange={(value) => setSlider4Value(value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    modalText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000000',
    },
  });

export default SettingsModalContent;
