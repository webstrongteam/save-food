import React from 'react';
import {Text, View, TouchableOpacity, ScrollView} from "react-native";
import {Icon} from "react-native-elements";
import styles from "../../containers/Home/Home.style";
import {LinearGradient} from "expo-linear-gradient";

const InfoWindow = ({color1 = '#f8f8f8', color2 = ['#f2a91e', '#e95c17'], title = 'none', val = 'none', colorTitle = '#000', onPress}) => (
    <View style={{
        width: '100%',
        height: 90,
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <View style={{
            width: '90%',
            marginTop: 10,
            flex: 1,
            height: 80,
            borderColor: color1,
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color1,

        }}>
            <View style={{flex: 4}}>
                <Text style={{
                    fontSize: 22,
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: colorTitle
                }}>{title}</Text>
            </View>
            <LinearGradient
                start={{x: 1, y: 1}}
                end={{x: 0, y: 0}}
                colors={color2}
                style={{
                    borderLeftWidth: 1,
                    flex: 5,
                    height: '100%',
                    borderBottomLeftRadius: 40,
                    borderTopLeftRadius: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {onPress ? <TouchableOpacity onPress={()=>onPress()}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 28,
                            textAlign: 'center',
                        }}>{val}</Text>
                    </TouchableOpacity>
                    : <Text style={{
                        color: '#fff',
                        fontSize: 28,
                        textAlign: 'center',
                    }}>{val}</Text>}
            </LinearGradient>
        </View>
    </View>
);

export default InfoWindow;