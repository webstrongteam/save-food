import React, { Component } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button, ButtonGroup, Icon, Slider } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'
import Input from '../../components/Input/Input'
import Header from '../../components/Header/Header'
import InfoWindow from '../../components/InfoWindow/InfoWindow'
import Spinner from '../../components/Spinner/Spinner'
import Modal from '../../components/Modal/Modal'
import { Camera } from 'expo-camera'
import { showMessage } from 'react-native-flash-message'
import { checkValid } from '../../common/validation'
import { getQuantitySuffix } from '../../common/utility'
import styles from './Food.styles'

import { connect } from 'react-redux'
import * as actions from '../../store/actions'

class Food extends Component {
	state = {
		savedData: {
			id: null,
			image: null,
			name: undefined,
			quantity: undefined,
			price: undefined,
			percentage: 100,
			productQuantity: 1,
			quantitySuffixIndex: 0,
			selected: 1,
		},

		controls: {
			name: {
				label: this.props.translations.nameLabel,
				required: true,
				characterRestriction: 70,
			},
			quantity: {
				label: this.props.translations.quantityLabel,
				keyboardType: 'numeric',
				required: true,
				characterRestriction: 5,
				number: true,
				positiveNumber: true,
			},
			price: {
				label: this.props.translations.priceLabel,
				keyboardType: 'numeric',
				required: true,
				characterRestriction: 7,
				number: true,
				positiveNumber: true,
			},
		},

		quantitySuffixes: [this.props.translations.grams, this.props.translations.milliliters],
		showModal: false,
		modalContent: null,
		type: '',
		loading: true,
	}

	componentDidMount() {
		this.setFood()
	}

	componentDidUpdate(prevProps) {
		if (this.props.navigation !== prevProps.navigation) {
			this.setFood()
		}
	}

	setFood = () => {
		const { navigation } = this.props

		const id = navigation.getParam('id', null)
		let image = navigation.getParam('image', null)

		if (!image || image === 'null') {
			image = require('../../assets/common/dish.png')
		} else if (!image.uri) {
			image = { uri: image }
		}

		const savedData = {
			id,
			image,
			name: navigation.getParam('name', undefined),
			quantity: navigation.getParam('quantity', undefined),
			price: navigation.getParam('price', undefined),
			paid: navigation.getParam('paid', 0),
			productQuantity: navigation.getParam('productQuantity', 1),
			quantitySuffixIndex: navigation.getParam('quantitySuffixIndex', 1),
			percentage: navigation.getParam('percentage', 100),
			selected: navigation.getParam('selected', 1),
		}

		this.setState({
			...savedData,
			savedData,
			loading: false,
		})
	}

	setContent = (type) => {
		const { controls } = this.state
		const { translations } = this.props

		const hasValue = this.state[type] && this.state[type] !== translations.noData

		this.setState({
			modalContent: (
				<View style={styles.modalContentWrapper}>
					<Input
						elementConfig={controls[type]}
						translations={translations}
						focus={!hasValue}
						value={this.state[type]}
						changed={(value, control) => {
							const { controls } = this.state
							controls[type] = control
							this.setState({ [type]: value, controls })
						}}
					/>
					{type === 'quantity' && this.quantitySuffixButtons()}
				</View>
			),
			showModal: true,
			type,
		})
	}

	quantitySuffixButtons = () => {
		const { quantitySuffixes, quantitySuffixIndex } = this.state

		return (
			<ButtonGroup
				onPress={(index) =>
					this.setState({ quantitySuffixIndex: index }, () => this.setContent('quantity'))
				}
				selectedIndex={quantitySuffixIndex}
				buttons={quantitySuffixes}
				selectedButtonStyle={styles.selectedButtonStyle}
			/>
		)
	}

	saveChange = () => {
		const { savedData, controls, type } = this.state

		if (checkValid(controls[type], this.state[type])) {
			savedData[type] = this.state[type]
			this.setState({ savedData, showModal: false })
		}
	}

	cancelChange = () => {
		const { savedData, type } = this.state

		this.setState({ [type]: savedData[type], showModal: false })
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
			const { navigation, translations } = this.props

			navigation.navigate('Camera', {
				buttonTitle: translations.takePhoto,
				takePhoto: this.takePicture,
			})
		} else {
			this.showSimpleMessage('permissionError')
		}
	}

	takePicture = (uri) => {
		this.setState({ image: { uri } })
	}

	showSimpleMessage = (type) => {
		const { translations } = this.props
		let message

		if (type === 'priceError') {
			message = {
				message: translations.noPriceTitle,
				description: translations.noPriceDescription,
				type: 'warning',
				icon: { icon: 'warning', position: 'left' },
				duration: 2500,
			}
		}
		if (type === 'permissionError') {
			message = {
				message: translations.permissionErrorTitle,
				description: translations.permissionErrorCamera,
				type: 'danger',
				icon: { icon: 'danger', position: 'left' },
				duration: 2500,
			}
		}

		showMessage(message)
	}

	checkValid = () => this.state.price && !this.state.controls.price.error

	saveFood = () => {
		if (!this.checkValid()) {
			this.showSimpleMessage('priceError')
			return
		}

		const {
			id,
			image,
			name,
			quantity,
			price,
			percentage,
			selected,
			quantitySuffixIndex,
			productQuantity,
		} = this.state

		this.props.onSaveFood({
			image: image.constructor.name !== 'Object' ? 'null' : image.uri,
			name,
			id,
			productQuantity,
			quantitySuffixIndex,
			quantity,
			selected,
			paid: 0, // false
			price: (+price).toFixed(2),
			percentage: percentage.toFixed(0),
		})
		this.props.navigation.navigate('List', {})
	}

	render() {
		const {
			showModal,
			modalContent,
			type,
			savedData,
			image,
			percentage,
			id,
			quantitySuffixIndex,
			loading,
		} = this.state
		const { navigation, currency, translations } = this.props

		if (loading) {
			return <Spinner color='#000' size={64} />
		}

		return (
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
								style={styles.headerBackIcon}
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
							<InfoWindow
								color1='#f8f8f8'
								color2={['#f2a91e', '#e95c17']}
								title={translations.name}
								val={savedData.name ?? translations.noData}
								onPress={() => this.toggleModal('name')}
							/>
							<InfoWindow
								color1='#f8f8f8'
								color2={['#f2a91e', '#e95c17']}
								title={translations.quantity}
								val={
									savedData.quantity
										? `${+savedData.quantity} ${getQuantitySuffix(
												quantitySuffixIndex,
												translations,
										  )}`
										: 0
								}
								onPress={() => this.toggleModal('quantity')}
							/>
							<InfoWindow
								color1='#f8f8f8'
								color2={['#af3462', '#bf3741']}
								title={translations.price}
								val={`${savedData.price ? +savedData.price : 0} ${currency}`}
								onPress={() => this.toggleModal('price')}
							/>

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
									value={percentage}
									onValueChange={(value) => this.setState({ percentage: value })}
								/>
								<Text style={styles.percent}>{percentage.toFixed(0)}%</Text>
							</View>
						</View>

						<View style={styles.saveButtonContainer}>
							<TouchableOpacity onPress={this.saveFood}>
								<Button
									buttonStyle={styles.saveButton}
									titleStyle={styles.saveButtonTitle}
									disabled={!this.checkValid()}
									type='outline'
									title={translations.save}
								/>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>
			</LinearGradient>
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
