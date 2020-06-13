import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
// Components
import Start from "./containers/Start/Start";
import Home from "./containers/Home/Home";

const MainNavigator = createStackNavigator(
    {
        Start: {screen: Start},
        Home: {screen: Home},
    },
    {
        initialRouteName: 'Start',
        headerMode: 'none'
    },
);

const router = createAppContainer(MainNavigator);

export default router;