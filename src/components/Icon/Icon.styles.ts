import { Platform, StyleSheet } from 'react-native'

export default StyleSheet.create({
	backIcon: {
		marginLeft: 20,
	},
	exitIcon: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 40 : 50,
		left: 20,
		zIndex: 20,
	},
})
