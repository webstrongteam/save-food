import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { shadow } from '../../common/styles'
import styles from './InfoWindow.styles'

type Props = {
	color1?: string
	color2?: string[]
	title: string
	value: string
	colorTitle?: string
	onPress?: () => void
	height?: number
}

const InfoWindow = ({
	color1 = '#f8f8f8',
	color2 = ['#f2a91e', '#e95c17'],
	title,
	value,
	colorTitle = '#000',
	onPress,
	height = 60,
}: Props) => (
	<View
		style={{
			height,
			...styles.container,
		}}
	>
		<TouchableOpacity
			onPress={onPress}
			style={{
				backgroundColor: color1,
				...styles.wrapper,
				...shadow,
			}}
		>
			<View style={styles.titleWrapper}>
				<Text
					style={{
						color: colorTitle,
						...styles.title,
					}}
				>
					{title}
				</Text>
			</View>
			<View style={styles.valueWrapper}>
				<LinearGradient
					start={{ x: 1, y: 1 }}
					end={{ x: 0, y: 0 }}
					colors={color2}
					style={styles.gradient}
				>
					<Text numberOfLines={1} style={styles.value}>
						{value}
					</Text>
				</LinearGradient>
			</View>
		</TouchableOpacity>
	</View>
)

export default InfoWindow
