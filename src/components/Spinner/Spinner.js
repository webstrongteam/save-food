import React from 'react';
import {ActivityIndicator, View} from "react-native";

const spinner = ({size, color, bgColor}) => (
    <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor ? bgColor: '#fff'
    }}>
        <ActivityIndicator
            size={size ? size : 'large'}
            color={color ? color : '#fff'}
        />
    </View>
);

export default spinner;