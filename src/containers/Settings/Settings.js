import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import Header from '../../components/Header/Header';
import styles from './Settings.styles';
import InfoWindow from '../../components/InfoWindow/InfoWindow';
import Modal from '../../components/Modal/Modal';
import {showMessage} from "react-native-flash-message";

import {connect} from 'react-redux';
import * as actions from "../../store/actions";

class Settings extends Component {
    state = {
        lang: '',
        currency: '',
        notification_cycle: null,

        languages: [
            {short: 'en', name: this.props.translations.english},
            {short: 'pl', name: this.props.translations.polish}
        ],
        currencyList: ['USD', 'PLN'],

        type: '',
        modalContent: null,
        showModal: false
    };

    componentDidMount() {
        const {languages, currencyList} = this.state;
        const {lang, currency, notification_cycle} = this.props.settings;

        this.setState({
            lang: languages.find(l => l.short === lang.toLowerCase()).name,
            currency: currencyList.find(c => c === currency),
            notification_cycle
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.translations !== this.props.translations) {
            const {translations, settings} = this.props;
            const languages = [
                {short: 'en', name: translations.english},
                {short: 'pl', name: translations.polish}
            ];

            this.setState({
                languages, showModal: false,
                lang: languages.find(l => l.short === settings.lang.toLowerCase()).name,
            })
        }
    }

    changeLanguage = (lang) => {
        this.props.onChangeLang(lang.short);
    };

    changeCurrency = (currency) => {
        this.props.onChangeCurrency(currency);
        this.setState({currency, showModal: false});
    };

    // changeNotificationCycle = (cycle) => {
    //     this.props.onChangeNotificationCycle(cycle);
    //     this.setState({cycle});
    // };

    setContent = (type) => {
        const {lang, currency} = this.props.settings;

        if (type === 'language') {
            this.setState({
                modalContent: (
                    <View>
                        {
                            this.state.languages.map((item, i) => (
                                <TouchableOpacity key={i} onPress={() => this.changeLanguage(item)}>
                                    <ListItem
                                        title={item.name}
                                        bottomDivider
                                        chevron
                                        containerStyle={{backgroundColor: 'transparency'}}
                                        titleStyle={{color: item.short === lang ? '#4b8b1d' : '#000'}}
                                    />
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                ),
                showModal: true, type
            })
        } else if (type === 'currency') {
            this.setState({
                modalContent: (
                    <View>
                        {
                            this.state.currencyList.map((item, i) => (
                                <TouchableOpacity key={i} onPress={() => this.changeCurrency(item)}>
                                    <ListItem
                                        title={item}
                                        bottomDivider
                                        chevron
                                        containerStyle={{backgroundColor: 'transparency'}}
                                        titleStyle={{color: item === currency ? '#4b8b1d' : '#000'}}
                                    />
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                ),
                showModal: true, type
            })
        } else if (type === 'clearTheDatabase') {
            this.setState({
                modalContent: (
                    <View>
                        <Text style={styles.clearTheDatabase}>
                            {this.props.translations.clearTheDatabaseModal}
                        </Text>
                    </View>
                ),
                showModal: true, type
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

    clearTheDatabase = () => {
        this.props.fetchAllWastedFood((list) => {
            list.map((val) => {
                this.props.removeFood(val.id)
            })
        });
        this.showSimpleMessage();
        this.toggleModal();
    };

    showSimpleMessage = () => {
        const {translations} = this.props;

        const message = {
            message: translations.clearTheDatabaseSuccessTitle,
            description: translations.clearTheDatabaseSuccess && translations.clearTheDatabaseSuccess,
            type: "success",
            icon: {icon: "success", position: "left"},
            duration: 2500
        };

        showMessage(message);
    };

    render() {
        const {showModal, modalContent, type, currency, lang} = this.state;
        const {translations, navigation} = this.props;

        return (
            <View style={styles.container}>
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
                        }}>{translations.settings}</Text>
                    }
                />
                <Modal
                    visible={showModal}
                    toggleModal={this.toggleModal}
                    title={type === 'clearTheDatabase' ? translations.clearTheDatabase : translations['select_' + type]}
                    content={modalContent}
                    buttons={type === 'clearTheDatabase' ? [
                        {text: translations.yes, onPress: this.clearTheDatabase},
                        {text: translations.cancel, onPress: this.toggleModal}
                    ] : []}
                />

                <View style={{marginTop: 125, width: '100%'}}>
                    <TouchableOpacity onPress={() => this.toggleModal('language')}>
                        <InfoWindow color1={'#292b2c'} color2={['#f2a91e', '#e95c17']} title={translations.language}
                                    val={lang}
                                    colorTitle={'#fff'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleModal('currency')}>
                        <InfoWindow color1={'#292b2c'} color2={['#af3462', '#bf3741']} title={translations.currency}
                                    val={currency}
                                    colorTitle={'#fff'}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.clear} onPress={() => this.toggleModal('clearTheDatabase')}>
                        <Text style={{fontSize: 22, color: '#ddd', textAlign: 'center', fontFamily: 'Lato-Light'}}>
                            {`${translations.clearTheDatabase}  `}
                        </Text>
                        <Icon
                            size={25} name='trash-o'
                            type='font-awesome' color={"#fff"}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{position: 'absolute', bottom: 20}}>
                    <Text style={{fontSize: 12, color: '#ddd', textAlign: 'center', fontFamily: 'Lato-Light'}}>
                        {translations.version}: {this.props.settings.version}
                    </Text>
                    <Text style={{fontSize: 12, color: '#ddd', textAlign: 'center', fontFamily: 'Lato-Light'}}>
                        API: https://world.openfoodfacts.org
                    </Text>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        settings: state.settings,
        translations: state.settings.translations
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onChangeLang: (value) => dispatch(actions.changeLang(value)),
        onChangeCurrency: (value) => dispatch(actions.changeCurrency(value)),
        onChangeNotificationCycle: (value) => dispatch(actions.changeNotificationCycle(value)),
        fetchAllWastedFood: (value) => dispatch(actions.fetchAllWastedFood(value)),
        removeFood: (value) => dispatch(actions.removeFood(value))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);