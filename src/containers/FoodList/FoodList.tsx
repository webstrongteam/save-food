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
import { Button, CheckBox, Icon, ListItem } from 'react-native-elements'
import Header from '../../components/Header/Header'
import { getImage, getQuantitySuffix, getResizeMode } from '../../common/utility'
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

type Props = {
	navigation: NavigationScreenType
}

type Action = 'amountError' | 'success'

const FoodList = ({ navigation }: Props) => {
	const moveButton = useRef(new Animated.Value(100)).current

	const { useSubscribe } = useSettingsContext()
	const { settings, translations } = useSubscribe((s) => s)

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

		if (showMessage) showSimpleMessage('success')
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

	const showSimpleMessage = (action: Action) => {
		if (action === 'amountError') {
			const message: MessageOptions = {
				message: translations.amountErrorTitle,
				description: translations.amountErrorDescription + settings.currency,
				type: 'warning',
				icon: { icon: 'warning', position: 'left' },
				duration: 2500,
			}
			showMessage(message)
		} else if (action === 'success') {
			const message: MessageOptions = {
				message: translations.paymentSuccessTitle,
				description: translations.paymentSuccessDescription,
				type: 'success',
				icon: { icon: 'success', position: 'left' },
				duration: 2500,
			}
			showMessage(message)
		}
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
		<ListItem
			containerStyle={{
				...styles.listItemContainer,
				...shadow,
			}}
		>
			<ListItem.Content>
				<TouchableOpacity
					style={styles.listItem}
					onPress={() => navigation.navigate('Food', { ...item })}
				>
					<View style={styles.details}>
						<View style={styles.leftElement}>
							<Image
								style={{
									...styles.image,
									resizeMode: item.resizeMode,
								}}
								onError={(ev) => {
									// @ts-ignore
									ev.target.src = '../../assets/common/dish.png'
								}}
								source={getImage(item.image)}
							/>

							<View style={styles.productDetails}>
								<Text numberOfLines={2} style={styles.productName}>
									{item.name === '' ? translations.noData : item.name}
								</Text>
								<Text numberOfLines={1} style={styles.text}>
									{translations.quantity}:{' '}
									{item.quantity
										? `${item.quantity} ${getQuantitySuffix(
												item.quantitySuffixIndex,
												translations,
										  )}`
										: translations.noData}
								</Text>
								<Text numberOfLines={1} style={styles.text}>
									{translations.percent}: {item.percentage}%
								</Text>
							</View>
						</View>

						<View style={styles.rightElement}>
							<TouchableOpacity onPress={() => addFoodQuantity(item, 1)}>
								<Icon size={22} style={styles.quantityAddIcon} name='add' type='material' />
							</TouchableOpacity>
							<TouchableOpacity onPress={() => addFoodQuantity(item, -1)}>
								<Icon size={22} style={styles.quantityMinusIcon} name='minus' type='entypo' />
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.itemListFooter}>
						<View style={styles.priceContainer}>
							<CheckBox
								checked={!!item.selected}
								onPress={() => selectItem(item)}
								containerStyle={styles.checkbox}
								checkedColor='#4b8b1d'
							/>
							<View style={styles.priceWrapper}>
								<Text style={styles.priceText}>
									{item.price * item.productQuantity} {settings.currency}
								</Text>
								{item.productQuantity > 1 && (
									<Text style={styles.quantityText}>
										({item.price} {settings.currency} x{item.productQuantity})
									</Text>
								)}
							</View>
						</View>
						<TouchableOpacity onPress={() => toggleModal(item.id)}>
							<Icon
								size={22}
								style={styles.deleteProductIcon}
								color='#d9534f'
								name='trash'
								type='font-awesome-5'
							/>
						</TouchableOpacity>
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
				leftComponent={
					<TouchableOpacity onPress={() => navigation.replace('Home')}>
						<Icon
							style={styles.leftHeaderIcon}
							size={28}
							name='arrowleft'
							type='antdesign'
							color='#fff'
						/>
					</TouchableOpacity>
				}
				centerComponent={<Text style={styles.headerTitle}>{translations.foodList}</Text>}
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
				<View>
					<Text style={styles.deleteProductDescription}>
						{translations.deleteProductDescription}
					</Text>
				</View>
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
				style={{
					transform: [{ translateY: moveButton }],
					...styles.paymentButtonContainer,
					...shadow,
				}}
			>
				<View style={styles.paymentButtonWrapper}>
					<TouchableOpacity onPress={() => showSimpleMessage('amountError')}>
						<Button
							buttonStyle={styles.paymentButton}
							titleStyle={styles.paymentButtonTitle}
							disabled={amount < 2}
							onPress={goToPayment}
							title={`${translations.pay} ${amount} ${settings.currency}`}
						/>
					</TouchableOpacity>
				</View>
			</Animated.View>
		</Background>
	)
}

export default FoodList
