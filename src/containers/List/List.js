import React, {Component} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import styles from './List.style';
import Header from '../../components/Header/Header';
import {LinearGradient} from "expo-linear-gradient";
import {Button, CheckBox, Icon} from "react-native-elements";
import {getResizeMode} from "../../common/utility";
import Spinner from "../../components/Spinner/Spinner";
import {BlurView} from "expo-blur";
import ButtonAdd from "../../components/ButtonAdd/ButtonAdd";
import Swipeable from "react-native-swipeable";

import {connect} from 'react-redux';
import * as actions from "../../store/actions";

class List extends Component {
    state = {
        list: [],
        selectedItems: [],
        amount: 0,
        isSwiping: false,
        loading: true,
        wait: false
    };

    async componentDidMount() {
        this.initWastedList();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.refresh !== this.props.refresh && !this.state.wait) {
            this.setState({loading: true}, () => {
                this.initWastedList();
            })
        } else if (this.props.navigation !== prevProps.navigation) {
            this.paidFood();
        }
    }

    paidFood = () => {
        const ids = this.props.navigation.getParam('ids', null);
        if (ids) {
            this.setState({loading: true}, async () => {
                await Promise.all(ids.map(id => {
                    this.props.paidFood(id, () => {
                        return Promise.resolve()
                    })
                }));
                this.initWastedList(true);
            })
        }
    };

    showSimpleMessage = () => {
        const {translations} = this.props;

        const message = {
            message: translations.paymentSuccessTitle,
            description: translations.paymentSuccessDescription,
            type: "success",
            icon: {icon: "success", position: "left"},
            duration: 2500
        };

        showMessage(message);
    };

    initWastedList = (showMessage = false) => {
        this.props.fetchWastedFood(foods => {
            const list = foods.map((val) => {
                let {image} = val;
                if (!image || image === 'null') {
                    image = require('../../assets/not-found-image.png');
                } else {
                    image = {uri: image};
                }
                let resize = 'cover';
                if (image.constructor.name === 'String') {
                    getResizeMode(image, (resizeMode) => {
                        resize = resizeMode
                    });
                }
                return ({
                    ...val,
                    resizeMode: resize
                })
            });
            this.setState({
                list, selectedItems: [], amount: 0, loading: false
            }, () => {
                if (showMessage) this.showSimpleMessage();
            })
        })
    };

    getAmount = (selectedItems = this.state.selectedItems) => {
        return selectedItems.reduce((a, i) => a + i.price * i.productQuantity, 0);
    };

    selectItem = (item, onlyRemove = false) => {
        const {selectedItems} = this.state;
        const checkSelectedItem = selectedItems.find(i => i.id === item.id);

        if (checkSelectedItem) {
            const newSelectedItems = selectedItems.filter(i => i.id !== item.id);
            this.setState({
                selectedItems: newSelectedItems,
                amount: this.getAmount(newSelectedItems)
            });
        } else if (!onlyRemove) {
            selectedItems.push(item);
            this.setState({
                selectedItems,
                amount: this.getAmount(selectedItems)
            });
        }
    };

    removeItem = (id) => {
        this.props.removeFood(id);
        this.selectItem({id}, true);
        this.props.fetchWastedFood(foods => {
            this.setState({list: foods})
        })
    };

    addFood = (item, val) => {
        const quantity = item.productQuantity + val;
        if (!this.state.wait && quantity < 100 && quantity > 0) {
            this.setState({wait: true}, () => {
                const quantity = item.productQuantity + val;
                const {selectedItems} = this.state;
                let {amount} = this.state;
                const selectedIn = selectedItems.findIndex((val) => (val.id === item.id));
                if (selectedIn >= 0) {
                    selectedItems[selectedIn].productQuantity = selectedItems[selectedIn].productQuantity + val;
                    amount = this.getAmount(selectedItems);
                }

                const index = this.state.list.indexOf(item);
                const newList = this.state.list;
                newList[index].productQuantity = quantity;
                this.props.onSaveFood({...item, productQuantity: quantity}, () => {
                    this.props.onRefresh();
                    this.setState({list: newList, amount, wait: false});
                });
            })
        }
    };

    render() {
        const {isSwiping, selectedItems, amount, list, loading} = this.state;
        const {currency, translations, navigation} = this.props;

        return (
            <>
                <LinearGradient
                    colors={['#4b8b1d', '#6cd015']}
                    style={styles.containerColor}
                />
                <Header
                    leftComponent={
                        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
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
                {loading ?
                    <Spinner bgColor='transparency' color='#000' size={64}/> :
                    <View style={styles.container}>
                        {list.length < 1 ?
                            <View style={{marginTop: 20}}>
                                <Text style={styles.emptyList}>{translations.emptyList}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
                                    <Text style={{
                                        ...styles.emptyList,
                                        fontFamily: 'Lato-Regular'
                                    }}>{translations.scanProduct}</Text>
                                </TouchableOpacity>
                                <Text style={styles.emptyList}>{translations.or}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Food')}>
                                    <Text style={{
                                        ...styles.emptyList,
                                        fontFamily: 'Lato-Regular'
                                    }}>{translations.addManually}</Text>
                                </TouchableOpacity>
                            </View> :
                            <ScrollView scrollEnabled={!isSwiping}>
                                {list.map((item, i) => (
                                    <Swipeable
                                        key={i}
                                        style={{paddingLeft: 10, paddingRight: 10}}
                                        onSwipeStart={() => this.setState({isSwiping: true})}
                                        onSwipeRelease={() => this.setState({isSwiping: false})}
                                        rightButtons={[
                                            <>
                                                <TouchableOpacity onPress={() => this.removeItem(item.id)}
                                                                  style={styles.delete}>
                                                    <Icon
                                                        style={{marginLeft: 10}}
                                                        size={40} name='trash-o'
                                                        type='font-awesome' color={'#fff'}/>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => navigation.navigate('Food', {...item})}
                                                    style={styles.edit}>
                                                    <Icon
                                                        style={{marginLeft: 10}}
                                                        size={40} name='edit'
                                                        type='font-awesome' color={'#fff'}/>
                                                </TouchableOpacity>
                                            </>
                                        ]}>
                                        <BlurView style={styles.listItem} intensity={50} tint='dark'>
                                            <View style={{flex: 1}}>
                                                <CheckBox
                                                    checked={!!selectedItems.find(i => i.id === item.id)}
                                                    onPress={() => this.selectItem(item)}
                                                    style={styles.checkbox}
                                                    checkedColor={"#ea6700"}
                                                    tintColors={{true: '#ea6700', false: '#ea6700'}}
                                                />
                                            </View>
                                            <View>
                                                <View style={{paddingBottom: 10}}>
                                                    <Image
                                                        style={{
                                                            width: 100,
                                                            height: 100,
                                                            resizeMode: item.resizeMode
                                                        }}
                                                        source={item.image === 'null' ? require('../../assets/not-found-image.png') : {uri: item.image}}
                                                    />
                                                </View>
                                                <ButtonAdd
                                                    onPressAdd={() => this.addFood(item, 1)}
                                                    onPresMinus={() => this.addFood(item, -1)}
                                                    value={item.productQuantity}
                                                />
                                            </View>
                                            <View style={{flex: 3}}>
                                                <Text numberOfLines={2} style={{
                                                    fontFamily: 'Lato-Bold',
                                                    fontSize: 20,
                                                    color: '#fff',
                                                    marginLeft: 10,
                                                    marginBottom: 5,
                                                    marginTop: -30
                                                }}>{item.name}</Text>
                                                <Text
                                                    style={styles.text}>{translations.quantity}: {item.quantity}</Text>
                                                <Text
                                                    style={styles.text}>{translations.percent}: {item.percentage}%</Text>
                                            </View>
                                            <Text
                                                style={styles.priceText}>{item.price * item.productQuantity} {currency}</Text>
                                        </BlurView>
                                    </Swipeable>
                                ))}
                            </ScrollView>
                        }
                    </View>
                }
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
                        disabled={amount === 0}
                        titleStyle={{
                            color: '#fff',
                            fontSize: 18,
                            padding: 25,
                            fontFamily: 'Lato-Light'
                        }}
                        onPress={() => navigation.navigate('Payment', {ids: selectedItems.map(i => i.id), amount})}
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
        refresh: state.settings.refresh,
        translations: state.settings.translations
    }
};
const mapDispatchToProps = dispatch => {
    return {
        fetchWastedFood: (value) => dispatch(actions.fetchWastedFood(value)),
        removeFood: (value) => dispatch(actions.removeFood(value)),
        paidFood: (id, callback) => dispatch(actions.paidFood(id, callback)),
        onRefresh: () => dispatch(actions.onRefresh()),
        onSaveFood: (value, callback) => dispatch(actions.saveFood(value, callback))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(List);