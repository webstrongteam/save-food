import React from "react";
import {Image, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import Spinner from "../../components/Spinner/Spinner";
import {Button, Icon, Input} from 'react-native-elements';
import axios from 'axios';
import {WebView} from "react-native-webview";
import Header from "../../components/Header/Header";

import {connect} from 'react-redux';
import * as actions from "../../store/actions";

class Payment extends React.Component {
    state = {
        ids: null,
        amount: 0,
        name: 'saveFood',
        email: '',
        currency: 'PLN',
        screen: "product",
        charity: 'pajacyk',
        initUrl: "https://savefood-payment.netlify.app/",
        url: "https://savefood-payment.netlify.app/payment-init",
        loading: true
    };

    componentDidMount() {
        const {navigation} = this.props;
        const ids = navigation.getParam('ids', null);
        const amount = navigation.getParam('amount', 0);
        const currency = this.props.currency;

        this.setState({ids, amount, currency});
    }

    showSimpleMessage = () => {
        const message = {
            message: "Bład podczas płatności",
            description: "Doszło do błędu podczas płatnośći. Spóbuj ponownie i upewnij się że podałeś poprawne dane.",
            type: "danger",
            icon: { icon: "danger", position: "left" },
            duration: 5000
        };

        showMessage(message);
    };

    async createPaymentSession() {
        const data = {
            amount: this.state.amount,
            name: this.state.name,
            email: this.state.email,
            currency: this.state.currency
        };

        await axios.post('https://webstrong.pl/api/savefood/payment', data)
            .then(result => {
                const sessionID = JSON.parse(result.data.body);
                this.setState({
                    url: this.state.initUrl + "payment?session=" + sessionID.id,
                    loading: false
                });
            })
            .catch(err => console.log(err));
    }

    _onNavigationStateChange(webViewState) {
        if (webViewState.url === this.state.initUrl + "payment-init") {
            this.createPaymentSession();
        }

        if (webViewState.url === this.state.initUrl + "payment-success") {
            this.props.navigation.navigate('List', {ids: this.state.ids});
        }

        if (webViewState.url === this.state.initUrl + "payment-failure") {
            this.setState({screen: "product"}, this.showSimpleMessage);
        }
    }

    startPayment() {
        const loading = this.state.loading;
        let url = this.state.url;
        if (url === "") {
            url = this.state.initUrl;
        }

        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <StatusBar barStyle={'dark-content'}/>
                {loading && <Spinner color='#000' size={64}/>}
                <WebView
                    style={{marginTop: 20}}
                    mixedContentMode="never"
                    source={{
                        uri: url
                    }}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                />
            </View>
        );
    }

    showProduct() {
        const {amount, currency, charity, email} = this.state;

        return (
            <View style={{flex: 1, alignItems: 'center', backgroundColor: '#fff'}}>
                <StatusBar barStyle={'dark-content'}/>
                <Header
                    leftComponent={
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon
                                style={{marginTop: 5, marginLeft: 20}}
                                size={25} name='arrowleft'
                                type='antdesign' color={"#000"}
                            />
                        </TouchableOpacity>
                    }
                    centerComponent={
                        <Text style={{fontSize: 20, fontFamily: 'Lato-Light', color: '#000'}}>
                            Razem: <Text style={{fontFamily: 'Lato-Regular'}}>{amount} {currency}</Text>
                        </Text>
                    }
                />
                <ScrollView style={{flex: 1, width: '100%'}} contentContainerStyle={{flex: 1, alignItems: 'center'}}>
                    <View style={{width: '80%', marginTop: 50}}>
                        <Input
                            leftIcon={{
                                name: 'email',
                                style: {opacity: '0.5'}
                            }}
                            autoCapitalize={"none"}
                            labelStyle={{fontFamily: 'Lato-Bold'}}
                            label='Wpisz swój e-mail'
                            keyboardType='email-address'
                            textContentType='emailAddress'
                            autoCompleteType='email'
                            inputStyle={{fontFamily: 'Lato-Light'}}
                            placeholder='E-mail'
                            onChangeText={(value) => this.setState({email: value})}
                        />
                    </View>
                    <View style={{marginTop: 20}}>
                        <Text style={{fontSize: 20, fontFamily: 'Lato-Light', color: '#000'}}>
                            Wybierz akcję charytatywną:
                        </Text>
                    </View>
                    <View style={{marginTop: 40, marginBottom: 20}}>
                        <TouchableOpacity onPress={() => this.setState({charity: 'pajacyk'})}>
                            <View style={{
                                padding: 5,
                                borderColor: '#4b8b1d',
                                borderWidth: charity === 'pajacyk' ? 1 : 0
                            }}>
                                <Image style={{width: 100, height: 100, resizeMode: 'center'}}
                                       source={require('../../assets/pajacyk.jpeg')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop: 20, marginBottom: 50}}>
                        <Button
                            buttonStyle={{backgroundColor: '#4b8b1d'}}
                            disabled={email === ''}
                            titleStyle={{
                                color: '#fff',
                                fontSize: 18,
                                padding: 25,
                                fontFamily: 'Lato-Light'
                            }}
                            title="Przejdź do płatności"
                            onPress={() => this.setState({screen: 'payment'})}/>
                    </View>
                </ScrollView>
            </View>
        );
    }

    render() {
        switch (this.state.screen) {
            case "product":
                return this.showProduct();
            case "payment":
                return this.startPayment();
            case "success":
                return (
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 25}}>Payments Succeeded :)</Text>
                    </View>
                );
            case "failure":
                return (
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 25}}>Payments failed :(</Text>
                    </View>
                );
            default:
                break;
        }
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
        onSaveFood: (value) => dispatch(actions.saveFood(value))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);