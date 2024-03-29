import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const handleOptionClick = (option) => {
    // Handle click event for the selected option
    console.log(`Option ${option} clicked`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My App Title</Text>
      <View style={styles.content}>
        <TouchableOpacity style={styles.box} onPress={() => handleOptionClick(1)}>
          <Text style={styles.text}>Option 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => handleOptionClick(2)}>
          <Text style={styles.text}>Option 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => handleOptionClick(3)}>
          <Text style={styles.text}>Option 3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => handleOptionClick(4)}>
          <Text style={styles.text}>Option 4</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40, // Add padding top to push content below the status bar
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  box: {
    width: '45%', // Adjust width as needed for a 2x2 layout
    aspectRatio: 1, // Maintain aspect ratio for square boxes
    backgroundColor: '#ADD8E6', // Light blue color
    borderRadius: 10, // Rounded edges
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2.5%', // Adjust margin for spacing between boxes
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
  },
});
