import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const handleOptionClick = (option) => {
    // Handle click event for the selected option
    console.log(`Option ${option} clicked`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>V-QUIP Gesture Recognition Software v0.0.1</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Current PipeLine:</Text>
        <Text style={styles.infoText}>MediaPipe</Text>
        <Text style={styles.infoText}>Background</Text>
        <Text style={styles.infoText}>Running App</Text>
        <Text style={styles.infoText}>Current PipeLine:</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 20,
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
    justifyContent: 'center',
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
