import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator';
import { COLORS } from './src/utils/constants';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />
      <RootNavigator />
    </Provider>
  );
};

export default App;