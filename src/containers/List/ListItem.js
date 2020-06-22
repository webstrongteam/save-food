import React, {Component} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import {BlurView} from 'expo-blur';
import styles from './List.style';
import Header from '../../components/Header/Header';
import {LinearGradient} from "expo-linear-gradient";
import {Button, CheckBox, Icon} from "react-native-elements";
import Swipeable from 'react-native-swipeable';
import ButtonAdd from '../../components/ButtonAdd/ButtonAdd';
import {getResizeMode} from "../../common/utility";
import Spinner from "../../components/Spinner/Spinner";

import {connect} from 'react-redux';
import * as actions from "../../store/actions";

class ListItem extends Component {
    state={
        isSwiping: false
    }
    render() {
        const {list, currency, translations, navigation, selectedItems, onSwipeStart, removeItem, selectItem, addFood} = this.props;

        return (
            <>
                {list.map((item, i) => (
                    <ScrollView scrollEnabled={!this.state.isSwiping}>
                        <Swipeable
                            key={i}
                            onSwipeStart={() => this.setState({isSwiping: true})}
                            onSwipeRelease={() => this.setState({isSwiping: false})}
                            rightButtons={[
                                <>
                                    <TouchableOpacity onPress={() => removeItem(item.id)}
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
                                        onPress={() => selectItem(item)}
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
                                        onPressAdd={() => addFood(item, 1)}
                                        onPresMinus={() => addFood(item, -1)}
                                        value={item.productQuantity}
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
                                    <Text
                                        style={styles.text}>{translations.quantity}: {item.quantity}</Text>
                                    <Text
                                        style={styles.text}>{translations.percent}: {item.percentage}%</Text>
                                </View>
                                <Text
                                    style={styles.priceText}>{item.price * item.productQuantity} {currency}</Text>
                            </BlurView>
                        </Swipeable>
                    </ScrollView>
                ))}
            </>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);