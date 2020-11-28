import React, { Component } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Button, Icon, Input, Slider } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'
import InfoWindow from '../../components/InfoWindow/InfoWindow'
import Spinner from '../../components/Spinner/Spinner'
import Modal from '../../components/Modal/Modal'
import { Camera } from 'expo-camera'
import { showMessage } from 'react-native-flash-message'
import Header from '../../components/Header/Header'
import { exitIcon, shadow } from '../../common/styles'
import styles from './Food.styles'

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
		selected: 1,
		savedDate: {},
		showCamera: false,

		showModal: false,
		modalContent: null,
		type: '',

		loading: true,
	}

	componentDidMount() {
		this.setFood()
	}

	componentDidUpdate(prevProps) {
		if (this.props.translations !== prevProps.translations) {
			if (this.state.name === 'No data') {
				const { translations } = this.props
				const { savedDate } = this.state
				savedDate.name = translations.noData
				this.setState({ savedDate, name: translations.noData })
			}
			if (this.state.quantity === 'No data') {
				const { translations } = this.props
				const { savedDate } = this.state
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

		let id = navigation.getParam('id', null)
		let image = navigation.getParam('image', null)
		let name = navigation.getParam('name', null)
		let quantity = navigation.getParam('quantity', null)

		if (!name) name = translations.noData
		if (!quantity) quantity = translations.noData

		if (!image || image === 'null') {
			image = require('../../assets/common/dish.png')
		} else if (!image.uri) {
			image = { uri: image }
		}

		if (id) {
			// Edit
			const savedDate = {
				image,
				id: navigation.getParam('id', null),
				name: navigation.getParam('name', null),
				paid: navigation.getParam('paid', 0),
				productQuantity: navigation.getParam('productQuantity', 1),
				quantity: navigation.getParam('quantity', 0),
				price: navigation.getParam('price', 0),
				percentage: navigation.getParam('percentage', 100),
				selected: navigation.getParam('selected', 1),
			}
			this.setState({
				...savedDate,
				savedDate,
				loading: false,
			})
		} else {
			// New
			this.setState({
				savedDate: { name, image, quantity, price: 0.0, percent: 100 },
				image,
				name,
				quantity,
				loading: false,
			})
		}
	}

	setContent = (type) => {
		const { translations } = this.props

		this.setState({
			modalContent: (
				<View style={{ marginTop: 20, marginBottom: -20 }}>
					<Input
						keyboardType={type === 'name' ? 'default' : 'numeric'}
						placeholder={`${this.state[type]}`}
						defaultValue={
							this.state[type] && this.state[type] !== translations.noData
								? `${this.state[type]}`
								: undefined
						}
						onChangeText={(value) => {
							if (type === 'price' && value.length > 4) {
								return
							}

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

	toggleCamera = async () => {
		const { status } = await Camera.requestPermissionsAsync()

		if (status === 'granted') {
			this.setState({ showCamera: !this.state.showCamera })
		}
	}

	takePicture = async () => {
		if (this.camera) {
			await this.camera.takePictureAsync({
				onPictureSaved: (photo) => {
					this.setState({
						image: { uri: photo.uri },
						showCamera: false,
					})
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
		const { image, name, quantity, price, percent, selected, id, productQuantity } = this.state
		this.props.onSaveFood({
			image: image.constructor.name !== 'Object' ? 'null' : image.uri,
			name,
			id,
			productQuantity,
			quantity,
			selected,
			paid: 0, // false
			price: price.toFixed(2),
			percentage: percent.toFixed(0),
		})
		this.props.navigation.navigate('List', {})
	}

	render() {
		const {
			showModal,
			showCamera,
			modalContent,
			type,
			savedDate,
			image,
			percent,
			id,
			loading,
		} = this.state
		const { navigation, currency, translations } = this.props

		return (
			<>
				{loading ? (
					<Spinner color='#000' size={64} />
				) : (
					<>
						{showCamera ? (
							<Camera
								style={styles.camera}
								ratio='16:9'
								type={Camera.Constants.Type.back}
								ref={(ref) => {
									this.camera = ref
								}}
							>
								<TouchableOpacity style={exitIcon} onPress={this.toggleCamera}>
									<Icon size={30} name='close' type='antdesign' color='#fff' />
								</TouchableOpacity>
								<View style={{ ...styles.takePhotoButtonWrapper, ...shadow }}>
									<Button
										onPress={this.takePicture}
										buttonStyle={styles.takeFoodButton}
										titleStyle={styles.takeFoodButtonTitle}
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
												style={styles.backIcon}
												size={25}
												name='arrowleft'
												type='antdesign'
												color='#fff'
											/>
										</TouchableOpacity>
									}
									centerComponent={
										<Text style={styles.headerTitle}>
											{id ? translations.editFood : translations.newFood}
										</Text>
									}
								/>

								<Modal
									visible={showModal}
									toggleModal={this.toggleModal}
									title={translations[type]}
									content={modalContent}
									buttons={[
										{ text: translations.save, onPress: this.saveChange },
										{ text: translations.cancel, onPress: this.cancelChange },
									]}
								/>

								<View style={styles.contentWrapper}>
									<ScrollView>
										<View style={styles.imageContainer}>
											<TouchableOpacity onPress={this.toggleCamera}>
												<View style={styles.imageWrapper}>
													<Image style={styles.image} source={image} />

													<View style={styles.tapImage}>
														<Text style={styles.tapImageText}>{translations.tapToChange}</Text>
													</View>
												</View>
											</TouchableOpacity>
										</View>
										<View style={styles.infoWindowsContainer}>
											<TouchableOpacity onPress={() => this.toggleModal('name')}>
												<InfoWindow
													color1='#f8f8f8'
													color2={['#f2a91e', '#e95c17']}
													title={translations.name}
													val={savedDate.name}
												/>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => this.toggleModal('quantity')}>
												<InfoWindow
													color1='#f8f8f8'
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
													color1='#f8f8f8'
													color2={['#af3462', '#bf3741']}
													title={translations.price}
													val={`${savedDate.price} ${currency}`}
												/>
											</TouchableOpacity>
											<View style={styles.sliderContainer}>
												<Text style={styles.percentInfo}>{translations.percentInfo}</Text>
												<Slider
													style={styles.slider}
													thumbStyle={styles.sliderThumbStyle}
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
										<View style={styles.saveButtonContainer}>
											<TouchableOpacity onPress={this.checkValid}>
												<Button
													buttonStyle={styles.saveButton}
													disabled={savedDate.price === 0}
													titleStyle={styles.saveButtonTitle}
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
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Food)
