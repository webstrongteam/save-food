import React from 'react'
import { ActivityIndicator, Platform, View } from 'react-native'
import styles from './Spinner.styles'
import Background from '../Background/Background'

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
		<Background>
			<ActivityIndicator style={styles.spinner} size={getSize()} color={color} />
		</Background>
	)
}

export default Spinner
