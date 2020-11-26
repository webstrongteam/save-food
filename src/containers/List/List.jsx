import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, FlatList, RefreshControl, View, Animated } from 'react-native'
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

class List extends Component {
	state = {
		list: [],
		selectedItems: [],
		moveButton: new Animated.Value(100),
		amount: 0,
		visibleData: 8,
		isSwiping: false,
		loading: true,
		wait: false,
	}

	async componentDidMount() {
		this.initWastedList()
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.refresh !== this.props.refresh && !this.state.wait) {
			this.setState({ loading: true }, () => {
				this.initWastedList()
			})
		} else if (this.props.navigation !== prevProps.navigation) {
			this.paidFood()
			this.props.onRefresh()
		} else if (this.state.selectedItems !== prevState.selectedItems) {
			if (this.state.selectedItems.length) {
				this.showButton()
			} else {
				this.hideButton()
			}
		}
	}

	paidFood = () => {
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

	initWastedList = (showMessage = false) => {
		this.props.fetchWastedFood((items) => {
			const list = items.map((item) => {
				let resize = 'cover'
				if (item.image.constructor.name === 'String') {
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
					selectedItems: [],
					visibleData: 8,
					amount: 0,
					loading: false,
				},
				() => {
					if (showMessage) this.showSimpleMessage('success')
				},
			)
		})
	}

	getAmount = (selectedItems = this.state.selectedItems) => {
		return selectedItems.reduce((a, i) => a + i.price * i.productQuantity, 0)
	}

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

	selectItem = (item, onlyRemove = false) => {
		const { selectedItems } = this.state
		const checkSelectedItem = selectedItems.find((i) => i.id === item.id)

		if (checkSelectedItem) {
			const newSelectedItems = selectedItems.filter((i) => i.id !== item.id)
			this.setState({
				selectedItems: newSelectedItems,
				amount: this.getAmount(newSelectedItems),
			})
		} else if (!onlyRemove) {
			const newSelectedItems = selectedItems.concat(item)
			this.setState({
				selectedItems: newSelectedItems,
				amount: this.getAmount(newSelectedItems),
			})
		}
	}

	removeItem = (id) => {
		this.props.removeFood(id)
		this.selectItem({ id }, true)
		this.props.fetchWastedFood((foods) => {
			this.setState({ list: foods })
		})
	}

	addFoodQuantity = (item, val) => {
		const quantity = item.productQuantity + val
		if (!this.state.wait && quantity < 100 && quantity > 0) {
			this.setState({ wait: true }, () => {
				const { selectedItems } = this.state
				let { amount } = this.state
				const quantity = item.productQuantity + val

				const selectedIn = selectedItems.findIndex((val) => val.id === item.id)
				if (selectedIn >= 0) {
					selectedItems[selectedIn].productQuantity =
						selectedItems[selectedIn].productQuantity + val
					amount = this.getAmount(selectedItems)
				}

				const index = this.state.list.indexOf(item)
				const newList = this.state.list
				newList[index].productQuantity = quantity

				this.props.onSaveFood({ ...item, productQuantity: quantity }, () => {
					this.props.onRefresh()
					this.setState({ list: newList, amount, wait: false })
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

	startPayment = () => {
		const { amount, selectedItems } = this.state
		const { navigation } = this.props

		navigation.navigate('Payment', {
			ids: selectedItems.map((i) => i.id),
			amount,
		})
	}

	renderItemRow = ({ item }) => {
		const {selectedItems} = this.state
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
						<TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Food', { ...item })}>
							<View style={styles.details}>
								<View style={styles.leftElement}>
									<Image
										style={{
											resizeMode: item.resizeMode,
											...styles.image,
										}}
										onError={(ev) => {
											ev.target.src = '../../assets/common/dish.svg'
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
										<Text style={styles.text}>
											{translations.quantity}: {item.quantity}
										</Text>
										<Text style={styles.text}>
											{translations.percent}: {item.percentage}%
										</Text>
									</View>
								</View>

								<View style={styles.rightElement}>
									<TouchableOpacity onPress={() => this.addFoodQuantity(item, 1)} style={styles.button}>
										<Icon size={22} style={styles.quantityAddIcon} name='add' type='material' />
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this.addFoodQuantity(item, -1)} style={styles.button}>
										<Icon size={22} style={styles.quantityMinusIcon} name='minus' type='entypo' />
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.footer}>
								<View style={styles.priceContainer}>
									<CheckBox
										checked={!!selectedItems.find((i) => i.id === item.id)}
										onPress={() => this.selectItem(item)}
										containerStyle={styles.checkbox}
										checkedColor='#4b8b1d'
									/>
									<View style={styles.priceWrapper}>
										<Text style={styles.priceText}>
											{item.price * item.productQuantity} {currency}
										</Text>
										{item.productQuantity > 1 &&
										<Text style={styles.quantityText}>
											({item.price} {currency} x{item.productQuantity})
										</Text>
										}
									</View>
								</View>
								<TouchableOpacity onPress={() => this.removeItem(item.id)} >
								<Icon size={22} style={styles.deleteProductIcon} color='#d9534f' name='trash' type='font-awesome-5' />
								</TouchableOpacity>
							</View>
						</TouchableOpacity>
					</ListItem.Content>
				</ListItem>
		)
	}

	render() {
		const { isSwiping, selectedItems, amount, visibleData, list, loading } = this.state
		const { currency, translations, navigation } = this.props

		return (
			<>
				<LinearGradient colors={['#4b8b1d', '#6cd015']} style={styles.containerColor} />
				<Header
					leftComponent={
						<TouchableOpacity onPress={() => navigation.navigate('Home')}>
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
						ListEmptyComponent={
							<EmptyList translations={translations} navigation={navigation} />
						}
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
									amount < 2 ? '(minimum 2 ' + currency + ')' : ''
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
		removeFood: (value) => dispatch(actions.removeFood(value)),
		paidFood: (id, callback) => dispatch(actions.paidFood(id, callback)),
		onRefresh: () => dispatch(actions.onRefresh()),
		onSaveFood: (value, callback) => dispatch(actions.saveFood(value, callback)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
