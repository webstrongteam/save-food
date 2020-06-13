import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import Header from '../../components/Header/Header';
import styles from './Settings.styles';
import InfoWindow from '../../components/InfoWindow/InfoWindow';
import {Overlay} from 'react-native-elements';

import {connect} from 'react-redux';
import * as actions from "../../store/actions";

class Settings extends Component {
    state = {
        lang: 'en',
        currency: 'USD',
        notification_cycle: null,
        overlay: false
    };

    componentDidMount() {
        const {lang, currency, notification_cycle} = this.props.settings;
        this.setState({lang, currency, notification_cycle});
    }

    changeLanguage = (lang) => {
        this.props.onChangeLang(lang);
        this.setState({language: lang});
    };

    changeCurrency = (currency) => {
        this.props.onChangeCurrency(currency);
        this.setState({currency: currency});
    };

    changeNotificationCycle = (cycle) => {
        this.props.onChangeNotificationCycle(cycle);
        this.setState({cycle});
    };

    setOverlay = () => {
        this.setState({overlay: !this.state.overlay})
    }

    render() {
        const {navigation} = this.props;

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
                            fontSize: 25,
                            color: '#fff'
                        }}>Settings</Text>
                    }
                />
                <Overlay isVisible={this.state.overlay} onBackdropPress={() => this.setOverlay()} overlayStyle={{
                    backgroundColor: '#292b2c',
                    border: 5,
                    width: 200,
                    borderColor: '#4b8b1d',
                }}>
                    <TouchableOpacity>
                        <Text style={styles.text}>English</Text>
                    </TouchableOpacity>
                </Overlay>
                <View style={{marginTop: 125, width: '100%'}}>
                    <InfoWindow color1={'#292b2c'} color2={['#f2a91e', '#e95c17']} title={'Language'} val={'EN'}
                                colorTitle={'#fff'} onPress={() => this.setOverlay()}/>
                    <InfoWindow color1={'#292b2c'} color2={['#af3462', '#bf3741']} title={'Currency'} val={'USD'}
                                colorTitle={'#fff'} onPress={() => this.setOverlay()}/>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        settings: state.settings
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onChangeLang: (value) => dispatch(actions.changeLang(value)),
        onChangeCurrency: (value) => dispatch(actions.changeCurrency(value)),
        onChangeNotificationCycle: (value) => dispatch(actions.changeNotificationCycle(value))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);