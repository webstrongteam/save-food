import React, { Component } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Analytics from 'expo-firebase-analytics'
import axios from 'axios'
import Spinner from '../../components/Spinner/Spinner'
import { Button, Icon } from 'react-native-elements'
import styles from './Scanner.styles'

import { connect } from 'react-redux'

class Scanner extends Component {
	state = {
		scanned: false,
		loading: false,
	}

	componentDidMount() {
		BarCodeScanner.requestPermissionsAsync()
	}

	handleBarCodeScanned = ({ data }) => {
		this.setState({ loading: true, scanned: true }, () => {
			axios
				.get(`https://world.openfoodfacts.org/api/v0/product/${data}.json`)
				.then((res) => {
					const image = res.data.product.image_url
					const name = res.data.product.product_name
					const quantity = res.data.product.product_quantity

					Analytics.logEvent('scannedFood', {
						component: 'Scanner',
					})

					if (!image && !name && !quantity) {
						Analytics.logEvent('missingProduct', {
							component: 'Scanner',
						})
					}

					this.setState({ loading: false })
					this.props.navigation.navigate('Food', { image, name, quantity })
				})
				.catch(() => {
					this.setState({ loading: false })
					this.props.navigation.navigate('Food', {
						image: null,
						name: null,
						quantity: null,
					})
				})
		})
	}

	render() {
		const { scanned, loading } = this.state
		const { navigation } = this.props

		return (
			<View style={styles.container}>
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
					style={styles.barCodeScanner}
				/>
				{loading && (
					<View style={styles.loading}>
						<Spinner bgColor='transparency' color='#fff' size={64} />
					</View>
				)}
				<View style={styles.backIcon}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Icon size={30} name='close' type='antdesign' color='#fff' />
					</TouchableOpacity>
				</View>
				<View style={styles.scannerBoxContainer}>
					<View style={styles.scannerBox}>
						<View style={styles.scannerBoxBorder} />
					</View>
				</View>
				<View style={styles.addManuallyButtonWrapper}>
					<Button
						onPress={() => navigation.navigate('Food')}
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
