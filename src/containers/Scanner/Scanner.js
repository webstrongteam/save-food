import React, { Component } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import axios from 'axios'
import Spinner from '../../components/Spinner/Spinner'
import { Button, Icon } from 'react-native-elements'
import styles from './Scanner.style'

import { connect } from 'react-redux'

class Scanner extends Component {
	state = {
		scanned: false,
		loading: false,
	}

	componentDidMount() {
		this.getPermission()
	}

	getPermission = async () => {
		const { status } = await BarCodeScanner.requestPermissionsAsync()

		this.setState({ permission: status === 'granted' })
	}

	handleBarCodeScanned = ({ type, data }) => {
		this.setState({ loading: true, scanned: true }, () => {
			axios
				.get(`https://world.openfoodfacts.org/api/v0/product/${data}.json`)
				.then((res) => {
					const image = res.data.product.image_url
					const name = res.data.product.product_name
					const quantity = res.data.product.product_quantity

					this.props.navigation.navigate('Food', { image, name, quantity })
					this.setState({ loading: false })
				})
				.catch((err) => {
					this.props.navigation.navigate('Food', {
						image: null,
						name: null,
						quantity: null,
					})
					this.setState({ loading: false })
				})
		})
	}

	render() {
		const { scanned, loading } = this.state

		return (
			<View style={styles.container}>
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
					style={{ width: '100%', height: '100%' }}
				/>
				{loading && (
					<View style={styles.loading}>
						<Spinner bgColor='transparency' color='#fff' size={64} />
					</View>
				)}
				<View style={styles.backIcon}>
					<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
						<Icon size={30} name='close' type='antdesign' color="#fff" />
					</TouchableOpacity>
				</View>
				<View style={styles.scannerBoxContainer}>
					<View style={styles.scannerBox}>
						<View style={styles.scannerBoxBorder} />
					</View>
				</View>
				<View style={styles.addManuallyButton}>
					<Button
						onPress={() => this.props.navigation.navigate('Food')}
						buttonStyle={{ backgroundColor: '#4b8b1d' }}
						titleStyle={{
							color: '#fff',
							fontSize: 18,
							padding: 25,
							fontFamily: 'Lato-Light',
						}}
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
