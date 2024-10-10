import React from 'react';
import { Button, View } from 'react-native';
import { navigateToNewScreen } from './navigation'; // Assuming you have a function to navigate to the new screen

export default function App() {
  const handleButtonPress = () => {
    // Call a function to navigate to the new screen
    navigateToNewScreen();
  };

  return (
    <View>
      <Button title="Go to New Screen" onPress={handleButtonPress} />
    </View>
  );
}
