import React, {Component} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {BlurView} from 'expo-blur';
import styles from './List.style';
import Header from '../../components/Header/Header';
import {LinearGradient} from "expo-linear-gradient";
import {Button, CheckBox, Icon} from "react-native-elements";
import Swipeable from 'react-native-swipeable';
import ButtonAdd from '../../components/ButtonAdd/ButtonAdd';

class List extends Component {
    render() {
        const {navigation} = this.props;
        const rightButtons = [
            <TouchableOpacity style={styles.delete}>
                <Icon
                    style={{marginLeft: 10}}
                    size={40} name='trash-o'
                    type='font-awesome' color={'#fff'}/>
            </TouchableOpacity>,
        ];
        const list = [{name: 'pizza'}, {name: 'pizza', quantity: '22', percentage: '42', price: '200 PLN'}]

        return (
            <>
                <LinearGradient
                    colors={['#4b8b1d', '#6cd015']}
                    style={styles.containerColor}
                />
                <ScrollView>
                    <Header
                        leftComponent={
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon
                                    style={{marginTop: 5, marginLeft: 20}}
                                    size={25} name='arrowleft'
                                    type='antdesign' color={"#fff"}
                                />
                            </TouchableOpacity>
                        }
                    />
                    <View
                        style={styles.container}
                    >
                        {list.map((item, i) => (
                            <Swipeable rightButtons={rightButtons}>
                                <BlurView style={styles.listItem} intensity={50} tint='dark'>
                                    <View style={{flex: 1}}>
                                        <CheckBox
                                            value={false}
                                            // onValueChange={() => this.setState({saveUserData: !this.state.saveUserData})}
                                            style={styles.checkbox}
                                            checkedColor={"#ea6700"}
                                            tintColors={{true: '#ea6700', false: '#ea6700'}}
                                        />
                                    </View>
                                    <View>
                                        <Image
                                            style={{width: 100, height: 100, resizeMode: 'center'}}
                                            source={item.image ? {uri: item.image} : require('../../assets/not-found-image.png')}
                                        />
                                        <ButtonAdd
                                            onPressAdd
                                            onPresMinus
                                            val={'2'}
                                        />
                                    </View>
                                    <View style={{flex: 3}}>
                                        <Text style={{
                                            fontFamily: 'Lato-Bold',
                                            fontSize: 20,
                                            color: '#fff',
                                            marginLeft: 10,
                                            marginBottom: 5,
                                            marginTop: -30
                                        }}>Name {item.name}</Text>
                                        <Text style={styles.text}>Quantity: {item.quantity}g</Text>
                                        <Text style={styles.text}>Percentage: {item.percentage}%</Text>
                                    </View>
                                    <Text style={styles.priceText}>{item.price}</Text>
                                </BlurView>
                            </Swipeable>
                        ))}
                    </View>
                </ScrollView>
                <View style={{
                    position: 'absolute',
                    width: '100%',
                    bottom: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 0
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    elevation: 7
                }}>
                    <Button
                        buttonStyle={{backgroundColor: '#4b8b1d'}}
                        titleStyle={{
                            color: '#fff',
                            fontSize: 18,
                            padding: 25,
                            fontFamily: 'Lato-Light'
                        }}
                        title="Pay (25 USD)"
                    />
                </View>
            </>
        );
    }
}

export default List;