import React, { ReactText, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Image, ScrollView, StatusBar, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import Carousel from 'react-native-snap-carousel'
import * as WebBrowser from 'expo-web-browser'
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
import Modal from '../../components/Modal/Modal'
import useAsyncEffect from '../../common/hooks/useAsyncEffect'
import { getPaidWastedFoods } from '../../../database/actions/wastedFood'
import { changeEmail } from '../../../database/actions/settings'
import logEvent from '../../common/logEvent'
import { blackColor } from '../../common/colors'

type Props = {
	navigation: NavigationScreenType
}

type Organization = {
	url: string
	image: number
}

const charityOrganizations: Organization[] = [
	{
		url: 'https://www.pajacyk.pl/wesprzyj',
		image: require('../../assets/organizations/pajacyk.jpeg'),
	},
	{
		url: 'https://www.pah.org.pl/wplac',
		image: require('../../assets/organizations/pah.jpg'),
	},
	{
		url: 'https://www.actionagainsthunger.org/donate/save-lives-and-end-hunger',
		image: require('../../assets/organizations/aah.jpg'),
	},
	{
		url: 'https://bankizywnosci.pl/przekaz-darowizne',
		image: require('../../assets/organizations/bank_zywnosci.png'),
	},
	{
		url: 'https://secure.feedingamerica.org/site/Donation',
		image: require('../../assets/organizations/feeding_america.jpg'),
	},
	{
		url: 'https://www.bread.org',
		image: require('../../assets/organizations/bread_for_the_world.png'),
	},
]

const Payment = ({ navigation }: Props) => {
	const { useSubscribe, setSettings } = useSettingsContext()
	const settings = useSubscribe((s) => s.settings)
	const translations = useSubscribe((s) => ({
		...s.translations.Payment,
		...s.translations.common,
	}))

	const [loading, setLoading] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [amount, setAmount] = useState<number>()
	const [email, setEmail] = useState<ReactText>(settings.email)
	const [controls, setControls] = useState<InputsControl>({
		email: {
			label: translations.emailLabel,
			characterRestriction: 70,
			keyboardType: 'email-address',
			email: true,
		},
	})

	const payForFoodHandler = async () => {
		setLoading(true)
		if (email && !controls.email.error) {
			await fetch(`${config.SAVE_FOOD_API}/send-email`, {
				method: 'POST',
				body: JSON.stringify({ email, lang: settings.lang }),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
				.then(async (res) => {
					if (res.status !== 200) {
						throw new Error(`Response status: ${res.status}`)
					}

					await logEvent('sendEmail', {
						component: 'Payment',
					})
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.warn(err)
					Sentry.Native.captureException(err)
				})

			setSettings(await changeEmail(`${email}`))
		}

		const ids = navigation.getParam('ids', undefined)

		if (!ids) {
			// eslint-disable-next-line no-console
			console.warn('Missing food ids for payment')
			Sentry.Native.captureException('Missing food ids for payment')
		}

		navigation.navigate('List', { ids })
	}

	const itemOnPressHandler = async (item: Organization) => {
		await logEvent('itemOnPress', {
			component: 'Payment',
			item,
		})

		await WebBrowser.openBrowserAsync(item.url)
	}

	const renderItem = ({ item }: { item: Organization }) => (
		<TouchableOpacity
			activeOpacity={1}
			style={{ ...styles.imageContainer, ...shadow }}
			onPress={() => itemOnPressHandler(item)}
		>
			<Image style={styles.image} source={item.image} />
		</TouchableOpacity>
	)

	useEffect(() => {
		const amount = navigation.getParam('amount', 0)
		setAmount(amount)
	}, [])

	useAsyncEffect(async () => {
		const paidFoods = await getPaidWastedFoods()

		if (paidFoods.length === 0) {
			setShowModal(true)
		}
	}, [])

	return (
		<View style={styles.flex}>
			<StatusBar barStyle='dark-content' translucent backgroundColor='transparent' />
			<Header
				leftComponent={
					<Icon color={blackColor} onPress={() => navigation.goBack()} variant='backIcon' />
				}
				centerComponent={
					<Text numberOfLines={1} style={styles.header}>
						{translations.amount} {amount} {settings.currency}
					</Text>
				}
				rightComponent={
					<Icon
						color={blackColor}
						style={styles.infoIcon}
						onPress={() => setShowModal(true)}
						type='material'
						name='info-outline'
					/>
				}
			/>

			<Modal
				visible={showModal}
				toggleModal={() => setShowModal(!showModal)}
				title={translations.paymentInfoTitle}
				buttons={[{ text: 'Ok', onPress: () => setShowModal(false) }]}
			>
				<View style={styles.infoTextWrapper}>
					<Text style={styles.infoText}>{translations.paymentInfo1}</Text>
					<Text style={styles.infoText}>{translations.paymentInfo2}</Text>
					<Text style={styles.infoText}>{translations.paymentInfo3}</Text>
				</View>
			</Modal>

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
						<Text style={styles.lightText}>{translations.paymentHeaderText1}&nbsp;</Text>
						<Text style={styles.boldText}>{translations.paymentHeaderText2}&nbsp;</Text>
						<Text style={styles.lightText}>{translations.paymentHeaderText3}&nbsp;</Text>
						<Text style={styles.boldText}>{translations.paymentHeaderText4}&nbsp;</Text>
						<Text style={styles.lightText}>:</Text>
					</Text>

					<Carousel
						layout='default'
						removeClippedSubviews={false}
						data={charityOrganizations}
						sliderWidth={200}
						itemWidth={200}
						renderItem={renderItem}
						activeSlideAlignment='center'
						containerCustomStyle={styles.slider}
						loop
					/>

					<Text style={styles.contentTextWrapper}>
						<Text style={styles.lightText}>{translations.paymentFooterText1}&nbsp;</Text>
						<Text style={styles.boldText}>{translations.paymentFooterText2}&nbsp;</Text>
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
						loading={loading}
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
