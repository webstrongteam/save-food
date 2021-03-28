import React, { useEffect } from 'react'
import { BackHandler, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Onboarding from 'react-native-onboarding-swiper'
import config from '../../config/config'
import styles from './Start.styles'
import { NavigationScreenType } from '../../types/navigation'
import { Language, Translations } from '../../types/settings'
import { useSettingsContext } from '../../common/context/SettingsContext'
import { primaryColor } from '../../common/utility'

type Props = {
	navigation: NavigationScreenType
}

const Start = ({ navigation }: Props) => {
	const { useSubscribe } = useSettingsContext()
	const { settings, translations } = useSubscribe((s) => s)

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', () => true)

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', () => true)
		}
	}, [])

	const doneBtnHandle = async () => {
		await AsyncStorage.removeItem('start')
		navigation.replace('Home')
	}

	return (
		<Onboarding
			showSkip={false}
			containerStyles={styles.imageContainer}
			onDone={doneBtnHandle}
			pages={getPages(translations, settings.lang)}
		/>
	)
}

const getPages = (translations: Translations, lang: Language) => [
	{
		backgroundColor: primaryColor,
		image: (
			<Image
				style={styles.firstStepContainer}
				source={require('../../assets/icon-transparent.png')}
			/>
		),
		title: translations.startTitle,
		subtitle: translations.startSubtitle,
	},
	{
		backgroundColor: primaryColor,
		image: (
			<Image
				style={styles.stepContainer}
				source={{
					uri: `${config.ASSETS_URL}/promo-screens/android/${lang}/transparent/2.png`,
					cache: 'reload',
				}}
			/>
		),
		title: '',
		subtitle: '',
	},
	{
		backgroundColor: primaryColor,
		image: (
			<Image
				style={styles.stepContainer}
				source={{
					uri: `${config.ASSETS_URL}/promo-screens/android/${lang}/transparent/3.png`,
					cache: 'reload',
				}}
			/>
		),
		title: '',
		subtitle: '',
	},
	{
		backgroundColor: primaryColor,
		image: (
			<Image
				style={styles.stepContainer}
				source={{
					uri: `${config.ASSETS_URL}/promo-screens/android/${lang}/transparent/4.png`,
					cache: 'reload',
				}}
			/>
		),
		title: '',
		subtitle: '',
	},
	{
		backgroundColor: primaryColor,
		image: (
			<Image
				style={styles.stepContainer}
				source={{
					uri: `${config.ASSETS_URL}/promo-screens/android/${lang}/transparent/5.png`,
					cache: 'reload',
				}}
			/>
		),
		title: '',
		subtitle: '',
	},
]

export default Start
