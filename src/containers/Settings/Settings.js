import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import Header from '../../components/Header/Header';
import styles from './Settings.styles';

import {connect} from 'react-redux';
import * as actions from "../../store/actions";

class Settings extends Component {
    state = {
        lang: 'en',
        currency: 'USD',
        notification_cycle: null
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
                <View style={{marginTop: 85, width: '100%'}}>
                    <ListItem
                        title={'Language'}
                        leftIcon={{name: 'language'}}
                        bottomDivider
                        chevron
                    />
                    <ListItem
                        title={'Currency'}
                        leftIcon={{name: 'attach-money', type: 'material'}}
                        bottomDivider
                        chevron
                    />
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