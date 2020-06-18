import React, {Component} from 'react';
import {AsyncStorage, ScrollView, Text, TouchableOpacity, View} from "react-native";
import styles from './Home.style';
import Header from '../../components/Header/Header';
import {LinearGradient} from "expo-linear-gradient";
import {Icon} from "react-native-elements";
import InfoWindow from "../../components/InfoWindow/InfoWindow";
import Spinner from "../../components/Spinner/Spinner";
import en_facts from "../../translations/en/facts";
import pl_facts from "../../translations/pl/facts";

import {connect} from "react-redux";
import * as actions from "../../store/actions";

class Home extends Component {
    state = {
        totalPrice: 0,
        unpaid: 0,
        food: 0,
        fact: '',
        loading: true
    };

    async componentDidMount() {
        if (await AsyncStorage.getItem('start') === 'true') {
            this.props.navigation.navigate('Start');
        } else {
            this.setData();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.navigation !== prevProps.navigation || this.props.refresh !== prevProps.refresh) {
            this.setData();
        } else if (this.props.lang !== prevProps.lang) {
            this.setState({fact: this.drawFact()});
        }
    }

    setData = () => {
        this.props.fetchAllWastedFood(list => {
            let price = 0;
            let unpaid = 0;
            let food = 0;
            list.map((val) => {
                if (val.paid === 0) {
                    unpaid += val.price;
                }
                price += val.price;
                food += 1;
            });
            this.setState({totalPrice: price, unpaid, food, fact: this.drawFact(), loading: false});
        });
    };

    drawFact = () => {
        const {lang} = this.props;
        let facts;

        if (lang === 'pl') facts = pl_facts;
        else facts = en_facts;

        const id = Math.floor(Math.random() * facts.length);

        return facts[id];
    };

    render() {
        const {totalPrice, unpaid, food, fact, loading} = this.state;
        const {translations, currency, navigation} = this.props;

        return (
            <>
                {loading ?
                    <Spinner size={64}/> :
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
                                        <Text style={{marginLeft: 5, color: '#fff'}}>({unpaid} {currency})</Text>
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
                                {fact}
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
                                        val={`${food}`}/>
                            <InfoWindow color1={'#f8f8f8'} color2={['#f2a91e', '#e95c17']}
                                        title={translations.wastedMoney}
                                        val={`${totalPrice} ${currency}`}/>
                        </ScrollView>
                    </View>
                }
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        refresh: state.settings.refresh,
        currency: state.settings.currency,
        lang: state.settings.lang,
        translations: state.settings.translations
    }
};
const mapDispatchToProps = dispatch => {
    return {
        fetchAllWastedFood: (value) => dispatch(actions.fetchAllWastedFood(value)),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);