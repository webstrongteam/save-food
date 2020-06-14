import React from 'react';
import {Text, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";

const InfoWindow = ({color1 = '#f8f8f8', color2 = ['#f2a91e', '#e95c17'], title = 'none', val = 'none', colorTitle = '#000'}) => (
    <View style={{
        width: '100%',
        height: 60,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <View style={{
            width: '90%',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color1,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 0
            },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 7
        }}>
            <View style={{flex: 5}}>
                <Text style={{
                    fontFamily: 'Lato-Light',
                    fontSize: 20,
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: colorTitle
                }}>{title}</Text>
            </View>
            <View style={{
                borderBottomLeftRadius: 30,
                borderTopLeftRadius: 30,
                overflow: 'hidden',
                flex: 5
            }}>
                <LinearGradient
                    start={{x: 1, y: 1}}
                    end={{x: 0, y: 0}}
                    colors={color2}
                    style={{
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{
                        color: '#fff',
                        fontSize: 18,
                        textAlign: 'center',
                        fontFamily: 'Lato-Bold'
                    }}>{val}</Text>
                </LinearGradient>
            </View>
        </View>
    </View>
);

export default InfoWindow;