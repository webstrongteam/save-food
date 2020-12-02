import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import styles from './EmptyList.styles'

const EmptyList = ({ translations, navigation }) => (
	<View style={styles.container}>
		<Text style={styles.emptyList}>{translations.emptyList}</Text>
		<TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
			<Text
				style={{
					...styles.emptyList,
					fontFamily: 'Lato-Regular',
				}}
			>
				{translations.scanProduct}
			</Text>
		</TouchableOpacity>
		<Text style={styles.emptyList}>{translations.or}</Text>
		<TouchableOpacity onPress={() => navigation.navigate('Food')}>
			<Text
				style={{
					...styles.emptyList,
					fontFamily: 'Lato-Regular',
				}}
			>
				{translations.addManually}
			</Text>
		</TouchableOpacity>
	</View>
)

export default EmptyList
