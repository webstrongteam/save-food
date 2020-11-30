import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { Icon, ListItem } from 'react-native-elements'
import Header from '../../components/Header/Header'
import InfoWindow from '../../components/InfoWindow/InfoWindow'
import Modal from '../../components/Modal/Modal'
import { showMessage } from 'react-native-flash-message'
import styles from './Settings.styles'

import { connect } from 'react-redux'
import * as actions from '../../store/actions'

class Settings extends Component {
	state = {
		lang: '',
		currency: '',
		languages: [
			{ short: 'en', name: this.props.translations.english },
			{ short: 'pl', name: this.props.translations.polish },
		],
		currencyList: ['USD', 'PLN'],

		type: '',
		modalContent: null,
		showModal: false,
	}

	componentDidMount() {
		const { languages, currencyList } = this.state
		const { lang, currency } = this.props.settings

		this.setState({
			lang: languages.find((l) => l.short === lang.toLowerCase()).name,
			currency: currencyList.find((c) => c === currency),
		})
	}

	componentDidUpdate(prevProps) {
		if (prevProps.translations !== this.props.translations) {
			const { translations, settings } = this.props
			const languages = [
				{ short: 'en', name: translations.english },
				{ short: 'pl', name: translations.polish },
			]

			this.setState({
				languages,
				showModal: false,
				lang: languages.find((l) => l.short === settings.lang.toLowerCase()).name,
			})
		}
	}

	changeLanguage = (lang) => {
		this.props.onChangeLang(lang.short)
	}

	changeCurrency = (currency) => {
		this.props.onChangeCurrency(currency)
		this.setState({ currency, showModal: false })
	}

	// changeNotificationCycle = (cycle) => {
	//     this.props.onChangeNotificationCycle(cycle);
	//     this.setState({cycle});
	// };

	setContent = (type) => {
		const { lang, currency } = this.props.settings

		if (type === 'language') {
			this.setState({
				modalContent: (
					<View>
						{this.state.languages.map((item, i) => (
							<TouchableOpacity key={i} onPress={() => this.changeLanguage(item)}>
								<ListItem bottomDivider>
									<ListItem.Content>
										<ListItem.Title style={{ color: item.short === lang ? '#4b8b1d' : '#000' }}>
											{item.name}
										</ListItem.Title>
									</ListItem.Content>
								</ListItem>
							</TouchableOpacity>
						))}
					</View>
				),
				showModal: true,
				type,
			})
		} else if (type === 'currency') {
			this.setState({
				modalContent: (
					<View>
						{this.state.currencyList.map((item, i) => (
							<TouchableOpacity key={i} onPress={() => this.changeCurrency(item)}>
								<ListItem bottomDivider>
									<ListItem.Content>
										<ListItem.Title style={{ color: item === currency ? '#4b8b1d' : '#000' }}>
											{item}
										</ListItem.Title>
									</ListItem.Content>
								</ListItem>
							</TouchableOpacity>
						))}
					</View>
				),
				showModal: true,
				type,
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
				showModal: true,
				type,
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

	clearDatabase = () => {
		this.props.fetchAllWastedFood((list) => {
			list.map((val) => {
				this.props.removeFood(val.id)
			})
		})
		this.showSimpleMessage()
		this.toggleModal()
	}

	showSimpleMessage = () => {
		const { translations } = this.props

		const message = {
			message: translations.clearTheDatabaseSuccessTitle,
			description: translations.clearTheDatabaseSuccess && translations.clearTheDatabaseSuccess,
			type: 'success',
			icon: { icon: 'success', position: 'left' },
			duration: 2500,
		}

		showMessage(message)
	}

	render() {
		const { showModal, modalContent, type, currency, lang } = this.state
		const { translations, navigation } = this.props

		return (
			<View style={styles.container}>
				<Header
					leftComponent={
						<TouchableOpacity onPress={() => navigation.navigate('Home', {})}>
							<Icon
								style={styles.leftHeaderIcon}
								size={25}
								name='arrowleft'
								type='antdesign'
								color='#fff'
							/>
						</TouchableOpacity>
					}
					centerComponent={<Text style={styles.headerTitle}>{translations.settings}</Text>}
				/>

				<Modal
					visible={showModal}
					toggleModal={this.toggleModal}
					title={type === 'clearTheDatabase' ? translations.clearTheDatabase : translations[type]}
					content={modalContent}
					buttons={
						type === 'clearTheDatabase'
							? [
									{ text: translations.yes, onPress: this.clearDatabase },
									{ text: translations.cancel, onPress: this.toggleModal },
							  ]
							: []
					}
				/>

				<View style={styles.settingsWrapper}>
					<InfoWindow
						color1='#292b2c'
						color2={['#f2a91e', '#e95c17']}
						title={translations.language}
						val={lang}
						colorTitle='#fff'
						onPress={() => this.toggleModal('language')}
					/>
					<InfoWindow
						color1='#292b2c'
						color2={['#af3462', '#bf3741']}
						title={translations.currency}
						val={currency}
						colorTitle='#fff'
						onPress={() => this.toggleModal('currency')}
					/>
					<TouchableOpacity
						style={styles.clear}
						onPress={() => this.toggleModal('clearTheDatabase')}
					>
						<Text style={styles.clearText}>{`${translations.clearTheDatabase}  `}</Text>
						<Icon size={25} name='trash-o' type='font-awesome' color='#fff' />
					</TouchableOpacity>
				</View>

				<View style={styles.footerContainer}>
					<Text style={styles.versionText}>
						{translations.version}: {this.props.settings.version}
					</Text>
					<TouchableOpacity
						onPress={() => WebBrowser.openBrowserAsync('https://world.openfoodfacts.org')}
					>
						<Text style={styles.linkText}>API: https://world.openfoodfacts.org</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => WebBrowser.openBrowserAsync('https://webstrong.pl')}>
						<Text style={styles.linkText}>{translations.authors}: https://webstrong.pl</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		settings: state.settings,
		translations: state.settings.translations,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onChangeLang: (value) => dispatch(actions.changeLang(value)),
		onChangeCurrency: (value) => dispatch(actions.changeCurrency(value)),
		fetchAllWastedFood: (value) => dispatch(actions.fetchAllWastedFood(value)),
		removeFood: (value) => dispatch(actions.removeFood(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
