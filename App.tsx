import {StyleSheet, Alert, BackHandler} from 'react-native';
import React, {useEffect} from 'react';
import AuthNavigation from './src/navigation/AuthNavigation';
import {NavigationContainer} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

const App = () => {
  useEffect(() => {
    Geolocation.getCurrentPosition(
      () => {
        //Location is available
      },
      error => {
        if (error.code === 2) {
          Alert.alert(
            'Location Turned Off',
            'Please turned on Location service to continue using the app.',
            [
              {
                text: 'ok',
                onPress: () => {
                  BackHandler.exitApp();
                },
              },
            ],
          );
        }
      },
    );
  }, []);
  return (
    <NavigationContainer>
      <AuthNavigation />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
