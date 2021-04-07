import React, { ReactText, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ImageBackground, ScrollView, StatusBar, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import Carousel from 'react-native-snap-carousel'
import * as WebBrowser from 'expo-web-browser'
import * as Analytics from 'expo-firebase-analytics'
import * as Sentry from 'sentry-expo'
import { NavigationScreenType } from '../../types/navigation'
import { InputsControl } from '../../types/common'
import { useSettingsContext } from '../../common/context/SettingsContext'
import Header from '../../components/Header/Header'
import Icon from '../../components/Icon/Icon'
import Input from '../../components/Input/Input'
import { shadow } from '../../common/styles'
import config from '../../config/config'
import styles from './Payment.styles'

type Props = {
	navigation: NavigationScreenType
}

type Organization = {
	title: string
	url: string
	image: number
}

const charityOrganizations: Organization[] = [
	{
		title: 'Pajacyk',
		url: 'https://www.pajacyk.pl/wesprzyj/',
		image: require('../../assets/organizations/pajacyk.png'),
	},
	{
		title: 'Pajacyk2',
		url: '',
		image: require('../../assets/organizations/pajacyk.png'),
	},
	{
		title: 'Pajacyk3',
		url: '',
		image: require('../../assets/organizations/pajacyk.png'),
	},
]

const Payment = ({ navigation }: Props) => {
	const { useSubscribe } = useSettingsContext()
	const { settings, translations } = useSubscribe((s) => s)

	const [amount, setAmount] = useState<number>()
	const [email, setEmail] = useState<ReactText>()
	const [controls, setControls] = useState<InputsControl>({
		email: {
			label: translations.emailLabel,
			required: true,
			characterRestriction: 70,
			email: true,
		},
	})

	const itemOnPress = async (item: Organization) => {
		await Analytics.logEvent('itemOnPress', {
			component: 'Payment',
			item,
		})

		await WebBrowser.openBrowserAsync(item.url)
	}

	const payForFoodHandler = async () => {
		if (email && !controls.email.error) {
			await fetch(`${config.SAVE_FOOD_API}/send-email`, {
				method: 'POST',
				body: JSON.stringify({ email }),
			})
				.then(async () => {
					await Analytics.logEvent('sendEmail', {
						component: 'Payment',
					})
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.warn(err)
					Sentry.Native.captureException(err)
				})
		}

		const ids = navigation.getParam('ids', undefined)
		navigation.navigate('List', { ids })
	}

	const renderItem = ({ item }: { item: Organization }) => (
		<TouchableOpacity
			activeOpacity={1}
			style={{ ...styles.imageContainer, ...shadow }}
			onPress={() => itemOnPress(item)}
		>
			<ImageBackground style={styles.image} source={item.image}>
				<Text style={styles.imageHeading}>{item.title}</Text>
			</ImageBackground>
		</TouchableOpacity>
	)

  useEffect(() => {
    const amount = navigation.getParam('amount', 0)
    setAmount(amount)
  }, [])

	return (
		<View style={styles.flex}>
			<StatusBar barStyle='dark-content' translucent backgroundColor='transparent' />

			<Header
				leftComponent={<Icon color='#000' onPress={() => navigation.goBack()} variant='backIcon' />}
				centerComponent={
					<Text style={styles.header}>
						{translations.amount} {amount} {settings.currency}
					</Text>
				}
			/>

			<ScrollView scrollEventThrottle={200} directionalLockEnabled>
				<View style={styles.inputWrapper}>
					<Input
						inputConfig={controls.email}
						translations={translations}
						focus={false}
						value={email}
						changed={(value, control) => {
							setEmail(value)
							setControls({ email: control })
						}}
					/>
				</View>

				<View style={styles.contentWrapper}>
					<Text style={styles.contentTextWrapper}>
						<Text style={styles.lightText}>{translations.paymentHeaderText1} </Text>
						<Text style={styles.boldText}>{translations.paymentHeaderText2} </Text>
						<Text style={styles.lightText}>{translations.paymentHeaderText3} </Text>
						<Text style={styles.boldText}>{translations.paymentHeaderText4} </Text>
						<Text style={styles.lightText}>:</Text>
					</Text>

					<Carousel
						layout='default'
						data={charityOrganizations}
						sliderWidth={200}
						itemWidth={200}
						renderItem={renderItem}
						activeSlideAlignment='center'
						containerCustomStyle={styles.slider}
						loop
					/>

					<Text style={styles.contentTextWrapper}>
						<Text style={styles.lightText}>{translations.paymentFooterText1} </Text>
						<Text style={styles.boldText}>{translations.paymentFooterText2} </Text>
						<Text style={styles.lightText}>{translations.paymentFooterText3}</Text>
					</Text>
				</View>
			</ScrollView>

			<View
				style={{
					...styles.paymentButtonContainer,
					...shadow,
				}}
			>
				<View style={styles.paymentButtonWrapper}>
					<Button
						buttonStyle={styles.paymentButton}
						titleStyle={styles.paymentButtonTitle}
						onPress={payForFoodHandler}
						title={translations.donationSent}
					/>
				</View>
			</View>
		</View>
	)
}

export default Payment
