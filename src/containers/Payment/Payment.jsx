import React from 'react'
import { ImageBackground, ScrollView, StatusBar, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { TouchableOpacity } from 'react-native-gesture-handler'
import openSocket from 'socket.io-client'
import { showMessage } from 'react-native-flash-message'
import { Button, CheckBox, Icon } from 'react-native-elements'
import { checkValid, validator } from '../../common/validation'
import axios from 'axios'
import * as Analytics from 'expo-firebase-analytics'
import * as WebBrowser from 'expo-web-browser'
import config from '../../config/config'
import Header from '../../components/Header/Header'
import Modal from '../../components/Modal/Modal'
import Spinner from '../../components/Spinner/Spinner'
import Input from '../../components/Input/Input'
import pajacyk from '../../assets/common/pajacyk.png'
import styles from './Payment.styles'

import { connect } from 'react-redux'
import * as actions from '../../store/actions'

class Payment extends React.Component {
	state = {
		ids: null,
		amount: 0,
		name: 'saveFood',
		email: this.props.email !== '' ? this.props.email : undefined,
		currency: 'pln',
		modalContent: null,
		socketID: null,
		showModal: false,
		paymentUrl: undefined,
		checkedStatus: false,
		modalButtons: [],
		loading: false,

		emailControl: {
			label: this.props.translations.emailLabel,
			keyboardType: 'email-address',
			textContentType: 'emailAddress',
			autoCompleteType: 'email',
			autoCapitalize: 'none',
			required: true,
			email: true,
			characterRestriction: 70,
		},
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
		const { translations, onUpdateEmail } = this.props

		this.setState(
			{
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
			},
			() => onUpdateEmail(this.state.email),
		)
	}

	createPaymentSession = () => {
		let paymentMethods
		if (this.state.currency === 'pln') {
			paymentMethods = ['card', 'p24']
		} else {
			paymentMethods = ['card']
		}

		const data = {
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
				const paymentUrl = `${config.PAYMENT_URL}/payment?session=${result.data.id}`
				this.setState({ paymentUrl })
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
				this.setState({ paymentUrl: undefined }, () => {
					this.paymentSuccess()
				})
			} else {
				this.setState({ paymentUrl: undefined }, () => {
					this.showErrorMessage('dismiss')
				})
			}
		})
	}

	paymentSuccess = () => {
		const data = {
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

	checkPaymentValidation = () => {
		const { email, emailControl, checkedStatus } = this.state
		return email && checkedStatus && checkValid(emailControl, email)
	}

	submitPayment = () => {
		const { emailControl, email } = this.state
		const { translations } = this.props

		validator(emailControl, email, translations, (emailControl) => {
			const { checkedStatus } = this.state
			if (!emailControl.error && checkedStatus) {
				this.showModal()
			} else {
				this.setState({ emailControl })
			}
		})
	}

	render() {
		const {
			showModal,
			modalContent,
			modalButtons,
			emailControl,
			amount,
			currency,
			email,
			paymentUrl,
			checkedStatus,
			loading,
		} = this.state
		const { translations, navigation } = this.props

		if (paymentUrl) {
			return (
				<View style={styles.webviewContainer}>
					<StatusBar barStyle='dark-content' />

					<WebView style={styles.webview} mixedContentMode='never' source={{ uri: paymentUrl }} />
				</View>
			)
		}

		return (
			<View style={styles.container}>
				<StatusBar barStyle='dark-content' />

				<Modal
					visible={showModal}
					toggleModal={() => this.setState({ showModal: false })}
					buttons={modalButtons}
					title={translations.commissionTitle}
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
										style={styles.headerIcon}
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
									<Text>
										{amount} {currency.toUpperCase()}
									</Text>
								</Text>
							}
						/>

						<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
							<View style={styles.inputContainer}>
								<Input
									elementConfig={emailControl}
									translations={translations}
									focus={false}
									value={email}
									placeholder='E-mail'
									changed={(value, control) => {
										this.setState({ email: value, emailControl: control })
									}}
								/>
							</View>

							<View style={styles.charityWrapper}>
								<Text style={styles.charity}>{translations.charity}</Text>
								<Text onPress={this.openCharityPage} style={styles.charityText}>
									&quot;Pajacyk&quot;
								</Text>
							</View>
							<ImageBackground source={pajacyk} style={styles.charityImage} />

							<View style={styles.inline}>
								<View style={styles.checkPermission}>
									<CheckBox
										onPress={() => this.setState({ checkedStatus: !checkedStatus })}
										checked={checkedStatus}
										checkedColor='#4b8b1d'
										tintColors={{ true: '#ea6700', false: '#ea6700' }}
										title={
											<Text style={styles.permission}>
												<Text style={styles.permissionText}>{translations.emailPermission} </Text>
												<Text
													onPress={() => WebBrowser.openBrowserAsync(config.STRIPE_URL)}
													style={styles.href}
												>
													Stripe{' '}
												</Text>
												<Text style={styles.permissionText}>{translations.termsPermission1} </Text>
												<Text
													onPress={() => WebBrowser.openBrowserAsync(config.STRIPE_TERMS)}
													style={styles.href}
												>
													{translations.termsPermission2}
												</Text>
												<Text style={styles.permissionText}>.</Text>
											</Text>
										}
									/>
								</View>
							</View>
							<View style={styles.buttonContainer}>
								<TouchableOpacity onPress={this.submitPayment}>
									<Button
										buttonStyle={styles.buttonStyle}
										titleStyle={styles.buttonTitle}
										disabled={!this.checkPaymentValidation()}
										title={translations.moveToPayment}
									/>
								</TouchableOpacity>
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
		email: state.settings.email,
		lang: state.settings.lang,
		translations: state.settings.translations,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onUpdateEmail: (email) => dispatch(actions.changeEmail(email)),
		onSaveFood: (value) => dispatch(actions.saveFood(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment)
