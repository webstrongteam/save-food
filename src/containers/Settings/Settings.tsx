import React, { ReactNode, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { MessageOptions, showMessage } from 'react-native-flash-message'
import { Icon, ListItem } from 'react-native-elements'
import Header from '../../components/Header/Header'
import InfoWindow from '../../components/InfoWindow/InfoWindow'
import Modal from '../../components/Modal/Modal'
import styles from './Settings.styles'
import config from '../../config/config'
import { Currency, Language } from '../../types/settings'
import { NavigationScreenType } from '../../types/navigation'
import { useSettingsContext } from '../../common/context/SettingsContext'
import { changeLang, changeCurrency, clearDatabase } from '../../../database/actions/settings'

type LanguageMap = Record<Language, string>

type ModalType = 'language' | 'currency' | 'clearTheDatabase'

type Props = {
	navigation: NavigationScreenType
}

const currencyList: Currency[] = ['USD', 'PLN']

const Settings = ({ navigation }: Props) => {
	const { useSubscribe, setSettings } = useSettingsContext()
	const { settings, translations } = useSubscribe((s) => s)

	const [modalType, setModalType] = useState<ModalType>('language')
	const [modalContent, setModalContent] = useState<ReactNode>()
	const [showModal, setShowModal] = useState(false)

	const languageMap: LanguageMap = {
		en: translations.english,
		pl: translations.polish,
	}

	const changeLanguageHandler = async (lang: Language) => {
		toggleModal()
		setSettings(await changeLang(lang))
	}

	const changeCurrencyHandler = async (currency: Currency) => {
		toggleModal()
		setSettings(await changeCurrency(currency))
	}

	const clearDatabaseHandler = async () => {
		toggleModal()
		setSettings(await clearDatabase())
		showSimpleMessage()
	}

	const setModalContentHandler = (type: ModalType) => {
		if (type === 'language') {
			setModalContent(
				<View>
					{(Object.keys(languageMap) as Array<keyof LanguageMap>).map((lang, i) => (
						<TouchableOpacity key={i} onPress={() => changeLanguageHandler(lang)}>
							<ListItem bottomDivider>
								<ListItem.Content>
									<ListItem.Title style={{ color: lang === settings.lang ? '#4b8b1d' : '#000' }}>
										{languageMap[lang]}
									</ListItem.Title>
								</ListItem.Content>
							</ListItem>
						</TouchableOpacity>
					))}
				</View>,
			)
		} else if (type === 'currency') {
			setModalContent(
				<View>
					{currencyList.map((item, i) => (
						<TouchableOpacity key={i} onPress={() => changeCurrencyHandler(item)}>
							<ListItem bottomDivider>
								<ListItem.Content>
									<ListItem.Title
										style={{ color: item === settings.currency ? '#4b8b1d' : '#000' }}
									>
										{item}
									</ListItem.Title>
								</ListItem.Content>
							</ListItem>
						</TouchableOpacity>
					))}
				</View>,
			)
		} else if (type === 'clearTheDatabase') {
			setModalContent(
				<View>
					<Text style={styles.clearTheDatabase}>{translations.clearTheDatabaseModal}</Text>
				</View>,
			)
		}

		setModalType(type)
		setShowModal(true)
	}

	const toggleModal = (type?: ModalType) => {
		if (!showModal && type) {
			setModalContentHandler(type)
		} else {
			setShowModal(false)
		}
	}

	const showSimpleMessage = () => {
		const message: MessageOptions = {
			message: translations.clearTheDatabaseSuccessTitle,
			description: translations.clearTheDatabaseSuccess,
			type: 'success',
			icon: { icon: 'success', position: 'left' },
			duration: 2500,
		}

		showMessage(message)
	}

	return (
		<View style={styles.container}>
			<Header
				leftComponent={
					<TouchableOpacity onPress={() => navigation.replace('Home')}>
						<Icon
							style={styles.leftHeaderIcon}
							size={28}
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
				toggleModal={toggleModal}
				title={translations[modalType]}
				buttons={
					modalType === 'clearTheDatabase'
						? [
								{ text: translations.yes, onPress: clearDatabaseHandler },
								{ text: translations.cancel, onPress: toggleModal },
						  ]
						: []
				}
			>
				{modalContent}
			</Modal>

			<View style={styles.settingsWrapper}>
				<InfoWindow
					color1='#292b2c'
					color2={['#f2a91e', '#e95c17']}
					title={translations.language}
					value={languageMap[settings.lang]}
					colorTitle='#fff'
					onPress={() => toggleModal('language')}
				/>
				<InfoWindow
					color1='#292b2c'
					color2={['#af3462', '#bf3741']}
					title={translations.currency}
					value={settings.currency}
					colorTitle='#fff'
					onPress={() => toggleModal('currency')}
				/>
				<TouchableOpacity style={styles.clear} onPress={() => toggleModal('clearTheDatabase')}>
					<Text style={styles.clearText}>{`${translations.clearTheDatabase}  `}</Text>
					<Icon size={28} name='trash-o' type='font-awesome' color='#fff' />
				</TouchableOpacity>
			</View>

			<View style={styles.footerContainer}>
				<Text style={styles.versionText}>
					{translations.version}: {settings.version}
				</Text>
				<TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(config.FOOD_API)}>
					<Text style={styles.linkText}>API: {config.FOOD_API}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(config.WS_URL)}>
					<Text style={styles.linkText}>
						{translations.authors}: {config.WS_URL}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default Settings
