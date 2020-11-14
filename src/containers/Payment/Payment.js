import React from 'react'
import {
	ImageBackground,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
	Platform,
	Linking,
} from 'react-native'
import openSocket from 'socket.io-client'
import { showMessage } from 'react-native-flash-message'
import Spinner from '../../components/Spinner/Spinner'
import { Button, CheckBox, Icon, Input } from 'react-native-elements'
import axios from 'axios'
import { WebView } from 'react-native-webview'
import Header from '../../components/Header/Header'
import Modal from '../../components/Modal/Modal'
import * as WebBrowser from 'expo-web-browser'
import { auth } from '../../config/backendAuth'
import styles from './Payment.style'
import { validateEmail } from '../../common/validation'
import pajacyk from '../../assets/pajacyk.png'

import { connect } from 'react-redux'
import * as actions from '../../store/actions'

const defaultData = {
	initUrl: 'https://savefood-payment.netlify.app/',
	url: 'https://savefood-payment.netlify.app/payment-init',
	backendUrl: 'https://webstrong.pl',
}

class Payment extends React.Component {
	state = {
		ids: null,
		amount: 0,
		name: 'saveFood',
		email: '',
		currency: 'pln',
		screen: 'product',
		charity: 'pajacyk',
		initUrl: defaultData.initUrl,
		url: defaultData.url,
		backendUrl: defaultData.backendUrl,
		modalContent: null,
		type: null,
		socketID: null,
		initPayment: false,
		showModal: false,
		errorEmail: '',
		checkedStatuse: false,
		modalButtons: [],
		loading: true,
	}

	componentDidMount() {
		const { navigation } = this.props
		const ids = navigation.getParam('ids', null)
		const amount = navigation.getParam('amount', 0)
		const currency = this.props.currency.toLowerCase()

		if (Platform.OS === 'ios') {
			this.checkingPaymentStatus()
		}

		this.setState({ ids, amount, currency })
	}

	showSimpleMessage = () => {
		const { translations } = this.props

		const message = {
			message: translations.paymentErrorTitle,
			description: translations.paymentErrorDescription,
			type: 'danger',
			icon: { icon: 'danger', position: 'left' },
			duration: 5000,
		}

		showMessage(message)
	}

	setContent = (type) => {
		const { translations } = this.props

		if (type === 'commission') {
			this.setState({
				modalContent: (
					<View>
						<Text style={styles.modalMessage}>{translations[type]}</Text>
					</View>
				),
				modalButtons: [
					{
						text: translations.confirm,
						onPress: () =>
							this.setState({
								screen: 'payment',
								loading: true,
								showModal: false,
							}),
					},
					{
						text: translations.cancel,
						onPress: () => this.setState({ showModal: false }),
					},
				],
				showModal: true,
				type: translations[type + 'Title'],
			})
		} else {
			this.setState({
				modalContent: (
					<View>
						<Text style={styles.modalMessage}>{translations[type.toLowerCase()]}</Text>
						<View style={styles.inline}>
							<Text style={styles.modalFooterMessage}>
								{translations[type.toLowerCase() + 'Footer']}
							</Text>
							<TouchableOpacity onPress={() => Linking.openURL('https://www.pajacyk.pl/')}>
								<Text style={styles.modalFooterMessage}>https://www.pajacyk.pl/</Text>
							</TouchableOpacity>
						</View>
					</View>
				),
				showModal: true,
				type,
				modalButtons: [],
			})
		}
	}

	toggleModal = (type) => {
		if (!this.state.showModal) {
			this.setContent(type)
		} else {
			this.setState({ showModal: !this.state.showModal })
		}
	}

	createPaymentSession() {
		let paymentMethods
		if (this.state.currency === 'pln') {
			paymentMethods = ['card', 'p24']
		} else {
			paymentMethods = ['card']
		}

		const data = {
			auth,
			title: this.props.translations.paymentTitle,
			lang: this.props.lang,
			amount: this.state.amount,
			name: this.state.name,
			email: this.state.email,
			currency: this.state.currency,
			paymentMethods,
		}

		if (Platform.OS === 'ios') {
			this.iosPayment(data)
		} else {
			this.androidPayment(data)
		}
	}

	iosPayment = (data) => {
		data.socketID = this.state.socketID
		axios
			.post(`${this.state.backendUrl}/savefood/api/payment`, data)
			.then(async (result) => {
				const url = `${this.state.initUrl}payment?session=${result.data.id}`

				WebBrowser.openBrowserAsync(url)
					.then((res) => {
						if (res.type === 'cancel') {
							this.paymentError(false)
						}
					})
					.catch(() => this.paymentError())
			})
			.catch(() => {
				this.paymentError()
			})
	}

	androidPayment = (data) => {
		axios
			.post(`${this.state.backendUrl}/savefood/api/payment`, data)
			.then(async (result) => {
				const url = `${this.state.initUrl}payment?session=${result.data.id}`
				this.setState({ url, loading: false })
			})
			.catch((err) => {
				console.log(err)
				this.paymentError()
			})
	}

	checkingPaymentStatus = () => {
		const socket = openSocket(this.state.backendUrl)

		socket.on('connect', () => {
			this.setState({ socketID: socket.id })
		})

		socket.on('payment', (data) => {
			if (data.status === 'success') {
				WebBrowser.dismissBrowser()
				this.paymentSuccess()
			} else {
				WebBrowser.dismissBrowser()
				this.paymentError()
			}
		})
	}

	paymentSuccess = () => {
		const data = {
			auth,
			title: this.props.translations.paymentTitle,
			lang: this.props.lang,
			amount: this.state.amount,
			name: this.state.name,
			email: this.state.email,
			currency: this.state.currency,
		}

		axios.post(`${this.state.backendUrl}/savefood/api/send-email`, data) // Send email after a successful payment
		this.props.navigation.navigate('List', { ids: this.state.ids })
	}

	paymentError = (error = true) => {
		this.setState(
			{
				screen: 'product',
				url: defaultData.url,
				initPayment: false,
				loading: false,
			},
			() => error && this.showSimpleMessage(),
		)
	}

	validationEmail = () => {
		const { email } = this.state
		const { translations } = this.props
		if (email.length < 1) {
			this.setState({
				errorEmail: translations.emptyEmail,
			})
		} else if (!validateEmail(email)) {
			this.setState({
				errorEmail: translations.wrongEmail,
			})
		} else {
			this.setState({
				errorEmail: '',
			})
		}
	}

	_onNavigationStateChange(webViewState) {
		if (webViewState.url === this.state.initUrl + 'payment-init') {
			// Payment init
			if (!this.state.initPayment) {
				this.setState({ initPayment: true }, () => {
					this.createPaymentSession()
				})
			}
		}

		if (webViewState.url.includes('payment-success')) {
			// Payment success
			this.paymentSuccess()
		}

		if (webViewState.url.includes('payment-failure')) {
			// Payment failed
			this.paymentError()
		}
	}

	startPayment() {
		const { url, loading } = this.state

		return (
			<View style={{ flex: 1, backgroundColor: '#fff' }}>
				<StatusBar barStyle="dark-content" />
				{loading && <Spinner color='#000' size={64} />}
				<WebView
					style={{ marginTop: 20 }}
					mixedContentMode='never'
					source={{ uri: url }}
					onNavigationStateChange={this._onNavigationStateChange.bind(this)}
				/>
			</View>
		)
	}

	showProduct() {
		const { amount, currency, charity, email, errorEmail, checkedStatuse } = this.state
		const { translations } = this.props

		return (
			<View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}>
				<StatusBar barStyle="dark-content" />
				<Header
					leftComponent={
						<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
							<Icon
								style={{ marginTop: 5, marginLeft: 20 }}
								size={25}
								name='arrowleft'
								type='antdesign'
								color="#000"
							/>
						</TouchableOpacity>
					}
					centerComponent={
						<Text style={{ fontSize: 20, fontFamily: 'Lato-Light', color: '#000' }}>
							{translations.amount}{' '}
							<Text style={{ fontFamily: 'Lato-Regular' }}>
								{amount} {currency.toUpperCase()}
							</Text>
						</Text>
					}
				/>

				<ScrollView
					style={{ flex: 1, width: '100%' }}
					contentContainerStyle={{ flex: 1, alignItems: 'center' }}
				>
					<View style={{ width: '80%', marginTop: 45, marginBottom: -10 }}>
						<Input
							leftIcon={{
								name: 'email',
								style: { opacity: 0.5 },
							}}
							autoCapitalize="none"
							labelStyle={{ fontFamily: 'Lato-Bold' }}
							label={translations.emailLabel}
							keyboardType='email-address'
							textContentType='emailAddress'
							autoCompleteType='email'
							inputStyle={{ fontFamily: 'Lato-Light' }}
							placeholder='E-mail'
							// onChangeText={(value) => this.setState({email: value})}

							value={this.state.email}
							onChange={(e) => this.setState({ email: e.nativeEvent.text }, this.validationEmail)}
							onBlur={() => this.validationEmail()}
							// onKeyDown={this.handleKeyDown}
						/>
					</View>
					<Text style={{ fontSize: 20, fontFamily: 'Lato-Light', color: '#dc3545' }}>
						{errorEmail}
					</Text>
					<View style={{ marginTop: errorEmail === '' ? 15 : 19.8 }}>
						<Text style={{ fontSize: 20, fontFamily: 'Lato-Light', color: '#000' }}>
							{translations.chooseCharity}
						</Text>
						<TouchableOpacity onPress={() => this.toggleModal('Pajacyk')}>
							<Text
								style={{
									fontSize: 20,
									fontFamily: 'Lato-Bold',
									color: '#4d6999',
									textAlign: 'center',
									marginBottom: 20,
								}}
							>
								"Pajacyk"
							</Text>
						</TouchableOpacity>
					</View>
					<ImageBackground source={pajacyk} style={styles.image} />
					<View style={styles.inline}>
						<View style={styles.checkStatuse}>
							<CheckBox
								onPress={() => this.setState({ checkedStatuse: !checkedStatuse })}
								checked={checkedStatuse}
								checkedColor="#4b8b1d"
								tintColors={{ true: '#ea6700', false: '#ea6700' }}
							/>
						</View>
						<View style={styles.statuse}>
							<Text style={styles.textStatuse}>{translations.statuseFirst}</Text>
							<TouchableOpacity onPress={() => Linking.openURL('https://www.pajacyk.pl/')}>
								<Text style={styles.href}>{translations.statuseSecond}</Text>
							</TouchableOpacity>
							<Text style={styles.textStatuse}>{translations.statuseThird}</Text>
							<TouchableOpacity onPress={() => Linking.openURL('https://www.pajacyk.pl/')}>
								<Text style={styles.href}>{translations.statuseFourth}</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ marginTop: 20, marginBottom: 20 }}>
						<Button
							buttonStyle={{ backgroundColor: '#4b8b1d' }}
							disabled={errorEmail !== '' || email === '' || !checkedStatuse}
							titleStyle={{
								color: '#fff',
								fontSize: 18,
								padding: 25,
								fontFamily: 'Lato-Light',
							}}
							title={translations.moveToPayment}
							onPress={() => this.toggleModal('commission')}
						/>
					</View>
					<Text
						style={{
							fontSize: 14,
							fontFamily: 'Lato-Light',
							color: '#dc3545',
							textAlign: 'center',
						}}
					>
						*
						<Text
							style={{
								fontSize: 14,
								fontFamily: 'Lato-Light',
								color: '#000',
								textAlign: 'center',
							}}
						>
							{translations.commissionText}
						</Text>
					</Text>
				</ScrollView>
			</View>
		)
	}

	render() {
		const { showModal, type, screen, modalContent, modalButtons } = this.state

		const switchComponents = () => {
			if (screen === 'product') {
				return this.showProduct()
			} else if (screen === 'payment') {
				return this.startPayment()
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

const mapStateToProps = (state) => {
	return {
		currency: state.settings.currency,
		lang: state.settings.lang,
		translations: state.settings.translations,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onSaveFood: (value) => dispatch(actions.saveFood(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment)
