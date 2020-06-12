import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';

class Template extends Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent/>
                {this.props.children}
            </View>
        )
    }
}

export default Template;