import React from 'react'
import { ActivityIndicator, Platform, View } from 'react-native'

const spinner = ({ size, color, bgColor }) => {
	let setSize
	if (size) {
		if (size > 32 && Platform.OS === 'ios') setSize = 'large'
		else setSize = size
	} else setSize = 18

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: bgColor ? bgColor : '#fff',
			}}
		>
			<ActivityIndicator size={setSize} color={color ? color : '#fff'} />
		</View>
	)
}

export default spinner
