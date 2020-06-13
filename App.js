import React, {Component} from 'react';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {setCustomText} from 'react-native-global-props';
import Spinner from './src/components/Spinner/Spinner';
import Template from "./src/containers/Template/Template";
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {initApp} from './src/db';
import {loadAsync} from "expo-font";
import Router from './src/router';
import wastedFoodReducer from './src/store/reducers/wastedFood';
import settingsReducer from './src/store/reducers/settings';

const rootReducer = combineReducers({
    wastedFood: wastedFoodReducer,
    settings: settingsReducer
});

export const store = createStore(rootReducer, (
    applyMiddleware(thunk)
));

class App extends Component {
    state = {ready: false};

    async componentDidMount() {
        await loadAsync({
            'Lato-Light': require('./src/assets/fonts/Lato-Light.ttf'),
            'Lato-Regular': require('./src/assets/fonts/Lato-Regular.ttf'),
            'Lato-Bold': require('./src/assets/fonts/Lato-Bold.ttf')
        });

        initApp(() => {
            this.setState({ready: true})
        })
    }

    render() {
        const {ready} = this.state;
        // Hide yellow boxes
        console.disableYellowBox = true;

        // Set default styles for all Text components.
        const customTextProps = {
            style: {fontFamily: 'Lato-Regular'}
        };
        setCustomText(customTextProps);

        return (
            ready ?
                <Provider store={store}>
                    <Template>
                        <Router/>
                    </Template>
                </Provider> :
                <Spinner color='#000' size={64}/>
        );
    }
}

export default App;