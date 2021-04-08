import { LinearGradient } from 'expo-linear-gradient'
import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import { primaryColor } from '../../common/utility'
import styles from './Background.styles'

type Props = PropsWithChildren<{
	colors?: string[]
}>

const Background = ({ children, colors = [primaryColor, '#6cd015'] }: Props) => (
	<View style={styles.wrapper}>
		<LinearGradient colors={colors} style={styles.container} />
		{children}
	</View>
)

export default Background