import React from 'react';
import {Platform, View} from "react-native";

const Header = ({leftComponent, centerComponent, rightComponent, leftSize = 1, centerSize = 3, rightSize = 1}) => (
    <View style={{
        position: 'relative',
        zIndex: 200,
        top: 0,
        height: 40,
        width: '100%',
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 30 : 40,
        marginBottom: 10,
        justifyContent: 'space-between'
    }}>
        <View style={{flex: leftSize, alignItems: 'flex-start'}}>
            {leftComponent ? leftComponent : <View/>}
        </View>
        <View style={{flex: centerSize, alignItems: 'center'}}>
            {centerComponent ? centerComponent : <View/>}
        </View>
        <View style={{flex: rightSize, alignItems: 'flex-end'}}>
            {rightComponent ? rightComponent : <View/>}
        </View>
    </View>
);

export default Header;