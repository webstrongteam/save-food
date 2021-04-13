import React, { useEffect } from 'react'
import { BackHandler, Image, View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Onboarding from 'react-native-onboarding-swiper'
import styles from './Start.styles'
import { NavigationScreenType } from '../../types/navigation'
import { Language, Translations } from '../../types/settings'
import { useSettingsContext } from '../../common/context/SettingsContext'
import { primaryColor } from '../../common/colors'

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
			<View style={styles.stepWrapper}>
				<Image
					style={styles.stepContainer}
					source={
						lang === 'pl'
							? require('../../assets/screens/pl/1.png')
							: require('../../assets/screens/en/1.png')
					}
				/>
			</View>
		),
		title: '',
		subtitle: '',
	},
	{
		backgroundColor: primaryColor,
		image: (
			<View style={styles.stepWrapper}>
				<Image
					style={styles.stepContainer}
					source={
						lang === 'pl'
							? require('../../assets/screens/pl/2.png')
							: require('../../assets/screens/en/2.png')
					}
				/>
			</View>
		),
		title: '',
		subtitle: '',
	},
	{
		backgroundColor: primaryColor,
		image: (
			<View style={styles.stepWrapper}>
				<Image
					style={styles.stepContainer}
					source={
						lang === 'pl'
							? require('../../assets/screens/pl/3.png')
							: require('../../assets/screens/en/3.png')
					}
				/>
			</View>
		),
		title: '',
		subtitle: '',
	},
	{
		backgroundColor: primaryColor,
		image: (
			<View style={styles.stepWrapper}>
				<Image
					style={styles.stepContainer}
					source={
						lang === 'pl'
							? require('../../assets/screens/pl/4.png')
							: require('../../assets/screens/en/4.png')
					}
				/>
			</View>
		),
		title: '',
		subtitle: '',
	},
]

export default Start
