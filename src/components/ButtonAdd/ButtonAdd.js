import React from 'react';
import {Platform, Text, TouchableOpacity, View} from "react-native";
import styles from "../../containers/List/List.style";
import {Icon} from "react-native-elements";

const ButtonAdd = ({color = '#fff', onPresMinus, onPressAdd}, val) => (
    <View style={{
        width: 100,
        height: 25,
        borderWidth: 1,
        flexDirection: 'row',
        borderRadius:2,
        borderColor: color,
        opacity: 0.75
    }}>
        <TouchableOpacity onPress={() => onPresMinus()} style={{
            flex: 1,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Icon
                size={25} name='minus'
                type='entypo' color={color}
            />
        </TouchableOpacity>
        <View style={{
            flex: 2,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: color,
            justifyContent: 'center'
        }}>
           <Text style={{
                flex: 1,
                color: color,
                fontSize: 16,
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                1
            </Text>
        </View>
        <TouchableOpacity onPress={() => onPressAdd()} style={{
            flex: 1,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Icon
                size={25} name='add'
                type='material' color={color}
            />
        </TouchableOpacity>
    </View>
);

export default ButtonAdd;