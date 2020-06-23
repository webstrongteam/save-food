import React, {Component} from 'react';
import {AsyncStorage, Image} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import {connect} from "react-redux";

class Start extends Component {
    state = {
        pages: [
            {
                backgroundColor: '#4b8b1d',
                image: <Image style={{width: 200, height: 200}} source={
                    this.props.lang === 'pl' ?
                        require('../../assets/icon.png') :
                        require('../../assets/icon.png')}/>,
                title: this.props.translations.startTitle,
                subtitle: this.props.translations.startSubtitle
            },
            {
                backgroundColor: '#5bc0de',
                image: <Image style={this.props.lang === 'pl' ? {width: 300, height: 265} : {width: 310, height: 220}}
                              source={
                                  this.props.lang === 'pl' ?
                                      require('../../assets/steps_pl/1.jpg') :
                                      require('../../assets/steps_en/1.jpg')}/>,
                title: this.props.translations.firstStepTitle,
                subtitle: this.props.translations.firstStepSubtitle
            },
            {
                backgroundColor: '#f0ad4e',
                image: <Image style={{width: 350, height: 175}} source={
                    this.props.lang === 'pl' ?
                        require('../../assets/steps_pl/2.jpg') :
                        require('../../assets/steps_en/2.jpg')}/>,
                title: this.props.translations.stepTwoTitle,
                subtitle: this.props.translations.stepTwoSubtitle
            },
            {
                backgroundColor: '#fe6e58',
                image: <Image style={{width: 310, height: 220}} source={
                    this.props.lang === 'pl' ?
                        require('../../assets/steps_pl/3.jpg') :
                        require('../../assets/steps_en/3.jpg')}/>,
                title: this.props.translations.stepThreeTitle,
                subtitle: this.props.translations.stepThreeSubtitle
            },
            {
                backgroundColor: '#f7f7f7',
                image: <Image style={{width: 350, height: 175}} source={
                    this.props.lang === 'pl' ?
                        require('../../assets/steps_pl/4.jpg') :
                        require('../../assets/steps_en/4.jpg')}/>,
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
        lang: state.settings.lang,
        translations: state.settings.translations
    }
};

export default connect(mapStateToProps)(Start);