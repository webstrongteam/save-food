import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSettingsContext } from '../../common/context/SettingsContext'
import { NavigationScreenType } from '../../types/navigation'
import styles from './EmptyList.styles'

type Props = {
	navigation: NavigationScreenType
}

const EmptyList = ({ navigation }: Props) => {
	const { useSubscribe } = useSettingsContext()
	const translations = useSubscribe((s) => s.translations.common)

	return (
		<View style={styles.container}>
			<Text style={styles.emptyList}>{translations.emptyList}</Text>
			<TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
				<Text style={[styles.emptyList, { fontFamily: 'Lato-Regular' }]}>
					{translations.scanProduct}
				</Text>
			</TouchableOpacity>
			<Text style={styles.emptyList}>{translations.or}</Text>
			<TouchableOpacity onPress={() => navigation.navigate('Food')}>
				<Text style={[styles.emptyList, { fontFamily: 'Lato-Regular' }]}>
					{translations.addManually}
				</Text>
			</TouchableOpacity>
		</View>
	)
}

export default EmptyList
