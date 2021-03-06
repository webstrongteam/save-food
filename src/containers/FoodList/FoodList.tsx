import React, { useEffect, useRef, useState } from 'react'
import {
	Image,
	Text,
	TouchableOpacity,
	FlatList,
	RefreshControl,
	View,
	Animated,
} from 'react-native'
import { MessageOptions, showMessage } from 'react-native-flash-message'
import { Button, CheckBox, ListItem } from 'react-native-elements'
import Header from '../../components/Header/Header'
import { getImage, getPrice, getQuantitySuffix, getResizeMode } from '../../common/utility'
import Spinner from '../../components/Spinner/Spinner'
import Modal from '../../components/Modal/Modal'
import { shadow } from '../../common/styles'
import { ResizeMode, WastedFood } from '../../types/westedFood'
import {
	fetchWastedFood,
	paidFood,
	removeFood,
	saveFood,
	selectFood,
} from '../../../database/actions/wastedFood'
import useAsyncEffect from '../../common/hooks/useAsyncEffect'
import { NavigationScreenType } from '../../types/navigation'
import { useSettingsContext } from '../../common/context/SettingsContext'
import styles from './FoodList.styles'
import EmptyList from '../../components/EmptyList/EmptyList'
import Background from '../../components/Background/Background'
import Icon from '../../components/Icon/Icon'
import { blackColor, primaryColor, redColor } from '../../common/colors'

type Props = {
	navigation: NavigationScreenType
}

const FoodList = ({ navigation }: Props) => {
	const moveButton = useRef(new Animated.Value(100)).current

	const { useSubscribe } = useSettingsContext()
	const settings = useSubscribe((s) => s.settings)
	const translations = useSubscribe((s) => ({
		...s.translations.FoodList,
		...s.translations.common,
	}))

	const [list, setList] = useState<WastedFood[]>()
	const [amount, setAmount] = useState(0)
	const [visibleData, setVisibleData] = useState(8)
	const [loading, setLoading] = useState(true)
	const [wait, setWait] = useState(false)
	const [selectedId, setSelectedId] = useState<number>()
	const [showModal, setShowModal] = useState(false)

	const initWastedList = async (showMessage = false) => {
		const wastedFoods = await fetchWastedFood()
		const list = wastedFoods.map((food) => {
			let resize: ResizeMode = 'cover'

			if (food.image) {
				getResizeMode(food.image, (resizeMode) => {
					resize = resizeMode
				})
			}

			return {
				...food,
				resizeMode: resize,
			}
		})

		setList(list)
		setAmount(getAmount(list))
		setLoading(false)
		setWait(false)

		if (showMessage) showSuccessMessage()
	}

	const checkFood = async () => {
		const ids = navigation.getParam('ids', undefined)
		if (ids) {
			setLoading(true)

			await Promise.all(
				ids.map(async (id: number) => {
					await paidFood(id)
					await Promise.resolve()
				}),
			)

			await initWastedList(true)
		} else {
			await initWastedList()
		}
	}

	const showSuccessMessage = () => {
		const message: MessageOptions = {
			message: translations.paymentSuccessTitle,
			type: 'success',
			icon: { icon: 'success', position: 'left' },
			duration: 2500,
		}

		showMessage(message)
	}

	const getAmount = (list: WastedFood[]): number =>
		+list
			.filter((item) => !!item.selected)
			.reduce((a, i) => a + i.price * i.productQuantity, 0)
			.toFixed(2)

	const hideButton = () => {
		Animated.timing(moveButton, {
			toValue: 100,
			duration: 250,
			useNativeDriver: true,
		}).start()
	}

	const showButton = () => {
		Animated.timing(moveButton, {
			toValue: -25,
			duration: 250,
			useNativeDriver: true,
		}).start()
	}

	const selectItem = async (item: WastedFood) => {
		if (!wait) {
			setWait(true)
			if (item.selected) {
				await selectFood(item.id, 0)
			} else {
				await selectFood(item.id, 1)
			}

			await initWastedList()
		}
	}

	const removeItemHandler = async (id: number) => {
		await removeFood(id)
		await initWastedList()
		toggleModal()
	}

	const addFoodQuantity = async (item: WastedFood, value: number) => {
		const newQuantity = +item.productQuantity + value
		if (!wait && newQuantity < 100 && newQuantity > 0) {
			setWait(true)
			await saveFood({ ...item, productQuantity: newQuantity })
			await initWastedList()
		}
	}

	const loadNextData = () => {
		if (list && visibleData < list.length) {
			setVisibleData(visibleData + 8)
		}
	}

	const toggleModal = (id?: number) => {
		if (id) setSelectedId(id)
		setShowModal(!showModal)
	}

	const goToPayment = () => {
		navigation.navigate('Payment', {
			ids: list?.filter((item) => !!item.selected).map((i) => i.id),
			amount,
		})
	}

	const renderItemRow = ({ item }: { item: WastedFood }) => (
		<ListItem containerStyle={[styles.listItemContainer, shadow]}>
			<ListItem.Content>
				<TouchableOpacity
					style={styles.listItem}
					onPress={() => navigation.navigate('Food', { ...item })}
				>
					<View style={styles.details}>
						<View style={styles.leftElement}>
							<Image
								style={[styles.image, { resizeMode: item.resizeMode }]}
								onError={(ev) => {
									if (ev.target) {
										// @ts-ignore
										ev.target.src = '../../assets/common/dish.png'
									}
								}}
								source={getImage(item.image)}
							/>

							<View style={styles.productDetails}>
								<Text numberOfLines={2} style={styles.productName}>
									{!item.name || item.name === '' ? translations.noData : item.name}
								</Text>
								<Text numberOfLines={1} style={styles.text}>
									{translations.quantity}:{' '}
									{item.quantity
										? `${item.quantity} ${getQuantitySuffix(item.quantitySuffixIndex)}`
										: translations.noData}
								</Text>
								<Text numberOfLines={1} style={styles.text}>
									{translations.percent}: {item.percentage}%
								</Text>
							</View>
						</View>

						<View style={styles.rightElement}>
							<Icon
								size={22}
								style={styles.quantityAddIcon}
								name='add'
								type='material'
								color={blackColor}
								onPress={() => addFoodQuantity(item, 1)}
							/>
							<Icon
								size={22}
								style={styles.quantityMinusIcon}
								name='minus'
								type='entypo'
								color={blackColor}
								onPress={() => addFoodQuantity(item, -1)}
							/>
						</View>
					</View>

					<View style={styles.itemListFooter}>
						<TouchableOpacity onPress={() => selectItem(item)} style={styles.priceContainer}>
							<CheckBox
								checked={!!item.selected}
								onPress={() => selectItem(item)}
								containerStyle={styles.checkbox}
								checkedColor={primaryColor}
							/>
							<View style={styles.priceWrapper}>
								<Text style={styles.priceText}>
									{(item.price * item.productQuantity).toFixed(2)} {settings.currency}
								</Text>
								{item.productQuantity > 1 && (
									<Text style={styles.quantityText}>
										({item.price} {settings.currency} x{item.productQuantity})
									</Text>
								)}
							</View>
						</TouchableOpacity>
						<Icon
							size={22}
							onPress={() => toggleModal(item.id)}
							style={styles.deleteProductIcon}
							color={redColor}
							name='trash'
							type='font-awesome-5'
						/>
					</View>
				</TouchableOpacity>
			</ListItem.Content>
		</ListItem>
	)

	useAsyncEffect(async () => {
		await checkFood()
	}, [navigation])

	useEffect(() => {
		if (list?.some((item) => !!item.selected)) {
			showButton()
		} else {
			hideButton()
		}
	}, [list])

	useAsyncEffect(async () => {
		await initWastedList()
	}, [])

	if (!list) {
		return <Spinner size={64} />
	}

	return (
		<Background>
			<Header
				leftComponent={<Icon variant='backIcon' onPress={() => navigation.replace('Home')} />}
				centerComponent={<Text style={styles.headerTitle}>{translations.foodList}</Text>}
				rightComponent={
					<Icon
						style={styles.openScannerIcon}
						name='plus'
						type='antdesign'
						onPress={() => navigation.navigate('Scanner')}
					/>
				}
				centerSize={6}
			/>

			<Modal
				visible={showModal}
				toggleModal={toggleModal}
				title={translations.deleteProduct}
				buttons={[
					{ text: translations.yes, onPress: () => selectedId && removeItemHandler(selectedId) },
					{ text: translations.cancel, onPress: toggleModal },
				]}
			>
				<Text style={styles.deleteProductDescription}>{translations.deleteProductDescription}</Text>
			</Modal>

			<View style={styles.container}>
				<FlatList
					keyboardShouldPersistTaps='always'
					keyboardDismissMode='interactive'
					scrollEventThrottle={16}
					refreshControl={
						<RefreshControl refreshing={loading} tintColor='#fff' onRefresh={initWastedList} />
					}
					ListEmptyComponent={<EmptyList navigation={navigation} />}
					data={list}
					initialNumToRender={8}
					onEndReachedThreshold={0.2}
					onEndReached={loadNextData}
					renderItem={renderItemRow}
					keyExtractor={(item) => `${item.id}`}
					onRefresh={initWastedList}
					refreshing={loading}
					ListFooterComponent={
						list.length > visibleData ? (
							<Spinner bgColor='transparency' />
						) : (
							<View style={styles.listFooter} />
						)
					}
				/>
			</View>

			<Animated.View
				style={[{ transform: [{ translateY: moveButton }] }, styles.paymentButtonContainer, shadow]}
			>
				<View style={styles.paymentButtonWrapper}>
					<Button
						buttonStyle={styles.paymentButton}
						titleStyle={styles.paymentButtonTitle}
						onPress={goToPayment}
						disabled={amount === 0}
						title={`${translations.donate} ${getPrice(amount)} ${settings.currency}`}
					/>
				</View>
			</Animated.View>
		</Background>
	)
}

export default FoodList
