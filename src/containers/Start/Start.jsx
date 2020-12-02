import React, { Component } from 'react'
import { BackHandler, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Onboarding from 'react-native-onboarding-swiper'
import config from '../../config/config'
import styles from './Start.styles'

import { connect } from 'react-redux'

class Start extends Component {
	state = {
		pages: [
			{
				backgroundColor: '#4b8b1d',
				image: (
					<Image
						style={styles.firstStepContainer}
						source={require('../../assets/icon-transparent.png')}
					/>
				),
				title: this.props.translations.startTitle,
				subtitle: this.props.translations.startSubtitle,
			},
			{
				backgroundColor: '#4b8b1d',
				image: (
					<Image
						style={styles.stepContainer}
						source={{
							uri: `${config.ASSETS_URL}/promo-screens/android/${this.props.lang}/transparent/2.png`,
							cache: 'reload',
						}}
					/>
				),
				title: '',
				subtitle: '',
			},
			{
				backgroundColor: '#4b8b1d',
				image: (
					<Image
						style={styles.stepContainer}
						source={{
							uri: `${config.ASSETS_URL}/promo-screens/android/${this.props.lang}/transparent/3.png`,
							cache: 'reload',
						}}
					/>
				),
				title: '',
				subtitle: '',
			},
			{
				backgroundColor: '#4b8b1d',
				image: (
					<Image
						style={styles.stepContainer}
						source={{
							uri: `${config.ASSETS_URL}/promo-screens/android/${this.props.lang}/transparent/4.png`,
							cache: 'reload',
						}}
					/>
				),
				title: '',
				subtitle: '',
			},
			{
				backgroundColor: '#4b8b1d',
				image: (
					<Image
						style={styles.stepContainer}
						source={{
							uri: `${config.ASSETS_URL}/promo-screens/android/${this.props.lang}/transparent/5.png`,
							cache: 'reload',
						}}
					/>
				),
				title: '',
				subtitle: '',
			},
		],
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
	}

	componentWillUnmount() {
		this.backHandler.remove()
	}

	doneBtnHandle = async () => {
		await AsyncStorage.removeItem('start')
		this.props.navigation.replace('Home')
	}

	render() {
		return (
			<Onboarding
				showSkip={false}
				containerStyles={styles.imageContainer}
				onDone={this.doneBtnHandle}
				pages={this.state.pages}
			/>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		lang: state.settings.lang,
		translations: state.settings.translations,
	}
}

export default connect(mapStateToProps)(Start)
