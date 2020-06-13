import React, {Component} from 'react';
import {Platform, StatusBar, View} from 'react-native';

class Template extends Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{
                    height: Platform.OS === 'ios' ?
                        20 : StatusBar.currentHeight,
                    backgroundColor: "rgba(0, 0, 0, 0.2)"
                }}>
                    <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent/>
                </View>
                {this.props.children}
            </View>
        )
    }
}

export default Template;