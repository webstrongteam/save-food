import React, { Component } from 'react'
import { TouchableOpacity, View, Platform } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Button, Icon } from 'react-native-elements'
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Analytics from 'expo-firebase-analytics'
import axios from 'axios'
import Spinner from '../../components/Spinner/Spinner'
import { exitIcon, shadow } from '../../common/styles'
import styles from './Scanner.styles'

import { connect } from 'react-redux'

class Scanner extends Component {
	state = {
		grantedPermission: false,
		scanned: false,
		loading: true,
	}

	componentDidMount() {
		BarCodeScanner.requestPermissionsAsync()
			.then(({ status }) => {
				if (status !== 'granted') {
					this.showPermissionError('permissionError')
				} else {
					this.setState({ grantedPermission: true, loading: false })
				}
			})
			.catch(() => {
				this.showPermissionError('permissionError')
			})
	}

	showPermissionError = () => {
		const { translations } = this.props

		const message = {
			message: translations.permissionErrorTitle,
			description: translations.permissionErrorCamera,
			type: 'danger',
			icon: { icon: 'danger', position: 'left' },
			duration: 2500,
		}

		showMessage(message)
	}

	handleBarCodeScanned = ({ data }) => {
		this.setState({ loading: true, scanned: true }, () => {
			axios
				.get(`https://world.openfoodfacts.org/api/v0/product/${data}.json`)
				.then(({ data }) => {
					Analytics.logEvent('scannedFood', {
						component: 'Scanner',
					})

					const { translations } = this.props
					const image = data.product.image_url
					const name = data.product.product_name
					const quantity = data.product.product_quantity
					let quantitySuffixIndex = 1 // default ml

					const quantitySuffix = data.product.quantity.slice(-2) // get last two char (g, ml, l)
					if (quantitySuffix.trim() === translations.gramsSuffix) {
						quantitySuffixIndex = 0 // g
					}

					if (!image && !name && !quantity) {
						Analytics.logEvent('missingProductData', {
							component: 'Scanner',
						})
					}

					this.setState({ loading: false })
					this.props.navigation.replace('Food', { image, name, quantity, quantitySuffixIndex })
				})
				.catch(() => {
					this.setState({ loading: false })
					this.props.navigation.replace('Food', {
						image: null,
						name: null,
						quantity: null,
					})
				})
		})
	}

	render() {
		const { scanned, grantedPermission, loading } = this.state
		const { navigation } = this.props

		return (
			<View style={styles.container}>
				{grantedPermission && (
					<BarCodeScanner
						ratio='16:9'
						onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
						style={styles.barCodeScanner}
					/>
				)}

				{loading && (
					<View style={styles.loading}>
						<Spinner bgColor='transparency' color='#fff' size={64} />
					</View>
				)}

				<View style={exitIcon}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Icon size={30} name='close' type='antdesign' color='#fff' />
					</TouchableOpacity>
				</View>

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
						title={this.props.translations.addManually}
					/>
				</View>
			</View>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		translations: state.settings.translations,
	}
}

export default connect(mapStateToProps)(Scanner)
