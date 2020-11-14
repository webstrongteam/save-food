import React, { Component } from 'react'
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Button, Icon, Input, Slider } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'
import InfoWindow from '../../components/InfoWindow/InfoWindow'
import Spinner from '../../components/Spinner/Spinner'
import Modal from '../../components/Modal/Modal'
import { getResizeMode } from '../../common/utility'
import { Camera } from 'expo-camera'
import { showMessage } from 'react-native-flash-message'
import Header from '../../components/Header/Header'
import styles from './Food.style'

import { connect } from 'react-redux'
import * as actions from '../../store/actions'

class Food extends Component {
	state = {
		id: null,
		image: '',
		name: '',
		quantity: '',
		price: 0.0,
		percent: 100,
		productQuantity: 1,
		savedDate: {},
		resizeMode: 'cover',
		showCamera: false,

		showModal: false,
		modalContent: null,
		type: '',

		loading: true,
	}

	componentDidMount() {
		this.setFood()
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.translations !== prevProps.translations) {
			if (this.state.name === 'No data') {
				const { translations } = this.props
				const {savedDate} = this.state
				savedDate.name = translations.noData
				this.setState({ savedDate, name: translations.noData })
			}
			if (this.state.quantity === 'No data') {
				const { translations } = this.props
				const {savedDate} = this.state
				savedDate.quantity = translations.noData
				this.setState({ savedDate, quantity: translations.noData })
			}
		}
		if (this.props.navigation !== prevProps.navigation) {
			this.setFood()
		}
	}

	setFood = () => {
		const { navigation, translations } = this.props

		let id = navigation.getParam('id', false)
		let image = navigation.getParam('image', false)
		let name = navigation.getParam('name', false)
		let quantity = navigation.getParam('quantity', false)

		if (!name) name = translations.noData
		if (!quantity) quantity = translations.noData

		if (!image || image === 'null') {
			image = require('../../assets/fast-food-outline.png')
		} else {
			image = { uri: image }
		}

		if (id) {
			// Edit
			const savedDate = {
				image,
				name: navigation.getParam('name', false),
				paid: navigation.getParam('paid', false),
				productQuantity: navigation.getParam('productQuantity', false),
				quantity: navigation.getParam('quantity', false),
				price: navigation.getParam('price', false),
				percentage: navigation.getParam('percentage', false),
				id: navigation.getParam('id', false),
			}
			this.setState(
				{
					...savedDate,
					savedDate: savedDate,
				},
				() => this.setResizeMode(image),
			)
		} else {
			// New
			this.setState(
				{
					savedDate: { name, image, quantity, price: 0.0, percent: 100 },
					image,
					name,
					quantity,
				},
				() => this.setResizeMode(image),
			)
		}
	}

	setResizeMode = (image) => {
		if (image.constructor.name === 'String') {
			getResizeMode(image, (resizeMode) => {
				this.setState({ resizeMode, loading: false })
			})
		} else {
			this.setState({ loading: false })
		}
	}

	setContent = (type) => {
		this.setState({
			modalContent: (
				<View style={{ marginTop: 20, marginBottom: -20 }}>
					<Input
						keyboardType={type === 'name' ? 'default' : 'numeric'}
						placeholder={this.state[type] + ''}
						onChangeText={(value) => {
							this.setState({
								[type]: type === 'price' ? Math.abs(+value.replace(',', '.')) : value,
							})
						}}
					/>
				</View>
			),
			showModal: true,
			type,
		})
	}

	saveChange = () => {
		const { savedDate, type } = this.state
		savedDate[type] = this.state[type]

		this.setState({ savedDate, showModal: false })
	}

	cancelChange = () => {
		const { savedDate, type } = this.state

		this.setState({ [type]: savedDate[type], showModal: false })
	}

	toggleModal = (type) => {
		if (!this.state.showModal) {
			this.setContent(type)
		} else {
			this.setState({ showModal: !this.state.showModal })
		}
	}

	toggleCamera = () => {
		this.setState({ showCamera: !this.state.showCamera })
	}

	takePicture = async () => {
		if (this.camera) {
			await this.camera.takePictureAsync({
				onPictureSaved: (photo) => {
					this.setState(
						{
							image: { uri: photo.uri },
							showCamera: false,
							loading: true,
						},
						() => this.setResizeMode(photo.uri),
					)
				},
			})
		}
	}

	showSimpleMessage = () => {
		const { translations } = this.props

		const message = {
			message: translations.noPriceTitle,
			description: translations.noPriceDescription,
			type: 'warning',
			icon: { icon: 'warning', position: 'left' },
			duration: 2500,
		}

		showMessage(message)
	}

	checkValid = () => {
		if (this.state.price === 0) {
			this.showSimpleMessage()
		} else {
			this.saveFood()
		}
	}

	saveFood = () => {
		const { image, name, quantity, price, percent, id, productQuantity } = this.state
		this.props.onSaveFood({
			image: image.constructor.name !== 'Object' ? 'null' : image.uri,
			name: name,
			paid: 0,
			id: id,
			productQuantity: productQuantity,
			quantity: quantity,
			price: price,
			percentage: percent.toFixed(0),
		})
		this.props.onRefresh()
		this.props.navigation.navigate('List')
	}

	render() {
		const {
			showModal,
			showCamera,
			modalContent,
			resizeMode,
			type,
			savedDate,
			image,
			percent,
			id,
			loading,
		} = this.state
		const { navigation, currency, translations } = this.props
		const heightWindow = Dimensions.get('window').height

		return (
			<>
				{loading ? (
					<Spinner color='#000' size={64} />
				) : (
					<>
						{showCamera ? (
							<Camera
								style={{ width: '100%', height: '100%' }}
								ratio='1:1'
								type={Camera.Constants.Type.back}
								ref={(ref) => (this.camera = ref)}
							>
								<TouchableOpacity
									style={{ position: 'absolute', top: 40, left: 20 }}
									onPress={this.toggleCamera}
								>
									<Icon size={30} name='close' type='antdesign' color="#fff" />
								</TouchableOpacity>
								<View style={styles.takePhotoButton}>
									<Button
										onPress={this.takePicture}
										buttonStyle={{ backgroundColor: '#4b8b1d' }}
										titleStyle={{
											color: '#fff',
											fontSize: 18,
											padding: 25,
											fontFamily: 'Lato-Light',
										}}
										title={translations.takePhoto}
									/>
								</View>
							</Camera>
						) : (
							<LinearGradient
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								colors={['#f2f3f5', '#f2f3f5']}
								style={styles.linearGradient1}
							>
								<LinearGradient colors={['#4b8b1d', '#6cd015']} style={styles.linearGradient2} />

								<Header
									leftComponent={
										<TouchableOpacity onPress={() => navigation.goBack()}>
											<Icon
												style={{ marginTop: 5, marginLeft: 20 }}
												size={25}
												name='arrowleft'
												type='antdesign'
												color="#fff"
											/>
										</TouchableOpacity>
									}
									centerComponent={
										<Text
											style={{
												textAlign: 'center',
												fontSize: 22,
												color: '#fff',
											}}
										>
											{id ? translations.editFood : translations.newFood}
										</Text>
									}
								/>

								<Modal
									visible={showModal}
									toggleModal={this.toggleModal}
									title={translations['change_' + type]}
									content={modalContent}
									buttons={[
										{ text: translations.save, onPress: this.saveChange },
										{ text: translations.cancel, onPress: this.cancelChange },
									]}
								/>

								<View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
									<ScrollView>
										<View
											style={{
												flex: 1,
												flexDirection: 'row',
												justifyContent: 'center',
											}}
										>
											<TouchableOpacity onPress={this.toggleCamera}>
												<View style={{ width: 200, height: 200, marginTop: 30 }}>
													<Image style={{ width: 200, height: 200, resizeMode }} source={image} />
												</View>
											</TouchableOpacity>
										</View>
										<View style={styles.infoWindowsContainer}>
											<TouchableOpacity onPress={() => this.toggleModal('name')}>
												<InfoWindow
													color1="#f8f8f8"
													color2={['#f2a91e', '#e95c17']}
													title={translations.name}
													val={savedDate.name}
												/>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => this.toggleModal('quantity')}>
												<InfoWindow
													color1="#f8f8f8"
													color2={['#f2a91e', '#e95c17']}
													title={translations.quantity}
													val={
														savedDate.quantity !== translations.noData
															? savedDate.quantity
															: savedDate.quantity
													}
												/>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => this.toggleModal('price')}>
												<InfoWindow
													color1="#f8f8f8"
													color2={['#af3462', '#bf3741']}
													title={translations.price}
													val={`${savedDate.price} ${currency}`}
												/>
											</TouchableOpacity>
											<View style={styles.sliderContainer}>
												<Text style={styles.percentInfo}>{translations.percentInfo}</Text>
												<Slider
													style={{ width: '100%' }}
													thumbTintColor='#292b2c'
													minimumTrackTintColor='#3f3f3f'
													maximumTrackTintColor='#b3b3b3'
													minimumValue={1}
													maximumValue={100}
													value={percent}
													onValueChange={(value) => this.setState({ percent: value })}
												/>
												<Text style={styles.percent}>{percent.toFixed(0)}%</Text>
											</View>
										</View>
										<View style={styles.saveContainer}>
											<TouchableOpacity onPress={this.checkValid}>
												<Button
													buttonStyle={{
														borderColor: '#4b8b1d',
														width: '100%',
													}}
													disabled={savedDate.price === 0}
													titleStyle={{
														color: '#4b8b1d',
														fontSize: 18,
														fontFamily: 'Lato-Light',
													}}
													onPress={this.saveFood}
													type='outline'
													title={translations.save}
												/>
											</TouchableOpacity>
										</View>
									</ScrollView>
								</View>
							</LinearGradient>
						)}
					</>
				)}
			</>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		currency: state.settings.currency,
		translations: state.settings.translations,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onSaveFood: (value) => dispatch(actions.saveFood(value)),
		onRefresh: () => dispatch(actions.onRefresh()),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Food)
