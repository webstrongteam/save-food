import React from 'react'
import { ImageBackground, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import openSocket from 'socket.io-client'
import { showMessage } from 'react-native-flash-message'
import { Button, CheckBox, Icon, Input } from 'react-native-elements'
import axios from 'axios'
import * as Analytics from 'expo-firebase-analytics'
import * as WebBrowser from 'expo-web-browser'
import { auth } from '../../config/auth'
import config from '../../config/config'
import { validateEmail } from '../../common/validation'
import Header from '../../components/Header/Header'
import Modal from '../../components/Modal/Modal'
import Spinner from '../../components/Spinner/Spinner'
import pajacyk from '../../assets/common/pajacyk.png'
import styles from './Payment.styles'

import { connect } from 'react-redux'
import * as actions from '../../store/actions'

class Payment extends React.Component {
	state = {
		ids: null,
		amount: 0,
		name: 'saveFood',
		email: null,
		currency: 'pln',
		modalContent: null,
		type: null,
		socketID: null,
		showModal: false,
		errorEmail: '',
		checkedStatus: false,
		modalButtons: [],
		loading: false,
	}

	componentDidMount() {
		const { navigation } = this.props
		const ids = navigation.getParam('ids', null)
		const amount = navigation.getParam('amount', 0)
		const currency = this.props.currency.toLowerCase()

		this.checkingPaymentStatus()

		this.setState({ ids, amount, currency })
	}

	showErrorMessage = (err) => {
		const { translations } = this.props

		Analytics.logEvent('paymentFailed', {
			component: 'Payment',
			error: err.message,
		})

		const message = {
			message: translations.paymentErrorTitle,
			description: translations.paymentErrorDescription,
			type: 'danger',
			icon: { icon: 'danger', position: 'left' },
			duration: 5000,
		}

		this.setState({ loading: false })
		showMessage(message)
	}

	showModal = () => {
		const { translations } = this.props

		this.setState({
			modalContent: (
				<View>
					<Text style={styles.modalMessage}>{translations.commission}</Text>
				</View>
			),
			modalButtons: [
				{
					text: translations.confirm,
					onPress: () => {
						this.setState({ showModal: false, loading: true }, () => this.createPaymentSession())
					},
				},
				{
					text: translations.cancel,
					onPress: () => this.setState({ showModal: false }),
				},
			],
			showModal: true,
			type: translations.commissionTitle,
		})
	}

	createPaymentSession = () => {
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

		this.startPayment(data)
	}

	startPayment = (data) => {
		Analytics.logEvent('startPayment', {
			component: 'Payment',
		})

		data.socketID = this.state.socketID
		axios
			.post(`${config.API_URL}/payment`, data)
			.then(async (result) => {
				const url = `${config.PAYMENT_URL}/payment?session=${result.data.id}`

				WebBrowser.openBrowserAsync(url)
					.then((res) => {
						if (res.type === 'cancel') {
							this.setState({ loading: false })
						}
					})
					.catch((err) => this.showErrorMessage(err))
			})
			.catch((err) => this.showErrorMessage(err))
	}

	checkingPaymentStatus = () => {
		const socket = openSocket(config.WS_URL)

		socket.on('connect', () => {
			this.setState({ socketID: socket.id })
		})

		socket.on('payment', (data) => {
			if (data.status === 'success') {
				WebBrowser.dismissBrowser()
				this.paymentSuccess()
			} else {
				WebBrowser.dismissBrowser()
				this.showErrorMessage('dismiss')
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

		axios.post(`${config.API_URL}/send-email`, data) // Send email after a successful payment
		this.props.navigation.navigate('List', { ids: this.state.ids })
	}

	openCharityPage = () => {
		WebBrowser.openBrowserAsync(config.PAJACYK_URL)
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

	render() {
		const {
			showModal,
			type,
			modalContent,
			modalButtons,
			amount,
			currency,
			email,
			errorEmail,
			checkedStatus,
			loading,
		} = this.state
		const { translations, navigation } = this.props

		return (
			<View style={styles.container}>
				<StatusBar barStyle='dark-content' />

				<Modal
					visible={showModal}
					toggleModal={() => this.setState({ showModal: false })}
					buttons={modalButtons}
					title={type}
					content={modalContent}
				/>
				{loading ? (
					<Spinner size={64} color='#000' />
				) : (
					<>
						<Header
							leftComponent={
								<TouchableOpacity onPress={() => navigation.goBack()}>
									<Icon
										style={styles.icon}
										size={25}
										name='arrowleft'
										type='antdesign'
										color='#000'
									/>
								</TouchableOpacity>
							}
							centerComponent={
								<Text style={styles.headerCenterComponent}>
									<Text>{translations.amount} </Text>
									<Text style={styles.amount}>
										{amount} {currency.toUpperCase()}
									</Text>
								</Text>
							}
						/>

						<ScrollView style={styles.scrollView} contentContainerStyle={styles.contentScrollView}>
							<View style={styles.inputContainer}>
								<Input
									leftIcon={{
										name: 'email',
										style: styles.leftIconInput,
									}}
									autoCapitalize='none'
									labelStyle={styles.labelStyleInput}
									label={translations.emailLabel}
									keyboardType='email-address'
									textContentType='emailAddress'
									autoCompleteType='email'
									inputStyle={styles.inputStyle}
									placeholder='E-mail'
									onChangeText={(value) => this.setState({ email: value })}
									onBlur={() => this.validationEmail()}
									value={email}
								/>
							</View>
							<Text style={styles.errorEmail}>{errorEmail}</Text>
							<View style={{ marginTop: errorEmail === '' ? 0 : 20 }}>
								<Text style={styles.charity}>{translations.charity}</Text>
								<TouchableOpacity onPress={this.openCharityPage}>
									<Text style={styles.pajacykText}>&quot;Pajacyk&quot;</Text>
								</TouchableOpacity>
							</View>
							<ImageBackground source={pajacyk} style={styles.image} />
							<View style={styles.inline}>
								<View style={styles.checkPermission}>
									<CheckBox
										onPress={() => this.setState({ checkedStatus: !checkedStatus })}
										checked={checkedStatus}
										checkedColor='#4b8b1d'
										tintColors={{ true: '#ea6700', false: '#ea6700' }}
										title={
											<View style={styles.permission}>
												<Text style={styles.textPermission}>{translations.permission}</Text>
												<TouchableOpacity
													onPress={() => WebBrowser.openBrowserAsync('https://stripe.com')}
												>
													<Text style={styles.href}>Stripe</Text>
												</TouchableOpacity>
												<Text style={styles.textPermission}>.</Text>
											</View>
										}
									/>
								</View>
							</View>
							<View style={styles.buttonContainer}>
								<Button
									buttonStyle={{ backgroundColor: '#4b8b1d' }}
									disabled={errorEmail !== '' || !email || !checkedStatus}
									titleStyle={styles.buttonTitle}
									title={translations.moveToPayment}
									onPress={this.showModal}
								/>
							</View>
						</ScrollView>
					</>
				)}
			</View>
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
