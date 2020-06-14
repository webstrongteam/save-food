import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
// Components
import Home from "./containers/Home/Home";
import Scanner from "./containers/Scanner/Scanner";
import Food from "./containers/Food/Food";
import List from "./containers/List/List";
import Settings from "./containers/Settings/Settings";

const MainNavigator = createStackNavigator(
    {
        Home: {screen: Home},
        Scanner: {screen: Scanner},
        Food: {screen: Food},
        List: {screen: List},
        Settings: {screen: Settings}
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none'
    },
);

const router = createAppContainer(MainNavigator);

export default router;