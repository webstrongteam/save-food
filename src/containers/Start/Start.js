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
                        require('../../assets/icon-circle.png') :
                        require('../../assets/icon-circle.png')}/>,
                title: this.props.translations.startTitle,
                subtitle: this.props.translations.startSubtitle
            },
            {
                backgroundColor: '#4b8b1d',
                image: <Image style={{width: '100%', height: '100%', resizeMode: 'stretch', marginTop: 110}} source={
                    this.props.lang === 'pl' ?
                        require('../../assets/steps_pl/1.jpg') :
                        require('../../assets/steps_en/1.jpg')}/>,
                title: '',
                subtitle: ''
            },
            {
                backgroundColor: '#4b8b1d',
                image: <Image style={{width: '100%', height: '100%', resizeMode: 'stretch', marginTop: 110}} source={
                    this.props.lang === 'pl' ?
                        require('../../assets/steps_pl/2.jpg') :
                        require('../../assets/steps_en/2.jpg')}/>,
                title: '',
                subtitle: ''
            },
            {
                backgroundColor: '#4b8b1d',
                image: <Image style={{width: '100%', height: '100%', resizeMode: 'stretch', marginTop: 110}} source={
                    this.props.lang === 'pl' ?
                        require('../../assets/steps_pl/3.jpg') :
                        require('../../assets/steps_en/3.jpg')}/>,
                title: '',
                subtitle: ''
            },
            {
                backgroundColor: '#4b8b1d',
                image: <Image style={{width: '100%', height: '100%', resizeMode: 'stretch', marginTop: 110}} source={
                    this.props.lang === 'pl' ?
                        require('../../assets/steps_pl/4.jpg') :
                        require('../../assets/steps_en/4.jpg')}/>,
                title: '',
                subtitle: ''
            }
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