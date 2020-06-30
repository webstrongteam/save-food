import React from "react";
import {ImageBackground, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import Spinner from "../../components/Spinner/Spinner";
import {Button, Icon, Input} from 'react-native-elements';
import axios from 'axios';
import {WebView} from "react-native-webview";
import Header from "../../components/Header/Header";
import Modal from "../../components/Modal/Modal";

import {connect} from 'react-redux';
import * as actions from "../../store/actions";

class Payment extends React.Component {
    state = {
        ids: null,
        amount: 0,
        name: 'saveFood',
        email: '',
        currency: 'pln',
        screen: "product",
        charity: 'pajacyk',
        initUrl: "https://savefood-payment.netlify.app/",
        url: "https://savefood-payment.netlify.app/payment-init",
        modalContent: null,
        type: null,
        showModal: false,
        loading: true
    };

    componentDidMount() {
        const {navigation} = this.props;
        const ids = navigation.getParam('ids', null);
        const amount = navigation.getParam('amount', 0);
        const currency = this.props.currency.toLowerCase();

        this.setState({ids, amount, currency});
    }

    showSimpleMessage = () => {
        const {translations} = this.props;

        const message = {
            message: translations.paymentErrorTitle,
            description: translations.paymentErrorDescription,
            type: "danger",
            icon: {icon: "danger", position: "left"},
            duration: 5000
        };

        showMessage(message);
    };

    setContent = (type) => {
        this.setState({
            modalContent: (
                <View>
                    <Text style={{
                        marginTop: 15,
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 16,
                        fontFamily: "Lato-Light"
                    }}>
                        {this.props.translations[type.toLowerCase()]}
                    </Text>
                    <Text style={{
                        marginTop: 15,
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 12,
                        fontFamily: "Lato-Light"
                    }}>
                        {this.props.translations[type.toLowerCase() + "Footer"]}
                    </Text>
                </View>
            ),
            showModal: true, type
        })
    };

    toggleModal = (type) => {
        if (!this.state.showModal) {
            this.setContent(type);
        } else {
            this.setState({showModal: !this.state.showModal});
        }
    };

    async createPaymentSession() {
        let paymentMethods;
        if (this.state.currency === 'pln') {
            paymentMethods = ["card", "p24"];
        } else {
            paymentMethods = ["card"];
        }

        const data = {
            title: this.props.translations.paymentTitle,
            lang: this.props.lang,
            amount: this.state.amount,
            name: this.state.name,
            email: this.state.email,
            currency: this.state.currency,
            paymentMethods
        };

        await axios.post('https://webstrong.pl/api/savefood/payment', data)
            .then(result => {
                const sessionID = JSON.parse(result.data.body);
                this.setState({
                    url: this.state.initUrl + "payment?session=" + sessionID.id,
                    loading: false
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({screen: "product", loading: false}, this.showSimpleMessage);
            });
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
        const {amount, showModal, type, modalContent, currency, charity, email} = this.state;
        const {translations} = this.props;

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
                            {translations.amount} <Text
                            style={{fontFamily: 'Lato-Regular'}}>{amount} {currency.toUpperCase()}</Text>
                        </Text>
                    }
                />

                <Modal
                    visible={showModal}
                    toggleModal={this.toggleModal}
                    title={type}
                    content={modalContent}
                />

                <ScrollView style={{flex: 1, width: '100%'}} contentContainerStyle={{flex: 1, alignItems: 'center'}}>
                    <View style={{width: '80%', marginTop: 50}}>
                        <Input
                            leftIcon={{
                                name: 'email',
                                style: {opacity: 0.5}
                            }}
                            autoCapitalize={"none"}
                            labelStyle={{fontFamily: 'Lato-Bold'}}
                            label={translations.emailLabel}
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
                            {translations.chooseCharity}
                        </Text>
                    </View>
                    <View style={{marginTop: 40, marginBottom: 20}}>
                        <TouchableOpacity onPress={() => this.setState({charity: 'pajacyk'})}>
                            <View style={{
                                padding: 5,
                                borderColor: '#4b8b1d',
                                borderWidth: charity === 'pajacyk' ? 1 : 0
                            }}>
                                <ImageBackground style={{width: 100, height: 100, resizeMode: 'center'}}
                                                 source={require('../../assets/charities/pajacyk.png')}>
                                    <View style={{position: 'absolute', right: 0, top: 0}}>
                                        <TouchableOpacity onPress={() => this.toggleModal('Pajacyk')}>
                                            <Icon
                                                style={{opacity: 0.5}}
                                                size={23} name='info-outline'
                                                type='material' color={"#000"}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </ImageBackground>
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
                            title={translations.moveToPayment}
                            onPress={() => this.setState({screen: 'payment', loading: true})}/>
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
            default:
                break;
        }
    }
}

const mapStateToProps = state => {
    return {
        currency: state.settings.currency,
        lang: state.settings.lang,
        translations: state.settings.translations
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onSaveFood: (value) => dispatch(actions.saveFood(value))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);