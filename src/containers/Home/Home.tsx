import React, { useEffect, useState } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import Header from '../../components/Header/Header'
import InfoWindow from '../../components/InfoWindow/InfoWindow'
import Spinner from '../../components/Spinner/Spinner'
import styles from './Home.styles'
import { NavigationScreenType } from '../../types/navigation'
import useAsyncEffect from '../../common/hooks/useAsyncEffect'
import { useSettingsContext } from '../../common/context/SettingsContext'
import { fetchAllWastedFood } from '../../../database/actions/wastedFood'
import { WastedFood } from '../../types/westedFood'
import Background from '../../components/Background/Background'
import Icon from '../../components/Icon/Icon'
import {
	greenGradient,
	orangeGradient,
	redGradient,
	whiteColor,
	whiteGradient,
} from '../../common/colors'

import en_facts from '../../translations/en/facts.json'
import pl_facts from '../../translations/pl/facts.json'
import { getPrice } from '../../common/utility'

type Props = {
	navigation: NavigationScreenType
}

type Data = {
	totalPrice: number
	unpaid: number
	moderateWaste: number
	foodAmount: number
}

const initialData: Data = {
	totalPrice: 0,
	unpaid: 0,
	moderateWaste: 0,
	foodAmount: 0,
}

const Home = ({ navigation }: Props) => {
	const { useSubscribe } = useSettingsContext()
	const settings = useSubscribe((s) => s.settings)
	const translations = useSubscribe((s) => s.translations.Home)

	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<Data>(initialData)
	const [foodFact, setFoodFact] = useState('')

	const onSetData = async () => {
		const allWestedFoods: WastedFood[] = await fetchAllWastedFood()
		const data: Data = { ...initialData }

		allWestedFoods.forEach((food) => {
			if (food.paid === 0) {
				data.unpaid += +food.price * food.productQuantity
			}
			data.totalPrice += +food.price * food.productQuantity
			data.foodAmount += 1
			data.moderateWaste += food.percentage
		})

		if (allWestedFoods.length) {
			data.moderateWaste /= allWestedFoods.length
		}

		data.totalPrice = +data.totalPrice.toFixed(2)
		data.unpaid = +data.unpaid.toFixed(2)
		data.moderateWaste = +data.moderateWaste.toFixed(0)

		setData(data)
		setLoading(false)
	}

	const drawFact = () => {
		let facts = en_facts

		if (settings.lang === 'pl') facts = pl_facts

		const id = Math.floor(Math.random() * facts.length)

		return facts[id]
	}

	useAsyncEffect(async () => {
		if ((await AsyncStorage.getItem('start')) === 'true' && Platform.OS !== 'web') {
			navigation.navigate('Start')
		} else {
			await onSetData()
		}
	}, [])

	useEffect(() => {
		setFoodFact(drawFact())
	}, [translations])

	if (loading) {
		return <Spinner size={64} />
	}

	return (
		<Background>
			<View style={styles.container}>
				<Header
					leftComponent={
						<Icon
							testID='go-to-settings'
							name='setting'
							style={styles.leftHeaderIcon}
							type='antdesign'
							onPress={() => navigation.navigate('Settings')}
						/>
					}
					rightComponent={
						<TouchableOpacity testID='go-to-food-list' onPress={() => navigation.replace('List')}>
							<View style={styles.rightHeaderContainer}>
								<Icon
									onPress={() => navigation.replace('List')}
									name='trash-o'
									type='font-awesome'
								/>
								<Text style={styles.rightHeaderText}>
									({getPrice(data.unpaid)} {settings.currency})
								</Text>
							</View>
						</TouchableOpacity>
					}
					rightSize={4}
				/>

				<ScrollView>
					<Text style={styles.text}>{foodFact}</Text>

					<View style={styles.containerCenter}>
						<TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
							<LinearGradient colors={whiteGradient} style={styles.circleOne}>
								<LinearGradient colors={orangeGradient} style={styles.circleTwo}>
									<LinearGradient colors={whiteGradient} style={styles.circleThree}>
										<Text style={styles.textScan}>{translations.scan}</Text>
									</LinearGradient>
								</LinearGradient>
							</LinearGradient>
						</TouchableOpacity>
					</View>

					<View style={styles.infoWindowWrapper}>
						<InfoWindow
							color1={whiteColor}
							color2={redGradient}
							title={translations.wastedFood}
							value={`${data.foodAmount}`}
						/>
						<InfoWindow
							color1={whiteColor}
							color2={orangeGradient}
							title={translations.wastedMoney}
							value={`${getPrice(data.totalPrice)} ${settings.currency}`}
						/>
						<InfoWindow
							color1={whiteColor}
							color2={greenGradient}
							title={translations.moderateWaste}
							value={`${data.moderateWaste} %`}
						/>
					</View>
				</ScrollView>
			</View>
		</Background>
	)
}

export default Home
