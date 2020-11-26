import React, { Component } from 'react'
import {
	Image,
	Text,
	TouchableOpacity,
	FlatList,
	RefreshControl,
	View,
	Animated,
} from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { LinearGradient } from 'expo-linear-gradient'
import { Button, CheckBox, Icon, ListItem } from 'react-native-elements'
import Header from '../../components/Header/Header'
import { getResizeMode } from '../../common/utility'
import Spinner from '../../components/Spinner/Spinner'
import EmptyList from './EmptyList/EmptyList'
import styles from './List.styles'

import { connect } from 'react-redux'
import * as actions from '../../store/actions'
import Modal from '../../components/Modal/Modal'

class List extends Component {
	state = {
		list: [],
		moveButton: new Animated.Value(100),
		amount: 0,
		visibleData: 8,
		loading: true,
		wait: false,

		selectedId: null,
		showModal: false,
	}

	componentDidMount() {
		this.initWastedList()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.navigation !== prevProps.navigation) {
			this.checkFood()
		} else if (this.state.list !== prevState.list) {
			if (this.state.list.some((item) => !!item.selected)) {
				this.showButton()
			} else {
				this.hideButton()
			}
		}
	}

	initWastedList = (showMessage = false) => {
		this.props.fetchWastedFood((items) => {
			const list = items.map((item) => {
				let resize = 'cover'
				if (item.image && item.image !== 'null' && item.image.constructor.name === 'String') {
					getResizeMode(item.image, (resizeMode) => {
						resize = resizeMode
					})
				}
				return {
					...item,
					resizeMode: resize,
				}
			})
			this.setState(
				{
					list,
					visibleData: 8,
					amount: this.getAmount(list),
					showModal: false,
					wait: false,
					loading: false,
				},
				() => {
					if (showMessage) this.showSimpleMessage('success')
				},
			)
		})
	}

	checkFood = () => {
		const ids = this.props.navigation.getParam('ids', null)
		if (ids) {
			this.setState({ loading: true }, async () => {
				await Promise.all(
					ids.map((id) => {
						this.props.paidFood(id, () => {
							return Promise.resolve()
						})
					}),
				)
				this.initWastedList(true)
			})
		} else {
			this.initWastedList()
		}
	}

	showSimpleMessage = (action) => {
		const { translations, currency } = this.props

		let message

		if (action === 'amountError') {
			message = {
				message: translations.amountErrorTitle,
				description: translations.amountErrorDescription + currency,
				type: 'warning',
				icon: { icon: 'warning', position: 'left' },
				duration: 2500,
			}
		} else if (action === 'success') {
			message = {
				message: translations.paymentSuccessTitle,
				description: translations.paymentSuccessDescription,
				type: 'success',
				icon: { icon: 'success', position: 'left' },
				duration: 2500,
			}
		}

		showMessage(message)
	}

	getAmount = (list = this.state.list) =>
		list
			.filter((item) => !!item.selected)
			.reduce((a, i) => a + i.price * i.productQuantity, 0)
			.toFixed(2)

	hideButton = () => {
		Animated.timing(this.state.moveButton, {
			toValue: 100,
			duration: 250,
			useNativeDriver: true,
		}).start()
	}

	showButton = () => {
		Animated.timing(this.state.moveButton, {
			toValue: -25,
			duration: 250,
			useNativeDriver: true,
		}).start()
	}

	selectItem = (item) => {
		if (!this.state.wait) {
			this.setState({ wait: true }, () => {
				if (item.selected) {
					this.props.selectFood(item.id, 0, () => {
						this.initWastedList()
					})
				} else {
					this.props.selectFood(item.id, 1, () => {
						this.initWastedList()
					})
				}
			})
		}
	}

	removeItem = (id) => {
		this.props.removeFood(id, () => {
			this.initWastedList()
		})
	}

	addFoodQuantity = (item, val) => {
		const newQuantity = item.productQuantity + val
		if (!this.state.wait && newQuantity < 100 && newQuantity > 0) {
			this.setState({ wait: true }, () => {
				this.props.onSaveFood({ ...item, productQuantity: newQuantity }, () => {
					this.initWastedList()
				})
			})
		}
	}

	loadNextData = () => {
		const { visibleData, list } = this.state
		if (visibleData < list.length) {
			this.setState({ visibleData: visibleData + 8 })
		}
	}

	toggleModal = (id) => {
		this.setState({ selectedId: id, showModal: !this.state.showModal })
	}

	startPayment = () => {
		const { amount, list } = this.state
		const { navigation } = this.props

		navigation.navigate('Payment', {
			ids: list.filter((item) => !!item.selected).map((i) => i.id),
			amount,
		})
	}

	renderItemRow = ({ item }) => {
		const { translations, navigation, currency } = this.props

		return (
			<ListItem
				containerStyle={{
					...styles.shadow,
					marginRight: 20,
					marginLeft: 20,
					marginTop: 20,
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
										resizeMode: item.resizeMode,
										...styles.image,
									}}
									onError={(ev) => {
										ev.target.src = '../../assets/common/dish.png'
									}}
									source={
										!item.image || item.image === 'null'
											? require('../../assets/common/dish.png')
											: { uri: item.image }
									}
								/>
								<View style={styles.productDetails}>
									<Text numberOfLines={2} style={styles.productName}>
										{item.name}
									</Text>
									<Text numberOfLines={1} style={styles.text}>
										{translations.quantity}: {item.quantity}
									</Text>
									<Text numberOfLines={1} style={styles.text}>
										{translations.percent}: {item.percentage}%
									</Text>
								</View>
							</View>

							<View style={styles.rightElement}>
								<TouchableOpacity
									onPress={() => this.addFoodQuantity(item, 1)}
									style={styles.button}
								>
									<Icon size={22} style={styles.quantityAddIcon} name='add' type='material' />
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => this.addFoodQuantity(item, -1)}
									style={styles.button}
								>
									<Icon size={22} style={styles.quantityMinusIcon} name='minus' type='entypo' />
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.footer}>
							<View style={styles.priceContainer}>
								<CheckBox
									checked={!!item.selected}
									onPress={() => this.selectItem(item)}
									containerStyle={styles.checkbox}
									checkedColor='#4b8b1d'
								/>
								<View style={styles.priceWrapper}>
									<Text style={styles.priceText}>
										{item.price * item.productQuantity} {currency}
									</Text>
									{item.productQuantity > 1 && (
										<Text style={styles.quantityText}>
											({item.price} {currency} x{item.productQuantity})
										</Text>
									)}
								</View>
							</View>
							<TouchableOpacity onPress={() => this.toggleModal(item.id)}>
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
	}

	render() {
		const { amount, visibleData, list, selectedId, showModal, loading } = this.state
		const { currency, translations, navigation } = this.props

		return (
			<>
				<LinearGradient colors={['#4b8b1d', '#6cd015']} style={styles.containerColor} />
				<Header
					leftComponent={
						<TouchableOpacity onPress={() => navigation.navigate('Home', {})}>
							<Icon
								style={styles.leftHeaderIcon}
								size={25}
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
					toggleModal={this.toggleModal}
					title={translations.deleteProduct}
					content={
						<View>
							<Text style={styles.deleteProductDescription}>
								{translations.deleteProductDescription}
							</Text>
						</View>
					}
					buttons={[
						{ text: translations.yes, onPress: () => this.removeItem(selectedId) },
						{ text: translations.cancel, onPress: this.toggleModal },
					]}
				/>

				<View style={styles.container}>
					<FlatList
						keyboardShouldPersistTaps='always'
						keyboardDismissMode='interactive'
						scrollEventThrottle={16}
						refreshControl={
							<RefreshControl
								refreshing={loading}
								tintColor='#fff'
								onRefresh={this.initWastedList}
							/>
						}
						ListEmptyComponent={<EmptyList translations={translations} navigation={navigation} />}
						data={list}
						initialNumToRender={8}
						onEndReachedThreshold={0.2}
						onEndReached={this.loadNextData}
						renderItem={this.renderItemRow}
						keyExtractor={(item) => `${item.id}`}
						onRefresh={this.initWastedList}
						refreshing={loading}
						ListFooterComponent={
							list.length > visibleData ? <Spinner /> : <View style={{ marginBottom: 90 }} />
						}
					/>
				</View>

				<Animated.View
					style={{
						transform: [{ translateY: this.state.moveButton }],
						...styles.paymentButtonContainer,
					}}
				>
					<View style={styles.paymentButtonWrapper}>
						<TouchableOpacity onPress={() => this.showSimpleMessage('amountError')}>
							<Button
								buttonStyle={styles.paymentButton}
								titleStyle={styles.paymentButtonTitle}
								disabled={amount < 2}
								onPress={this.startPayment}
								title={`${translations.pay} ${amount} ${currency} ${
									amount < 2 ? '(min. 2 ' + currency + ')' : ''
								}`}
							/>
						</TouchableOpacity>
					</View>
				</Animated.View>
			</>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		currency: state.settings.currency,
		refresh: state.settings.refresh,
		translations: state.settings.translations,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		fetchWastedFood: (value) => dispatch(actions.fetchWastedFood(value)),
		removeFood: (value, callback) => dispatch(actions.removeFood(value, callback)),
		selectFood: (id, selected, callback) => dispatch(actions.selectFood(id, selected, callback)),
		paidFood: (id, callback) => dispatch(actions.paidFood(id, callback)),
		onSaveFood: (value, callback) => dispatch(actions.saveFood(value, callback)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
