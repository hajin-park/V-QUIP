// App.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import HomePage from './HomePage';
import About from './About';
import Settings from './Settings';

const App = () => {
  const [currentPage, setCurrentPage] = useState('Home');

  const renderPage = () => {
    switch (currentPage) {
      case 'About':
        return <About onClose={() => setCurrentPage('Home')} />;
      case 'Settings':
        return <Settings onClose={() => setCurrentPage('Home')} />;
      default:
        return <HomePage onPage1={() => setCurrentPage('Page1')} onPage2={() => setCurrentPage('Page2')} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderPage()}
    </View>
  );
};

export default App;
