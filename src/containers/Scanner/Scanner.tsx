import React, { useEffect, useState } from 'react'
import { View, Platform } from 'react-native'
import { MessageOptions, showMessage } from 'react-native-flash-message'
import { Button } from 'react-native-elements'
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Analytics from 'expo-firebase-analytics'
import * as Sentry from 'sentry-expo'
import Spinner from '../../components/Spinner/Spinner'
import { shadow } from '../../common/styles'
import styles from './Scanner.styles'
import { useSettingsContext } from '../../common/context/SettingsContext'
import { NavigationScreenType } from '../../types/navigation'
import Icon from '../../components/Icon/Icon'

type Props = {
	navigation: NavigationScreenType
}

const Scanner = ({ navigation }: Props) => {
	const { useSubscribe } = useSettingsContext()
	const translations = useSubscribe((s) => s.translations)

	const [grantedPermission, setGrantedPermission] = useState(false)
	const [scanned, setScanned] = useState(false)
	const [loading, setLoading] = useState(false)

	const showPermissionError = () => {
		const message: MessageOptions = {
			message: translations.permissionErrorTitle,
			description: translations.permissionErrorCamera,
			type: 'danger',
			icon: { icon: 'danger', position: 'left' },
			duration: 2500,
		}

		showMessage(message)
	}

	const showMissingDataError = () => {
		const message: MessageOptions = {
			message: translations.missingDataErrorTitle,
			description: translations.missingDataErrorDescription,
			type: 'warning',
			icon: { icon: 'warning', position: 'left' },
			duration: 3000,
		}

		showMessage(message)
	}

	useEffect(() => {
		BarCodeScanner.requestPermissionsAsync()
			.then(({ status }) => {
				if (status !== 'granted') {
					showPermissionError()
				} else {
					setGrantedPermission(true)
					setLoading(false)
				}
			})
			.catch(() => {
				showPermissionError()
			})
	}, [])

	const handleBarCodeScanned = async ({ data }: { data: string }) => {
		setLoading(true)
		setScanned(true)

		await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`)
			.then(async (response) => {
				await Analytics.logEvent('scannedFood', {
					component: 'Scanner',
				})

				const data = await response.json()

				const image = data.product?.image_url
				const name = data.product?.product_name
				const quantity = data.product?.product_quantity
				let quantitySuffixIndex = 1 // default ml

				const quantitySuffix = data.product?.quantity.slice(-2) // get last two chars (g, ml, l)
				if (quantitySuffix && quantitySuffix.trim() === translations.gramsSuffix) {
					quantitySuffixIndex = 0 // g
				}

				if (!image && !name && !quantity) {
					Sentry.Native.captureEvent({ message: `Missing product data for barcode ${data.code}` })
					showMissingDataError()
				}

				setLoading(false)
				navigation.replace('Food', { image, name, quantity, quantitySuffixIndex })
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.warn(err)
				Sentry.Native.captureException(err)

				setLoading(false)
				navigation.replace('Food')
			})
	}

	return (
		<View style={styles.container}>
			{grantedPermission && (
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
					style={styles.barCodeScanner}
				/>
			)}

			{loading && (
				<View style={styles.loading}>
					<Spinner bgColor='transparency' color='#fff' size={64} />
				</View>
			)}

			<Icon variant='exitIcon' onPress={() => navigation.goBack()} />

			{Platform.OS === 'ios' && (
				<View style={styles.scannerBoxContainer}>
					<View style={styles.scannerBox}>
						<View style={styles.scannerBoxBorder} />
					</View>
				</View>
			)}

			<View style={{ ...styles.addManuallyButtonWrapper, ...shadow }}>
				<Button
					onPress={() => navigation.replace('Food')}
					buttonStyle={styles.addManuallyButton}
					titleStyle={styles.addManuallyButtonTitle}
					title={translations.addManually}
				/>
			</View>
		</View>
	)
}

export default Scanner
