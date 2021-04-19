import React, { ReactNode, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { MessageOptions, showMessage } from 'react-native-flash-message'
import { ListItem } from 'react-native-elements'
import Header from '../../components/Header/Header'
import InfoWindow from '../../components/InfoWindow/InfoWindow'
import Modal from '../../components/Modal/Modal'
import styles from './Settings.styles'
import config from '../../config/config'
import { Currency, Language } from '../../types/settings'
import { NavigationScreenType } from '../../types/navigation'
import { useSettingsContext } from '../../common/context/SettingsContext'
import { changeLang, changeCurrency, clearDatabase } from '../../../database/actions/settings'
import Icon from '../../components/Icon/Icon'
import {
	blackColor,
	orangeGradient,
	primaryColor,
	redGradient,
	whiteColor,
} from '../../common/colors'

type Props = {
	navigation: NavigationScreenType
}

type LanguageMap = Record<Language, string>
type ModalType = 'language' | 'currency' | 'clearTheDatabase'

const currencyList: Currency[] = ['USD', 'PLN']

const Settings = ({ navigation }: Props) => {
	const { useSubscribe, setSettings } = useSettingsContext()
	const settings = useSubscribe((s) => s.settings)
	const translations = useSubscribe((s) => ({
		...s.translations.Settings,
		...s.translations.common,
	}))

	const [modalType, setModalType] = useState<ModalType>('language')
	const [modalContent, setModalContent] = useState<ReactNode>()
	const [showModal, setShowModal] = useState(false)

	const languageMap: LanguageMap = {
		en: translations.english,
		pl: translations.polish,
	}

	const changeLanguageHandler = async (lang: Language) => {
		setShowModal(false)
		setSettings(await changeLang(lang))
	}

	const changeCurrencyHandler = async (currency: Currency) => {
		setShowModal(false)
		setSettings(await changeCurrency(currency))
	}

	const clearDatabaseHandler = async () => {
		setShowModal(false)
		setSettings(await clearDatabase())
		showSuccessMessage()
	}

	const setModalContentHandler = (type: ModalType) => {
		if (type === 'language') {
			setModalContent(
				<View>
					{(Object.keys(languageMap) as Array<keyof LanguageMap>).map((lang, i) => (
						<TouchableOpacity
							key={i}
							testID={`set-${lang}-lang`}
							onPress={() => changeLanguageHandler(lang)}
						>
							<ListItem bottomDivider>
								<ListItem.Content>
									<ListItem.Title
										style={{ color: lang === settings.lang ? primaryColor : blackColor }}
									>
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
										style={{ color: item === settings.currency ? primaryColor : blackColor }}
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
				<Text style={styles.clearTheDatabase}>{translations.clearTheDatabaseModal}</Text>,
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

	const showSuccessMessage = () => {
		const message: MessageOptions = {
			message: translations.clearTheDatabaseSuccess,
			type: 'success',
			icon: { icon: 'success', position: 'left' },
			duration: 2500,
		}

		showMessage(message)
	}

	return (
		<View style={styles.container}>
			<Header
				leftComponent={<Icon onPress={() => navigation.replace('Home')} variant='backIcon' />}
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
					testID='open-lang-modal'
					color1={blackColor}
					color2={orangeGradient}
					title={translations.language}
					value={languageMap[settings.lang]}
					colorTitle={whiteColor}
					onPress={() => toggleModal('language')}
				/>
				<InfoWindow
					color1={blackColor}
					color2={redGradient}
					title={translations.currency}
					value={settings.currency}
					colorTitle={whiteColor}
					onPress={() => toggleModal('currency')}
				/>
				<TouchableOpacity style={styles.clear} onPress={() => toggleModal('clearTheDatabase')}>
					<Text style={styles.clearText}>{`${translations.clearTheDatabase}  `}</Text>
					<Icon
						onPress={() => toggleModal('clearTheDatabase')}
						size={28}
						name='trash-o'
						type='font-awesome'
					/>
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
