import React from 'react'
import { View } from 'react-native'
import styles from './Header.styles'

const Header = ({
	leftComponent,
	centerComponent,
	rightComponent,
	leftSize = 1,
	centerSize = 3,
	rightSize = 1,
	bgColor,
}) => (
	<View
		style={{
			backgroundColor: bgColor ? bgColor : 'transparency',
			...styles.container,
		}}
	>
		<View style={{ flex: leftSize, alignItems: 'flex-start' }}>
			{leftComponent ? leftComponent : <View />}
		</View>
		<View style={{ flex: centerSize, alignItems: 'center' }}>
			{centerComponent ? centerComponent : <View />}
		</View>
		<View style={{ flex: rightSize, alignItems: 'flex-end' }}>
			{rightComponent ? rightComponent : <View />}
		</View>
	</View>
)

export default Header
