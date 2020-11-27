import React from 'react'
import { Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { shadow } from '../../common/styles'
import styles from './InfoWindow.styles'

const InfoWindow = ({
	color1 = '#f8f8f8',
	color2 = ['#f2a91e', '#e95c17'],
	title = 'none',
	val = 'none',
	colorTitle = '#000',
	height = 60,
}) => (
	<View
		style={{
			height: height,
			...styles.container,
		}}
	>
		<View
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
						{val}
					</Text>
				</LinearGradient>
			</View>
		</View>
	</View>
)

export default InfoWindow
