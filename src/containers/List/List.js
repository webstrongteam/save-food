import React, {Component} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {BlurView} from 'expo-blur';
import styles from './List.style';
import Header from '../../components/Header/Header';
import {LinearGradient} from "expo-linear-gradient";
import {Button, CheckBox, Icon} from "react-native-elements";
import Swipeable from 'react-native-swipeable';
import ButtonAdd from '../../components/ButtonAdd/ButtonAdd';

import {connect} from 'react-redux';
import * as actions from "../../store/actions";

class List extends Component {
    state = {
        list: [
            {
                id: 1,
                name: 'Burger',
                quantity: 500,
                percentage: 50,
                price: 10
            }, {
                id: 2,
                name: 'Pizza',
                quantity: 22,
                percentage: 42,
                price: 20
            }
        ],
        selectedItems: [],
        amount: 0
    };

    getAmountOfItems = (id) => {
        const {list} = this.state;
        let amount = 0;

        list.map(i => {
            if (i.id === id) {
                amount++;
            }
        });

        return amount;
    };

    selectItem = (item) => {
        let {amount, selectedItems} = this.state;
        const checkSelectedItem = selectedItems.find(i => i === item.id);

        if (checkSelectedItem) {
            this.setState({
                selectedItems: selectedItems.filter(i => i !== item.id),
                amount: amount - item.price
            });
        } else {
            selectedItems.push(item.id);
            this.setState({
                selectedItems,
                amount: amount + item.price
            });
        }
    };

    removeItem = (id) => {

    };

    addFood = (item) => {
    };

    minusFood = (id) => {
    };

    render() {
        const {selectedItems, amount, list} = this.state;
        const {currency, translations, navigation} = this.props;

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
                        centerComponent={
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 22,
                                color: '#fff'
                            }}>{translations.foodList}</Text>
                        }
                        centerSize={6}
                    />
                    <View
                        style={styles.container}
                    >
                        {list.map((item, i) => (
                            <Swipeable key={i} rightButtons={[
                                <TouchableOpacity onPress={() => this.removeItem(item.id)} style={styles.delete}>
                                    <Icon
                                        style={{marginLeft: 10}}
                                        size={40} name='trash-o'
                                        type='font-awesome' color={'#fff'}/>
                                </TouchableOpacity>
                            ]}>
                                <BlurView style={styles.listItem} intensity={50} tint='dark'>
                                    <View style={{flex: 1}}>
                                        <CheckBox
                                            checked={selectedItems.find(i => i === item.id)}
                                            onPress={() => this.selectItem(item)}
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
                                            onPressAdd={() => this.addFood(item)}
                                            onPresMinus={() => this.minusFood(item.id)}
                                            value='1'
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
                                        }}>{item.name}</Text>
                                        <Text style={styles.text}>{translations.quantity}: {item.quantity}g</Text>
                                        <Text style={styles.text}>{translations.percent}: {item.percentage}%</Text>
                                    </View>
                                    <Text style={styles.priceText}>{item.price} {currency}</Text>
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
                        title={`${translations.pay} ${amount} ${currency}`}
                    />
                </View>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        currency: state.settings.currency,
        translations: state.settings.translations
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onChangeLang: (value) => dispatch(actions.changeLang(value)),
        onChangeCurrency: (value) => dispatch(actions.changeCurrency(value)),
        onChangeNotificationCycle: (value) => dispatch(actions.changeNotificationCycle(value))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(List);