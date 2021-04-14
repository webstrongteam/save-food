import React, { ReactNode, useEffect, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button, ButtonGroup, Slider } from 'react-native-elements'
import { Camera } from 'expo-camera'
import { MessageOptions, showMessage } from 'react-native-flash-message'
import Input from '../../components/Input/Input'
import Header from '../../components/Header/Header'
import InfoWindow from '../../components/InfoWindow/InfoWindow'
import Spinner from '../../components/Spinner/Spinner'
import Modal, { ModalButtonType } from '../../components/Modal/Modal'
import { checkValidation } from '../../common/validation'
import { getImage, getQuantitySuffix, prepareData } from '../../common/utility'
import { WastedFood } from '../../types/westedFood'
import { InputsControl } from '../../types/common'
import { saveFood } from '../../../database/actions/wastedFood'
import { NavigationScreenType } from '../../types/navigation'
import { useSettingsContext } from '../../common/context/SettingsContext'
import styles from './Food.styles'
import Background from '../../components/Background/Background'
import Icon from '../../components/Icon/Icon'
import {
	blackColor,
	darkColor,
	grayColor,
	orangeGradient,
	redGradient,
	whiteColor,
} from '../../common/colors'

type Props = {
	navigation: NavigationScreenType
}

type ModalType = keyof Omit<WastedFood, 'image'> | 'discardChanges'

const initialData: WastedFood = {
	id: 0,
	image: '',
	name: '',
	quantity: 0,
	price: 0,
	percentage: 100,
	productQuantity: 1,
	quantitySuffixIndex: 0,
	selected: 1,
	paid: 0,
}

const Food = ({ navigation }: Props) => {
	const { useSubscribe } = useSettingsContext()
	const settings = useSubscribe((s) => s.settings)
	const translations = useSubscribe((s) => ({ ...s.translations.Food, ...s.translations.common }))

	const [savedData, setSavedData] = useState<WastedFood>(initialData)
	const [templateData, setTemplateData] = useState<WastedFood>(initialData)
	const [loading, setLoading] = useState(true)
	const [hasChanges, setHasChanges] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [modalType, setModalType] = useState<ModalType>('id')
	const [modalContent, setModalContent] = useState<ReactNode>()
	const [controls, setControls] = useState<InputsControl>({
		name: {
			label: translations.foodNameLabel,
			required: true,
			characterRestriction: 70,
		},
		quantity: {
			label: translations.quantityLabel,
			keyboardType: 'numeric',
			required: true,
			characterRestriction: 5,
			number: true,
			positiveNumber: true,
			precision: 0,
		},
		price: {
			label: translations.priceLabel,
			keyboardType: 'numeric',
			required: true,
			characterRestriction: 7,
			number: true,
			positiveNumber: true,
			precision: 2,
		},
	})

	const quantitySuffixes = [translations.grams, translations.milliliters]

	const setFood = () => {
		const savedData = {
			id: navigation.getParam('id', undefined),
			image: navigation.getParam('image', undefined),
			name: navigation.getParam('name', ''),
			quantity: navigation.getParam('quantity', 0),
			price: navigation.getParam('price', 0),
			paid: navigation.getParam('paid', 0),
			productQuantity: navigation.getParam('productQuantity', 1),
			quantitySuffixIndex: navigation.getParam('quantitySuffixIndex', 1),
			percentage: navigation.getParam('percentage', 100),
			selected: navigation.getParam('selected', 1),
		}

		setSavedData(savedData)
		setTemplateData(savedData)
		setLoading(false)
	}

	const QuantitySuffixButtons = () => {
		const [value, setValue] = useState(savedData.quantitySuffixIndex)

		return (
			<ButtonGroup
				onPress={(index) => {
					setSavedData({
						...savedData,
						quantitySuffixIndex: index,
					})
					setValue(index)
				}}
				selectedIndex={value}
				buttons={quantitySuffixes}
				selectedButtonStyle={styles.selectedButtonStyle}
			/>
		)
	}

	const setContent = (type: ModalType) => {
		if (type === 'discardChanges') {
			setModalContent(
				<Text style={styles.discardChanges}>{translations.discardChangesDescription}</Text>,
			)
		} else {
			setModalContent(
				<View style={styles.modalContentWrapper}>
					<Input
						inputConfig={controls[type]}
						translations={translations}
						value={templateData[type]}
						changed={(value, control) => {
							setTemplateData({
								...templateData,
								[type]: value,
							})
							setControls({
								...controls,
								[type]: control,
							})
						}}
					/>
					{type === 'quantity' && <QuantitySuffixButtons />}
				</View>,
			)
		}

		setShowModal(true)
		setModalType(type)
	}

	const saveChange = () => {
		if (modalType === 'discardChanges') {
			return
		}

		if (checkValidation(controls[modalType], templateData[modalType] ?? '')) {
			setTemplateData(prepareData(templateData, controls))
			setSavedData(
				prepareData(
					{
						...savedData,
						[modalType]: templateData[modalType],
					},
					controls,
				),
			)

			setHasChanges(true)
			setShowModal(false)
		}
	}

	const cancelChange = () => {
		if (modalType === 'discardChanges') {
			return
		}

		setTemplateData({
			...templateData,
			[modalType]: savedData[modalType],
		})
		setShowModal(false)
	}

	const toggleModal = (type?: ModalType) => {
		if (!showModal && type) {
			setContent(type)
		} else {
			setShowModal(false)
		}
	}

	const takePhoto = (uri: string) => {
		setSavedData({
			...templateData,
			image: uri,
		})
	}

	const toggleCamera = async () => {
		const { status } = await Camera.requestPermissionsAsync()

		if (status === 'granted') {
			navigation.navigate('Camera', {
				buttonTitle: translations.takePhoto,
				takePhoto,
			})
		} else {
			showErrorMessage('permissionError')
		}
	}

	const showErrorMessage = (type: 'priceError' | 'permissionError') => {
		if (type === 'priceError') {
			const message: MessageOptions = {
				message: translations.noPriceTitle,
				description: translations.noPriceDescription,
				type: 'warning',
				icon: { icon: 'warning', position: 'left' },
				duration: 2500,
			}

			showMessage(message)
		}
		if (type === 'permissionError') {
			const message: MessageOptions = {
				message: translations.permissionErrorTitle,
				description: translations.permissionErrorCamera,
				type: 'danger',
				icon: { icon: 'danger', position: 'left' },
				duration: 2500,
			}

			showMessage(message)
		}
	}

	const checkPrice = (): boolean => !!(templateData.price && !controls.price.error)

	const exitHandler = () => {
		if (hasChanges && checkPrice()) {
			setContent('discardChanges')
		} else {
			navigation.goBack()
		}
	}

	const getModalButtons = (): ModalButtonType[] => {
		if (modalType === 'discardChanges') {
			return [
				{
					text: translations.yes,
					onPress: () => {
						setShowModal(false)
						navigation.goBack()
					},
				},
				{ text: translations.save, onPress: saveFoodHandler },
				{ text: translations.cancel, onPress: () => setShowModal(false) },
			]
		}
		return [
			{ text: translations.save, onPress: saveChange },
			{ text: translations.cancel, onPress: cancelChange },
		]
	}

	const saveFoodHandler = async () => {
		if (!checkPrice()) {
			showErrorMessage('priceError')
			return
		}

		setShowModal(false)
		await saveFood(savedData)
		navigation.replace('List')
	}

	useEffect(() => {
		setFood()
	}, [])

	if (loading) {
		return <Spinner size={64} />
	}

	return (
		<Background>
			<Header
				leftComponent={<Icon onPress={exitHandler} variant='backIcon' />}
				centerComponent={
					<Text style={styles.headerTitle}>
						{savedData.id ? translations.editFood : translations.newFood}
					</Text>
				}
			/>

			<Modal
				visible={showModal}
				toggleModal={toggleModal}
				title={translations[modalType]}
				buttons={getModalButtons()}
			>
				{modalContent}
			</Modal>

			<View style={styles.contentWrapper}>
				<ScrollView>
					<View style={styles.imageContainer}>
						<TouchableOpacity onPress={toggleCamera}>
							<View style={styles.imageWrapper}>
								<Image style={styles.image} source={getImage(savedData.image)} />

								<View style={styles.tapImage}>
									<Text style={styles.tapImageText}>{translations.tapToChange}</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>

					<View style={styles.infoWindowsContainer}>
						<InfoWindow
							color1={whiteColor}
							color2={orangeGradient}
							title={translations.name}
							value={
								!savedData.name || savedData.name === '' ? translations.noData : savedData.name
							}
							onPress={() => toggleModal('name')}
						/>
						<InfoWindow
							color1={whiteColor}
							color2={orangeGradient}
							title={translations.quantity}
							value={
								savedData.quantity
									? `${+savedData.quantity} ${getQuantitySuffix(savedData.quantitySuffixIndex)}`
									: '0'
							}
							onPress={() => toggleModal('quantity')}
						/>
						<InfoWindow
							color1={whiteColor}
							color2={redGradient}
							title={translations.price}
							value={`${savedData.price ? +savedData.price : 0} ${settings.currency}`}
							onPress={() => toggleModal('price')}
						/>

						<View style={styles.sliderContainer}>
							<Text style={styles.percentInfo}>{translations.percentInfo}</Text>
							<Slider
								style={styles.slider}
								thumbStyle={styles.sliderThumbStyle}
								thumbTintColor={blackColor}
								minimumTrackTintColor={darkColor}
								maximumTrackTintColor={grayColor}
								minimumValue={1}
								maximumValue={100}
								value={savedData.percentage}
								onValueChange={(value: number) => {
									setHasChanges(true)
									setSavedData({ ...savedData, percentage: +value.toFixed(0) })
								}}
							/>
							<Text style={styles.percent}>{savedData.percentage}%</Text>
						</View>
					</View>

					<View style={styles.saveButtonContainer}>
						<TouchableOpacity onPress={saveFoodHandler}>
							<Button
								buttonStyle={styles.saveButton}
								titleStyle={styles.saveButtonTitle}
								disabled={!checkPrice()}
								type='outline'
								title={translations.save}
							/>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		</Background>
	)
}

export default Food
