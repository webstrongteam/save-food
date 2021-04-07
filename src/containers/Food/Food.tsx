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
import Modal from '../../components/Modal/Modal'
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

type ModalType = keyof Omit<WastedFood, 'image'>

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

type Props = {
	navigation: NavigationScreenType
}

const Food = ({ navigation }: Props) => {
	const { useSubscribe } = useSettingsContext()
	const { settings, translations } = useSubscribe((s) => s)

	const [savedData, setSavedData] = useState<WastedFood>(initialData)
	const [templateData, setTemplateData] = useState<WastedFood>(initialData)
	const [showModal, setShowModal] = useState(false)
	const [loading, setLoading] = useState(true)
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
		setShowModal(true)
		setModalType(type)
	}

	const saveChange = () => {
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

			setShowModal(false)
		}
	}

	const cancelChange = () => {
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
			showSimpleMessage('permissionError')
		}
	}

	const showSimpleMessage = (type: 'priceError' | 'permissionError') => {
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

	const saveFoodHandler = async () => {
		if (!checkPrice()) {
			showSimpleMessage('priceError')
			return
		}

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
				leftComponent={<Icon onPress={() => navigation.goBack()} variant='backIcon' />}
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
				buttons={[
					{ text: translations.save, onPress: saveChange },
					{ text: translations.cancel, onPress: cancelChange },
				]}
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
							color1='#f8f8f8'
							color2={['#f2a91e', '#e95c17']}
							title={translations.name}
							value={
								!savedData.name || savedData.name === '' ? translations.noData : savedData.name
							}
							onPress={() => toggleModal('name')}
						/>
						<InfoWindow
							color1='#f8f8f8'
							color2={['#f2a91e', '#e95c17']}
							title={translations.quantity}
							value={
								savedData.quantity
									? `${+savedData.quantity} ${getQuantitySuffix(
											savedData.quantitySuffixIndex,
											translations,
									  )}`
									: '0'
							}
							onPress={() => toggleModal('quantity')}
						/>
						<InfoWindow
							color1='#f8f8f8'
							color2={['#af3462', '#bf3741']}
							title={translations.price}
							value={`${savedData.price ? +savedData.price : 0} ${settings.currency}`}
							onPress={() => toggleModal('price')}
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
								value={savedData.percentage}
								onValueChange={(value: number) =>
									setSavedData({ ...savedData, percentage: +value.toFixed(0) })
								}
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
