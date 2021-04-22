import React, { ReactNode } from 'react'
import { Platform, View } from 'react-native'
import styles from './Header.styles'

type Props = {
	leftComponent?: ReactNode
	centerComponent?: ReactNode
	rightComponent?: ReactNode
	leftSize?: number
	centerSize?: number
	rightSize?: number
	bgColor?: string
}

const Header = ({
	leftComponent,
	centerComponent,
	rightComponent,
	leftSize = 1,
	centerSize = 3,
	rightSize = 1,
	bgColor,
}: Props) => (
	<View style={[{ backgroundColor: bgColor ?? 'transparency' }, styles.container]}>
		<View style={{ flex: leftSize, alignItems: 'flex-start' }}>{leftComponent ?? <View />}</View>
		<View
			style={{ flex: centerSize, alignItems: 'center', marginTop: Platform.OS === 'ios' ? -2 : 0 }}
		>
			{centerComponent ?? <View />}
		</View>
		<View style={{ flex: rightSize, alignItems: 'flex-end' }}>{rightComponent ?? <View />}</View>
	</View>
)

export default Header
