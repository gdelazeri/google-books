import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';

import Home from '../screens/Home';
import Book from '../screens/Book';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home,
    Book,
  },
  config
);

export default HomeStack;
