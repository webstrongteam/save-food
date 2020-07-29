import React from "react";
import {ImageBackground, ScrollView, StatusBar, Text, TouchableOpacity, View, Platform} from "react-native";
import openSocket from 'socket.io-client';
import {showMessage} from "react-native-flash-message";
import Spinner from "../../components/Spinner/Spinner";
import {Button, Icon, Input} from 'react-native-elements';
import axios from 'axios';
import {WebView} from "react-native-webview";
import Header from "../../components/Header/Header";
import Modal from "../../components/Modal/Modal";
import * as WebBrowser from 'expo-web-browser';
import {auth} from '../../config/backendAuth';
import styles from './Payment.style';

import {connect} from 'react-redux';
import * as actions from "../../store/actions";

const defaultData = {
    initUrl: "https://savefood-payment.netlify.app/",
    url: "https://savefood-payment.netlify.app/payment-init",
    backendUrl: 'https://webstrong.pl'
};

class Payment extends React.Component {
    state = {
        ids: null,
        amount: 0,
        name: 'saveFood',
        email: '',
        currency: 'pln',
        screen: "product",
        charity: 'pajacyk',
        initUrl: defaultData.initUrl,
        url: defaultData.url,
        backendUrl: defaultData.backendUrl,
        modalContent: null,
        type: null,
        socketID: null,
        initPayment: false,
        showModal: false,
        modalButtons: [],
        loading: true
    };

    componentDidMount() {
        const {navigation} = this.props;
        const ids = navigation.getParam('ids', null);
        const amount = navigation.getParam('amount', 0);
        const currency = this.props.currency.toLowerCase();

        if (Platform.OS === 'ios') {
            this.checkingPaymentStatus();
        }

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
        const {translations} = this.props;

        if (type === 'commission') {
            this.setState({
                modalContent: (
                    <View>
                        <Text style={styles.modalMessage}>
                            {translations[type]}
                        </Text>
                    </View>
                ),
                modalButtons: [
                    {
                        text: translations.confirm,
                        onPress: () => this.setState({screen: 'payment', loading: true, showModal: false})
                    }, {
                        text: translations.cancel,
                        onPress: () => this.setState({showModal: false})
                    }
                ], showModal: true, type: translations[type + 'Title']
            })
        } else {
            this.setState({
                modalContent: (
                    <View>
                        <Text style={styles.modalMessage}>
                            {translations[type.toLowerCase()]}
                        </Text>
                        <Text style={styles.modalFooterMessage}>
                            {translations[type.toLowerCase() + "Footer"]}
                        </Text>
                    </View>
                ),
                showModal: true, type, modalButtons: []
            })
        }
    };

    toggleModal = (type) => {
        if (!this.state.showModal) {
            this.setContent(type);
        } else {
            this.setState({showModal: !this.state.showModal});
        }
    };

    createPaymentSession() {
        let paymentMethods;
        if (this.state.currency === 'pln') {
            paymentMethods = ["card", "p24"];
        } else {
            paymentMethods = ["card"];
        }

        const data = {
            auth,
            title: this.props.translations.paymentTitle,
            lang: this.props.lang,
            amount: this.state.amount,
            name: this.state.name,
            email: this.state.email,
            currency: this.state.currency,
            paymentMethods
        };

        if (Platform.OS === 'ios') {
            this.iosPayment(data);
        } else {
            this.androidPayment(data);
        }
    }

    iosPayment = (data) => {
        data.socketID = this.state.socketID;
        axios.post(`${this.state.backendUrl}/savefood/api/payment`, data)
            .then(async result => {
                const url = `${this.state.initUrl}payment?session=${result.data.id}`;

                WebBrowser.openBrowserAsync(url)
                    .then((res) => {
                        if (res.type === 'cancel') {
                            this.paymentError(false);
                        }
                    })
                    .catch(err => this.paymentError());
            })
            .catch(err => {
                console.log(err);
                this.paymentError();
            });
    };

    androidPayment = (data) => {
        axios.post(`${this.state.backendUrl}/savefood/api/payment`, data)
            .then(async result => {
                const url = `${this.state.initUrl}payment?session=${result.data.id}`;
                this.setState({url, loading: false});
            })
            .catch(err => {
                console.log(err);
                this.paymentError();
            });
    };

    checkingPaymentStatus = () => {
        const socket = openSocket(this.state.backendUrl);

        socket.on('connect', () => {
            this.setState({socketID: socket.id});
        });

        socket.on('payment', data => {
            if (data.status === 'success') {
                WebBrowser.dismissBrowser();
                this.paymentSuccess();
            } else {
                WebBrowser.dismissBrowser();
                this.paymentError();
            }
        });
    };

    paymentSuccess = () => {
        const data = {
            auth,
            title: this.props.translations.paymentTitle,
            lang: this.props.lang,
            amount: this.state.amount,
            name: this.state.name,
            email: this.state.email,
            currency: this.state.currency
        };

        axios.post(`${this.state.backendUrl}/savefood/api/send-email`, data); // Send email after a successful payment
        this.props.navigation.navigate('List', {ids: this.state.ids});
    };

    paymentError = (error = true) => {
        this.setState({
            screen: "product",
            url: defaultData.url,
            initPayment: false,
            loading: false
        }, () => error && this.showSimpleMessage());
    };

    _onNavigationStateChange(webViewState) {
        if (webViewState.url === this.state.initUrl + "payment-init") { // Payment init
            if (!this.state.initPayment) {
                this.setState({initPayment: true}, () => {
                    this.createPaymentSession();
                })
            }
        }

        if (webViewState.url.includes("payment-success")) { // Payment success
            this.paymentSuccess();
        }

        if (webViewState.url.includes("payment-failure")) { // Payment failed
            this.paymentError();
        }
    }

    startPayment() {
        const {url, loading} = this.state;

        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <StatusBar barStyle={'dark-content'}/>
                {loading && <Spinner color='#000' size={64}/>}
                <WebView
                    style={{marginTop: 20}}
                    mixedContentMode="never"
                    source={{uri: url}}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                />
            </View>
        );
    }

    showProduct() {
        const {amount, currency, charity, email} = this.state;
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

                <ScrollView
                    style={{flex: 1, width: '100%'}}
                    contentContainerStyle={{flex: 1, alignItems: 'center'}}
                >
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
                            onPress={() => this.toggleModal('commission')}/>
                    </View>
                </ScrollView>
            </View>
        );
    }

    render() {
        const {showModal, type, screen, modalContent, modalButtons} = this.state;

        const switchComponents = () => {
            if (screen === 'product') {
                return this.showProduct();
            } else if (screen === 'payment') {
                return this.startPayment();
            }
        }

        return (
            <>
                <Modal
                    visible={showModal}
                    toggleModal={this.toggleModal}
                    buttons={modalButtons}
                    title={type}
                    content={modalContent}
                />
                {switchComponents()}
            </>
        )
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