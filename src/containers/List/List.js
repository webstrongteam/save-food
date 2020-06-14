import React, {Component} from 'react';
import {Image, ScrollView, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import styles from './List.style';
import Header from '../../components/Header/Header';
import {LinearGradient} from "expo-linear-gradient";
import {Icon, CheckBox} from "react-native-elements";
import Swipeable from 'react-native-swipeable';
import ButtonAdd from '../../components/ButtonAdd/ButtonAdd';

class List extends Component {
    render() {
        const {navigation} = this.props;
        const rightButtons = [
            <TouchableOpacity style={styles.delete}>
                <Icon
                    size={40} name='delete'
                    type='antdesign' color={'#fff'}/>
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
                                <LinearGradient
                                    colors={['#f8aa24', '#ec4f18']}
                                    style={styles.listItem}
                                    start={{x: 1, y: 1}}
                                    end={{x: 0, y: 0}}
                                >
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
                                            val={'2'}/>
                                    </View>
                                    <View style={{flex: 3}}>
                                        <Text style={{
                                            fontSize: 22,
                                            color: '#fff',
                                            marginLeft: 10,
                                            marginBottom: 5,
                                            marginTop: -20
                                        }}>Name {item.name}</Text>
                                        <Text style={styles.text}>Quantity {item.quantity}</Text>
                                        <Text style={styles.text}>Percentage {item.percentage}</Text>
                                    </View>
                                    <Text style={styles.priceText}>{item.price}</Text>
                                </LinearGradient>
                            </Swipeable>
                        ))}
                    </View>
                </ScrollView>
            </>
        );
    }
}

export default List;