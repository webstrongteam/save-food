import React from 'react';
import {Text, View, TouchableOpacity} from "react-native";
import {Icon} from "react-native-elements";

const Header = () => (
    <View style={{
        position: 'absolute',
        top: 0,
        height:40,
        width:'100%',
        left: 0,
        flexDirection: 'row',
        margin:30,
        justifyContent: 'space-between'
    }}>
        <TouchableOpacity onPress={() => this.props.onPress}>
            <Icon color="#fff" size={25}
                  name='setting'
                  type='antdesign'/>
        </TouchableOpacity>
        <Text style={{
            textAlign:'right',
            fontSize:25,
            marginRight:60,
            color: '#fff'
        }}>Save food</Text>
    </View>
);

export default Header;