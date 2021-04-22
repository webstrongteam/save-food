import { LinearGradient } from 'expo-linear-gradient'
import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import styles from './Background.styles'
import { greenGradient } from '../../common/colors'

type Props = PropsWithChildren<{
	colors?: string[]
}>

const Background = ({ children, colors = greenGradient }: Props) => (
	<View style={styles.wrapper}>
		<LinearGradient colors={colors} style={styles.container} />
		{children}
	</View>
)

export default Background
