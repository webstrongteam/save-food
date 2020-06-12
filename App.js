import React, {Component} from 'react';
import Spinner from './src/components/Spinner/Spinner';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {initApp} from './src/db';
import {loadAsync} from "expo-font";
import Router from './src/router';
import settingsReducer from './src/store/reducers/settings';

const rootReducer = combineReducers({
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

        return (
            ready ?
                <Provider store={store}>
                    <Router/>
                </Provider> :
                <Spinner color='#000' size={64}/>
        );
    }
}

export default App;