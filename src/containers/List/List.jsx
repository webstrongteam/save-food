import React, { Component } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View, Animated } from 'react-native'
import { BlurView } from 'expo-blur'
import { showMessage } from 'react-native-flash-message'
import { LinearGradient } from 'expo-linear-gradient'
import { Button, CheckBox, Icon } from 'react-native-elements'
import Swipeable from 'react-native-swipeable'
import Header from '../../components/Header/Header'
import { getResizeMode } from '../../common/utility'
import Spinner from '../../components/Spinner/Spinner'
import ButtonAdd from '../../components/ButtonAdd/ButtonAdd'
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
		this.props.fetchWastedFood((foods) => {
			const list = foods.map((val) => {
				let { image } = val
				if (!image || image === 'null') {
					image = require('../../assets/fast-food-outline.png')
				} else {
					image = { uri: image }
				}
				let resize = 'cover'
				if (image.constructor.name === 'String') {
					getResizeMode(image, (resizeMode) => {
						resize = resizeMode
					})
				}
				return {
					...val,
					resizeMode: resize,
				}
			})
			this.setState(
				{
					list,
					selectedItems: [],
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

	addFood = (item, val) => {
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

	startPayment = () => {
		const { amount, selectedItems } = this.state
		const { navigation } = this.props

		navigation.navigate('Payment', {
			ids: selectedItems.map((i) => i.id),
			amount,
		})
	}

	render() {
		const { isSwiping, selectedItems, amount, list, loading } = this.state
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
				{loading ? (
					<Spinner bgColor='transparency' color='#000' size={64} />
				) : (
					<View style={styles.container}>
						{list.length < 1 ? (
							<EmptyList translations={translations} navigation={navigation} />
						) : (
							<ScrollView scrollEnabled={!isSwiping}>
								{list.map((item, i) => {
									return (
										<Swipeable
											key={i}
											style={styles.swipeable}
											onSwipeStart={() => this.setState({ isSwiping: true })}
											onSwipeRelease={() => this.setState({ isSwiping: false })}
											rightButtons={[
												<>
													<TouchableOpacity
														onPress={() => this.removeItem(item.id)}
														style={styles.delete}
													>
														<Icon
															style={styles.icon}
															size={40}
															name='trash-o'
															type='font-awesome'
															color='#fff'
														/>
													</TouchableOpacity>
													<TouchableOpacity
														onPress={() => navigation.navigate('Food', { ...item })}
														style={styles.edit}
													>
														<Icon
															style={styles.icon}
															size={40}
															name='edit'
															type='font-awesome'
															color='#fff'
														/>
													</TouchableOpacity>
												</>,
											]}
										>
											<BlurView style={styles.listItem} intensity={50} tint='dark'>
												<View style={styles.checkboxWrapper}>
													<CheckBox
														checked={!!selectedItems.find((i) => i.id === item.id)}
														onPress={() => this.selectItem(item)}
														style={styles.checkbox}
														checkedColor='#ea6700'
														tintColors={{ true: '#ea6700', false: '#ea6700' }}
													/>
												</View>
												<View>
													<View style={styles.imageWrapper}>
														<Image
															style={{
																resizeMode: item.resizeMode,
																...styles.image,
															}}
															onError={(ev) => {
																ev.target.src = '../../assets/fast-food-outline.png'
															}}
															source={
																item.image === 'null'
																	? require('../../assets/fast-food-outline.png')
																	: { uri: item.image }
															}
														/>
													</View>
													<ButtonAdd
														onPressAdd={() => this.addFood(item, 1)}
														onPressMinus={() => this.addFood(item, -1)}
														value={item.productQuantity}
													/>
												</View>
												<View style={styles.productDetails}>
													<Text numberOfLines={2} style={styles.nameText}>
														{item.name}
													</Text>
													<Text style={styles.text}>
														{translations.quantity}: {item.quantity}
													</Text>
													<Text style={styles.text}>
														{translations.percent}: {item.percentage}%
													</Text>
												</View>
												<Text style={styles.priceText}>
													{item.price * item.productQuantity} {currency}
												</Text>
											</BlurView>
										</Swipeable>
									)
								})}
							</ScrollView>
						)}
					</View>
				)}

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
