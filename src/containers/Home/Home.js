import React, {Component} from 'react';
import {AsyncStorage, ScrollView, Text, TouchableOpacity, View} from "react-native";
import styles from './Home.style';
import Header from '../../components/Header/Header';
import {LinearGradient} from "expo-linear-gradient";
import {Icon} from "react-native-elements";

import {connect} from "react-redux";
import * as actions from "../../store/actions";
import InfoWindow from "../../components/InfoWindow/InfoWindow";


class Home extends Component {
    state = {
        ready: false,
        totalPrice: 0,
        food: 0
    };

    componentDidMount() {
        if (AsyncStorage.getItem('start')) {
            this.props.navigation.navigate('Start');
        } else {
            this.setState({ready: true});
        }
        this.props.fetchAllWastedFood(
            list => {
                let price = 0;
                let food = 0;
                list.map((val) => {
                    price += val.price;
                    food += 1;
                })
                this.setState({totalPrice: price, food: food})
            }
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.navigation !== prevProps.navigation) {
            this.setState({ready: true});
        }
    }

    render() {
        const {translations, currency, navigation} = this.props;

        return (
            <>
                {this.state.ready &&
                <View style={styles.container}>
                    <Header
                        leftComponent={
                            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                                <Icon color="#fff" size={25}
                                      name='setting' style={{marginLeft: 20}}
                                      type='antdesign'/>
                            </TouchableOpacity>
                        }
                        rightComponent={
                            <TouchableOpacity onPress={() => navigation.navigate('List')}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 20}}>
                                    <Icon
                                        size={25} name='trash-o'
                                        type='font-awesome' color={"#fff"}
                                    />
                                    <Text style={{marginLeft: 5, color: '#fff'}}>(25 {currency})</Text>
                                </View>
                            </TouchableOpacity>
                        }
                        rightSize={4}
                    />
                    <LinearGradient
                        colors={['#4b8b1d', '#6cd015']}
                        style={styles.containerColor}
                    >
                    </LinearGradient>
                    <ScrollView>
                        <Text style={styles.text}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry's
                        </Text>

                    <View style={styles.containerCenter}>
                        <TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
                            <LinearGradient
                                colors={['#f2f3f5', '#c4bfc3']}
                                style={styles.circleOne}
                            >
                                <LinearGradient
                                    colors={['#f8aa24', '#ec4f18']}
                                    style={styles.circleTwo}
                                >
                                    <LinearGradient
                                        colors={['#f2f3f5', '#c4bfc3']}
                                        style={styles.circleThree}
                                    >
                                        <Text style={styles.textScan}>{translations.scan}</Text>
                                    </LinearGradient>
                                </LinearGradient>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                        <InfoWindow color1={'#f8f8f8'} color2={['#af3462', '#bf3741']}
                                    title={translations.wastedFood}
                                    val={`${this.state.food}`}/>
                        <InfoWindow color1={'#f8f8f8'} color2={['#f2a91e', '#e95c17']}
                                    title={translations.wastedMoney}
                                    val={`${this.state.totalPrice} ${currency}`}/>
                </ScrollView>
            </View>
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
        fetchAllWastedFood: (value) => dispatch(actions.fetchAllWastedFood(value)),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);