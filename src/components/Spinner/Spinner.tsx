import React from 'react'
import { ActivityIndicator, Platform, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import styles from './Spinner.styles'

type Props = {
	size?: number | 'small' | 'large'
	color?: string
	bgColor?: string
}

const Spinner = ({ size = 32, color = '#fff', bgColor }: Props) => {
	const getSize = (): number | 'small' | 'large' => {
		if (Platform.OS === 'ios') {
			if (size > 32) {
				return 'large'
			}
			return 'small'
		}
		return size
	}

	if (bgColor) {
		return (
			<View style={{ ...styles.spinner, backgroundColor: bgColor }}>
				<ActivityIndicator size={getSize()} color={color} />
			</View>
		)
	}

	return (
		<View style={styles.spinner}>
			<LinearGradient colors={['#4b8b1d', '#6cd015']} style={styles.containerColor} />
			<ActivityIndicator size={getSize()} color={color} />
		</View>
	)
}

export default Spinner
