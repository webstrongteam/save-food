import React, {Component} from 'react';
import {AsyncStorage, Image} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import {connect} from "react-redux";

class Start extends Component {
    state = {
        pages: [
            {
                backgroundColor: '#4b8b1d',
                image: <Image source={require('../../assets/not-found-image.png')}/>,
                title: this.props.translations.startTitle,
                subtitle: this.props.translations.startSubtitle
            },
            {
                backgroundColor: '#5bc0de',
                image: <Image source={require('../../assets/not-found-image.png')}/>,
                title: this.props.translations.firstStepTitle,
                subtitle: this.props.translations.firstStepSubtitle
            },
            {
                backgroundColor: '#f0ad4e',
                image: <Image source={require('../../assets/not-found-image.png')}/>,
                title: this.props.translations.stepTwoTitle,
                subtitle: this.props.translations.stepTwoSubtitle
            },
            {
                backgroundColor: '#fe6e58',
                image: <Image source={require('../../assets/not-found-image.png')}/>,
                title: this.props.translations.stepThreeTitle,
                subtitle: this.props.translations.stepThreeSubtitle
            },
            {
                backgroundColor: '#f7f7f7',
                image: <Image source={require('../../assets/not-found-image.png')}/>,
                title: this.props.translations.lastStepTitle,
                subtitle: this.props.translations.lastStepSubtitle
            },
        ]
    };

    doneBtnHandle = async () => {
        await AsyncStorage.removeItem('start');
        this.props.navigation.navigate('Home', {ready: true});
    };

    render() {
        return (
            <Onboarding
                showSkip={false}
                onDone={this.doneBtnHandle}
                pages={this.state.pages}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        translations: state.settings.translations
    }
};

export default connect(mapStateToProps)(Start);